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

**Extract the base widget rules, not just the id-keyed overrides.** Elementor
splits a widget's styling in two: the per-instance rules keyed to the element id
(`.elementor-element-f9df6a7 …`) and the widget's base rules
(`.elementor-widget-gt3-core-button …`). The id-keyed rules are the ones that
look like "the design", so they are the ones you extract — and then the button
comes out 38px tall reading "Log In", because `text-transform: uppercase` and
`line-height: 1.5` were only ever in the base rule. Pull both.

**Measure the production build, never `next dev`.** The dev server was caught
serving a **stale CSS chunk**: `md:` variants from the files edited minutes
earlier were simply absent from it, so `localhost:3000` rendered an older
stylesheet than the source on disk. The trial band's two-column split looked
broken for that reason alone and nothing was wrong with the code. Build, then
serve `out/` and screenshot that:

```powershell
npm run build
node scratchpad/serve-out.js D:\Ampliteach-Nextjs\out 4310
```

Any screenshot taken against port 3000 is evidence about the dev server's cache,
not about the site.

**Verify by measuring a render, not by re-reading the CSS.** Chrome is enough —
but it must be `--headless=old`. The new headless mode accepts `--screenshot`
and writes **no file**, silently, so a capture step that "worked" and produced
nothing is this flag and not a bad URL:

```powershell
chrome.exe --headless=old --disable-gpu --hide-scrollbars `
  --force-device-scale-factor=1 --virtual-time-budget=8000 `
  --window-size=1901,300 --screenshot=out.png http://localhost:4310/
```

then bounding-box the same element in both PNGs by colour (brand red isolates a
button, `#0B0B0B` the social chips) and compare width/height. **Solve for the
capture offset first**: a screenshot taken from a real browser window usually
carries a couple of pixels of chrome, so every live coordinate is shifted by a
constant. The header comparison had a uniform 3px vertical / 2px horizontal
offset, which reads as "everything is 3px out" until you subtract it — after
which every box agreed to within 1px of antialiasing.

Add `--force-prefers-reduced-motion` when measuring anything animated, so the
element sits in a known state instead of wherever the capture happened to land.

**Locate a full-bleed band by its left edge, and take the FIRST contiguous run.**
Two mistakes, both made while measuring the trial band. Probing the page centre
for brand red also hits red *ink* in unrelated sections, so the band came back
1796px tall. And recording the last red row anywhere finds the transform-CTA
banner further down the page, swallowing everything between — read `x=5`, and
stop at the first row that is no longer red.

**A box's own colour disqualifies it as the ink test.** The trial submit button
is brand red text on white, the same red as the band behind it, so scanning it
for "not white" returns the rounded corners and therefore the full box width.
Inset the scan past the border radius before believing an ink measurement.

**The live screenshots carry a ~7–8px horizontal offset, from the scrollbar.**
A browser capture at 1920 has a ~17px scrollbar, so its layout viewport is
~1903 and every centred container sits ~8px left of where our headless capture
(`--hide-scrollbars`, a true 1920) puts it. It shows up as "every x is 7px out"
while every y agrees — which is the signature of this, not of a real
difference. Compare **y** freely; for **x**, compare widths and the distance
between two features in the same image, never absolute x across the two.

**Font-size is solvable from a box, and weight from the family's real faces.**
Where a live declaration is missing or a no-op, render a candidate and measure:
the trial submit's box is 245px with a measured 31px of padding either side, so
the label must be 183px, and that pins the size to 11.5px. Watch the weight
while doing it — Arial ships only 400 and 700, so a `font-semibold` on an
Arial-fallback label is *synthesised* and renders much wider (that alone put
this button 27px over).

**A headless capture is NOT a witness for `font-family`.** No webfont loads
there, so any element whose declared family is unavailable falls back — and the
fallback is not what a real visitor sees. This has now produced one wrong
conclusion: the feature bullets declare no family at all, rendered serif in
every headless capture, and were duly built as serif — but a browser screenshot
showed them in the same sans as the copy around them. Geometry, spacing and
box sizes from a headless capture are trustworthy; typeface is not. Confirm
every font decision against a screenshot from a real browser.

**Lazy images do not render in a headless capture.** WordPress serves them with
a real `src` but a `srcset` holding a base64 placeholder, which wins until the
lazy script swaps `data-lazy-srcset` in — so the box is laid out at the right
size and stays transparent. To get the real thing, save the live HTML, insert
`<base href="https://www.ampliteach.com/">` into `<head>`, strip every
`srcset="data:image/png;base64,…"`, and screenshot that file. Same trick works
for anything else the live JS defers.

**For animations, extract frames from a screen recording.** There is no ffmpeg
here, but Chrome decodes WebM, and `scratchpad/extract-frames.js` uses it as a
decoder: it serves the page and the video from one local HTTP origin (a `file://`
video taints the canvas, so `toDataURL` would throw), then the page pulls each
frame's pixels and POSTs them back. Two traps, both hit:

- **Do not use `--virtual-time-budget`.** It completes a seek instantly without
  advancing the decoder, so every frame comes back as `t=0`.
- **A screen recording usually has no seek index** — `video.seekable` was
  `[0-0]`, so `currentTime` cannot be set at all. Play it through once in real
  time and grab a frame each time playback crosses the next target.

Then profile the frames numerically (pixel counts and ink bounding boxes per
frame) rather than eyeballing them; that is how the typing speed, hold, fade and
loop period below were pinned, and how the absence of a cursor was proved.

Two further traps cost real time, so they are worth stating:

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

The live `body` rule is `background:#FFF; font-size:16px; line-height:27px;
font-weight:400; color:#0b0b0b` — with **no `font-family`**. The theme's
`.secondary{font-family:Poppins}` never matches anything (the class is not in
the DOM), and `.elementor-kit-9` only declares custom properties. So the live
base font is the browser default; Poppins is applied by explicit per-widget
rules, including `nav>ul>li>a`. We set Poppins globally, which matches
everywhere the live site names it and is what its own CSS clearly intends.

Nothing sets `-webkit-font-smoothing` on the live site, so we do not either —
see deviation 13.

### Buttons

One live spec, held in `src/components/ui/button.tsx` and nowhere else:

| | value |
| --- | --- |
| family | **`Roboto, Sans-serif`** → Arial, since Roboto is unloaded (deviation 17) |
| label | 12px · weight 500 · letter-spacing 0.2px · **uppercase** |
| line-height | 1.5 → an 18px line box |
| box | padding 13px 20px · 1px border · 5px radius → **46px** tall |
| colour | fill + border `#FF1616`, both → `#0B0B0B` on hover, label stays white |
| `lg` | the live 16px/31px padding (`gt3_portfolio_view_more`) |
| `cta` | the live `size_custom`: 14px label, 5px/20px padding → 35px tall |

Sizes are padding-based rather than fixed heights because the live buttons are:
the theme sets padding per widget and lets the line box decide the height.

