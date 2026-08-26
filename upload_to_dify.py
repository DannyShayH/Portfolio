import sys
import json
import mimetypes
import requests
from pathlib import Path

API_KEY = "dataset-d5Y8j4JEgSlZ4HvRluRjlZqh"  # Replace with your Dify API secret key
DATASET_ID = "fbbdffd5-7a42-43cc-bb66-1801ca650556"  # Knowledge base: Portfolio
BASE_URL = "http://localhost/v1"
CONTENT_DIR = Path(__file__).parent / "content"

SUPPORTED_EXTENSIONS = {
    ".md", ".txt", ".pdf", ".html", ".htm",
    ".csv", ".json", ".xml", ".yaml", ".yml",
}

# Parent-child chunking:
#   Parent chunks  → larger segments retrieved as context (paragraph-level)
#   Child chunks   → smaller segments used for embedding & similarity search
PROCESS_RULE = {
    "mode": "custom",
    "rules": {
        "pre_processing_rules": [
            {"id": "remove_extra_whitespace", "enabled": True},
            {"id": "remove_urls_emails", "enabled": False},
        ],
        "segmentation": {
            "separator": "\n\n",   # split parents on blank lines
            "max_tokens": 1000,    # max tokens per parent chunk
        },
        "parent_mode": "paragraph",  # each paragraph is a parent chunk
        "subchunk_segmentation": {
            "separator": "\n",     # split children on single newlines
            "max_tokens": 200,     # max tokens per child chunk
        },
    },
}


def upload_file(file_path: Path) -> dict:
    url = f"{BASE_URL}/datasets/{DATASET_ID}/document/create_by_file"
    headers = {"Authorization": f"Bearer {API_KEY}"}

    mime_type, _ = mimetypes.guess_type(str(file_path))
    if mime_type is None:
        mime_type = "text/plain"

    # Build a unique name from the relative path, e.g.
    # posts/Warranty/week1/index.md → posts_Warranty_week1_index.md
    rel = file_path.relative_to(CONTENT_DIR)
    unique_name = "_".join(rel.parts[:-1] + (rel.name,)) if rel.parts[:-1] else rel.name

    data = {
        "data": json.dumps({
            "indexing_technique": "high_quality",
            "process_rule": PROCESS_RULE,
        }),
    }

    with open(file_path, "rb") as f:
        files = {"file": (unique_name, f, mime_type)}
        response = requests.post(url, headers=headers, data=data, files=files)

    response.raise_for_status()
    return response.json()


def main():
    if not CONTENT_DIR.exists():
        print(f"Error: content directory not found at {CONTENT_DIR}")
        sys.exit(1)

    all_files = [
        p for p in CONTENT_DIR.rglob("*")
        if p.is_file() and p.suffix.lower() in SUPPORTED_EXTENSIONS
    ]

    if not all_files:
        print("No supported files found.")
        sys.exit(0)

    print(f"Found {len(all_files)} file(s) to upload:")
    for p in all_files:
        print(f"  {p.relative_to(CONTENT_DIR.parent)}")
    print()

    success, failed = 0, 0
    for file_path in all_files:
        rel = file_path.relative_to(CONTENT_DIR.parent)
        print(f"Uploading: {rel} ... ", end="", flush=True)
        try:
            result = upload_file(file_path)
            doc_id = result.get("document", {}).get("id", "?")
            print(f"OK (doc id: {doc_id})")
            success += 1
        except requests.HTTPError as e:
            print(f"FAILED — {e.response.status_code}: {e.response.text}")
            failed += 1
        except Exception as e:
            print(f"FAILED — {e}")
            failed += 1

    print(f"\nDone: {success} uploaded, {failed} failed.")


if __name__ == "__main__":
    main()
