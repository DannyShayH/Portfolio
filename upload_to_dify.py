#!/usr/bin/env python3
"""Synchronize the portfolio's source content with a Dify knowledge dataset.

The API key is intentionally read from the environment. Document names are
derived from their paths so updates are deterministic and do not create a new
document on every run.
"""

from __future__ import annotations

import argparse
import json
import mimetypes
import os
import re
import sys
import time
from pathlib import Path
from typing import Any, Callable

import requests


PROJECT_ROOT = Path(__file__).resolve().parent
CONTENT_DIR = PROJECT_ROOT / "content"
DEFAULT_BASE_URL = "https://api.dify.ai/v1"
MAX_ATTEMPTS = 6
RETRYABLE_STATUS_CODES = {429, 503}
DEFAULT_WRITE_DELAY_SECONDS = 5.0
USER_AGENT = (
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
    "AppleWebKit/537.36 (KHTML, like Gecko) "
    "Chrome/131.0.0.0 Safari/537.36 PortfolioKnowledgeSync/1.0"
)
SUPPORTED_EXTENSIONS = {
    ".csv",
    ".htm",
    ".html",
    ".json",
    ".md",
    ".pdf",
    ".txt",
    ".xml",
    ".yaml",
    ".yml",
}

PROCESS_RULE = {
    "mode": "custom",
    "rules": {
        "pre_processing_rules": [
            {"id": "remove_extra_whitespace", "enabled": True},
            {"id": "remove_urls_emails", "enabled": False},
        ],
        "segmentation": {"separator": "\n\n", "max_tokens": 1000},
        "parent_mode": "paragraph",
        "subchunk_segmentation": {"separator": "\n", "max_tokens": 200},
    },
}


def source_files() -> list[Path]:
    return sorted(
        path
        for path in CONTENT_DIR.rglob("*")
        if path.is_file() and path.suffix.lower() in SUPPORTED_EXTENSIONS
    )


def selected_source_files(requested: list[str] | None) -> list[Path]:
    """Validate explicitly requested files and keep them inside content/."""
    if not requested:
        return source_files()

    selected: list[Path] = []
    content_root = CONTENT_DIR.resolve()
    for value in requested:
        candidate = Path(value)
        if not candidate.is_absolute():
            candidate = PROJECT_ROOT / candidate
        candidate = candidate.resolve()
        try:
            candidate.relative_to(content_root)
        except ValueError as error:
            raise ValueError(f"Content file is outside content/: {value}") from error
        if not candidate.is_file():
            raise ValueError(f"Content file does not exist: {value}")
        if candidate.suffix.lower() not in SUPPORTED_EXTENSIONS:
            raise ValueError(f"Unsupported content file type: {value}")
        selected.append(candidate)
    return sorted(set(selected))


def safe_part(value: str) -> str:
    cleaned = re.sub(r"[^A-Za-z0-9._-]+", "-", value).strip("-.")
    return cleaned or "document"


def canonical_name(path: Path) -> str:
    """Return a stable, collision-resistant Dify document name."""
    relative = path.relative_to(CONTENT_DIR)
    return "portfolio__" + "__".join(safe_part(part) for part in relative.parts)


def legacy_name(path: Path) -> str:
    """Name used by the previous uploader, retained for seamless migration."""
    return "_".join(path.relative_to(CONTENT_DIR).parts)