**The family is in the BASE widget rule**
(`.elementor-widget-gt3-core-button .elementor_gt3_btn_text`), so it applies to
every button on the site — and it was missing for a long time, leaving all eight
CTA sites in the Poppins they inherit from `body`. Poppins is narrower here, so
every label was short: the FAQ button measured 254px against the live 263, and
the testimonials button 318 against 341. Both land within 3px with `font-body`.
This is the third time the base-vs-id-keyed split has produced a wrong value —
see the top of this file.

**Only one button on the home page has a mobile label step.** `1b95fcf`, the
testimonials button, drops to 12px ≤767; the other five stay at 14px. It is
therefore a per-instance `max-md:text-xs`, not a change to the `cta` size.

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

**Which width applies depends on how WordPress renders the page, not on where
it sits in the nav.** An earlier version of this file claimed all page content
was clipped to 1170px by the theme wrapper. That is wrong, and it was wrong in
the direction that makes every section 25px narrow per side.

**Elementor pages — the whole marketing site, plus `/blog` — get 1220px.** The
theme's 10-level wrapper chain is transparent on them:

```css
body.elementor-page .site_wrapper .container.container-sidebar_none { width: 100% }
.main_wrapper > .container.container-sidebar_none > .row > .content-container { padding: 0 }
```

That first selector is specificity (0,4,1), so it beats bare
`.container{width:1170px}` *and* all five of its stepped media-query overrides —
media queries add no specificity. Nothing clips the 1220px `.elementor-container`
box, and the box is **flush**: the columns' own percentage padding provides the
inset, so a container gutter here is a 25–32px error.

Verified by measurement, at a 1901px viewport:

| | left edge |
| --- | --- |
| live hero's first ink | **x = 341** |
| centred 1220px box | 340.5 ✓ |
| centred 1170px box | 365.5 ✗ |

**Single post pages get 1170px, stepped.** Those are theme-rendered: the body
carries no `elementor-page` class and the wrapper no `container-sidebar_none`,
so the override misses and `.container` genuinely applies:

| Viewport | Content width |
| --- | --- |
| ≥1200 | 1170px |
| ≤1199 | 998px |
| ≤1023 | 740px |
| ≤767 | 560px |
| ≤599 | 420px |
| ≤479 | 90% |

Hence `Container`'s sizes: `default`/`wide` 1220px, `post` 1170px, plus a
`gutter` prop that Elementor sections turn off.

### Header

Taken from the live header template (Elementor `wpda-header` id `4031`) — its
own markup plus the element rules keyed to each widget id.

**The nav collapses at 1200px, not at 1024px.** `.wpda-mobile-navigation-toggle`
is `display:none` above `min-width:1200px` and `inline-block` below it, so `xl:`
is the hamburger boundary. This is easy to get wrong, because the *top strip*
does leave at 1024px (`elementor-hidden-tablet` + `elementor-hidden-phone`) and
the *Log In button* leaves at 767px. Three different boundaries, all real.

| | value | element |
| --- | --- | --- |
| top strip | min-height 46px, border-bottom 1px `#F0EFF3` | `435d824` |
| — phone/email | icon 14px `#FF1616` +3.5px · text 14px `#0B0B0B` +5px · 20px apart | `d89058a` |
| — socials | 12px glyph, `0.8em` padding → 31.2px round chip, 10px gap, `#0B0B0B` → `#FF1616` | `2c7e253` |
| main bar | min-height 110px, 80px ≤767 · padding `0 2%` · sticky at every width | `bbf218a` |
| — inner box | 1220px, padding-left 10px · `0 15px` ≤1024 · `0 5px` ≤767 | `66cf8ed` |
| — logo | 222×70 desktop, 165×52 ≤1024 · margin-right 68px · padding-top 10px | `e79fd48` / `416a9a1` |
| — nav item | Poppins 16px `#0B0B0B` → `#FF1616` · margin `0 10px 0 15px` · line-height 5 | `27ed643` |
| — Log In | padding 13px/20px · 1px border + 5px radius `#FF1616` · 12px/500, 0.2px · → `#0B0B0B` | `f9df6a7` |
| drawer | inset 12px, radius 5px, padding `55px 25px 25px`, scale .95→1 + fade 0.2s | `.wpda-navbar-collapse` |
| — toggle | 22×22, three 2px bars at −9/0/+7px, → X on open, `#3B3663` | `.wpda-toggle-*` |
| — Log In | `#FFF` on `#FF1616`, 16px/500, max-width **100px**, radius 10px, margin-top 20px | `.login_menu` |

Two live details that look like bugs and are reproduced anyway:

- **The strip is asymmetric.** Its left column keeps Elementor's 10px gap
  padding while the right column is explicitly zeroed, so the phone number sits
  10px inside the 1220px box and the social chips sit flush against its right
  edge.
- **The strip's links have no hover.** The section sets
  `a:hover{color:#5747E4}`, but both the glyph and the label carry their own
  colour on a child element, so none of it ever renders.
- **The hamburger is not `#0B0B0B`.** Its bars are `border-top: 2px solid`
  with no colour, so they inherit the main bar's `color:#3B3663` — an `ewebot`
  leftover rather than a brand value. Held in `--header-ink`; see the open
  questions.

The DOM order is load-bearing: the live menu widget sits **before** the button,
so between 768px and 1199px the hamburger is to the *left* of Log In.

### Home — hero (section `9a677a2`)

| | value |
| --- | --- |
| outer section | full width, `padding: 50px 0` — unchanged at every breakpoint |
| inner section | boxed 1220px, flush, items centred, `z-index: 5` |
| left column | padding 0 · `padding-left: 8%` ≤1024 · full width, 0 ≤767 |
| right column | `padding-left: 20%` · `0 20% 0 8%` ≤1024 · full width, 0 ≤767 |
| eyebrow | 44/56px, weight 800, `letter-spacing −0.2px`, `#FF1616`, `margin-bottom 10px`, `padding-right 10%` · 32px/1.5 ≤1024 · 26px/1.6 ≤767 |
| paragraph | 18px `#0B0B0B` · 14px ≤767 · line-height from `p{line-height:1.6875}` |
| spacers | 43px above the CTA; 60px below the section · 100px ≤1024 · 10px ≤767 |
| CTA | 14px/500 uppercase, `ls .2px`, white, `padding 5px 20px`, radius 5px, no border, centred, `margin: 0 22px 20px 0` · `0 0 22px 0` ≤767 |
| video | 16:9, YouTube `IPRyrJA5obM`, lazy, poster 489×275 |

**The hero has no heading.** The typed widget is a plain span, and the page's
only `h1` is the Features section's "FEATURES THAT DRIVE SUCCESS" — so that is
where `as="h1"` lives.

**The CTA is an in-page anchor**, `#power_of_ampliteach`, not the signup URL.
`TRIAL_CTA_ID` in `content/home.ts` keeps the live id, since it is a real URL
that may be linked from outside.

Measured against the live render at 1901px:

| | live | ours |
| --- | --- | --- |
| video poster | x1073–1560, w488, h275 | x1073–1560, w488, **h274** |
| CTA box | w273, **h35**, centre x634 | w**251**, h35, centre x634 |
| paragraph left edge | x341 | x341 |

