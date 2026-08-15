# Deploying to Cloudflare Pages

The site builds to a folder of static files — no server runs in production. Every route is
prerendered at build time, so Cloudflare serves plain HTML from its CDN.

**Build settings at a glance:**

| Setting               | Value                     |
| --------------------- | ------------------------- |
| Build command         | `npx nx run shop:build`   |
| Build output directory | `dist/apps/shop/browser` |
| Root directory        | `/` (repository root)     |
| `NODE_VERSION`        | `22.22.3`                 |

---

## Before you start

- A [Cloudflare account](https://dash.cloudflare.com/sign-up) (free tier is enough).
- This repository pushed to GitHub or GitLab. The existing remote is
  `github.com/thhein04-eng/ngal-staging`.

Everything in the repo is already configured — `.nvmrc` pins the Node version and
`apps/shop/public/_headers` sets caching and security headers. There is nothing to install.

---

## Step 1 — Push your latest commit

Cloudflare builds from a branch, so make sure your work is on the remote:

```bash
git add .
git commit -m "Prepare site for Cloudflare Pages"
git push origin main
```

## Step 2 — Create the Pages project

1. Open the [Cloudflare dashboard](https://dash.cloudflare.com).
2. In the sidebar choose **Workers & Pages**.
3. Click **Create** → the **Pages** tab → **Connect to Git**.
4. Authorise Cloudflare for your GitHub account. You can grant access to a single
   repository rather than all of them.
5. Select the repository and click **Begin setup**.

## Step 3 — Configure the build

On the setup screen:

| Field                     | Value                    |
| ------------------------- | ------------------------ |
| Project name              | e.g. `northlight-staging` — becomes `northlight-staging.pages.dev` |
| Production branch         | `main`                   |
| Framework preset          | **None**                 |
| Build command             | `npx nx run shop:build`  |
| Build output directory    | `dist/apps/shop/browser` |
| Root directory            | leave blank              |

Leave the framework preset as **None**. The Angular preset assumes a single-app layout and
will look for the build output in the wrong place for this Nx workspace.

## Step 4 — Set the Node version

Still on the setup screen, expand **Environment variables (advanced)** and add one for
**Production**:

| Variable       | Value      |
| -------------- | ---------- |
| `NODE_VERSION` | `22.22.3`  |

Angular 22 requires Node `^22.22.3 || ^24.15.0 || >=26.0.0`, and Cloudflare's default is
older than that. The repo's `.nvmrc` covers this too, but setting the variable explicitly
avoids surprises if the default changes.

## Step 5 — Deploy

Click **Save and Deploy**. The first build takes roughly two to four minutes — most of it is
`npm install`. Watch the log; a successful run ends with:

```
Prerendered 5 static routes.
Application bundle generation complete.
```

Your site is then live at `https://<project-name>.pages.dev`.

## Step 6 — Check the deployment

Visit the URL and confirm:

- All five pages load: `/`, `/services`, `/portfolio`, `/about`, `/contact`.
- The before/after slider drags on the home page and the portfolio.
- The portfolio filter buttons change the project list.
- Submitting the empty contact form shows validation errors.
- An unknown URL such as `/nope` lands on the home page.

You can also point the e2e suite at the deployed site:

```bash
BASE_URL=https://<project-name>.pages.dev npx nx run shop-e2e:e2e
```

## Step 7 — Add a custom domain (optional)

1. Open your Pages project → **Custom domains** → **Set up a custom domain**.
2. Enter the domain, e.g. `northlightstaging.com`.
3. If the domain's nameservers are already on Cloudflare, the DNS record is created for you.
   Otherwise add the `CNAME` record Cloudflare displays at your registrar.
4. TLS certificates are issued automatically and are free.

---

## How it works in production

Cloudflare Pages needs **no `_redirects` file**. Its default asset handling already does what
this site needs:

- `/services` → `308` to `/services/`, which serves the prerendered `services/index.html`.
- An unknown path such as `/nope` → serves `index.html` with `200`, and the Angular router's
  `**` route sends the visitor to the home page.

Adding a `_redirects` rule for this actively breaks things: Cloudflare rejects `404` as a
redirect status, and `/* /index.html 200` is discarded as an infinite loop because Pages
strips `/index` and `.html` and re-triggers the rule. Both were verified against
`wrangler pages dev`.

### Headers

`apps/shop/public/_headers` is copied to the output root at build time and sets:

- `X-Content-Type-Options`, `Referrer-Policy`, `X-Frame-Options` and `Permissions-Policy` on
  every response.
- One-year immutable caching for `*.js` and `*.css`, which are safe to cache forever because
  the build stamps a content hash into every filename.
- One-day revalidating cache for `/images/*` and the favicon, which keep stable names — so
  replacing the placeholder artwork with real photography takes effect within a day.

HTML is deliberately left on Cloudflare's default (`max-age=0, must-revalidate`) so a new
deployment is visible immediately.

---

## Ongoing deployments

Every push to `main` triggers a production build. Pull requests get their own preview URL,
which is useful for reviewing copy or photography changes before they go live.

To roll back, open the project's **Deployments** tab, find a previous build and choose
**Rollback to this deployment**.

---

## Testing the production build locally

To reproduce Cloudflare's behaviour exactly — redirects, headers and all — before pushing:

```bash
npx nx run shop:build
npx wrangler pages dev dist/apps/shop/browser
```

This runs the same asset server Cloudflare uses and reports any invalid `_headers` or
`_redirects` rules. For a quicker check without Cloudflare semantics:

```bash
npx nx run shop:serve-static
```

---

## Troubleshooting

**Build fails with an engine or syntax error**
The Node version is too old. Confirm `NODE_VERSION` is set to `22.22.3` for the Production
environment, then retry the deployment.

**Build succeeds but the site is blank or 404s**
The output directory is wrong. It must be `dist/apps/shop/browser` — note the `browser`
suffix. `dist/apps/shop` alone contains a `browser` subfolder and a routes manifest, not the
site itself.

**Pages load but nothing is interactive**
JavaScript is failing to load. Open the browser console and check for blocked requests. If
you added a `Content-Security-Policy` to `_headers`, it is the likely cause.

**Styling or images are stale after a deploy**
Hashed assets cannot go stale, so this points at `/images/*`, which is cached for a day.
Hard-refresh, or purge the cache from **Caching** → **Configuration** in the dashboard.

**`npm install` fails on a peer dependency**
Add an environment variable `NPM_FLAGS` with the value `--legacy-peer-deps`.

---

## What changed to make this work

For reference, the repository was adjusted as follows:

- `apps/shop/project.json` — `outputMode` switched from `server` to `static`, and the `ssr`
  entry removed. The build now emits only `browser/`, with no server bundle.
- `apps/shop/src/server.ts` — deleted. It was the Express runtime entry, unused once the
  output is static.
- `apps/shop/public/_headers` — added.
- `.nvmrc` — added, pinning Node `22.22.3`.

The site still prerenders through `main.server.ts` and `app.routes.server.ts` at build time;
only the production server was removed.
