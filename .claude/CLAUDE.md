# AmpliTeach — project instructions

A **marketing website**: a Next.js 16 rebuild of ampliteach.com (WordPress).
Home, why-choose, features-and-benefits, little-rockers, pricing, contact, blog,
privacy, terms. That is the whole scope.

**Read [`README.md`](../README.md) first** — folder structure, per-route
rendering table, and the static-export constraints live there and are not
repeated here. Architecture study: `docs/nextjs-architecture-plan.html`.

## Project requirements

These come from the client and govern every other decision in this file.

1. **Pixel-perfect parity with ampliteach.com, animations included.** Design,
   content and media are reproduced **as-is** — not reinterpreted, not
   modernised. A more contemporary type scale, a fluid heading, a cleaner
   accent is a **regression** against this requirement, not an upgrade.
2. **Parity at every viewport** — desktop, tablet and mobile alike.
3. **Responsive across all six breakpoints.** This is the one place we go
   beyond the live site, which is not responsive. `xs`–`xl`
   (480/600/768/1024/1200) are the live site's own boundaries, so a live
   `@media (max-width: 599px)` rule ports straight to `sm:`. Tokens are in
   `src/app/globals.css`.
4. **Never deviate silently.** Extract real values from the live site's
   **stylesheets**, not its declared theme globals — those are Elementor
   factory defaults, not the brand. Where a judgement call would change the
   visual result, **ask** rather than choose. Every agreed difference is
   recorded in [`docs/PARITY.md`](../docs/PARITY.md); add to that log instead
   of deciding quietly.
5. **Build order.** Finish and confirm setup before any page work, then build
   **page by page, starting from the home page**. If page work comes up
   mid-setup, note it and move on.

[`docs/PARITY.md`](../docs/PARITY.md) holds the measured live-site values, how
they were measured, the deviation log, and the open visual questions.

## Stack

Next.js 16 (App Router) · React 19 · TypeScript strict · **Tailwind v4** ·
shadcn/ui (`radix-nova`, neutral base) · react-hook-form + zod · sonner ·
lucide-react. No React Query, no Zustand, no axios, no i18n, no auth, no
database — don't introduce one without being asked.

## Definition of done

```bash
npm run verify     # typecheck + lint + build — must pass
npm run format     # Prettier, with Tailwind class sorting
```

`npm run typecheck` (**not** `type-check`). A change that leaves an ESLint error
behind is unfinished; **never** silence a rule with `eslint-disable` or by
editing `eslint.config.mjs` — fix the code.

## The two constraints that break builds

**1. The default build is `output: 'export'`** — a static site for S3 +
CloudFront, with no Node runtime. So there is **no** ISR, `revalidate`,
`revalidateTag`, SSR, `cookies()`, `headers()`, Route Handlers (`app/api/*`),
middleware, `next/image` optimisation, or `redirects`/`rewrites`/`headers` in
`next.config.ts`. Reaching for any of them fails `npm run build`. Data is
fetched at **build** time; forms post to an external endpoint
(`NEXT_PUBLIC_FORM_ENDPOINT`). `NEXT_BUILD_MODE=server` unlocks ISR and Route
Handlers with no code changes — the api and form layers are already written for
both — but don't assume it.

**2. Tailwind v4 is CSS-first — there is no `tailwind.config.js`, and you must
not create one.** Every theme token is declared in `src/app/globals.css`
(`:root` / `.dark`, mapped through `@theme inline`) and becomes a utility
automatically: `--brand` → `bg-brand`. Opacity modifiers work normally
(`bg-primary/90`) — v4 handles alpha via `color-mix()` internally, so the old
manual `color-mix()` workaround is not needed here.

## File structure — one thing per file

**One exported component per file. No exceptions under `features/`.** A file is
named for the thing you would point at in a screenshot, so "the pricing cards
are misaligned on tablet" leads to exactly one file. This is the template for
every page; `features/home/` and `features/blog/` are the reference.

```
src/app/(marketing)/<page>/page.tsx   ROUTE ONLY: generateMetadata, params, data,
                                      404. Returns <XPage content={…} />. ~10–25 lines.
src/content/<page>.ts                 every word of copy, as a PageContent object
src/types/content/blocks.ts           the block shapes — one per section design
src/lib/api/<page>.ts                 CMS fetch, committed content as the fallback
src/lib/cms/page-content.ts           zod validation of the CMS payload

src/features/<page>/
├─ <page>-page.tsx                    maps content.blocks through the renderer
├─ section-renderer.tsx               block `type` → section component (a switch)
├─ index.ts                           barrel — exports the page component
├─ sections/                          ONE FILE PER SECTION, named for its block type
│  ├─ hero.tsx
│  ├─ overview.tsx
│  └─ index.ts                        barrel
└─ components/                        a piece shared by two sections on this page,
   └─ pricing-card.tsx                or one extracted from a section that grew
```

**A route file never composes a page.** It resolves routing concerns —
`metadata`/`generateMetadata`, `generateStaticParams`, awaiting `params`,
`notFound()`, and build-time data via `src/lib/api/` — then renders the single
`<XPage />` from `features/<page>/`, passing anything it fetched as props. So
"where is this page's outline?" has one answer, and it is never in `app/`.
`features/legal/` holds both legal stubs, since they share `content/legal.ts`.

**`sections/index.ts` is a barrel — re-exports only, never components.** Putting
two sections in one file is the specific mistake this rule prevents:
`why-choose/sections/index.tsx` currently holds **six**, and
`features-benefits` (4), `contact` (3), `pricing` (3) and `little-rockers` (2)
do the same. Bring each in line the next time it is touched.

**Split a section out when any of these is true:**

- it passes ~80 lines
- a second component appears in the file
- a piece of it is needed by another section → move to `components/`
- it mixes layout with a distinct concern — a form, a carousel, an animation

