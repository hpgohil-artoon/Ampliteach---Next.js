# Parity with ampliteach.com

The rebuild must match the live site pixel-for-pixel, animations included, at
every viewport — with full responsiveness as the one deliberate addition.

This file is the record of **what the live site actually does**, **how we know**,
and **every place we knowingly differ**. If you are wondering why a heading is
40px or why the container behaves differently from the original, the answer is
here.

The live site is WordPress + Elementor on the `ewebot` theme.

---

## How these values were measured

Two traps cost real time, so they are worth stating:

**1. Fetching the page as text does not work.** Any tool that converts HTML to
markdown strips `<style>` blocks, `<link rel=stylesheet>` and Google Fonts
URLs — it will report "no colours found". Fetch the raw HTML instead
(`Invoke-WebRequest -UseBasicParsing`), pull out the stylesheet hrefs, then
fetch those. There are ~19 LiteSpeed-combined stylesheets (~600 KB) plus ~17
inline `<style>` blocks; **the theme's real customizer CSS is in the inline
blocks.**

**2. The declared theme globals are not the brand.** Elementor exposes

```
--e-global-color-primary:   #6EC1E4
--e-global-color-accent:    #61CE70
--e-global-typography-*:    "Roboto"
```

All of these are Elementor's **factory defaults**. The site overrides them with
hardcoded `!important` rules, so the real values have to be derived from
**usage frequency**, not from the variables. Reading the variables would have
given us a light blue site set in Roboto.

---

## Measured values

### Colour

| Value | Where it appears | Token |
| --- | --- | --- |
| `#FF1616` | **191 rules** — buttons, footer, hovers, price badges, `::selection` | `--brand`, `--primary` |
| `#0B0B0B` | `body { color }` and every heading | `--foreground` |
| `#818A91` | muted text | `--muted-foreground` |
| `#FFFFFF` | `body { background }` | `--background` |

`::selection` is brand red on white, and is reproduced.

### Typography

**Poppins** throughout — `body`, the nav, and every heading. Loaded from Google
Fonts on the live site; self-hosted via `next/font` here.

Every heading on the live pages renders at `elementor-size-default`, so the base
`h1`–`h6` rules **are** the site's type scale. Its `elementor-size-*` classes
(15/19/29/39/59px) exist in the CSS but are unused. There are **no media queries
changing a heading size** and **no per-element overrides** — the scale is flat.

| | size / line-height | weight |
| --- | --- | --- |
| `h1` | 40 / 43 px | 800 |
| `h2` | 30 / 40 px | 800 |
| `h3` | 24 / 30 px | 800 |
| `h4` | 20 / 33 px | 800 |
| `h5` | 18 / 30 px | 700 |
| `h6` | 16 / 24 px | 600 |
| body | 16 px / 1.6875 (27px) | 400 |

No letter-spacing on headings.

### Breakpoints

Every boundary below is real, taken by frequency across all the live
stylesheets. `md` and `lg` happen to equal Tailwind's stock values because they
are Elementor's defaults.

| Token | px | Live meaning |
| --- | --- | --- |
| `xs` | 480 | where the live container finally goes fluid (`width: 90%`) |
| `sm` | 600 | live's 599/600 step |
| `md` | 768 | Elementor's mobile/tablet boundary — 40 rules |
| `lg` | 1024 | Elementor's tablet/desktop boundary — 24 rules |
| `xl` | 1200 | live's desktop step |
| `2xl` | 1536 | ours, for ultrawide — the live site has no opinion above 1200 |

Minor extras in plugin CSS (992, 1300, 1501) are not modelled.

### Container width

**Page content aligns to 1170px, not the 1220px Elementor declares.** That
1220px boxed container renders *inside* the theme's `.container{width:1170px}`,
which clips it. The full chain:

```
.container { width: 1170px }                      the theme wrapper
  └─ .row                                         negative margin cancelled by
                                                  .container-sidebar_none
      └─ .content-container.span12 { padding: 0 }
          └─ #main_content > .elementor           margin: 0 -10px, cancelling
                                                  Elementor's column gap
              └─ .elementor-container             max-width: 1220px → clipped
```

The **header** escapes this: its Elementor template renders outside the theme
container, so it does get the full 1220px. Hence two tokens —
`--container-site` (1170px) and `--container-wide` (1220px).

The live container is a **stepped fixed width**:

| Viewport | Content width |
| --- | --- |
| ≥1200 | 1170px |
| ≤1199 | 998px |
| ≤1023 | 740px |
| ≤767 | 560px |
| ≤599 | 420px |
| ≤479 | 90% |

---

## Deviation log

Everything not listed here should match the live site. **Add to this list rather
than deviating quietly.**

### 1. The container is fluid, not stepped

The stepped widths above leave dead space between steps:

| Viewport | Live content | Empty each side |
| --- | --- | --- |
| 1024 — iPad landscape | 740px | **142px** |
| 768 — iPad portrait | 560px | **104px** |
| 600 | 420px | 90px |

Those are exactly the tablet widths the parity requirement cares about.
Desktop renders identically either way, so `Container` keeps the live
max-width and drops the empty margins. **Revert is confined to
`src/components/common/container.tsx`.**

### 2. Full responsiveness

The live site's type scale is flat and its container is stepped; neither is
responsive in the modern sense. Full responsiveness is an explicit project
requirement, so this is expected to diverge. Everything is token-driven in
`globals.css`, so adding a responsive step is a one-line edit per token.

### 3. All five real Poppins weights are loaded

The live site requests only `Poppins:400,500` while its CSS asks for
600/700/800 — so **every heading there is a browser-synthesised faux bold.**
We load the real weights, so headings render slightly crisper.

### 4. Rubik is not loaded

The live site loads it but uses it in exactly two rules (a blog button and a
map info marker). Not worth a second webfont. Add it if literal parity is
wanted.

### 5. Type sizes in rem, line-heights unitless

Identical rendering at a 16px root, but they respect a reader who has changed
their browser font size — which the live site's hard px does not.

### 6. `--destructive` is a deep crimson (`#BF0037`)

Not a live value at all: the live site has no form-validation styling. Because
the brand is red, shadcn's stock error red sat **0.1° of hue** from
`--primary`, making the required-field asterisk and error text read as brand
colour. See the commit for the contrast measurements.

### 7. `text-balance` on headings

No live equivalent. Costs nothing and prevents orphans.

---

## Open questions — awaiting a visual decision

Do not resolve these unilaterally.

- **The flat 40px `h1`.** Faithful to the live site, but small on a wide
  monitor. A responsive step is one line per token
  (`--text-h1: clamp(2.5rem, 4vw, 3.75rem)`).
- **The section eyebrow fails WCAG AA.** `#FF1616` on white is **3.90:1** at
  12px, where AA for small text requires 4.5:1. It appears on most sections.
  Fixing it means a darker `--brand-strong` for brand-coloured text on light
  grounds, which changes the appearance of a brand element.
