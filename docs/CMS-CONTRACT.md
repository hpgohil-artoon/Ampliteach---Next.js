# CMS contract

What the CMS must serve for this site to render from it. The authoritative
version is the code — `src/types/content/` for the shapes and
`src/lib/cms/page-content.ts` for the validation — and this file is the
human-readable mirror. Change one, change the other.

## Decisions this is built on

| Decision                | Choice                                                              |
| ----------------------- | ------------------------------------------------------------------- |
| Copy format             | **Plain strings.** No HTML, no markdown, in any field.               |
| Structure               | **Editors reorder and hide sections.** Order is data, not code.      |
| Images                  | **CMS-managed**, served from the CMS host as absolute URLs.          |
| SEO                     | CMS-owned, per page.                                                 |
| Publishing              | Rebuild on publish — the CMS calls a build webhook.                  |

## Endpoint

```
GET {CMS_API_URL}/pages/{slug}
```

`slug` is `home`, `why-choose`, `features-and-benefits`, `little-rockers`,
`pricing`, `contact`, `privacy-policy`, `terms-of-service`. Only `home` is wired
up so far; the rest follow the same shape.

- Response is JSON, `200`, no auth (the site reads published content only).
- The site never sends a request when `CMS_API_URL` is unset — that is today's
  state, and the committed content in `src/content/` renders instead.
- A failed request or a payload that fails validation is **not** a build
  failure: the page falls back to the committed content and logs why. A CMS
  outage during a deploy must never ship a blank page.

## Page shape

```jsonc
{
  "path": "/", // leading slash; the canonical URL is built from it
  "seo": {
    "title": "All-in-One Music School Management Software",
    "absoluteTitle": "AmpliTeach — All-in-One …", // optional; bypasses the "%s | AmpliTeach" template
    "description": "…",
    "ogImage": null, // or an image object
    "noIndex": false, // optional
  },
  "blocks": [
    /* ordered; see below */
  ],
}
```

### Every block

```jsonc
{
  "id": "home-hero", // stable, unique within the page — it is the React key
  "type": "hero",
  "hidden": false, // optional; true means "switched off", content preserved
}
```

`id` must survive edits and reorders. Reordering is keyed on it, so a CMS that
regenerates ids on save will make the whole page remount on every publish.

### Image object

```jsonc
{
  "src": "https://cms.example.com/uploads/student.webp",
  "alt": "A student practising guitar at home",
  "width": 800,
  "height": 900,
}
```

`width` and `height` are **required** and must be the real pixel dimensions —
the site reserves the space before the image loads, and wrong numbers mean the
layout jumps. Any field typed as an image may also be `null`, which renders a
neutral placeholder rather than a broken image.

The CMS's media hostname must be set as `NEXT_PUBLIC_CMS_MEDIA_HOST` at build
time (hostname only, no scheme), or `next/image` rejects the URL.

## Block types

| `type`           | Fields                                                                                                    |
| ---------------- | --------------------------------------------------------------------------------------------------------- |
| `hero`           | `eyebrow`, `body[] (runs)`, `cta {label, href}`, `video {youtubeId, title, poster}`                          |
| `overview`       | `body[] (runs)`, `image`, `mediaSide? ("left"\|"right")`                                                     |
| `feature-grid`   | `anchorId?`, `eyebrow?`, `heading`, `description?`, `headingLevel? ("h1"\|"h2")`, `features[]`               |
| `benefit-media`  | `heading`, `items[]`, `image`, `mediaSide? ("left"\|"right")`                                               |
| `trial-cta`      | `anchorId`, `eyebrow?`, `heading`, `body[][] (groups of paragraphs)`, `privacyNote`                          |
| `testimonials`   | `anchorId?`, `heading`, `items[] {quote (runs), author, location?, role?}`, `cta?`                           |
| `faqs`           | `anchorId?`, `eyebrow?`, `heading`, `items[] {question, answer}`, `image?`, `mediaSide?`, `closingHeading?`, `cta?` |
| `cta-banner`     | `heading`, `body`, `cta {label, href}`                                                                      |
| `closing-statement` | `intro`, `statement[][] (paragraphs of runs)`                                                            |

`features[]` is `{ title, description, icon? }`, where `icon` is one of the
names in `src/types/common.ts` → `IconName`: `award`, `book-open`,
`calendar-range`, `credit-card`, `graduation-cap`, `mail`, `message-square`,
`rocket`, `settings`, `sparkles`, `trending-up`, `wallet`. An unknown name drops
the icon rather than breaking the page. The CMS should offer these as a picker,
not a free-text field.

## Rules the CMS UI should enforce

1. **Exactly one `h1` per page.** Precisely one block on a page may set
   `headingLevel: "h1"`. Nothing in the site enforces this — it is an SEO
   requirement the editor has to be steered into.
2. **A paragraph that bolds phrases is a list of runs**, never markup in a
   string. A run is `{ "text": "...", "bold": true }`, and `bold` is omitted or
   `false` for ordinary text:

   ```json
   "body": [
     { "text": "AmpliTeach is a powerful music school and " },
     { "text": "studio management software", "bold": true },
     { "text": " built to simplify and scale …" }
   ]
   ```

   A paragraph with no emphasis is a single run. This is why no field ever needs
   to carry HTML — the hero bolds one phrase, the overview bolds three, and both
   use the same shape.

   A run may also set `"breakAfter": true` to force a line break after it. The
   testimonial quote is the case that needs it: it is three deliberate lines,
   not wrapped text, so the breaks have to survive as data.
3. **`trial-cta.body` is grouped, one level deeper than the other bodies.** It
   is a list of **groups**, each group a list of **paragraphs**, each paragraph
   a list of runs:

   ```json
   "body": [
     [[{ "text": "Fill out the form to start your FREE 30-day trial today." }]],
     [
       [{ "text": "Want to learn more?" }],
       [{ "text": "Schedule a free consultation at " }, { "text": "203-934-2501", "bold": true }]
     ]
   ]
   ```

   The nesting is not decorative — it carries spacing the live page cannot
   express otherwise. Paragraphs **inside** one group sit 18px apart; **groups**
   sit 12px apart. The live section is three separate Elementor text widgets,
   and Elementor zeroes the last paragraph's margin in each, so a flat list of
   five paragraphs cannot reproduce the two different gaps. A group holding a
   single paragraph — the common case — is `[[{...}]]`.
4. **`trial-cta.anchorId` is a real URL.** It is `power_of_ampliteach` on the
   home page, external links point at it, and changing it breaks them.
5. **No HTML in any string.** It renders as visible tags — the site escapes it
   deliberately.
6. **`cta.href`** is a site path (`/pricing/`, with the trailing slash), an
   in-page anchor (`#power_of_ampliteach`), or an absolute URL. Absolute URLs
   automatically open in a new tab.

## Publishing

The site is a static export. Content is fetched at **build** time and baked into
the HTML, so a publish is only live once the site rebuilds — the CMS should call
a build webhook on publish. Nothing in the code needs to change for this.

If instant publishing is ever required, `NEXT_BUILD_MODE=server` turns on ISR:
`getPageContent` already tags each request `page:<slug>`, so a webhook hitting
`revalidateTag` would be the only addition. That trades S3 for a Node host.
