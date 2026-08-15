# Northlight Home Staging

<a alt="Nx logo" href="https://nx.dev" target="_blank" rel="noreferrer"><img src="https://raw.githubusercontent.com/nrwl/nx/master/images/nx-logo.png" width="45"></a>

A marketing website for a home staging studio, built as an Angular 22 + [Nx](https://nx.dev) monorepo.

> **Note:** Northlight is a fictional company. The projects, testimonials, statistics, and
> contact details throughout the site are invented placeholder content, and the photography
> is generated SVG artwork. Replace them before using this for anything real.

## 📦 Project Overview

- **2 Applications**

  - `shop` — the Angular marketing site (fully prerendered to static files)
  - `api` — legacy Express backend from the original template; **not used by the site**

- **8 Libraries**

  - `@org/shop/feature-home` — home page
  - `@org/shop/feature-services` — services, pricing, and FAQ
  - `@org/shop/feature-portfolio` — before/after portfolio with filtering
  - `@org/shop/feature-about` — studio story and team
  - `@org/shop/feature-contact` — quote request form
  - `@org/shop/shared-ui` — presentational components shared across pages
  - `@org/shop/data` — content and quote-submission services
  - `@org/models` — shared domain models

- **E2E Testing**
  - `shop-e2e` — Playwright tests for the site

## 🚀 Quick Start

```bash
# Install dependencies
# (Note: You may need --legacy-peer-deps)
npm install

# Serve the site at http://localhost:4200
npx nx run shop:serve

# Build for production (prerenders all five routes)
npx nx run shop:build

# Serve the production build
npx nx run shop:serve-static

# Run unit tests / lint / build across the workspace
npx nx run-many -t test
npx nx run-many -t lint
npx nx run-many -t build

# Run e2e tests
npx nx run shop-e2e:e2e

# Visualize the project graph
npx nx graph
```

## 🚢 Deploying

The site builds to static files and is deployed to **Cloudflare Pages**:

- Build command: `npx nx run shop:build`
- Output directory: `dist/apps/shop/browser`
- `NODE_VERSION`: `22.22.3`

See **[DEPLOYMENT.md](./DEPLOYMENT.md)** for the full step-by-step guide, how routing and
caching behave in production, and troubleshooting.

## 🏠 About the Site

### Pages

| Route        | Library                        | Contents                                                                     |
| ------------ | ------------------------------ | ---------------------------------------------------------------------------- |
| `/`          | `@org/shop/feature-home`       | Hero, impact stats, before/after slider, packages, process, work, testimonials |
| `/services`  | `@org/shop/feature-services`   | Pricing cards, comparison table, process, accordion FAQ, service areas         |
| `/portfolio` | `@org/shop/feature-portfolio`  | Comparison sliders plus a filterable project archive                           |
| `/about`     | `@org/shop/feature-about`      | Studio story, values, team with credentials                                    |
| `/contact`   | `@org/shop/feature-contact`    | Quote request form with validation and confirmation                            |

Every route is lazy loaded via `loadComponent` and prerendered at build time — see
`apps/shop/src/app/app.routes.ts` and `app.routes.server.ts`.

### Content

All copy lives in `StagingContentService` (`packages/shop/data`), held in memory rather than
fetched, so every page renders on the server without a round trip. To rebrand the site, edit
the constants at the top of `staging-content.service.ts` — company details, services,
projects, testimonials, process steps, FAQs, team, stats, and service areas.

### Forms

The quote request form uses **Signal Forms** (`@angular/forms/signals`): a schema of
validators bound to a `signal` model, with fields wired up through the `[formField]`
directive. `QuoteRequestService` currently resolves locally after a short delay — replace the
body of its `submit()` method with an HTTP call when a real endpoint exists; the signature is
already the right shape.

### Images

`apps/shop/public/images/` contains generated SVG placeholders — stylised "before" (bare,
cold) and "after" (furnished, warm) rooms, varied per project, plus team portraits. Swap in
real photography and keep the `ngSrc` / `width` / `height` attributes intact so
`NgOptimizedImage` keeps working.

### Conventions

The site follows modern Angular practice throughout: standalone components without explicit
`standalone`/`changeDetection` flags, `input()` / `computed()` / signals for state, native
control flow (`@if` / `@for` / `@switch`), `class` and `style` bindings rather than `ngClass`
/ `ngStyle`, `inject()` over constructor injection, and `@Service()` for singletons.

Accessibility is treated as a requirement, not a polish pass: a skip link, labelled
navigation with `aria-current`, `aria-expanded` disclosures for the mobile menu and FAQ,
form errors wired via `aria-describedby` and `aria-invalid`, polite live regions for filter
results, and a before/after slider built on a real `input[type=range]` so it is keyboard
operable.

## ⭐ Featured Nx Capabilities

### 1. 🔒 Module Boundaries

Enforces architectural constraints using tags. Each project has specific dependencies it can use:

- `scope:shared` - Can be used by all projects
- `scope:shop` - Shop-specific libraries
- `scope:api` - API-specific libraries
- `type:feature` - Feature libraries
- `type:data` - Data access libraries
- `type:ui` - UI component libraries

**Try it out:**

```bash
# See the current project graph and boundaries
npx nx graph

# View a specific project's details
npx nx show project shop --web
```

[Learn more about module boundaries →](https://nx.dev/docs/features/enforce-module-boundaries)

### 2. 🎭 Playwright E2E Testing

End-to-end testing with Playwright is pre-configured:

```bash
# Run e2e tests
npx nx run shop-e2e:e2e

# Run e2e tests in CI mode
npx nx run shop-e2e:e2e-ci

# Run against an already-running server
BASE_URL=http://localhost:4200 npx nx run shop-e2e:e2e
```

[Learn more about E2E testing →](https://nx.dev/docs/technologies/test-tools/playwright)

### 3. ⚡ Vitest for Unit Testing

Fast unit testing with Vite for Angular libraries:

```bash
# Test a specific library
npx nx run shared-ui:test

# Test all projects
npx nx run-many -t test
```

[Learn more about Vite testing →](https://nx.dev/docs/technologies/build-tools/vite)

### 4. 🐳 Docker Integration

The legacy `api` project includes Docker support with automated targets and release management:

```bash
# Build Docker image
npx nx run api:docker:build

# Run Docker container
npx nx run api:docker:run

# Release with automatic Docker image versioning
npx nx release
```

[Learn more about Docker integration →](https://nx.dev/docs/guides/nx-release/release-docker-images)

### 5. 🔧 Self-Healing CI

The CI pipeline includes `nx fix-ci` which automatically identifies and suggests fixes for common issues:

```bash
# In CI, this command provides automated fixes
npx nx fix-ci
```

[Learn more about self-healing CI →](https://nx.dev/docs/features/ci-features/self-healing-ci)

## 📁 Project Structure

```
├── apps/
│   ├── shop/           [scope:shop]    - Angular marketing site (prerendered)
│   ├── shop-e2e/                       - Playwright tests
│   └── api/            [scope:api]     - Legacy Express API (unused by the site)
├── packages/
│   ├── shop/
│   │   ├── feature-home/       [scope:shop,type:feature] - Home page
│   │   ├── feature-services/   [scope:shop,type:feature] - Services & pricing
│   │   ├── feature-portfolio/  [scope:shop,type:feature] - Portfolio
│   │   ├── feature-about/      [scope:shop,type:feature] - About the studio
│   │   ├── feature-contact/    [scope:shop,type:feature] - Quote request form
│   │   ├── data/               [scope:shop,type:data]    - Content & quote services
│   │   └── shared-ui/          [scope:shop,type:ui]      - UI components
│   ├── api/
│   │   └── products/    [scope:api]    - Legacy product service
│   └── shared/
│       └── models/      [scope:shared,type:data] - Shared models
├── nx.json             - Nx configuration
├── tsconfig.base.json  - TypeScript path mappings
└── eslint.config.mjs   - ESLint with module boundary rules
```

## 🏷️ Understanding Tags

This repository uses tags to enforce module boundaries:

| Project            | Tags                         | Can Import From              |
| ------------------ | ---------------------------- | ---------------------------- |
| `shop`             | `scope:shop`                 | `scope:shop`, `scope:shared` |
| `api`              | `scope:api`                  | `scope:api`, `scope:shared`  |
| `feature-*`        | `scope:shop`, `type:feature` | `scope:shop`, `scope:shared` |
| `shared-ui`        | `scope:shop`, `type:ui`      | `scope:shop`, `scope:shared` |
| `data`             | `scope:shop`, `type:data`    | `@org/models` (see below)    |
| `models`           | `scope:shared`, `type:data`  | Nothing (base library)       |

A project carrying two tags must satisfy **both** rules. `data` is tagged `scope:shop` *and*
`type:data`, so its dependencies must be `scope:shop`/`scope:shared` **and** `type:data` —
which in practice means `@org/models`. Import a UI library from `data` and lint will fail.

## 📚 Useful Commands

```bash
# Project exploration
npx nx graph                                   # Interactive dependency graph
npx nx list                                    # List installed plugins
npx nx show project shop --web                 # View project details

# Development
npx nx run shop:serve                          # Serve the site
npx nx run shop:build                          # Production build with prerendering
npx nx run shop:serve-static                   # Serve the production build
npx nx run data:test                           # Test a specific library
npx nx run feature-contact:lint                # Lint a specific library

# Running multiple tasks
npx nx run-many -t build                       # Build all projects
npx nx run-many -t test --parallel=3           # Test in parallel

# Affected commands (great for CI)
npx nx affected -t build                       # Build only affected projects
npx nx affected -t test                        # Test only affected projects
```

## 🎯 Adding New Features

### Generate a new Angular library:

```bash
npx nx g @nx/angular:lib packages/shop/feature-my-page
```

Then register it in `tsconfig.base.json` (the generator usually does this for you) and add a
lazy route in `apps/shop/src/app/app.routes.ts`, plus a `RenderMode.Prerender` entry in
`app.routes.server.ts` if the page is static.

### Generate a new Angular component:

```bash
npx nx g @nx/angular:component my-component --project=shared-ui
```

Components in `shared-ui` use the `shop-` selector prefix, enforced by that project's ESLint
config.

You can use `npx nx list` to see all available plugins and `npx nx list <plugin-name>` to see all generators for a specific plugin.

## Nx Cloud

Nx Cloud ensures a [fast and scalable CI](https://nx.dev/nx-cloud?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects) pipeline. It includes features such as:

- [Remote caching](https://nx.dev/docs/features/ci-features/remote-cache?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)
- [Task distribution across multiple machines](https://nx.dev/docs/features/ci-features/distribute-task-execution?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)
- [Automated e2e test splitting](https://nx.dev/docs/features/ci-features/split-e2e-tasks?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)
- [Task flakiness detection and rerunning](https://nx.dev/docs/features/ci-features/flaky-tasks?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)

🚀 [Finish setting up your workspace](https://cloud.nx.app/connect/Kf9qcySizK) to get faster builds with remote caching, distributed task execution, and self-healing CI. [Learn more about Nx Cloud](https://nx.dev/ci/intro/why-nx-cloud).

## Install Nx Console

Nx Console is an editor extension that enriches your developer experience. It lets you run tasks, generate code, and improves code autocompletion in your IDE. It is available for VSCode and IntelliJ.

[Install Nx Console &raquo;](https://nx.dev/docs/getting-started/editor-setup?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)

## 🔗 Learn More

- [Angular Documentation](https://angular.dev)
- [Signal Forms](https://angular.dev/guide/forms/signals)
- [NgOptimizedImage](https://angular.dev/guide/image-optimization)
- [Nx Documentation](https://nx.dev/docs)
- [Module Boundaries](https://nx.dev/docs/features/enforce-module-boundaries)
- [Playwright Testing](https://nx.dev/docs/technologies/test-tools/playwright)
- [Vite with Angular](https://nx.dev/docs/technologies/build-tools/vite)
- [Nx Cloud](https://nx.dev/nx-cloud)

## 💬 Community

Join the Nx community:

- [Discord](https://go.nx.dev/community)
- [X (Twitter)](https://twitter.com/nxdevtools)
- [LinkedIn](https://www.linkedin.com/company/nrwl)
- [YouTube](https://www.youtube.com/@nxdevtools)
- [Blog](https://nx.dev/blog)
