# MovieHubFilms

MovieHubFilms is a React + TypeScript + Vite movie discovery app served by one Cloudflare Worker. The Worker serves Vite-built static assets and same-origin `/api/*` endpoints. TMDB supplies verifiable movie data; D1 stores anonymous visitor favorites and personal watchlists. OpenRouter-assisted discovery is optional.

## Requirements
- Node.js 22 or newer
- npm
- A TMDB API key for movie data
- Cloudflare account only for remote deployment; local development uses Wrangler's local runtime and local D1

## Local setup
The checked-in lockfile currently does not contain package records for `@cloudflare/vite-plugin` and `wrangler`, even though `package.json` declares them. Regenerate and review the lockfile once registry access is available (`npm install --no-audit --no-fund`) before relying on `npm ci`.

```bash
npm install
cp .dev.vars.example .dev.vars
# Edit .dev.vars and add TMDB_API_KEY plus a random VISITOR_TOKEN_SECRET (32+ characters).
npm run db:migrate:local
npm run dev
```

Open the local URL Vite prints. Check `/api/health` for the Worker health response. D1 is local; no production database or Cloudflare credentials are needed for local development. AI discovery is disabled gracefully unless `OPENROUTER_API_KEY` is set in `.dev.vars`.

## Commands
- `npm run dev` — Vite + Cloudflare Worker development
- `npm run build` — TypeScript project checks and production Vite build
- `npm run lint` — ESLint
- `npm run cf:dev` — Wrangler Worker preview
- `npm run db:migrate:local` — apply migrations to local D1
- `npm run db:migrate:remote` — apply migrations to the configured remote D1 (only when intentionally preparing a remote environment)
- `npm run deploy` — build and deploy to Cloudflare; **does not run automatically**

## Secrets
Local-only secrets belong in `.dev.vars`, which must not be committed:
- `TMDB_API_KEY` — TMDB v3 API key, used only by the Worker
- `VISITOR_TOKEN_SECRET` — at least 32 random characters; signs the anonymous visitor cookie
- `OPENROUTER_API_KEY` — optional; omit to disable AI discovery
- `OPENROUTER_MODEL` — optional model identifier; defaults to `openrouter/free` (review current availability and pricing at OpenRouter before use)

For a remote Worker, create secrets interactively with `npx wrangler secret put TMDB_API_KEY`, `npx wrangler secret put VISITOR_TOKEN_SECRET`, and optionally `npx wrangler secret put OPENROUTER_API_KEY`. Configure `OPENROUTER_MODEL` as a Worker variable if needed. Never prefix secrets with `VITE_`.

## D1
Schema lives in `migrations/0001_initial.sql`. It creates favorites, watchlists, watchlist entries, and a minimal analytics events table. D1 is bound as `DB` in `wrangler.jsonc`. For a new Cloudflare environment, create the D1 database in the dashboard or with `npx wrangler d1 create moviehubfilms-db`, then replace the placeholder `database_id` in `wrangler.jsonc` with the actual database ID before applying remote migrations. Local migrations do not use production data.

## Anonymous identity and privacy
A random visitor ID is held in a signed, HttpOnly, Secure, SameSite=Lax cookie. The Worker verifies the HMAC and expiry before using the ID as the owner for favorites/watchlists; the browser never supplies an owner ID. Configure `VISITOR_TOKEN_SECRET` or personal APIs return a safe configuration error. Clearing cookies or switching browsers/devices can make anonymous data inaccessible. This is not account authentication and does not provide cross-device sync. Build account linking/recovery separately if needed.

Analytics accepts a fixed allow-list of event types and only retains a small metadata allow-list (`resultCount`, `pageType`). It does not record raw IP addresses or prompt content, and is best-effort from the frontend. The current table has no automatic expiry: decide a retention period and add a scheduled deletion task before meaningful production use.

## API overview
- `GET /api/health`
- `GET /api/movie/{popular|now_playing|top_rated|upcoming}`
- `GET /api/movie/:id`, `/similar`, `/recommendations`
- `GET /api/search/movie`, `/api/discover/movie`, `/api/genre/movie/list`
- `GET|POST /api/favorites`, `DELETE /api/favorites/:movieId`
- `GET|POST /api/watchlists`, `PATCH|DELETE /api/watchlists/:id`
- `GET|POST|DELETE /api/watchlists/:id/entries` (DELETE takes `?movieId=`)
- `POST /api/ai/discover` with `{ "prompt": "..." }`
- `POST /api/analytics` with a validated event type

AI uses OpenRouter to formulate search terms, then validates displayed results against TMDB search results. It does not claim streaming availability. This first iteration does not include AI personalization history or persistent chat transcripts.

## Production deployment checklist
1. Review current Cloudflare Workers/Vite plugin and Wrangler documentation.
2. Configure a real D1 database ID and apply remote migrations deliberately.
3. Set secrets with Wrangler; do not place secrets in source or frontend environment variables.
4. Run local migrations, build, lint, tests, and manually test nested routes/API error cases.
5. Deploy to a separate `workers.dev` URL first. Do not change DNS until explicitly approved.
6. Keep Netlify's existing production configuration and deployment untouched as a fallback. `netlify.toml` remains in the repository.

## Licensing and monetization
TMDB access and imagery are subject to TMDB's current terms and attribution requirements. Do not enable ads, subscriptions, affiliate links, or other commercial use until the applicable licensing question has been resolved: https://www.themoviedb.org/documentation/api/terms-of-use. The Pro Membership CTA remains promotional UI only; there is no payment flow.

## Known limitations
- Anonymous saved data is browser-scoped and not recoverable after losing the cookie.
- Watchlist detail pages now include a catalog search picker. Browser-level end-to-end coverage is still pending.
- Analytics has no dashboard or automated retention task yet.
- AI model availability/pricing can change; configure and test the desired model before enabling it for users.
- Tests currently cover Worker route validation and input guards; they are not local D1 runtime or browser-level integration tests.