class DifyClient:
    def __init__(self, api_key: str, dataset_id: str, base_url: str) -> None:
        self.dataset_id = dataset_id
        self.base_url = base_url.rstrip("/")
        self.session = requests.Session()
        self.session.headers.update(
            {
                "Authorization": f"Bearer {api_key}",
                "Accept": "application/json",
                "User-Agent": USER_AGENT,
            }
        )

    def _url(self, suffix: str) -> str:
        return f"{self.base_url}/datasets/{self.dataset_id}{suffix}"

    @staticmethod
    def is_cloudflare_block(response: requests.Response) -> bool:
        """Distinguish Cloudflare HTML blocks from genuine Dify JSON 403s."""
        if response.status_code != 403:
            return False
        content_type = response.headers.get("Content-Type", "").lower()
        server = response.headers.get("Server", "").lower()
        preview = response.text[:5000].lower()
        return (
            "cloudflare" in server
            or "text/html" in content_type
            and (
                "attention required" in preview
                or "cloudflare" in preview
                or "cf-ray" in preview
            )
        )

    def _request_with_retry(
        self,
        request: Callable[[], requests.Response],
        operation: str,
    ) -> requests.Response:
        """Retry Dify's documented temporary capacity-check responses."""
        for attempt in range(1, MAX_ATTEMPTS + 1):
            response = request()
            cloudflare_block = self.is_cloudflare_block(response)
            if (
                response.status_code not in RETRYABLE_STATUS_CODES
                and not cloudflare_block
                or attempt == MAX_ATTEMPTS
            ):
                return response

            retry_after = response.headers.get("Retry-After", "")
            try:
                delay = max(1.0, min(float(retry_after), 120.0))
            except ValueError:
                base_delay = 15 if cloudflare_block else 5
                delay = min(base_delay * (2 ** (attempt - 1)), 60)

            reason = "Cloudflare block" if cloudflare_block else str(response.status_code)
            print(
                f"Dify returned {reason} while {operation}; "
                f"retrying in {delay:g}s "
                f"(attempt {attempt + 1}/{MAX_ATTEMPTS}).",
                file=sys.stderr,
                flush=True,
            )
            time.sleep(delay)

        raise RuntimeError("Retry loop ended unexpectedly")

    def list_documents(self) -> list[dict[str, Any]]:
        documents: list[dict[str, Any]] = []
        page = 1
        while True:
            response = self._request_with_retry(
                lambda: self.session.get(
                    self._url("/documents"),
                    params={"page": page, "limit": 100},
                    timeout=(10, 60),
                ),
                "listing documents",
            )
            response.raise_for_status()
            payload = response.json()
            documents.extend(payload.get("data", []))
            if not payload.get("has_more"):
                return documents
            page += 1

    def _file_request(
        self, method: str, suffix: str, path: Path, upload_name: str
    ) -> dict[str, Any]:
        mime_type = mimetypes.guess_type(path.name)[0] or "application/octet-stream"
        request_data = {
            "indexing_technique": "high_quality",
            "process_rule": PROCESS_RULE,
        }
        def send_file() -> requests.Response:
            # Reopen the file for every attempt so the upload always starts at
            # byte zero rather than retrying with an exhausted file handle.
            with path.open("rb") as handle:
                return self.session.request(
                    method,
                    self._url(suffix),
                    data={"data": json.dumps(request_data)},
                    files={"file": (upload_name, handle, mime_type)},
                    timeout=(10, 180),
                )

        response = self._request_with_retry(
            send_file, f"uploading {path.relative_to(PROJECT_ROOT)}"
        )
        response.raise_for_status()
        return response.json()

    def create_document(self, path: Path, upload_name: str) -> dict[str, Any]:
        return self._file_request(
            "POST", "/document/create-by-file", path, upload_name
        )

    def update_document(
        self, document_id: str, path: Path, upload_name: str
    ) -> dict[str, Any]:
        return self._file_request(
            "PATCH", f"/documents/{document_id}", path, upload_name
        )

    def delete_document(self, document_id: str) -> None:
        response = self._request_with_retry(
            lambda: self.session.delete(
                self._url(f"/documents/{document_id}"), timeout=(10, 60)
            ),
            f"deleting duplicate document {document_id}",
        )
        response.raise_for_status()