The two width gaps are the Roboto deviation below, not layout: live renders
Arial at an effective weight 400, we render real Roboto 500, which is narrower.

#### The typed eyebrow's animation cycle

Measured frame by frame from a screen recording, because none of it is in the
page: the widget carries no `data-settings`, so Typed.js takes its settings from
the plugin's PHP defaults. A headless capture is no help either — it has *zero*
ink in the eyebrow band, since Typed.js empties the span and the typing is
waypoint-triggered, so it never fires without a real viewport.

| phase | measured |
| --- | --- |
| type | ~128ms/char average — 5 chars at t=0.216s, 15 at t=1.499s |
| — jitter | per-char gaps scatter 84–283ms: Typed.js's `humanizer` adds a random 0–50% on top of `typeSpeed`, so **`typeSpeed: 100`** averages 125ms |
| hold | ~1.2s — red pixel count is 9800 ±8 from t=1.4 to t=2.5 |
| fade out | ~300ms — count falls to 7483 at t=2.71, 0 by t=2.90 |
| blank | ~0.9s, then it retypes |
| loop | forever; measured period **4.1s** |
| cursor | **none** — a blinking `\|` would swing the pixel count by ~130px² twice a second; it never moves more than 8 |

Verified against that recording, left column, 1905px viewport:

| | live | ours |
| --- | --- | --- |
| eyebrow | x343–814, w472, h34 | x343–815, **w473**, h34 |
| paragraph | x343–945, w603, y282–388 | x343–946, w604, y281–**388** |
| CTA | x500–771, w272, h34, centre 635.5 | x502–770, w269, h35, centre 636 |

All residuals are 1–3px, i.e. antialiasing. The glyph outlines were also
compared side by side at 2× and match.

**The cycle must not collapse the line box.** An element with no content
generates no line box, so an empty *and visible* eyebrow drops the row by 56px,
and because the hero grid is `items-center` that reflows the paragraph, the CTA
and the video — a visible flicker once per loop, and again on first paint. Two
things prevent it, both matching the live site:

- a zero-width space is always rendered beside the typed characters, so the line
  box exists from SSR onwards regardless of phase, at no horizontal cost;
- the loop restarts on the **first character**, never on an empty string, which
  is what Typed.js does.

The live paragraph measures y282..388 in every phase of the cycle, so this is
parity rather than an improvement. Ours holds y281..388 and the CTA y438 across
typing, hold, fade, blank and restart — checked by capturing the page at eleven
points spanning a full period.

Handy for this: `--virtual-time-budget=<ms>` *does* fast-forward timers and CSS
transitions (it only fails to advance media playback), so one screenshot per
budget lands the page at that moment of its own animation timeline.

### Home — overview (section `11fd155`)

| | value |
| --- | --- |
| outer section | full width, `padding: 50px 0` at every breakpoint |
| inner section | boxed 1220px, flush, items centred, `z-index: 5` |
| image column | padding **0** · `0 20% 0 8%` ≤1024 · `0 20px 20px` ≤767 |
| — the image | `width: 80%`, wrapper `padding-right: 15px` → a 476px box from a 595×397 source |
| text column | **`padding: 10px`** · `0 0 0 8%` ≤1024 · 0 ≤767 |
| paragraph | 18px `#0B0B0B` · 14px ≤767 · three bold phrases |
| spacer | 60px · 100px ≤1024 · 10px ≤767 |

**The two columns are not padded alike, and it is not a mistake.** Elementor's
`.elementor-column-gap-default > .elementor-column > .elementor-element-populated`
applies `padding: 10px`. The live CSS zeroes it on the image column
(`padding: 0% 0% 0% 0%`) but only resets `margin` on the text column, so the
text column keeps all four 10px. Miss it and the paragraph starts 10px left of
live and wraps 20px wider — which is exactly what happened on the first pass.

No heading: the live section is a screenshot beside a paragraph.

Verified against the live render at a 1905px viewport:

| | live | ours |
| --- | --- | --- |
| paragraph | x962–1550, w589, h290 | x962–1550, w589, h290 |
| image box | (lazy — see below) | x344–817, w474 |

**The live image never renders in a headless capture.** It ships with a real
`src` but a `srcset` holding a 60×40 base64 placeholder, which wins until the
`gt3-core-lazy-image` script swaps `data-lazy-srcset` in. The box is therefore
laid out at the right size but transparent. To measure it, re-serve the live
HTML with a `<base href>` and the placeholder `srcset` stripped — the recipe is
in "How these values were measured".

### Home — feature grid (section `59e9439`, `features_titel_mian`)

Twelve icon-boxes in two columns, with the trial CTA repeated after every
fourth.

