# Secure portfolio chat proxy

This Cloudflare Worker keeps the Dify chat app API key out of the public Hugo site and streams Dify's server-sent events to the custom portfolio interface.

Deployed endpoint: `https://shay-portfolio-chat.dannyshay.workers.dev/chat`

## Deploy

1. In Dify, open the portfolio chat app's **API Access** page and create or copy its app API key. This is separate from the public embed token currently stored in Hugo.
2. Check `ALLOWED_ORIGINS` in `wrangler.toml`. Browser origins do not contain a path, so the GitHub Pages value is `https://dannyshayh.github.io` even if the portfolio is served below `/Portfolio/`.
3. From this directory, authenticate and add the key as an encrypted Worker secret:

   ```sh
   npx wrangler login
   npx wrangler secret put DIFY_API_KEY
   ```

4. Deploy the Worker:

   ```sh
   npx wrangler deploy
   ```

5. Copy the deployed URL and add `/chat`, then set it in `config/_default/params.toml`:

   ```toml
   [chatbot]
     enabled = true
     proxyURL = "https://shay-portfolio-chat.<your-subdomain>.workers.dev/chat"
   ```

After that one setting is present, Hugo uses the fully custom interface. Until then, it deliberately keeps the existing Dify embed active so production chat continues to work.

## Local development

Copy `.dev.vars.example` to `.dev.vars`, place the app API key there, and run:

```sh
npx wrangler dev
```

`.dev.vars` is ignored by Git. Never add the Dify API key to `wrangler.toml`, Hugo configuration, browser JavaScript, or a committed environment file.

## Abuse protection

The Worker restricts browser origins, request methods, content size, and identifier formats. Origin checks prevent other websites from calling it through a visitor's browser, but they are not a complete rate limiter because non-browser clients can forge an `Origin` header. Before sharing the site widely, add a Cloudflare WAF rate-limiting rule for `POST /chat` (for example, a modest per-IP request limit) in the Cloudflare dashboard.
