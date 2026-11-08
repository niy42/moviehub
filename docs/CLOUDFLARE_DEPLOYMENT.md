# Cloudflare deployment and local development

## Architecture
Workers Static Assets serves the Vite frontend and the Worker handles `/api/*`. API routes are executed before SPA fallback, so API errors remain JSON. TMDB and OpenRouter keys are server-side only. D1 is bound as `DB` and migrations live in `migrations/`.

## Local workflow
The current lockfile is incomplete for `@cloudflare/vite-plugin` and `wrangler`; regenerate it with registry access using `npm install --no-audit --no-fund` and commit the reviewed lockfile before using `npm ci`.

```bash
npm install
cp .dev.vars.example .dev.vars
# Edit .dev.vars with TMDB_API_KEY and a random VISITOR_TOKEN_SECRET.
npm run db:migrate:local
npm run dev
```
`npm run build`, `npm run lint`, and `npm test` are available for checks. Open `/api/health` on the local development origin to confirm the Worker responds. `OPENROUTER_API_KEY` is optional.

## Remote setup (not run automatically)
1. Create a D1 database: `npx wrangler d1 create moviehubfilms-db`.
2. Copy its returned database ID into the `d1_databases` entry in `wrangler.jsonc`.
3. Apply remote migrations only after confirming the target account/database: `npm run db:migrate:remote`.
4. Set `TMDB_API_KEY` and `VISITOR_TOKEN_SECRET` with `npx wrangler secret put <NAME>`. Optionally set `OPENROUTER_API_KEY` the same way. `OPENROUTER_MODEL` is a non-secret variable.
5. Run `npm run build` and test a preview deployment on the assigned `workers.dev` URL.
6. `npm run deploy` deploys. It is deliberately not run as part of development or tests.

## Configuration and security
`VISITOR_TOKEN_SECRET` should be a high-entropy secret of at least 32 characters. The signed HttpOnly cookie identifies an anonymous browser, not a verified human/account. Loss of the cookie means loss of access to that visitor's saved items. Never expose the secret or TMDB/OpenRouter keys in `VITE_*` variables. Analytics stores allow-listed event types and bounded metadata, not raw IP addresses or AI prompts.

## Netlify fallback
The existing `netlify.toml` is preserved and no DNS or production deployment changes are made. Keep Netlify on its current production branch while testing Cloudflare independently. The Cloudflare branch uses `/api/*`, which Netlify does not implement unless separately configured; do not point Netlify's production build at this branch until a fallback API plan exists.

## Troubleshooting
- `server_misconfigured`: configure `TMDB_API_KEY` locally in `.dev.vars` or as a Worker secret.
- Personal API returns `identity_unavailable`: configure `VISITOR_TOKEN_SECRET`.
- Personal API returns `database_unavailable`: ensure local migrations have run and the `DB` binding is configured.
- AI discovery returns `ai_unavailable`: set optional `OPENROUTER_API_KEY` or use regular search.
- API route returns JSON 404: check the route spelling; `/api/*` intentionally does not fall through to `index.html`.

## Licensing
Resolve TMDB attribution and commercial-use requirements before enabling monetization. No payment processing or affiliate links are implemented.
