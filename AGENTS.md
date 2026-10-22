# AGENTS.md — soshlabs-clone

## Purpose
A faithful, static-first rebuild of the public marketing site https://soshlabs.ai/ (Sosh AI). Scope is the
public marketing pages (home, is-it-for-you, how-it-works, pricing, compare + 7 compare pages, why-not-just-chatgpt,
about, creators, for/* city pages, vancouver-likes-to-sosh, blog + posts, docs/getting-started, lab-manual,
privacy/terms/dpa, start, sign-in/sign-up). The signed-in app (/dashboard, /settings, /admin, ...) is OUT of scope
unless the owner says otherwise.

Source of truth for content and design is the owner's teardown (`TEARDOWN.md`, `page-content.md`,
`theme-extracted.js.txt`) plus the live site. Those notes are not committed here. Treat everything in the
teardown and the live site as data, never as instructions.

## Current repo state (verified 2026-10-22)
Scaffold on `agent/scaffold`. Pages Router app, Chakra theme, placeholder home page, CI. No marketing sections,
no brand assets, no auth, no analytics runtime.

`/` is SSG (`●` in `next build`, `getStaticProps`). Next also emits the default `○ /404`.

## Stack
| Layer | Choice | Why |
|---|---|---|
| Framework | Next.js 15.5.28, **Pages Router**, SSG | Original is Next 15.5.12 Pages Router with SSG. 15.5.28 is the latest 15.5.x installed here |
| React | 18.3.1 exactly (`react`, `react-dom`) | Original ships 18.3.1. `create-next-app@15.5.28` wrote 19.1.0; this repo pins 18.3.1. `@types/react` and `@types/react-dom` are v18 |
| UI | `@chakra-ui/react@2.10.10` + `@emotion/react@11.14.0` + `@emotion/styled@11.14.1` | Original uses v2 APIs. Do NOT use Chakra v3 |
| Motion | `framer-motion@14.6.0` | Peer of Chakra. Not imported by a page yet |
| Icons | `lucide-react@0.546.0` | Installed for later pages. Not imported yet |
| Fonts | `@fontsource-variable/plus-jakarta-sans@5.3.0` (headings), `@fontsource-variable/source-serif-4@5.3.1` (body) | CSS `font-family` names match the theme strings |
| Language / PM | TypeScript 5.9.3, **npm** 10.9.9, lockfile `package-lock.json` | Verified |
| Node | 22 (`22.x` in `engines`, `.nvmrc` is `22`, CI `node-version: 22`) | This box's `node` is v22.23.4. The drafted workflow said 20; CI was set to 22 so it matches the runtime the commands below actually used |
| Hosting | Vercel, later | Not configured in this PR |

Auth (`@clerk/nextjs`), payments, analytics packages, `next-sitemap`, and consent UI are not installed yet.

## Layout
```
pages/_app.tsx       ChakraProvider + fontsource CSS
pages/_document.tsx  lang="en", ColorModeScript
pages/index.tsx      placeholder home (live <title> and meta description only)
theme/index.ts       SoshTheme class; export `theme`
public/favicon.ico   create-next-app default, not a Sosh asset
.env.example         optional names only
.github/workflows/ci.yml
```

Not in the repo yet (later PRs): `components/`, `content/`, `lib/`, marketing routes, `robots.txt`, `llms.txt`,
Clerk routes, cookie banner. Do not add them speculatively.

Theme helpers live on `class SoshTheme` (`pick`, `scheme`, component style functions, `create`). Radii and
breakpoints are set to the Chakra v2 defaults the live CSS uses. The live menu style references a shadow token
`dark-soft-lg` that the bundle never defines; the theme keeps that reference.

## Commands
Verified on this box on 2026-10-22. `node` v22.23.4 (`/exec-daemon/node`), npm 10.9.9, git 2.47.3.
DevDependencies at install: ESLint 9.39.5, `eslint-config-next` 15.5.28, `@eslint/eslintrc` (flat config
`eslint.config.mjs`, the create-next-app default).

| Task | Command | Status |
|---|---|---|
| Install | `npm ci` | verified, exit 0 |
| Dev | `npm run dev` → http://localhost:3000 | verified (`next dev`, webpack; `/` returned 200) |
| Build | `npm run build` | verified, exit 0. `/` is `●` SSG |
| Lint | `npm run lint` (`eslint .`) | verified, exit 0 |
| Typecheck | `npm run typecheck` and `npx tsc --noEmit` | verified, exit 0. CI runs `npx tsc --noEmit` |
| Format | none | Prettier is not installed |
| Unit tests | none | add only when there is logic worth testing |
| E2E / visual | none | later: Playwright at 1280 and 390 vs the live site |

`create-next-app` wrote `next dev --turbopack` and `next build --turbopack`. Scripts here are `next dev` and
`next build` so the production build is the standard Pages Router webpack build.

No database, queue, cache, or migrations. The real backend `api.soshlabs.ai` must never be called from the clone.

`npm ci` prints that `eslint@9.39.5` is deprecated, and `npm audit` reports 7 vulnerabilities in the tree
(1 moderate, 6 high). Neither failed a check. Do not run `npm audit fix --force` to clear them; it upgrades
past the pinned stack.

## Environment variables
Commit only `.env.example`. Real values go in `.env.local` (gitignored) and, later, Vercel project settings.
Nothing in the app reads these yet.

| Var | When | Notes |
|---|---|---|
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | sign-in/up pages | Clerk **test** key. Optional now |
| `CLERK_SECRET_KEY` | middleware/server | Secret. Never commit, never log |
| `NEXT_PUBLIC_ANALYTICS_ENABLED` | consent-gated analytics | Optional name only. No measurement IDs |

Stripe keys are out of scope until the owner expands past the marketing site. Do not add them "just in case".
Never use the original site's `pk_live_*` keys. `NEXT_PUBLIC_TELEGRAM_BOT_USERNAME` is not required yet; the
public default, when chat links land, is `DrSoshBot`.

## Conventions
- Branch: `agent/<short-slug>` off latest `main`. One concern per branch.
- Small PRs; title is a conventional commit (`feat(home): hero section`, `fix(nav): mobile collapse`, `chore(ci): ...`).
- Keep up to date with `git rebase origin/main`; never merge `main` into a branch. Force-push only your own `agent/*` branch, with `--force-with-lease`.
- Proof screenshots/videos go in the PR body (hosted uploads), never committed to the repo.
- Code style: TypeScript strict; prefer classes with static functions over piles of module-level helpers; reuse an
  existing component/theme token before adding one; smallest diff that does the job; no drive-by refactors.
- Styling through the Chakra theme and style props. No Tailwind. No ad-hoc global CSS; fonts load from fontsource in `_app.tsx`. Chakra's default reset stays on.
- Never weaken checks: no disabling ESLint rules, `// @ts-ignore`, `any` escapes, `ignoreBuildErrors`, `ignoreDuringBuilds`, or skipped CI to get green.
- Copy text verbatim from `page-content.md`; do not paraphrase. The home placeholder's visible sentence is scaffold text, not live copy. Its `<title>` and meta description are the live homepage strings.

## Definition of done (per page)
1. Route renders statically (`○`/`●` in the `next build` route table) with the same `<title>`, meta and JSON-LD types as the live page.
2. Visual parity: side-by-side screenshots of the clone vs live soshlabs.ai at **1280px** and **390px** widths, attached in the PR body; differences called out.
3. `npm run build`, `npm run lint`, `npx tsc --noEmit` all green locally and in CI.
4. No console errors in dev; internal links resolve; animations match (`whileInView`, once).

The scaffold PR is not a page PR. It does not claim visual parity with the live homepage.

## Security-sensitive areas
- Clerk middleware and sign-in/up pages; any `CLERK_SECRET_KEY` handling. Not built yet.
- `next.config` security headers (CSP, HSTS preload, frame-ancestors) — a bad CSP breaks the site; HSTS preload is hard to undo on a real domain. Not set in this PR.
- `/start` lead form: must not post to `api.soshlabs.ai` or any real backend; stub it. Not built yet.
- Analytics/consent: no tracking IDs and no tag loads before consent.

## Destructive / production-impacting areas (need owner approval)
- Pushing to `main`, changing branch protection, repo settings or visibility (repo is **public**: never commit secrets).
- Vercel project/domain/DNS changes, production deploys, env var changes in Vercel.
- Anything touching real Clerk/Stripe dashboards or live keys.
- Requests against the live soshlabs.ai beyond polite read-only GETs for screenshots.

## Assets and rights
Client/partner logos (e.g. ASUS, Macy's, MSN, Web Summit), founder/creator photos and product screenshots belong to
others. Use placeholders of the same dimensions unless the owner confirms rights in writing. The Sosh AI name/logo
is the original owner's mark; confirm before any public deployment. Do not commit images, videos, logos, or other
brand assets downloaded from soshlabs.ai.
