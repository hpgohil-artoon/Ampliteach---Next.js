# AmpliTeach — Next.js

Rebuild of [ampliteach.com](https://www.ampliteach.com/) (WordPress) on Next.js 16.

**Architecture study and rendering decisions:** [`docs/nextjs-architecture-plan.html`](docs/nextjs-architecture-plan.html)

**Parity with the live site:** [`docs/PARITY.md`](docs/PARITY.md) — the measured
values from ampliteach.com (colour, type, breakpoints, container), how they were
measured, and every place we knowingly differ. Read it before changing anything
visual.

---

## Getting started

```bash
cp .env.example .env.local   # then fill in the values
npm install
npm run dev                  # http://localhost:3000
```

## Scripts

| Script                 | What it does                                                     |
| ---------------------- | ---------------------------------------------------------------- |
| `npm run dev`          | Dev server                                                       |
| `npm run build`        | **Static export build** (the default) — output lands in `out/`   |
| `npm run build:server` | Node build with ISR + Route Handlers enabled                     |
| `npm run serve:static` | Serve `out/` locally to check the exported site                  |
| `npm run typecheck`    | `tsc --noEmit`                                                   |
| `npm run lint`         | ESLint                                                           |
| `npm run format`       | Prettier, with Tailwind class sorting                            |
| **`npm run verify`**   | **typecheck + lint + build. Run before every push and in CI.**   |

---

## The one thing to understand first

The default build is `output: 'export'` — a pure static site that can be
dropped on **S3 + CloudFront** with no Node runtime. That is deliberate: it is
the most restrictive target, so anything incompatible with it fails on the
commit that introduces it rather than on deployment day.

**Static export does not support:**

- ISR / `revalidate` / `revalidateTag` — content is fetched at **build** time
- SSR, `cookies()`, `headers()`
- Route Handlers (`app/api/*`) — forms post to an external endpoint instead
- Middleware
- `next/image` optimisation — `unoptimized` is forced on
- `redirects` / `rewrites` / `headers` in `next.config.ts` — need a CloudFront Function

If hosting turns out to be Vercel, Amplify or Docker, set
`NEXT_BUILD_MODE=server` and ISR plus Route Handlers become available with **no
code changes** — the data layer and form layer are already written for both.

### Consequences you have to plan around

1. **A CMS publish needs a rebuild.** The CMS webhook must trigger the CI
   deploy pipeline, not `/api/revalidate`.
2. **Forms need a third-party endpoint** (API Gateway + Lambda, Formspree,
   HubSpot…) set as `NEXT_PUBLIC_FORM_ENDPOINT`. Left blank, submissions are
   logged to the console so you can still develop.
3. **Blog search is client-side** over an index baked into the page at build
   time. Fine at 13 posts.

---

## Rendering, per route

| Route                       | Mode           | Why                                            |
| --------------------------- | -------------- | ---------------------------------------------- |
| `/`                         | Static         | Fixed copy; the signup form is a client island |
| `/why-choose-ampliteach`    | Static         | Pure content                                   |
| `/features-and-benefits`    | Static         | Pure content                                   |
| `/little-rockers-program`   | Static         | Pure content                                   |
| `/privacy-policy` · `/terms-of-service` | Static | Pure content                            |
| `/pricing`                  | Static (SSG)   | Plans fetched at build; ISR when on a server   |
| `/blog` · `/blog/page/[n]`  | Static (SSG)   | Prebuilt from the post count                   |
| `/{post-slug}`              | Static (SSG)   | `generateStaticParams` over all slugs          |
| `/contact-us`               | Static + CSR   | Static page, client form → external endpoint   |
| SSR                         | **nowhere**    | No route differs per visitor                   |

> `/contact-us` being "dynamic" means the **submission** is dynamic, not the
> page. That is a Route Handler concern, not a rendering mode. Common mix-up.

**PPR is off.** Still experimental, needs `next@canary`, and solves a problem
this site does not have.

---

## Folder structure

```
src/
├─ app/                    ROUTING ONLY — no business logic
│  ├─ layout.tsx           html/body, fonts, Header + Footer, JSON-LD
│  ├─ page.tsx             Home
│  ├─ (marketing)/         route group — adds NO url segment
│  ├─ blog/                index + /blog/page/[page]
│  ├─ (posts)/[slug]/      root-level post urls, SEO preserved
│  ├─ sitemap.ts robots.ts generated, never hand-edited
│  └─ not-found.tsx error.tsx
│
├─ components/             generic — knows nothing about AmpliTeach
│  ├─ ui/                  shadcn/ui primitives (managed by the CLI)
│  ├─ layout/              Header TopBar NavLinks MobileMenu Footer …
│  ├─ common/              Container Section SectionHeading FeatureCard …
│  └─ forms/               ContactForm TrialSignupForm NewsletterForm
│
├─ features/               one folder per page — its sections live here
│  ├─ home/sections/       Hero Overview Features StudentBenefits …
│  ├─ why-choose/ features-benefits/ little-rockers/
│  ├─ pricing/             sections/ + components/PricingCard
│  ├─ contact/
│  └─ blog/components/     BlogCard BlogGrid PostBody TableOfContents …
│
├─ content/                every word of static copy, typed
├─ lib/
│  ├─ api/                 THE ONLY PLACE THAT FETCHES
│  ├─ cms/                 WordPress → our own types (swap CMS here only)
│  ├─ seo/                 buildMetadata() + JSON-LD
│  ├─ validation/          zod schemas, shared client + server
│  ├─ utils/               cn, format, pagination, headings
│  └─ constants/routes.ts  never hard-code a URL
├─ hooks/  types/  config/env.ts
```

### Why `components/` **and** `features/`

`components/` holds things that would work on any site (a `Button`, an
`Accordion`). `features/` holds things that only make sense here
(`home/sections/Faqs.tsx`). Without the split, one `components/` folder hits 90
files by launch and nobody can tell what is safe to change.

---

## The rules that keep files short

1. **A page file only composes.** Imports sections, exports `metadata`, returns
   them in order — 20–40 lines. See `src/app/page.tsx`.
2. **A section file only lays out.** It maps over data from `content/` or
   `lib/api/`. No hard-coded sentences in JSX.
3. **Copy lives in `src/content/*.ts`.** Marketing edits one line in one file
   and never opens a component.
4. **Server Components by default.** `'use client'` goes on the smallest
   possible leaf — the accordion, not the section containing it.
5. **Never `fetch` in a component.** Always through `src/lib/api/`.
6. **One component per file**, named export, `index.ts` barrel per folder.
7. **Absolute imports only** — `@/features/home/sections`. No `../../../`.
8. **No hex values in components.** Colours come from the tokens in
   `src/app/globals.css`.

Client components in the whole project: `NavLinks`, `MobileMenu`, `BlogSearch`,
`TableOfContents`, the three forms, and `error.tsx`. Everything else is server
rendered and ships zero JavaScript.

---

## Styling

**Tailwind v4** — CSS-first, so there is **no `tailwind.config.ts`**. Theme
tokens are declared in `src/app/globals.css` under `@theme`, and become
utilities automatically (`--color-brand` → `bg-brand`).

**shadcn/ui** (`radix-nova` preset, neutral base, CSS variables). Add a
component with:

```bash
npx shadcn@latest add <component>
```

Files land in `src/components/ui/` and are **ours to edit** — shadcn copies
source in rather than shipping a dependency. Treat `ui/` as managed by the CLI;
put project-specific pieces in `components/common/` instead.

---

## Open items

- [ ] **Confirm hosting** with DevOps. S3 is assumed; see the constraints above.
- [ ] **Confirm the CMS.** Headless WordPress is assumed (`CMS_API_URL`).
      Until it is set, the blog builds from `src/content/seed-posts.ts`.
- [ ] **Provision the form endpoint** and set `NEXT_PUBLIC_FORM_ENDPOINT`.
      Forms cannot work on S3 without it.
- [x] **Brand tokens** — done. The palette, typeface, type scale, breakpoints
      and container widths are all measured from the live site; see
      [`docs/PARITY.md`](docs/PARITY.md).
- [ ] **Real assets** into `public/images/` and `public/svg/`, then swap the
      `TODO` placeholder blocks for `<Img />`. Currently only `.gitkeep` files.
- [ ] **Legal copy** for `/privacy-policy` and `/terms-of-service`.
- [x] **CI**: `npm run verify` runs on every push and PR
      (`.github/workflows/verify.yml`), plus `format:check` and an assertion
      that the static export produced a real site.
- [ ] **Animations** — the live site's animations are in scope for parity but
      not yet surveyed. Scope them against the real home page rather than
      picking a library up front.