| | value |
| --- | --- |
| section | `#FFFAFB` (`--blush`), boxed 1220px flush, `padding: 30px 0` · `30px 0 20px` ≤767 |
| heading | Roboto 40px/48px weight 900, brand red, centred · 28px ≤1024 · 24px capped at 260px ≤599 |
| rows | `md:grid-cols-2`, each cell 10px (Elementor's default column gap), rows 10px apart |
| icon | 50px glyph in an 85×85 box, **8px `double` border**, radius 15px, red |
| — gap | 30px from the content · 10px ≤767, where the wrapper stops being flex and the icon centres above |
| title | Roboto 26px/900 on a 30px line box, brand red, 5px below |
| body | Roboto 18px · 13.5px ≤767 |
| bullets | **18px** · 15px ≤1024 · 13.5px ≤767, fixed 27px line box |
| — indent | 80px · 40px ≤1024 · 30px ≤767 |
| CTA | the hero's button, `margin: 20px 22px 20px 0` · 0 ≤767 |

**The red bracket** is the column's `::before`: an absolutely positioned box
drawing only its left, top and bottom borders with the left corners rounded, so
it reads as a `[` around the grid. The heading sits on its top edge as an
`inline-block` with the section's own background behind it, knocking a notch out
of the rule — the `<fieldset>` legend trick. Its seven breakpoints are the live
site's own and do not match the project's tokens: **1280, 1200, 1024, 991, 767,
599, 430**, written as arbitrary `max-[…]` variants because rounding them to the
nearest token would move the bracket relative to the content it frames.

Three details that look wrong and are reproduced anyway:

- **Every bullet has two markers, and they are the SAME size.** A dark
  `list-style: disc`, then the theme's `.content-container ul > li:before` adds
  a brand-red circle with a 10px right margin. Both measure **5×5**: live
  black disc x1142–1146 / y2533–2537, red dot x1158–1162 / y2534–2538, text
  from x1173.

  The `:before` rule reads `font: normal normal normal 7px/1 FontAwesome`, and
  7px is easy to mistake for the dot's size — it is the **font-size**, and the
  circle glyph does not fill its em box. Drawing a literal 7px circle makes the
  red dot visibly larger than the black one and pushes the text 2px right. When
  a marker is a glyph, measure the ink, not the declaration.
- **The icon glyph is centred, though the CSS says otherwise.** The live rule is
  `display: flex; align-items: center` with no `justify-content`, which would
  sit the glyph at flex-start — and building to that declaration put every icon
  visibly left in its box. The live site draws them centred. Match what is
  rendered, not what is declared.
- **The bullets are 18px on desktop, not the 16px the CSS implies.** The live
  rules set 15px ≤1024 and 13.5px ≤767 and nothing for desktop, which reads as
  "inherit 16px from `body`". It is not: the same bullet string measures 368px
  on the live site and 288px at 16px. Measured off a browser screenshot, which
  is the only reliable source for this — see the font warning above.

**A trailing empty `<p></p>` is NOT extra space.** Every live icon-box ends with
one, and the theme's `p { margin: 0 0 18px }` looks like 18px per card. An
earlier pass added it and the numbers appeared to confirm it — but that was
measured against a headless capture whose serif bullets made every row too
short, so the padding was compensating for the wrong thing. With the bullets
correct, adding it makes each row 18px too tall. Do not reinstate it.

Measured against a browser screenshot at a 1642px viewport:

| | live | ours |
| --- | --- | --- |
| bullet line width | 368px | 371px |
| description wrapping | 4 lines | identical breaks |
| title line box | 30px | 30px |
| row 2 title → CTA | 263px | **264px** |
| row 1 height | 335px | 326px |

**Known residual: row 1 is 9px short**, and only row 1 — row 2 is exact. It is
the only card carrying the `<br>`, which is the obvious suspect, but the two
cards' lines are pixel-aligned all the way through their bullets, so the
difference is below them. Not yet explained.

### Home — student benefits (sections `7eebc1a` + `76c55aa`)

Two live sections sharing one `#FFF7F8` ground — a heading band and a content
band — so they read as one and are built as one block.

| | value |
| --- | --- |
| ground | `#FFF7F8` (`--blush-deep`), boxed 1220px |
| heading | Roboto 40px/48px weight 900, brand red, centred, in a 20px band · 18px/40px ≤767 |
| content | `padding: 20px` · `0 0 40px` ≤1024 · `0 0 60px` ≤767 |
| text column | 60% · full width ≤1024 with `padding: 0 15px` · 0 ≤767 |
| — inner | `padding-right: 20px` · `30px 0 40px` ≤1024 · `60px 0 0` ≤767 |
| — list | 18px/28px, `padding-left: 10px`, disc + the theme's red dot · 13.5px ≤767 |
| image column | 40% · full width ≤1024 |
| — image | `width: 60%`, centred · 90% ≤767, from a 293×293 source |

**The columns swap below 1025px.** The section carries
`elementor-reverse-tablet` and `elementor-reverse-mobile`, so once they stack
the guitar sits *above* the list — `order`, not source order.

**Three entrance animations**, and this is the first section to need them:
`slideInLeft` on the list, `slideInRight` on the image column, and `zoomIn` on
the image itself over 2s (`animated-slow`) with the live 5ms delay. All go
through `components/common/reveal.tsx`; the keyframes are `--animate-*` tokens
in `globals.css`, so timings change in one place.

**This section cannot be verified headlessly.** Every element in it is
animation-hidden, so a headless capture of the live page shows an empty pink
band and nothing else. Only the band height is comparable:

| | live | ours |
| --- | --- | --- |
| `#FFF7F8` band height | 421px | 411px |

Content geometry needs a browser screenshot.

### Home — free trial (section `e112963`, `#power_of_ampliteach`)

| | value |
| --- | --- |
| ground | `#FF1616` (`--primary`), boxed 1220px, `padding: 20px` |
| heading | Roboto 30px/40px weight 900, white, centred · 18px/1.4em, left ≤767 |
| copy column | 50%, vertically centred against the form · 18px/1.6875 · 13.5px, left ≤767 |
| — paragraphs | 18px apart inside a text widget, 12px between widgets |
| heading margin | 31px below |
| form column | 50% |
| — rows | flex, `gap: 40px` · 10px ≤1024 · stacked ≤599 |
| — label | **Roboto** 16px/400 white, 12px above its control, asterisk in text flow |
| — input | 41px tall, white, 4px radius, `padding: 0 10px`, Roboto 14px/500, 26px below |
| — field pitch | **103px** = 24 label + 12 + 41 input + 26 |
| — submit | white on brand red, centred, 46px × 245px, `padding: 0 31px`, 11px uppercase |
| | 35px above it, and **9px below** — see the note under this table |
| privacy note | Roboto 18px weight 600 **italic**, white, centred, full width, 9px below the row · 11px, left ≤767 |

**The 580px form column comes from two nested 10px paddings, not one.** Both are
Elementor's default column gap: the outer column takes the 1220px box to 1200,
its two halves are 600 each, and their own 10px leaves 580 of content — which is
what makes each field in a two-up row 270px. Miss either padding and every input
is 5–10px wide.

The submit label's letter-spacing is **0.6px, not the gt3 button's 0.2px** — this
widget does not share that rule, and 0.6px is what the ink measurement gives.
The live CSS names it `.submit_forminput`, which reads like a typo for
`.submit_form input`; it is reproduced as the button's own styling rather than
copied, since only this one place uses it.

**The form labels are set in the body stack, not the site font.** Measured: the
live "Last name" is 72px wide with a 12px cap height; Poppins renders it at 81px
at that same cap height. `FormField` therefore sets `font-body` explicitly —
`components/ui/label.tsx` is CLI-managed and inherits Poppins from `body`. The
required asterisk sits in normal text flow 2px after the last letter; left as a
direct child of shadcn's `Label` it becomes a flex item and picks up its
`gap-2`, opening an 11px hole.

**The form column runs 9px past the button, and three things depend on it.**
That 9px is invisible on its own, but the copy column is vertically centred
against this column, so it moves the copy down 4.5px; and it is the difference
between a 657px band and the measured 666px. Diagnosing the copy as "3px high"
and nudging the copy would have been the wrong fix — the height was missing from
the *other* column.

**The 35px above the button is the whole gap, not 26 + 9.** Adjacent sibling
margins collapse, so the email field group's 26px bottom margin and a 9px button
top margin resolve to `max(26, 9) = 26` and the button lands 9px high.

Measured against the live screenshot, on the production build. Positions are
band-relative, so the two can be read directly against each other:

| | live | ours |
| --- | --- | --- |
| band height | 666px | **666px** |
| heading ink | 40..61 | **40..61** |
| label 1 ink | 117..128 | 116..127 |
| input row 1 | 147..187 | **147..187** |
| input row 2 | 250..290 | **250..290** |
| input row 3 | 353..393 | **353..393** |
| email row | 456..496 | **456..496** |
| submit box | 532..577 | **532..577** |
| copy, 8 lines | 213..480 | 214..481 |
| privacy note ink | 613..629 | 614..630 |
| input (two-up) | 270px | **270px** |
| gap between them | 40px | **40px** |
| email row width | 580px | **580px** |
| submit box | 245 × 46 | **245 × 46** |
| submit label ink | 183px | 182px |
| label "Last name" ink | 72px | 71px |

Everything is exact or within 1px of antialiasing.

### Home — testimonials + FAQs (section `559da34`)

**One live section holding both blocks.** The top section carries the `#FFF8F8`
ground and everything above its inner section is the testimonial; the inner
section `93f179c` is the FAQ. Split there, and both blocks declare the ground
themselves (deviation 20).

| | value |
| --- | --- |
| ground | `#FFF8F8` (`--blush-warm`), boxed 1220px |
| spacer | 64px above the heading · 50px ≤767 |
| heading | Roboto 40px/48px weight 900, brand red, centred · 18px ≤767 |
| quote | Roboto 18px weight 500 **italic**, brand red, centred · 14px ≤767 |
| author | the same 18px italic treatment |
| location | Roboto 15px, brand red, centred |
| — FAQ — | |
| text col | 50%, `margin: 0 30px 0 0` on the inner wrapper · 0 ≤1024 · full width `padding: 45px 5px 0` ≤767 |
| heading | Roboto 40px/48px weight 900, brand red, centred, 20px below |
| spacer | 20px under the heading |
| question | Roboto 18px/40px **weight 800**, brand red · 14px/1.5em ≤767 with a 15px top margin |
| answer | Roboto 18px, `--foreground` · 14px ≤767 |
| spacer | 30px above the closing heading |
| closing | Roboto 23px/48px weight 800, brand red, centred · 20px ≤767 |
| image col | 50%, 443×443, pulled up 20px and right 55px · 0 ≤1024 |

**The two columns keep Elementor's widget margin differently, and it matters.**
`2cdbad7` (the FAQ column) sets `margin-bottom: 0` on every non-last widget;
`72e008f` (the testimonials column) does not. So in the testimonial column each
widget carries the default 20px and in the FAQ column none do. Reading only the
id-keyed rules — where the heading's own padding is `0 0 20px 0` — left three
gaps in the testimonial exactly 20px short.

**The location's live `margin-top: -20px` must NOT be copied.** It exists only
to cancel the author widget's +20px, which our reset never adds; applied on top
of a zero margin it printed "Connecticut" straight through "Dylan R.". With
both omitted the 13px the live pair measures falls out of the two line boxes.

**The questions are 800 weight from the base rule.** Their id-keyed rules set
only colour, family and size; the weight comes from
`.elementor-widget-heading h2 { font-family: Poppins; font-weight: 800 }`, which
they never override. Same for the closing heading. The id rules alone would have
made both regular.

Measured against the live screenshots, on the production build. Positions are
relative to each block's first ink, so the two can be read directly:

| | live | ours |
| --- | --- | --- |
| heading ink | 178..206 | **178..206** |
| quote, 3 lines | 263..340 | **263..340** |
| author | 374..390 | **374..390** |
| location | 403..413 | 404..414 |
| testimonials button | 440..474 | 439..473 |
| FAQ heading ink | 534..565 | **534..565** |
| Q1 / A1 | 625..705 | **625..705** |
| Q2 / A2 | 725..832 | 726..833 |
| Q3 / A3 | 856..934 | 857..935 |
| closing heading | 386..407 | 387..408 |
| FAQ button | 416..450 | 419..453 |
| image | 443×443, 31px above the FAQ heading ink | **443×443, 31px** |

Everything within 3px, most exact.

### Home — closing statement (sections `92421d6` + `b7134d7`)

The page's sign-off, immediately above the footer. Two live sections, built as
one block because they always appear together and are only ever text.

| | value |
| --- | --- |
| strip | `#FF1616`, boxed 1220px, `padding: 10px 0` |
| — text | Roboto 18px, white, centred, **line-height 1.6875** |
| statement | `margin-top: 20px`, boxed 1220px, no declared background |
| — text | Roboto 30px/**1.3em** weight 600, brand red, centred · 19px ≤767 |
| — spacing | 18px between the two paragraphs |

**Neither text widget declares a line-height, and they resolve differently.**
The strip inherits the theme's bare `p { line-height: 1.6875 }`, so its 18px
text runs a 30.375px line box — NOT the `body` rule's absolute `line-height:
27px`, which the `p` rule overrides. The statement's own id-keyed rule sets
`1.3em`. Assuming either value for both puts the strip 3px out per line and the
statement 11px.

**There is no button.** This replaced a placeholder `cta-banner` block that had
a heading, body and CTA; the live sections hold nothing but text widgets. The
`cta-banner` block and `CtaBanner` component remain, because they still close
why-choose, features-and-benefits, little-rockers and pricing with placeholder
copy — when those pages are rebuilt from live markup we will know whether they
share this design, and if so this section moves to `components/common/`.

The strip's height is arithmetic worth keeping: `10` (section padding) + `10`
(column gap) + `2 × 30.375` (two lines) + `10` + `10` = **100.75px**.

Measured against the live screenshot, on the production build. Positions are
relative to the strip's top:

| | live | ours |
| --- | --- | --- |
| strip height | 101px | 100px |
| intro line 1 ink | 28 | **28** |
| intro line 2 ink | 59 | 58 |
| statement line 1 | 139 | 138 |
| statement line 2 | 178 | 177 |
| statement line 3 | 217 | 216 |
| statement line 4 | 274 | 273 |
| intro line widths | 1158 / 542 | 1159 / 543 |
| statement line widths | 821 / 873 / 285 / 325 | **821 / 873 / 285 / 325** |

The statement's four line widths are exact, which is what confirms the family,
size, weight and letter-spacing together. The uniform 1px on the vertical is the
100 vs 101 strip rounding propagating down.

### Footer (section `a6cf32d`, `footer_widgets`)

Site-wide, not page content — the blog post template carries it too.

| | value |
| --- | --- |
| ground | `#222` (`--footer`), boxed 1220px |
| padding | `200px 0 100px` · `100px 0` ≤1024 · `60px 0` ≤767 |
| divider | a white "tilt" wedge, `M0,6V0h1000v100L0,6z`, **height = width / 10** |
| columns | three equal thirds, each with Elementor's 10px column gap |
| spacer | 25px above each heading |
| heading | 20px/26px weight 800, white, `letter-spacing: .5px` |
| — bar | 25 × 4px brand red, `border-radius: 20px`, at the heading box's bottom-left |
| body | 16px/27px white |
| menu | 16px/30px, white, brand red on hover **and for the current page** |
| contact | 16px/27px, 16px icon + 4px margin + 12px text padding, 42px item pitch |
| social | 17px glyph in a 44.2px `#0B0B0B` chip, brand red on hover, 10px gap |

**The 200px top padding is what clears the divider.** The shape SVG has no
height rule, so it keeps its viewBox's 10:1 ratio — 190px at a 1903px viewport.

**The heading's red bar needs `position: relative` and `padding-bottom: 20px`
on the `h4`.** The live rule is only `.footer_widgets h4::after { position:
absolute; bottom: 0; left: 0 }`; neither the positioning context nor the 20px
appears in any cached stylesheet, but the render demands both — the bar
measures 286..289 with the heading ink at 249, and a bare 26px line box would
put it at 265..269.

**The footer inherits Poppins, unlike every page section.** None of its widgets
declare a family, so `font-body` must NOT be applied here: with it the About
paragraph wrapped to five lines against the live six and every line width was
out. Without it all six widths match — 371/341/353/367/300/203 against
370/340/354/367/300/203.

**All six footer particles are inline SVG, including the three the live site
loads as `.svg` files.** Routed through `<Img>` they rendered as broken images
in `next dev` and were fine only in the export: `unoptimized` is forced on for
`output: 'export'` but not in dev, so dev sent them to `/_next/image`, which
**refuses SVG** unless `dangerouslyAllowSVG` is set. Inlining removes the
dependency on the image pipeline in both modes rather than opening that flag
for a decorative shape. They are 0.5–1.3 KB each.

**A widget's width is an anchor, not a size, for the inline SVG particles.**
Each particle widget is 13–21px wide, but the inline `<svg>` carries its own
`width`/`height` and overflows the box — that is what renders. Sizing them to
the widget shrank each note to about a third. The three `<img>` particles are
the opposite: their rule is `width: 100px; max-width: 100%`, and the 100%
resolves against the widget box, so those do take the box width.

**Three widget paddings do not reach the render.** The menu declares
`padding-top: 15px` and the icon list `padding-top: 20px`, but all three
columns' first line lands within 2px of the same y — exactly 20px below the
heading box. Reproduced as measured, not as declared.

Measured against the live screenshot, on the production build, relative to the
footer's own top:

| | live | ours |
| --- | --- | --- |
| tilt edge, x0 → x1900 | 20 → 198 | 20 → 199 |
| heading ink | 249 | **249** |
| red bar | 286..289 | **286..289** |
| About, 6 lines | 317 / 344 / 371 / 398 / 425 / 452 | **317 / 344 / 371 / 398 / 425 / 452** |
| About line widths | 370/340/354/367/300/203 | 371/341/353/367/300/203 |
| menu, 5 links | 319 / 347 / 377 / 407 / 438 | 319 / 348 / 378 / 408 / 439 |
| contact, 3 rows | 315 / 357 / 399 | 316 / 357 / 400 |
| contact row widths | 245 / 140 / 344 | **245 / 141 / 345** |
| "About" ink | 64 | 65 |
| "Get In Touch" ink | 129 | 130 |
| "Quick Links" ink | 117 | 123 |

Everything within 1px except the "Quick Links" heading, which is 6px wide. Its
glyphs match the live ones to within 1px each — the difference is spread across
the nine inter-letter gaps, i.e. sub-pixel accumulation. The other two headings
share the same style and match, so this is left alone rather than "fixed" in a
way that would break them.

### Copyright bar (section `ac7a524`) and back-to-top button (`#back_to_top`)

| copyright bar | value |
| --- | --- |
| ground | `#000`, **full width** (not the 1220px box), `padding: 20px 0 10px` |
| text | 16px/1.4em white, centred, `letter-spacing: .5px` · 13px ≤767 |
| widget | `margin: 8px 0 17px` |

Height is the sum of those: 20 + **10** (column gap) + 8 + 22.4 + 17 + **10**
+ 10 = **97.4px**, and the live bar measures 97. The two 10s are Elementor's
default column gap, which is 10px on *all four* sides — applying it
horizontally only left the bar exactly 20px short.

The live section also paints an `elementor-background-overlay` of `#000` at 50%
opacity over its `#000` background. Black over black is black, so the overlay
element is not reproduced.

| back-to-top | value |
| --- | --- |
| box | 40 × 40, `border-radius: 5px`, **no border** |
| colour | `#FF1616`, white glyph → `#222` on hover |
| glyph | Font Awesome `\f106` (`angle-up`) at 26px |
| position | `fixed`, 40px from right and bottom · **25px at ≤600px** |
| state | `opacity: 0; pointer-events: none` until shown, `.3s` transition |

**The button's own CSS is spread across three files and the last one wins.**
The customizer sets a white background with a 2px `#0B0B0B` border; the theme
overrides with `background:#ff1616!important; color:#fff!important;
border:none!important`. Reading only the first gives a white outlined button.
The `right/bottom: 25px` rule is inside `@media (max-width: 600px)` — desktop
is 40px, which is what the live screenshot measures.

**It has no dark plate behind it.** The red box sits directly on whatever the
page shows at that scroll position; it only looks like it is on black in a
screenshot taken over the copyright bar.

Measured, on the production build:

| | live | ours |
| --- | --- | --- |
| bar height | 97px | **97px** |
| copyright ink (bar-relative) | 42..57 | **42..57** |
| copyright ink width | 355px | 354px |
| button box | 40 × 40 | **40 × 40** |
| button offsets | right 39, bottom 40 | right 40, bottom 40 |
| button fill | `#FF1616` | **`#FF1616`** |

**How the button was verified.** Headless Chrome on this machine returns a
blank capture at a short window size, and a full-page capture cannot scroll, so
the *shown* state is unreachable in a normal screenshot. It was measured
instead in an isolation harness that loads the real built stylesheet and
applies the classes the scroll handler toggles — so the numbers above are the
ones the page produces. The show/hide behaviour itself is not screenshot-proven.

**Toggle `pointer-events-none` OFF; never add `pointer-events-auto` beside it.**
The button first shipped with `pointer-events-none` in its base classes and the
handler adding `pointer-events-auto` on scroll. Both utilities have the same
specificity, so the winner is whichever Tailwind emits later — and in the built
sheet `.pointer-events-none` sits 41 bytes after `.pointer-events-auto`. The
button appeared correctly and was permanently unclickable. `auto` is the
default, so removing `none` is the whole fix. **This applies to any pair of
same-property Tailwind utilities toggled at runtime** — `block`/`hidden`,
`opacity-0`/`opacity-100` — the class list's order is not the cascade's.

**The copyright bar must be a SIBLING of the footer's padded section, not a
child of it.** The `<footer>` element started out carrying both the `#222`
ground and the 60–100px bottom padding, so the black bar rendered inside that
padding and a strip of `#222` showed *below* it. `<footer>` is now a bare
wrapper with the ground and padding on an inner `<section>`, matching the live
DOM, where the two are separate top-level sections.

---

## Deviation log

Everything not listed here should match the live site. **Add to this list rather
than deviating quietly.**

### 1. The post container is fluid, not stepped

**Scope corrected:** this only ever applied to single post pages. Elementor
pages — everything else — are fluid on the live site too, because their theme
container is `width:100%`. See "Container width" above.

The stepped widths leave dead space between steps:

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

### 8. The sticky header uses `position: sticky`, not JS + `position: fixed`

The live site pins the main bar from JavaScript: on scroll it adds a
`sticky_enabled` class carrying `position: fixed !important; z-index: 99`, plus
the translucent white and `0 0 7px rgba(0,0,0,.1)` shadow. Taking an element out
of flow needs a placeholder of the same height or the page jumps by 110px, and
that placeholder has to be maintained against three different bar heights.

`position: sticky; top: 0` pins at the same scroll offset with no placeholder
and no jump. The one thing it does not give us is *when* it pinned, which is
what `src/hooks/use-stuck.ts` reports so the fade to translucent stays timed to
the live site's. Confined to `header-bar.tsx` and that hook.

### 9. Elementor's percentage columns are flex

The live header's two columns are `23.991%`/`76%` above 1024px, `40%`/`60%` to
768px and `70%`/`30%` below it. Those percentages resolve to the same layout the
logo's own 68px right margin and the nav's right alignment already produce — the
logo is 222px + 68px = 290px against a 293px column, i.e. the percentage *is*
the content width — so the rendering is identical until the nav overflows, which
it cannot at 1200px (nav + button ≈ 770px in a 912px column). Flex is used
instead, and stays correct if a nav item is ever added.

### 10. The drawer locks scroll and closes on Escape

The live drawer is `position: fixed` and does not lock the body, so the page
scrolls behind it, and only the toggle closes it. Both are fixed here — the
first is a defect on a phone rather than a design decision, and the second is
keyboard accessibility. Neither is visible unless you scroll or press Escape.

### 11. `components/ui/button.tsx` holds measured live values

`components/ui/` is otherwise shadcn-CLI territory, but every CTA on the site
renders through `Button`, so it is the only place a button change lands
everywhere at once. Consequence: `npx shadcn@latest add button` would overwrite
the live spec. Re-apply from the Buttons table above if that happens.

### 12. Contact glyphs are Font Awesome outlines, not lucide

The live site draws `fa-phone-alt` and `fa-envelope-open` from Font Awesome
5.15 **Solid**. lucide's `Phone`/`MailOpen` are stroke icons with a different
silhouette — the live envelope is a filled shape, lucide's is an outline — and
render ~2px shorter in the same 14px box. The two outlines are carried verbatim
in `components/common/contact-icons.tsx`.

Still open: the rest of the site uses lucide, and the live site uses Font
Awesome throughout. Only the header's two glyphs are converted so far.

### 13. `-webkit-font-smoothing` is not set

`antialiased` was on `<body>`. The live site sets no font-smoothing at all, and
forcing greyscale smoothing renders every glyph slightly lighter than the live
one on macOS. Removed — a whole-site weight shift from one utility class.

### 14. Twitter is the X mark, not the bird — **client decision**

The live markup asks for `fab fa-twitter`, which is Font Awesome's pre-rebrand
bird. Asked, and the answer was to keep X. `TwitterIcon` in
`layout/social-icons.tsx` is the X mark and stays that way; the other three
chips match the live glyphs.

Worth knowing when comparing screenshots: the live chips render as four **empty**
black circles, because the Font Awesome *brands* webfont is not loading on the
live site. Ours draw glyphs, so a chip-for-chip diff of the strip will never
agree — that is the live site being broken, not a parity miss.

### 15. The Instagram chip's glyph is white

The live site sets that one glyph to `#F4F4F4` and the other three to `#FFF`.
Indistinguishable on a `#0B0B0B` chip, and not worth a token for a single icon.

### 17. Roboto is declared but NOT loaded — literal parity

All 56 text-widget rules on the live home page (page id 12261) declare
`font-family: "Roboto", Sans-serif`, but the site only ever requests
`Poppins:400,500|Rubik:400`. **Roboto never arrives**, so that copy falls
through to the generic sans — Arial on Windows, Helvetica on macOS — while the
nav and `h1`–`h6` render in real Poppins.

`--font-body` therefore declares the same unloaded stack, so we inherit the same
fallback face on the same machine. Poppins stays on nav and headings.

**This supersedes an earlier decision to load Roboto for real.** That was chosen
before the consequence was visible; a screen recording of the live site then
settled it. Measured on the hero eyebrow at 44px/800:

| | eyebrow width |
| --- | --- |
| live (recording) | **472px** |
| declared-not-loaded, i.e. Arial Bold | **473px** ✓ |
| real Roboto ExtraBold | 398px ✗ |

Roboto is materially narrower than Arial and its 500 is a true Medium rather
than Arial's 400 fallback, so loading it made every line ~9% short. Reverting
is one line in `globals.css`, at the cost of the face varying by platform —
which is what the live site does.

### 18. The hero has a mobile gutter below 768px

The live hero's left column drops to `padding: 0` under 768px inside a
full-width box, so its text runs to the screen edge. `px-5` is added below that
breakpoint. Desktop and tablet stay flush, as measured.

### 19. The typed eyebrow respects `prefers-reduced-motion`, and always ships its text

`useTypedText` returns the finished string immediately for a reader who has
asked for less motion, and `TypedText` renders the full string in an `sr-only`
span so the text is in the document for screen readers and with JS disabled.
The live widget does neither — it empties the element and, if its JS never
fires, the text is simply gone (which is exactly what a headless capture
shows).

### 21. Animated content ships visible, and is hidden only once JS runs

Elementor renders an animated widget with `.elementor-invisible`
(`visibility: hidden`) in the markup and reveals it from JS on scroll. So on the
live site, anyone without JS — and every headless capture — gets a heading and a
body list that are simply *not there*. It is why a capture of the Student
Benefits band comes back empty, and why the feature grid's `h1` never appears.

`Reveal` inverts that: the content is server-rendered visible and hidden only
after JS has confirmed it is running and that the reader has not asked for
reduced motion. The animation is identical when it plays; the difference is
only what happens when it cannot.

### 16. Elementor's `min-width: 1025px` boundaries land on `lg` (1024px)

Elementor pairs `max-width: 1024px` with `min-width: 1025px`; Tailwind's `lg` is
`min-width: 1024px`. So at a viewport of exactly 1024px the top strip and the
desktop logo appear one pixel early. Applies wherever a live `hidden-tablet` or
`hidden-desktop` rule is ported.

**`lg` is the desktop step, never `xl`.** `xl` is 1200px, so using it leaves the
tablet values in place across the whole 1025–1199 band — a 175px-wide error, not
a one-pixel one. The hero shipped with exactly that bug (`xl:pl-0`,
`xl:text-[44px]`, `xl:h-[60px]`): correct at the 1901px width it was verified
at, wrong at 1100px. Fixed, and worth checking on every section.

It recurred in the trial form's row gap (`lg:gap-2.5 xl:gap-10`), which is
invisible at the 1920px width the section was verified at and wrong across the
whole 1025–1199 band. Now `sm:gap-2.5 lg:gap-10`. **A section verified only at
one wide viewport has not been checked for this.**

### 20. Sections are self-contained, because editors can reorder them — **client decision**

The client confirmed every page's text comes from a CMS, and that editors can
reorder sections and switch them off (see
[`docs/CMS-CONTRACT.md`](./CMS-CONTRACT.md)). A live Elementor page is a fixed
stack, so its sections lean on each other freely — alternating backgrounds, a
spacer widget in one section paying for the gap above the next.

We cannot. Every section now owns its own background and its full vertical
rhythm, including any trailing spacer: the hero's 60/100/10px bottom spacer is
inside the hero. In the live order the rendered result is identical — this only
changes what happens in an order the live site never had.

The one thing not yet self-contained is the `h1`. Exactly one block per page
may set `headingLevel: "h1"` (on the home page, the feature grid, matching the
live document). Nothing enforces it in code; the CMS UI has to.

### 22. Both bullet dots are 7px, where the live pair is 6 and 7

The feature bullets show two dots: a black one from the theme's own `::marker`
and a brand-red one from Elementor. Measured on the live page they are **6×6 and
7×7** — a 1px mismatch nobody designed, and visible once you look for it. Ours
are both 7px, and both come from **one** pseudo-element:

```
before:size-[7px] before:rounded-full before:bg-primary
before:shadow-[-18px_0_0_0_var(--color-foreground)]
```

The second dot is that element's box-shadow, so the two cannot drift in size or
baseline — they are the same circle drawn twice. This replaced an attempt to
match the pair with a real `::marker`, which is not steerable enough: its size
moves only in whole pixels via `font-size`, and changing it shifts the dot
horizontally at the same time. `src/components/common/bullet.ts` is the single
definition; `IconBox` and `BenefitMedia` both import it.

### 23. Form field rhythm lives in `FormField`, once

Every form on the live site is the same Elementor form widget, so its rhythm is
set as the default in `components/forms/form-field.tsx` rather than per form:
a 24px label box, 12px to the control, and 26px under each field group, which
gives the live 103px field-row pitch. The label's `font-body`, 16px and 400
weight all override shadcn defaults. `components/ui/label.tsx` is CLI-managed
and is not edited; every override arrives as a `className` from `FormField`.

### 24. The FAQ questions are a `dl`, not five more `h2`s

The live FAQ section emits an `h2` per question plus one for "FAQs" and one for
"Got more questions?" — five same-level headings in one section, on a page whose
`h1` is the feature grid. That says nothing true about the document's outline
and it is invisible, so the questions render as `dt`/`dd` inside a `dl`. The
`h2` styling is reproduced exactly (Roboto 18px/40px weight 800, brand red), so
there is no visual difference.

### 25. `Q:` and `A:` are stripped from the FAQ structured data

The prefixes are part of the live copy and stay on screen verbatim, but the
FAQPage JSON-LD gets them removed: a crawler should read the question, not the
label. Screen output is unaffected.

### 27. Centred gt3 buttons are shifted 11.5px left, reproducing a live quirk — **client decision**

Every `gt3-core-button--alignment_center` button on the live site renders
**11.5px left of its column's centre**, while everything else in the same
column is dead centre. Measured on both home-page instances, and the number is
identical:

| | column centre | heading ink centre | button centre |
| --- | --- | --- | --- |
| testimonials | 951.5 | 951 | **941** |
| FAQ | — | 637 | **626** |

Nothing in the CSS accounts for it — both are `padding: 5px 20px`, no margin,
same alignment class — so it is an artifact of the widget's markup, which wraps
the label alongside two absolutely-positioned cover spans with literal
whitespace between them. It was initially left un-reproduced, with the button
optically centred, and logged as an open question; the client compared the two
renders and asked for the live position, so it is now reproduced.

`GT3_CENTERED_BUTTON_ROW` in `components/common/gt3-button-row.ts` is the single
definition — `pr-[23px]` on a `justify-center` row, which makes the free space
either side differ by 23px and lands the item 11.5px left. Desktop only: the
offset was measured at desktop widths and the live mobile rules never touch
button alignment. Deleting the `md:pr-[23px]` reverts to optical centring.

### 28. The `wipe` button's halves overlap by 1px

`wipe` paints its brand-red fill with two pseudo-elements, each anchored to one
edge so they can retract outwards on hover. At `w-1/2` an odd box width puts
each half on a half-pixel — a 259px button gives 129.5 — and the rounding left a
**1px `#0B0B0B` hairline down the centre of every wipe button**, the hero CTA
included. Confirmed by sampling: x=633 read `rgb(11,11,11)` between two runs of
brand red. Both halves are now `calc(50% + 1px)`. The overlap is invisible (same
colour) and harmless on hover, since each retracts towards its own outer edge.

### 30. The copyright line keeps its stray space — **needs a client decision**

The live copy is `© 2026 — AmpliTeach . All Rights Reserved.`, with a space
before the full stop, and it is visible on the page. Reproduced verbatim rather
than silently tidied. Deleting one character in
`components/layout/footer-copyright.tsx` fixes it if the client wants it fixed.

The year is generated, not hard-coded. Under `output: 'export'` that bakes it at
build time, so a site left unbuilt across New Year shows the old year — worth a
scheduled rebuild. The alternative, a client component for one number, costs
more than it saves.

### 29. The hidden "Footer Links" section is not reproduced

Between the closing strip and the statement, the live page has a third section
(`5a93287`) holding a spacer and this paragraph:

> Footer Links:
> • Music School CRM About Us • Privacy Policy • Terms of Service • Contact Us

It carries `elementor-hidden-desktop elementor-hidden-tablet
elementor-hidden-phone` — hidden at **every** breakpoint, so it renders for
nobody and appears in no screenshot. It is an SEO link list, and it is not
reproduced: shipping links hidden at all breakpoints is cloaking-adjacent, gives
no reader any value, and the same four destinations are already in the footer
where crawlers and people can both reach them. Nothing visual changes.

### 26. `TestimonialCard` was deleted

It was a shadcn-card testimonial with a lucide quote glyph, written before the
live markup was available. The live design is a centred italic quote with no
card, no icon and no border, so the component had no live counterpart, and the
rewrite left it with no callers. Removed rather than left to be reused. It is in
git history if a later page turns out to want a card.

---

## Open questions — awaiting a visual decision

Do not resolve these unilaterally.

- **The "Click here to see more testimonials" button links to `#`.** That is
  the live `href` — the button currently goes nowhere. Kept as-is rather than
  invented; it needs a real destination from the client.


- **The flat 40px `h1`.** Faithful to the live site, but small on a wide
  monitor. A responsive step is one line per token
  (`--text-h1: clamp(2.5rem, 4vw, 3.75rem)`).
- **The section eyebrow fails WCAG AA.** `#FF1616` on white is **3.90:1** at
  12px, where AA for small text requires 4.5:1. It appears on most sections.
  Fixing it means a darker `--brand-strong` for brand-coloured text on light
  grounds, which changes the appearance of a brand element.
- **Is `#F0EFF3` the site's hairline, or just the header's?** It is the live
  border under the top strip and the divider between megamenu columns. It is
  held as `--hairline` and used only there, because `--border` (shadcn's
  ~`#e5e5e5`) is what every card, input, table and the footer already draw with,
  and swapping that is a site-wide visual change. Worth deciding once, before
  more pages are built on the current value.
- **The hamburger's `#3B3663`.** Reproduced as measured, but it is an `ewebot`
  theme default the bars inherit by accident, not a brand colour — nothing else
  on the site is that purple. `--header-ink` is the single edit if the client
  wants it as `--foreground`.
- **Below 1024px the header loses the phone, email and socials entirely.** The
  live template hides the whole strip and does not move its contents into the
  drawer, so a phone visitor gets no contact route from the header. Matched, on
  the grounds that the footer carries all three, but it is a conversion
  question rather than a visual one.
- **The drawer's Log In pill is capped at `max-width: 100px`.** Measured, and
  reproduced, but it reads as an Elementor accident: the label is centred in a
  100px box with zero padding, so the pill is 100×24px regardless of viewport.
