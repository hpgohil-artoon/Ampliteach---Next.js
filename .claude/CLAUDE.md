# AmpliTeach — project instructions

A **marketing website**: a Next.js 16 rebuild of ampliteach.com (WordPress).
Home, why-choose, features-and-benefits, little-rockers, pricing, contact, blog,
privacy, terms. That is the whole scope.

**Read [`README.md`](../README.md) first** — folder structure, per-route
rendering table, and the static-export constraints live there and are not
repeated here. Architecture study: `docs/nextjs-architecture-plan.html`.

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

## Conventions

- **No hex, `rgb()`, named CSS colours or inline colour styles in components.**
  Use the tokens: `bg-background`, `text-foreground`, `bg-card`, `bg-primary`,
  `text-muted-foreground`, `border-border`, `text-destructive`, `bg-brand`.
  A colour change belongs in `globals.css` and nowhere else. The palette is
  currently the shadcn placeholder — `--primary` / `--brand-*` / `--font-heading`
  are awaiting the real brand values.
- **A page file only composes** — imports sections, exports `metadata`, returns
  them in order (20–40 lines). Page metadata is always `buildMetadata()` from
  `@/lib/seo`; never a hand-rolled `Metadata` object, and never react-helmet
  (it does not work in the App Router).
- **Copy lives in `src/content/*.ts`**, typed. No hard-coded sentences in JSX —
  a section maps over data from `content/` or `lib/api/`.
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