**One mechanism, one home.** Anything cross-cutting — an animation, a scroll
behaviour, a formatter — is written once (a hook in `src/hooks/`, keyframes as
`@theme --animate-*` tokens, a helper in `src/lib/utils/`) and imported. Never
re-implemented per section, or a fix lands in one of thirty copies.

## Content is data, and the CMS will serve it

The client has confirmed **every page's text comes from a CMS**. The CMS does
not exist yet; the site must already be built as though it did.
[`docs/CMS-CONTRACT.md`](../docs/CMS-CONTRACT.md) is the agreed API shape and
the spec the CMS is being built against. `features/home/` is the reference
implementation — convert the other pages to match as each is touched.

**A page is `seo` plus an ordered, toggleable list of blocks.** Editors reorder
sections and switch them off, so the order lives in `content.blocks`, never in
JSX. Four rules follow from that:

1. **A section never depends on its neighbours.** It owns its own background
   and its own vertical spacing — including any trailing spacer. Any block must
   render correctly in any position, next to any other block.
2. **A section reads its block prop and nothing else.** No section imports from
   `src/content/` — that import is what makes copy un-CMS-able.
3. **Copy is plain strings.** No HTML, no markdown in a content field. Emphasis
   that must exist is a separate field (see the hero's `body.emphasis`), never
   markup inside one.
4. **Nothing in a content field can be a function or a component.** An icon is
   a name resolved by `src/lib/icons/`, not a `LucideIcon`. If it cannot
   survive `JSON.parse(JSON.stringify(x))`, it does not belong in content.

**The fallback is permanent, not scaffolding.** `src/content/<page>.ts` holds
the real copy in the CMS's own shape. `lib/api/<page>.ts` prefers the CMS and
falls back to it when `CMS_API_URL` is unset, the fetch fails, or the payload
fails zod validation — always logging why. A CMS outage must never blank a page
or fail a build.

**SEO comes from content too** — `buildPageMetadata(content)` in
`generateMetadata`, not a hand-written title in the route file.

## Conventions

- **No hex, `rgb()`, named CSS colours or inline colour styles in components.**
  Use the tokens: `bg-background`, `text-foreground`, `bg-card`, `bg-primary`,
  `text-muted-foreground`, `border-border`, `text-destructive`, `bg-brand`.
  A colour change belongs in `globals.css` and nowhere else — the palette there
  is measured from the live site, so treat it as data, not as a starting point.
- **A page file only composes** — it takes resolved content and maps its blocks
  through the section renderer (20–40 lines). Page metadata is always
  `buildPageMetadata()` (or `buildMetadata()` where there is no page content
  yet) from `@/lib/seo`; never a hand-rolled `Metadata` object, and never
  react-helmet (it does not work in the App Router).
- **Copy lives in `src/content/*.ts`**, typed, in the CMS's own shape. No
  hard-coded sentences in JSX and no `@/content` import inside a section — a
  section renders the block it is handed.
- **Server Components by default.** `'use client'` goes on the smallest leaf.
  Today only: `NavLinks`, `MobileMenu`, `BlogSearch`, `TableOfContents`, the
  three forms, `error.tsx`.
- **Never `fetch` in a component** — only `src/lib/api/`, through `apiGet` /
  `apiGetWithHeaders` in `lib/api/client.ts`. CMS shapes are mapped to our own
  types in `lib/cms/` so the CMS can be swapped in one place.
- **Never read `process.env`** — import `env` (and `IS_STATIC_EXPORT`) from
  `@/config/env`, which validates once with zod.
- **Never hard-code a URL** — `src/lib/constants/routes.ts`. Note
  `trailingSlash: true`.
- `components/` is generic (would work on any site); `features/<page>/` is
  AmpliTeach-specific. `components/ui/` is managed by the shadcn CLI
  (`npx shadcn@latest add <x>`) — put project-specific pieces in
  `components/common/` instead.
- Section rhythm comes from `<Section>` + `<Container>` (`components/common`) —
  not ad-hoc margins.
- **One component per file, named export, `index.ts` barrel per folder.**
  Import from the barrel (`@/components/common`), and use absolute `@/` imports
  only — no `../../../`.
- **Files and folders are kebab-case** (`section-heading.tsx`,
  `use-media-query.ts`); Next.js route conventions (`[slug]`, `(marketing)`) are
  the exception.
- `sitemap.ts` and `robots.ts` are generated — a new route needs a sitemap entry,
  but never hand-edit the output.

## Forms

All three follow one shape: a zod schema in `src/lib/validation/`, bound with
`useForm({ resolver: zodResolver(schema) })`, fields wrapped in `FormField` +
`fieldA11y` (`components/forms/form-field.tsx`), submitted via
`src/lib/api/forms.ts`, with success/failure reported as a **sonner toast**. The
`<form>` is `noValidate` — validation is zod's, and messages come from the
schema. Every string field should start `z.string().trim()`. Contact and trial
forms carry a honeypot field that must stay empty.

## TypeScript

`strict` is on and `ignoreBuildErrors: false`, so a type error fails the build.

- **No `any`.** Narrow an unknown payload with a type guard
  (`function isPost(v: unknown): v is Post`), not a cast.
- **`import type`** for type-only imports.
- **Explicit return types on exported functions.** Inference is fine for small
  local helpers.
- **No unused imports or variables.**
- **Prefer union types to enums** (`type Tone = "default" | "muted" | "accent"`).
- **`interface` for object shapes that get extended; `type` for unions,
  intersections and mapped types.** Reach for `Pick` / `Omit` / `Partial`
  rather than re-declaring a near-duplicate shape.
- Types shared across features live in `src/types/`; a type used by one feature
  stays with it.