def sync(
    client: DifyClient,
    files: list[Path],
    write_delay: float = 0,
) -> tuple[int, int, int]:
    remote_documents = client.list_documents()
    by_name: dict[str, list[dict[str, Any]]] = {}
    for document in remote_documents:
        name = document.get("name")
        if name:
            by_name.setdefault(name, []).append(document)

    created = updated = duplicates_removed = 0
    for position, path in enumerate(files):
        name = canonical_name(path)
        old_name = legacy_name(path)
        matches = by_name.get(name, []) + (
            by_name.get(old_name, []) if old_name != name else []
        )

        if not matches:
            result = client.create_document(path, name)
            document = result.get("document", {})
            print(f"CREATE {path.relative_to(PROJECT_ROOT)} -> {name}")
            created += 1
            if document.get("id"):
                by_name[name] = [document]
            if write_delay and position < len(files) - 1:
                time.sleep(write_delay)
            continue

        # Prefer a document that already has the canonical name. Updating the
        # legacy match with the canonical upload filename migrates it in place.
        primary = next(
            (document for document in matches if document.get("name") == name),
            matches[0],
        )
        document_id = primary.get("id")
        if not document_id:
            raise RuntimeError(f"Dify returned a document without an id: {primary}")

        client.update_document(document_id, path, name)
        print(f"UPDATE {path.relative_to(PROJECT_ROOT)} -> {name}")
        updated += 1

        for duplicate in matches:
            duplicate_id = duplicate.get("id")
            if duplicate_id and duplicate_id != document_id:
                client.delete_document(duplicate_id)
                print(f"DELETE duplicate document {duplicate_id} ({duplicate.get('name')})")
                duplicates_removed += 1

        if write_delay and position < len(files) - 1:
            time.sleep(write_delay)

    return created, updated, duplicates_removed


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "--file",
        action="append",
        dest="files",
        help="sync only this content file; may be supplied more than once",
    )
    parser.add_argument(
        "--list-files-json",
        action="store_true",
        help="print the supported content-file list as JSON and exit",
    )
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="show stable upload names without contacting Dify",
    )
    return parser.parse_args()


def main() -> int:
    args = parse_args()
    if not CONTENT_DIR.is_dir():
        print(f"Content directory not found: {CONTENT_DIR}", file=sys.stderr)
        return 1

    if args.list_files_json:
        print(
            json.dumps(
                [str(path.relative_to(PROJECT_ROOT)) for path in source_files()],
                separators=(",", ":"),
            )
        )
        return 0

    try:
        files = selected_source_files(args.files)
    except ValueError as error:
        print(error, file=sys.stderr)
        return 2
    if not files:
        print("No supported content files found.")
        return 0

    if args.dry_run:
        print(f"Found {len(files)} source documents:")
        for path in files:
            print(f"  {path.relative_to(PROJECT_ROOT)} -> {canonical_name(path)}")
        return 0

    api_key = os.environ.get("DIFY_API_KEY", "").strip()
    dataset_id = os.environ.get("DIFY_DATASET_ID", "").strip()
    base_url = os.environ.get("DIFY_BASE_URL", DEFAULT_BASE_URL).strip()
    try:
        write_delay = max(
            0.0,
            float(
                os.environ.get(
                    "DIFY_WRITE_DELAY_SECONDS", str(DEFAULT_WRITE_DELAY_SECONDS)
                )
            ),
        )
    except ValueError:
        print("DIFY_WRITE_DELAY_SECONDS must be a number.", file=sys.stderr)
        return 2
    missing = [
        name
        for name, value in (
            ("DIFY_API_KEY", api_key),
            ("DIFY_DATASET_ID", dataset_id),
        )
        if not value
    ]
    if missing:
        print(
            f"Missing required environment variable(s): {', '.join(missing)}",
            file=sys.stderr,
        )
        return 2

    client = DifyClient(api_key, dataset_id, base_url)
    try:
        created, updated, removed = sync(client, files, write_delay=write_delay)
    except requests.HTTPError as error:
        response = error.response
        if response is not None and client.is_cloudflare_block(response):
            ray_id = response.headers.get("CF-RAY", "not provided")
            detail = (
                "Cloudflare blocked the request before it reached Dify "
                f"(Ray ID: {ray_id})."
            )
        else:
            detail = response.text[:1000] if response is not None else str(error)
        status = response.status_code if response is not None else "unknown"
        print(f"Dify request failed ({status}): {detail}", file=sys.stderr)
        return 1
    except (OSError, ValueError, RuntimeError) as error:
        print(f"Sync failed: {error}", file=sys.stderr)
        return 1

    print(
        "Sync complete: "
        f"{created} created, {updated} updated, {removed} duplicate(s) removed."
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
