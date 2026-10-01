const DEFAULT_DIFY_API_BASE = "https://api.dify.ai/v1";
const MAX_QUERY_LENGTH = 4000;
const MAX_BODY_BYTES = 12000;

function allowedOrigins(env) {
  return String(env.ALLOWED_ORIGINS || "")
    .split(",")
    .map((origin) => origin.trim().replace(/\/$/, ""))
    .filter(Boolean);
}

function corsHeaders(origin) {
  return {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "86400",
    "Vary": "Origin"
  };
}

function jsonResponse(payload, status, origin = "") {
  const headers = {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store"
  };
  if (origin) Object.assign(headers, corsHeaders(origin));
  return Response.json(payload, { status, headers });
}

function validIdentifier(value, maximum) {
  return typeof value === "string"
    && value.length <= maximum
    && /^[a-zA-Z0-9_-]*$/.test(value);
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (request.method === "GET" && url.pathname === "/health") {
      return jsonResponse({ ok: true }, 200);
    }

    if (url.pathname !== "/chat" && url.pathname !== "/api/chat") {
      return jsonResponse({ error: "Not found." }, 404);
    }

    const origin = (request.headers.get("Origin") || "").replace(/\/$/, "");
    const origins = allowedOrigins(env);
    if (!origin || !origins.includes(origin)) {
      return jsonResponse({ error: "Origin not allowed." }, 403);
    }

    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: corsHeaders(origin) });
    }

    if (request.method !== "POST") {
      return jsonResponse({ error: "Method not allowed." }, 405, origin);
    }

    if (!env.DIFY_API_KEY) {
      return jsonResponse({ error: "Chat is not configured." }, 503, origin);
    }

    const declaredSize = Number(request.headers.get("Content-Length") || 0);
    if (declaredSize > MAX_BODY_BYTES) {
      return jsonResponse({ error: "Request is too large." }, 413, origin);
    }

    let body;
    try {
      const rawBody = await request.text();
      if (new TextEncoder().encode(rawBody).byteLength > MAX_BODY_BYTES) {
        return jsonResponse({ error: "Request is too large." }, 413, origin);
      }
      body = JSON.parse(rawBody);
    } catch (_) {
      return jsonResponse({ error: "Invalid JSON request." }, 400, origin);
    }

    const query = typeof body.query === "string" ? body.query.trim() : "";
    if (!query || query.length > MAX_QUERY_LENGTH) {
      return jsonResponse({ error: `Question must contain 1–${MAX_QUERY_LENGTH} characters.` }, 400, origin);
    }

    const conversationId = body.conversation_id || "";
    const userId = body.user || "";
    if (!validIdentifier(conversationId, 128) || !validIdentifier(userId, 100)) {
      return jsonResponse({ error: "Invalid conversation data." }, 400, origin);
    }

    const difyBase = String(env.DIFY_API_BASE || DEFAULT_DIFY_API_BASE).replace(/\/$/, "");
    let upstream;
    try {
      upstream = await fetch(`${difyBase}/chat-messages`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${env.DIFY_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          inputs: {},
          query,
          response_mode: "streaming",
          conversation_id: conversationId,
          user: `portfolio-${userId || crypto.randomUUID()}`,
          files: [],
          auto_generate_name: true
        }),
        signal: request.signal
      });
    } catch (_) {
      return jsonResponse({ error: "The assistant is temporarily unavailable." }, 502, origin);
    }

    if (!upstream.ok || !upstream.body) {
      return jsonResponse({ error: "The assistant could not answer right now." }, upstream.status >= 500 ? 502 : 400, origin);
    }

    return new Response(upstream.body, {
      status: 200,
      headers: {
        ...corsHeaders(origin),
        "Content-Type": "text/event-stream; charset=utf-8",
        "Cache-Control": "no-cache, no-store",
        "X-Accel-Buffering": "no"
      }
    });
  }
};
