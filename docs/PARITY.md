# Parity with ampliteach.com

The rebuild must match the live site pixel-for-pixel, animations included, at
every viewport — with full responsiveness as the one deliberate addition.

This file is the record of **what the live site actually does**, **how we know**,
and **every place we knowingly differ**. If you are wondering why a heading is
40px or why the container behaves differently from the original, the answer is
here.

The live site is WordPress + Elementor on the `ewebot` theme.

---

## Home page — verified state at 1920px

Last measured against `https://www.ampliteach.com/` in **real Chrome**
(`channel: "chrome"`, `headless: false`) at a 1920 window — a 1905px layout
viewport once the scrollbar is taken out — `deviceScaleFactor: 1`, with the live
page's entrance animations revealed and its typed eyebrow filled. Without any
one of those four conditions the live page does not measure as a visitor sees
it; see the notes below, and deviation 3 for what the bundled browser does.

| Check | Result |
| --- | --- |
| Page height | **6222px live / 6222px local** |
| Full-bleed band boundaries | **all 8 identical**, start and end |
| Vertical position of every matched text run | no step anywhere except ±2px at the header Log In |
| Painted font face, per region | **identical on every region checked** |
| Ink width of matched text runs | **164 / 187 identical** to 0.01px |
| Ink x of matched text runs | **165 / 187 identical** |

Band heights, live and local: feature grid 1974.38 · Student Benefits 88 + 332.8
· free trial 665.38 · testimonials + FAQ 999.44 · transform CTA 100.75 · closing
194 · footer 666.19 · copyright 97.4.

**Also verified at 1536, 1440, 1366 and 1280**, which all return the same counts
as 1920 — those are above the live site's 1025px desktop boundary, so its layout
is legitimate there.

**Below 1025 the two sites diverge substantially, and this is now measured.** At
a 1024 window (a 1009px layout viewport) *every* matched anchor is ≥5px out and
the page is **344px shorter than live** (6822 vs 7166); at 768 it is 108px
shorter (8307 vs 8415) with 47 anchors ≥5px. Some of that is deviation 2 working
as intended — the live site's tablet and mobile rules are Elementor's, not a
responsive design, and full responsiveness is an explicit project requirement.
But it has never been separated into "intended" and "wrong", and 344px is far
more than the deviation alone should produce. **Treat sub-1024 as unverified,
not as agreed.** See the open questions.

### Images were a blind spot until 2026-09-17

The text harness matches anchors by their text, so images could never match: our
`alt` text is written properly where the live site uses upload filenames
(`image-2-1-scaled`, `gitar`, `FAQS`). Every image therefore fell out of the
comparison silently, and **two real defects sat behind that gap** — the overview
image 59.5px off horizontally, the FAQ photo 9.76px off vertically, both at every
desktop width, both visible when flipping between tabs.

Compare images by **DOM rect in document order**, never by matching them the way
text is matched. `document.images` filtered to boxes over 20px, sorted by `y`,
gives a stable list on both sides; the live/local pair then reads off directly.
Note the two lists are not the same length and must not be index-aligned: the
live hero video overlay is a CSS `background-image` (not an `<img>`) and our
footer particles are inline SVG (not `<img>`), so live has 7 and we have 5.

A whole-page **pixel diff** is the backstop that would have caught both without
knowing to look. Screenshot both full pages, diff per row with a ~24/channel
tolerance, and rank contiguous hot bands by area. The two defects showed up
immediately as the two largest bands, 453px and 316px tall — image-sized, where
every other band is a 13–19px text row. After the fix: **399,869 → 219,146
differing pixels, 3.37% → 1.85% of the canvas**, and the largest remaining band
is the typed eyebrow caught mid-cycle. Everything left is glyph antialiasing,
photo re-encoding noise, and the live site's own empty social chips
(deviation 14).

Both the static build (`out/`) and `next dev` were checked and agree. A
long-running dev server from an earlier session is still the classic trap — see
the note below — but Turbopack did pick up every change in this pass.

The remaining ink differences are **not** visual differences, and there is no
known visual difference left on this page beyond deviations 8 and 22:

- the social links' accessible labels. The live markup labels them with Font
  Awesome glyph text positioned off-screen at y ≈ −120000; ours are `sr-only`
  words. Nothing is painted in either case.
- a space attached to the adjacent run. Our content puts the space at the start
  of the following run where the live markup puts it at the end of the bold one;
  the rendered character sequence is identical.
- every bullet, where Chrome's `Range` rect for a `display: list-item` text node
  includes the leading marker area on the live side — reported as a uniform
  +17px x offset that does not exist. A pixel scan puts the glyphs within 1px
  (live 386.5 / ours 387.5). **Do not "fix" this by removing the 17px indent
  from `BULLET`**; it would move every bullet 17px left of the live one.
- the header nav sits 1.61px left, and the Log In label ±2px.

Re-run the harness after any change to a shared component: `Button`,
`FormField`, `IconBox`, `Container`, `TopBar`, `Footer` and `BULLET` are all
shared with the other eight routes, which have **not** been measured.

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

**For anything interactive, drive a real browser — the cascade is the only
authority.** `playwright-core` is a devDependency and launches the installed
Chrome (`channel: "chrome"`), so there is no browser download. It reads hover,
scroll and click states that a `--screenshot` capture cannot reach, and it
resolves whole cascades for you instead of you resolving them by eye.

Use it whenever a rule's final value is in doubt. The `hover_type5` button was
built as a wipe for a long time because the gt3 stylesheet defines a wipe and
then cancels it further down the same file; one `getComputedStyle` on the live
page settled it in seconds. `scratchpad/probe-hover.js` (live state dump),
`probe-ours.js` (ours, all variants) and `probe-curve.js` (pixel colour sampled
through a transition) are the three shapes worth keeping.

Note the scripts live outside the project, so they need
`NODE_PATH=D:\Ampliteach-Nextjs\node_modules` to resolve `playwright-core`.

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

**Drive REAL Chrome through Playwright — `channel: "chrome"`, `headless: false`
— and compare INK, not boxes.** Everything below was verified that way at
1920×1080, `deviceScaleFactor: 1`, diffing both sites numerically.

> **Two non-optional guards, and skipping either produces a self-consistent set
> of wrong numbers — it did, and the wrong conclusion shipped:**
>
> 1. `channel: "chrome"`, `headless: false`. Playwright's bundled Chromium never
>    loads ampliteach.com's webfonts and renders the whole live page in fallback
>    faces.
> 2. **Block until Poppins is paintable before measuring anything.** The live
>    site injects its Google Fonts stylesheet from JS about five seconds in —
>    after `networkidle` and after `document.fonts.ready`.
>
> Deviation 3 has the evidence and the probe that catches both.

Three techniques did the work, and they are worth reusing:

1. **`CSS.getPlatformFontsForNode`** (Chrome DevTools Protocol, via
   `context.newCDPSession`) reports the face Chrome actually **rasterised**,
   with a glyph count — the only reliable answer to "what font is this?".
   `getComputedStyle().fontFamily` returns the *declared* stack and will happily
   tell you "Poppins" for text painted in something else. Necessary but not
   sufficient: it reports faithfully about whatever browser you ran it in, so it
   only settles deviation 3 when run in real Chrome.
2. **Ink width via `Range.getBoundingClientRect()`** over each text node, rather
   than the element's box. Ink width is an exact fingerprint of family + size +
   weight + letter-spacing, so a match within 0.5px means the text renders
   identically. Element boxes lie constantly: the live site's inline `<span>`
   heading against our block `<h3>` differs by 7px of inline content area with
   the baselines in the same place, and a text run's box changes with where an
   adjacent `<strong>` keeps its space. **174 of 187 matched runs** now share
   an ink width to the hundredth of a pixel.
3. **A vertical map** — every matched run in live document order with its y
   delta, reporting where the delta *steps* rather than its absolute value.
   Cumulative drift makes absolute deltas meaningless; a step is exactly where
   space is missing or extra, and the step size is the fix. That turned a
   "-144px somewhere" into six specific edits.

Where ink and boxes both mislead, **scan the PNG**. The live red bullet dot's
`::before` reports a transparent background and a 6×7 box that a non-replaced
inline never applies, so only a pixel scan gives its real size and position
(deviation 22).

**Three things do not render in a capture, and all three change the layout you
measure.** Each one produced a wrong conclusion before it was found:

- **Elementor's entrance animations.** Widgets ship with `.elementor-invisible`
  (`visibility: hidden`) and JS strips the class on scroll; in a capture that JS
  often does not fire, so the two section headings, the FAQ photo and "Got more
  questions?" are invisible. Boxes are reserved either way — it is `visibility`,
  not `display` — so geometry survives, but screenshots do not. Strip the class
  before capturing.
- **The typed hero eyebrow.** Typed.js does not initialise, so its span stays
  empty, its widget collapses from 66px to a 10px strut, and because the hero
  column is `items-center` **everything in it moves**. Measured that way the
  hero looked 30px out when it was already correct. Its settings are in the page
  — a sibling `<script type="application/json" id="settings--…">`, not a
  `data-settings` attribute — so fill the span from `strings[0]` before
  measuring.
- **Lazy images**, as described above.

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
the testimonials button 318 against 341. `font-body` brought both to within 3px,
and the `wipe` inset below closed the last 3px exactly. This is the third time
the base-vs-id-keyed split has produced a wrong value — see the top of this file.

**Only one button on the home page has a mobile label step.** `1b95fcf`, the
testimonials button, drops to 12px ≤767; the other five stay at 14px. It is
therefore a per-instance `max-md:text-xs`, not a change to the `cta` size.

#### `hover_type5` is a CROSS-FADE, not a wipe

The gt3 stylesheet defines a two-half centre-out `scaleX` wipe — and then, in
the same file, switches all of it off:

```
.front:after, .back:after     { display: none }    ← the halves, gone
.front:before, .back:before   { width: 100% }      ← now full-size
...                           { transform: none }  ← no scaleX at all
...                           { transition: all .6s }
```

So what actually animates is **opacity**: the red layer fades out while a
`#0B0B0B` layer fades in, over **600ms `ease`**. This was built as the wipe for a
long time, because reading the rules top-down finds the wipe and stops.

Verified with Playwright against the live page rather than by reading — the
browser resolves the whole cascade:

| | live at rest | live on hover | ours |
| --- | --- | --- | --- |
| `.front::before` | opacity **1**, red | opacity **0** | ✓ |
| `.back::before` | opacity **0**, `#0B0B0B` | opacity **1** | ✓ |
| `.front/.back::after` | `display: none` | `display: none` | not emitted |
| transition | `all 0.6s ease` | | `opacity 0.6s ease` |
| layer box | 272.44 × 35 | | **272.44 × 35** |
| anchor box | 268.44 × 31 | | **268.44 × 31** |

`transition-property` is narrowed to `opacity` where live says `all`; only
opacity changes, so the result is identical and nothing else gets animated.

**The covers sit at `-2px` on every side** (`top/left/right/bottom: -2px`, with
`overflow: visible`), so the painted box is **4px wider and taller than the
anchor**. That is not cosmetic: it is exactly the 3–4px that every measured
button width was short by. With the inset, the testimonials button paints
341.97 against the live 341 and the FAQ button 263.77 against 263 — both
residuals resolved, and layout is untouched because the layers are absolutely
positioned.

Sampling the composited pixel through the transition confirms the curve — same
endpoints, same shape, settled by 600ms:

| t (ms) | live | ours |
| --- | --- | --- |
| rest | `255,22,22` | `255,22,22` |
| 200 | `74,59,59` | `83,62,62` |
| 400 | `19,18,18` | `21,20,20` |
| 600 | `11,11,11` | `11,11,11` |

Per-sample offsets differ by a few tens of ms because each read is a screenshot
plus a canvas decode and the two runs are not clock-synchronised — the `t=0`
readings already differ. The declarations above are the exact comparison.

**Every live `hover_type5` maps to `wipe` and nothing else does.** Checked by
inventorying both pages: the header's "Log In" carries no `hover_type` on the
live site and is correctly `variant="default"`; the trial form's submit is a
separate `input[type=submit]` treatment; the other six are all `wipe`. The
header and form-submit hovers are not yet verified against live.

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
| image box | **x402, y652.58, 476×317.59** | **x402, y652.58, 476×317.59** |

**The image is CENTRED in its column, and for a long time ours was not.** The
row above used to read "image box — live (lazy), ours x344–817" — the live value
was never taken, because the image does not render in a headless capture, and
the local value was recorded on its own and assumed correct. It was not: ours
sat flush at the container's left edge (x342.5) where the live image sits at
x402, i.e. **59.5px left of live at every desktop width**, for the whole life of
this section.

The mechanism is Elementor's own base rule, `.elementor-widget-image {
text-align: center }` with `.elementor-widget-image img { display: inline-block
}`. The column leaves 595px of content after the wrapper's `padding-right: 15px`,
the image is `width: 80%` of that = 476px, and centring it offsets it
(595 − 476) / 2 = **59.5px** — exactly the live x. Reproduced as `text-center` on
the wrapper plus `inline-block` on the image, matching what `faqs.tsx` already
did.

This is the **fourth** time the base-vs-id-keyed split has produced a wrong
value, and the first time it was caught by comparing images rather than text.
The id-keyed rules for this widget say nothing about alignment.

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
| image box (absolute, 1905px viewport) | x1058.5, y4553.74 | x1058.5, **y4553.61** |

**The image column took `px-2.5`, not `p-2.5` — the same correction its sibling
column already carried.** Elementor's 10px column gap is horizontal only, and a
vertical 10px here put the photo **9.76px below** the live one. The text column's
own note has said this since it was written; the image column was missed because
images were never compared, only text. Both columns now agree, and the photo
lands within 0.13px of live.

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

### Why Choose Us — verified state, all six breakpoints (2026-09-17)

Every landmark below was measured on ampliteach.com and on our build **in the
same browser, with fonts loaded on both sides**, and diffed. The page matches at
480, 600, 768, 1024, 1200 and 1920: total document height 4243px against the
live 4242px.

Two classes of residual difference are measurement artifacts, not defects:

- our `Container` reports a box that includes its own padding, while Elementor's
  `.elementor-container` is the content box — so the container rows read
  `x−3 w+6` while every child inside them matches exactly;
- live columns stretch to the grid row height; ours are content-height and
  centred. The painted content sits in the same place.

**How the live page had to be loaded.** LiteSpeed defers ampliteach.com's assets
— Google Fonts included — until a **real interaction event**. `page.goto` plus
programmatic `window.scrollTo` is not enough: the page renders in Times New
Roman, and every height measured off it is wrong. The capture must send real
input first:

```js
await page.mouse.move(400, 300);
await page.mouse.wheel(0, 500);
await page.keyboard.press("ArrowDown");
await page.waitForTimeout(3000);
await page.evaluate(() => document.fonts.ready);
```

This is the same trap as deviation 3, one layer further in: real Chrome is
necessary but not sufficient. Entrance animations must also be snapped to their
end state before measuring, or elements are caught mid-translate.

#### Sections, in live document order

| # | live id     | section                | ground   | padding (desktop · tablet · mobile) |
| - | ----------- | ---------------------- | -------- | ----------------------------------- |
| — | `.gt3-page-title` | red title band   | `#FF1616` | height 261px · 261px · 200px        |
| 1 | `144d110`   | illustration + intro   | `#FFF8F8` | 40/0/60 · 60/0/40 · 20/0/80         |
| 2 | `103790ba`  | three pitch rows       | none     | 100/0/60 · 80/0/60 · 60/0/60        |
| 3 | `5392376`   | founder message        | `#FFF8F8` | 120/0 at every width                |
| 4 | `68df698`   | "Take Your Teacher Home" | none   | 60 top · 60 · 80                    |
| 5 | `b0296ad`   | subheading + copy      | none     | 0 15 60 at every width              |
| 6 | `ee9cc70`   | three tinted cards     | none     | 0 15 80 — **full width, not boxed** |

Sections 4 and 5 are merged into one `centered-intro` block (they always appear
together); section 6 carries `elementor-section-full_width`, so its cards span
the viewport rather than the 1220px box — boxing it made the cards 220px
narrower and much taller.

#### The red banner's breadcrumb trail

Three values here are easy to get wrong, and two of them were, because the first
pass measured the trail's WRAPPER rather than the crumbs inside it:

| part           | value                                                     |
| -------------- | --------------------------------------------------------- |
| crumb text     | Poppins 12.432px/27px, weight 400, **`letter-spacing: 1px`** |
| crumb padding  | `0 1px`                                                    |
| separator      | a DRAWN 6px white disc (`::after`, `border-radius: 50%`), `margin: 0 10px` — 26px total |

The wrapper is `letter-spacing: normal`, so reading it gives unspaced crumbs
that render visibly tighter than the live ones — "Home" is 43.1px live against
39px unspaced. The separator is a circle, not a `&bull;` glyph: the glyph is
smaller and sits on the text baseline rather than the middle.

Measured with a Range, the text RUNS were already identical to the pixel
(41.08px for "Home"), which is what isolated the remaining 2px to the crumb's
own 1px padding. Both crumbs now match live at `dx 0.0, dw 0.0`.

#### Colours measured on this page

| token             | value     | where                                    |
| ----------------- | --------- | ---------------------------------------- |
| `--card-lilac`    | `#F9F8FF` | first closing card                       |
| `--card-mint`     | `#F0FFFC` | second closing card                      |
| `--card-cream`    | `#FFFCF6` | third closing card                       |
| `--pitch-border`  | `#D9E2E9` | 2px outline round each pitch row         |
| `--blush-warm`    | `#FFF8F8` | intro and founder grounds (already held) |

The three card grounds are **not declared in any stylesheet**. They were found
by walking up from each card for the first non-transparent background, which put
them on the card's own `.elementor-widget-container`. Read what Chrome paints,
not what a rule says.

#### Entrance animations, from the live `data-settings`

| element                | animation          | delay | speed  |
| ---------------------- | ------------------ | ----- | ------ |
| intro media column     | `slideInRight`     | —     | normal |
| intro illustration     | `zoomIn`           | 5ms   | slow   |
| intro heading, copy    | `slideInLeft`      | —     | normal |
| pitch rows 1 and 3     | `rotateInUpRight`  | 5ms   | slow   |
| pitch row 2            | `fadeInUp`         | 10ms  | slow   |
| founder column         | `fadeIn`           | —     | normal |
| "Take Your Teacher Home" | `fadeInRight`    | —     | normal |
| its body copy          | `fadeInLeft`       | —     | normal |
| cards 1, 2, 3          | `fadeInLeft`, `fadeInUp`, `fadeInRight` | — | normal |

`animated-slow` is 2s; the default is 1.25s. These came from the live widgets'
own `data-settings`, which is exact — the client's screen recording confirms the
result but cannot supply the names or the timings.

#### The founder section's doodles also NEVER stop moving

Separate from the entrance animations above, and missed on the first pass: the
three music-note doodles each carry one of the theme's two ambient classes and
loop forever.

| doodle | live class             | keyframes        | timing            |
| ------ | ---------------------- | ---------------- | ----------------- |
| clef   | `gt3_rotated_element`  | `rotatedelement` | 5s linear infinite |
| star   | `gt3_moved_element`    | `movedelement`   | 5s linear infinite |
| note   | `gt3_rotated_element`  | `rotatedelement` | 5s linear infinite |

They are **not interchangeable**: `rotatedelement` translates *and* rotates (to
25° at the halfway point), `movedelement` only translates. Both keyframe sets
are reproduced verbatim as `--animate-particle-tumble` and
`--animate-particle-drift`; both are deliberately lopsided, so the loop does not
read as a simple back-and-forth. The theme also sets `pointer-events: none` on
both, which we match.

Verified against live in real Chrome: same animation per doodle, same 5s,
`infinite` on both sides, and the computed transform demonstrably changing over
time on both. Positions then diffed at 480/768/1200/1920 — **all twelve exact,
zero delta**.

Two things this required, both worth knowing:

- the doodles are positioned against a box inset by Elementor's 10px column
  gutter, so they need their own layer whose border box **is** the container's
  content box. `absolute` resolves against the nearest positioned ancestor's
  *padding* box, so anchoring to `Container` ignores its responsive inset and
  lands 4–20px out depending on breakpoint;
- the star is the only one anchored by a percentage (`bottom: 80%`), so it alone
  is sensitive to that box's height — see deviation 37.

Unlike the entrance animations, an endless loop has no final state to hold, so
it is switched off under `prefers-reduced-motion` by a rule at the end of
globals.css. `Reveal` already does the equivalent in JS for the one-shot ones.

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

### 3. Only Poppins 400 and 500 are loaded — matching live exactly

The live site loads **Poppins 400 and 500, and nothing else**, while its CSS
asks for 600/700/800. So every heavier weight on ampliteach.com is a
browser-synthesised faux bold off Poppins Medium. Confirmed in real Chrome: the
live footer heading declares weight 900 and `CSS.getPlatformFontsForNode`
reports it painting **Poppins Medium**.

`app/layout.tsx` therefore requests `weight: ["400", "500"]`. **Loading the real
600/700/800 faces is the deviation, not the fix** — it renders those headings
narrower and cleaner than the live ones. This file previously loaded all five
and called it an improvement.

#### A wrong turn worth recording, because the tooling causes it

This deviation was briefly rewritten to claim the live site loads **no webfont
at all** and paints Times New Roman — and the build was changed to match, which
put the header, both bullet lists, the footer and the trial submit label in a
serif. That was wrong, and it shipped for one round before the client reported
it.

There are **two** independent causes, and a harness needs a guard for each.

The live page references the Google Fonts stylesheet twice: once as
`rel="preload"` carrying a `&ver=` query — which fetches without applying — and
once as a plain `<link rel="stylesheet">` that JavaScript injects later, without
the query. Everything depends on that second tag.

**1. Playwright's bundled Chromium never injects it at all.** Polled once a
second for 25s, the live page's font links stay `[dns-prefetch, preload]`
forever and `document.fonts` never lists Poppins:

| | Chrome for Testing | real Chrome |
| --- | --- | --- |
| font links after 15s | `dns-prefetch, preload` | `dns-prefetch, preload, **stylesheet**` |
| `document.fonts` | Font Awesome only | **Poppins 400, Poppins 500, Rubik 400 — loaded** |
| header strip, nav, bullets, footer | Times New Roman / Arial | **Poppins** |

Every conclusion drawn from the first column was false, and it was internally
consistent enough to be convincing: the local build was measured in the same
browser, so "both sides paint Times New Roman" read as agreement.

**2. Even in real Chrome the swap lands about five seconds in** — far later than
`networkidle` or `document.fonts.ready`, both of which resolve while the page is
still in a fallback face:

```
t=3.5s  Poppins@40px=301.08  fallback  links=[dns-prefetch, preload]
t=5.5s  Poppins@40px=358.28  POPPINS   links=[dns-prefetch, preload, stylesheet]
```

This is why the error looked intermittent: three consecutive runs that waited 3s
reported Times New Roman and one that waited longer reported Poppins.

**So: launch with `channel: "chrome"` and `headless: false`, and then block
until Poppins is paintable — refusing to measure if it never is.** A cheap probe
is to render `Handgloves 12345` at 40px in each declared family and compare
widths; if a declared `Poppins` matches `serif` or `sans-serif` exactly, it is
not loading yet:

| declared | width at 40px |
| --- | --- |
| `Poppins` | **358.28** (loaded — both sites) |
| `Arial` / `sans-serif` | 333.59 |
| `Times New Roman` / `serif` | 301.08 |

What the live site paints, verified in real Chrome and now matched on both
sides. Note that a single icon-box legitimately mixes two faces:

| Live declaration | Painted | Where |
| --- | --- | --- |
| `Poppins` | **Poppins** | `body`: header contact strip, feature-card bullets, the whole footer, the trial submit label |
| `Poppins, sans-serif` | **Poppins** | the main nav — the generic matters only if Poppins fails |
| `Roboto, sans-serif` | **Arial**, Arial Black at 900 | the 56 text widgets: hero, headings, buttons, form labels, testimonials, Student Benefits bullets |

### 4. ~~Rubik is not loaded~~ — WITHDRAWN 2026-09-17, Rubik IS now loaded

Originally: the live site loads Rubik 400, but used it only in a blog button and
a map info marker, neither on the home page — not worth a second webfont.

**That stopped being true with /why-choose-ampliteach.** Its founder-message
quote is a gt3 testimonial widget, and the widget's rule declares
`font-family: Rubik`. Verified the way deviation 3 says to — in real Chrome, via
`CSS.getPlatformFontsForNode`, on both sides:

| element                      | declared     | live paints  | we paint     |
| ---------------------------- | ------------ | ------------ | ------------ |
| `.testimonials-text-wrapper p` | Rubik 400  | Rubik Light  | Rubik Light  |
| `.gt3-page-title h1`         | Poppins 800  | Poppins Medium | Poppins Medium |
| card body copy               | Poppins 400  | Poppins      | Poppins      |

Both sides report **Rubik Light**, not Rubik Regular: Google serves Rubik v31 as
a variable font, and Chrome names the instance it rasterises after the family's
Light master. `next/font`'s `Rubik({ weight: ["400"] })` resolves to the same
face, so this matches rather than merely looking similar.

`--font-quote` in globals.css, `rubik.variable` in `app/layout.tsx`. Weight 400
only, because 400 is all the live Google Fonts request asks for.

### 32. The scrollbar is the browser's, and always present — matching live

`globals.css` used to style it: `scrollbar-width: thin` plus a 6px
`::-webkit-scrollbar`. The live site styles it not at all and forces it on with
`html { overflow-y: scroll }`.

This is not cosmetic, because the scrollbar comes out of the **layout viewport**
and therefore moves every centred element on the page:

| | layout viewport at 1920 | 1220px container x |
| --- | --- | --- |
| live (`overflow-y: scroll`, default bar) | **1905** | **342.5** |
| ours, before (thin 6px bar) | 1910 | 345 |

A 6px themed bar reserves 10px where the live one reserves 15, which put
**every centred text run 2.5px right of the live one** — 112 of 187 measured
runs, all by exactly 2.5px, with another 42 at 3.5px from sub-pixel rounding.
It presents as "the padding is slightly off everywhere" and no padding change
would have fixed it.

`overflow-y: scroll` also pins the gutter, so a short page (404, a legal stub)
is laid out on the same 1905px as a long one instead of shifting 15px when its
content crosses the viewport height.

The themed scrollbar is a one-block revert in `globals.css` if the client wants
it, but it shifts the whole site and must be logged here if it comes back.

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

**It has one measurable consequence, and it is in our favour.** The live
placeholder is **103px for a 110px bar**, so the live header (0–158px) overlaps
the top of its own page content, which begins at **151px**. Our header is the
same 158px tall and the content begins at 158, so everything below sits 7px
lower than on the live site. Nothing is actually obscured live — the hero's
first 50px is padding — so this reads as "the live page is 7px shorter", not as
a visible defect either way.

Matching it would mean deliberately reproducing a 7px overlap of the header onto
the content, i.e. `margin-top: -7px` on `<main>`. **Not done**, on the grounds
that it reproduces a theme bug with no visual payoff; raise it if the client
wants the 7px. Note this is measured at desktop; the live placeholder is a JS
value and may differ at the 80px bar height.

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
fallback face on the same machine. Poppins stays on `body`, the nav, the footer
and the feature-card bullets.

**This deviation is correct as written, and was re-confirmed in real Chrome:**
the live page's `Roboto, sans-serif` copy paints Arial, and Arial Black at
weight 900. A Roboto woff2 *is* fetched by an unrelated rule, which makes the
network log misleading — check the painted face, not the request list.

It was briefly generalised to "Poppins is declared but never loaded either",
which is false. See deviation 3: Poppins does load, and the tool that said
otherwise was the bundled Chromium.

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

#### Amended 2026-09-17: `desktop:` exists for the structural cases

"One pixel early" holds while the rule only changes padding. It does **not**
hold where the rule changes LAYOUT. On /why-choose-ampliteach the same boundary
decides whether the intro is one column or two and whether the closing cards are
one across or three, so at exactly 1024px — iPad landscape, a real device width
— `lg:` produced a desktop layout where the live site is still stacked. Measured
before the fix: the intro image 1018px wide against the live 872px, the cards
331px against 994px. Not a one-pixel difference, a different page.

So globals.css declares

```css
@custom-variant desktop (@media (min-width: 1025px));
```

and structural Elementor rules use `desktop:`. `lg:` stays correct for the
theme's own container steps, which really are keyed to 1024.

`features/why-choose/` uses `desktop:` throughout.

**The site chrome has now been corrected too** (see the section above): the
header's top bar and logo swap and the footer's section padding were all keyed
to `lg` and all structural. The top bar alone was 48px — the live header is
110px at exactly 1024 where ours was 158.

That is three components in which "one pixel early" turned out to mean a
different layout. The test is not how small the breakpoint difference is, it is
**what the rule does**: a padding value can stay on `lg`, but anything that
hides an element, swaps an asset, or changes a column count belongs on
`desktop:`.

**The home page's own sections have still not been re-checked** — their `lg:`
uses are padding and type size, where the original reasoning holds.

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

### 22. Both bullet dots are 7px, where the live pair is 6 and 5

The feature bullets show two dots: a black one from the theme's own `::marker`
and a brand-red one from Elementor.

**Re-measured by pixel scan** of the Student Benefits list at 1920, reading the
rendered PNG rather than the CSS (the live red dot's `::before` reports a
transparent background and a 6×7 box that a non-replaced inline never applies,
so computed style is not a witness here):

| | live | ours |
| --- | --- | --- |
| black dot | x 353–357, **5–6px** | x 352–358, **7px** |
| red dot | x 370–375, **6px** | x 370–376, **7px** |
| vertical centre | y 3224 | y 3222 — **2px high** |

The original "6 and 7" had the red dot roughly right and the black one a pixel
over. The black dot is the `list-style: disc` marker, so its size tracks the
list's `font-size`, while the red one is fixed — reproducing that faithfully
means a size-varying marker, which is exactly what the mechanism below was
chosen to avoid.

**Everything else about both lists matches.** Text glyphs start within 1px
(pixel-scanned: live 386.5 / ours 387.5), the ink widths are identical to the
hundredth of a pixel (265.02px for "Effortlessly assign rooms and
instructors."), and the list boxes agree exactly (x 360, w 692,
`padding-left: 10px`). What is left is a 1–2px difference in two decorative
dots, sitting 2px high.

Ours are both 7px, and both come from **one** pseudo-element:

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
set as the default in `components/forms/form-field.tsx` rather than per form.
The label's `font-body`, 16px and 400 weight all override shadcn defaults.
`components/ui/label.tsx` is CLI-managed and is not edited; every override
arrives as a `className` from `FormField`.

**Corrected against the live form's own boxes.** This used to read "a 24px label
box, 12px to the control, and 26px under each field group", which does reach the
live 103px row pitch but distributes it differently — the label landed 10px high
and the control 11px high inside every row. The live composition is margins, not
a flex `gap`:

| | live |
| --- | --- |
| label | `margin: 10px 0`, line box **27px** (not Tailwind's paired 24px) |
| control | 41px, `margin-bottom: 15px` |
| pitch | 10 + 27 + 10 + 41 + 15 = **103px** |

Margins do not collapse in a flex column, so the 15px below and the 10px above
the next label stay distinct, as they do live. The trial form's own arithmetic
then closes exactly: 4 rows × 103 + 18 + 50 + 15 = **495px**, the live form
height.

The required asterisk is part of the label's own text run — the live label is a
single text node, `" First name*"` — so it inherits the label's colour. It was
previously a `text-destructive` span, which made it crimson and, being a
separate flex item, also picked up the label's gap.

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

The feature grid's three buttons used to carry their own `mr-[22px]` for the
same quirk — two mechanisms for one live behaviour. They now use this constant
as well, so there is one home for it.

### 31. The footer's Quick Links menu is rendered at 95% — reproduced

The WPDA menu plugin wraps that one menu in
`div.wpda-navbar-collapse { transform: matrix(.95,0,0,.95,0,0) }` with
`transform-origin: 0 50%`, so the **middle footer column's type really is 5%
smaller than the two columns either side of it**, on the live desktop site.
Measured:

| | live | unscaled |
| --- | --- | --- |
| "Little Rockers Program" ink | **142.68px** | 150.19px (×0.95 = 142.68) |
| item pitch | **29.63px** | declared 31.2px (×0.95 = 29.64) |
| menu block | 148.14px | 156px |

So the declared line-heights in `footer.tsx` are the live *declared* ones —
31.2px on the link, 32px on the item — and `origin-left scale-95` on the `<nav>`
scales them to what renders. Collapsing the two into a single "30px" lands 1.4px
out per row and 8px over the column. The left origin is why the column does not
also shift: live and local both put the link's left edge at x = 766.66.

The 20px gap above it is **15px**, not the 20px the other two columns get — the
live menu widget's container declares `padding-top: 15px` where the About text
and the icon list declare 20px. It sits outside the scale, as it does live.

An obvious plugin accident, reproduced rather than corrected, on the same
grounds as deviation 27. One class (`scale-95`) reverts it.

### 28. ~~The `wipe` button's halves overlap by 1px~~ — WITHDRAWN

This described a 1px `#0B0B0B` hairline down the centre of every wipe button,
caused by two half-width pseudo-elements landing on a half-pixel. Both the bug
and the fix are gone: the halves themselves were wrong. `hover_type5` is a
cross-fade with **no halves at all** — see "Buttons" above. Kept as a numbered
entry so the surrounding numbering stays stable.

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

### 33. The pitch-row note is a fixed width, not a shrunk flex item

The live figure declares `width: 136px` but is a flex item beside the copy, so
it shrinks — to 98px at 768, 107px at 1024 and 110px from 1200 up. Those
outcomes are stated directly (`md:w-[98px] lg:w-[107px] desktop:w-[110px]`)
rather than recreating Elementor's shrink arithmetic, which depends on the
copy's max-content width and would move whenever an editor changed the copy.

The figure is also given an explicit `h-[42px]` for a 34px glyph, at both the
pitch rows and the closing cards. That 8px is not padding: the live image is
**inline** and its line box adds the descender gap. It matters — it is most of
row one's height, because row one is a single line of copy.

### 34. Positional values are derived from index, not carried in content

Four things on this page vary by a block's position rather than its content, and
all four are computed by the section:

- pitch rows: odd rows inset 9% left / 2% right, even rows 11% right;
- pitch row animations: `rotateInUpRight`, `fadeInUp`, `rotateInUpRight`;
- card animations: from the left, from below, from the right;
- the first card's tablet padding is 64px and its title margin 10px, where the
  other two are 57px and 3px — and the first column's top padding is 10px where
  the others are 50px.

The last one is almost certainly an Elementor accident rather than a design, but
it is reproduced: an editor adding a fourth row or card gets the pattern
continued instead of an unstyled one, and the CMS never carries a layout field.

### 35. Card titles are stored in sentence case and upper-cased in CSS

The live titles are stored in WordPress already upper-cased, and only the first
card additionally carries `text-transform: uppercase`. Here all three are
upper-cased in CSS and the copy is stored in sentence case: identical pixels,
but an editor sees readable copy and casing stays a presentation decision.

### 36. The founder portrait's gap is the rendered 13px, not the declared 6.4px

The live rule is `margin-bottom: 6.4px`, but the portrait is an inline image and
the line box it sits in supplies the rest, rendering a 13px gap. The declared
number alone lands the quote 7px high. Same reasoning as the 42px figures in
deviation 33: where a declared value and a painted result disagree, the painted
result is what parity means.

### 37. The drifting star carries a +4px correction on its `bottom`

The founder section's three doodles are positioned against a layer inset by
Elementor's 10px column gutter. That reproduces the clef and the note exactly,
because both are anchored with `top`, which does not care how tall the box is.

The star is anchored `bottom: 80%`, so it does care — and the live column adds a
second 10px gutter **vertically** that it does not add horizontally, making the
live box 20px shorter than ours. 80% of 20px is a constant 4px, measured
identically at 480, 768, 1200 and 1920.

It is added back as `bottom-[calc(80%+4px)]` rather than by re-insetting the
layer, because re-insetting would drag the clef and the note off their exact
`top` values to fix a doodle that is already drifting ±10px under its own
animation. One declared correction on the one element that needs it, with the
arithmetic written down, beats moving three things to satisfy one.

### 38. The two bottom-anchored footer notes are lifted 8px

The live footer widgets wrap an inline `<svg>`, so each box carries ~8px of
line-box slack under the artwork: 39px around a 31px note, 66px around a 58px
clef. For the four TOP-anchored shapes that slack falls below the artwork and
changes nothing. For the two anchored by `bottom` it does the opposite — the box
grows upward from a fixed bottom edge, so the live artwork sits 8px higher than
a shrink-wrapped box puts it.

`mb-2` on those two reproduces it. Verified at 1920 and 1200: all six particles
now `dx0 dy0 dw0 dh0` against live.

Third occurrence of the same underlying thing — see deviations 33 and 36. The
rule that keeps emerging: **an inline image's box is taller than the image, and
whether that matters depends on which edge the box is anchored by.**

### 39. An Elementor rule with no tablet value inherits the DESKTOP one

The why-choose media column declares `padding: 20px 0 0` at desktop and
`30px 0 0` at mobile, and nothing for tablet. Reading the two values in source
order suggests desktop/tablet; it is actually desktop/mobile, with tablet
inheriting the desktop 20px.

Taking the 30px as the tablet value left that section — and the whole page —
10px tall at 768. Now `pt-[30px] md:pt-5`.

Worth stating because the extracted stylesheet flattens media queries away, so
two values for three breakpoints is ambiguous in the source and unambiguous in
the measurement. **Measure the middle breakpoint; do not infer it.**

### 26. `TestimonialCard` was deleted

It was a shadcn-card testimonial with a lucide quote glyph, written before the
live markup was available. The live design is a centred italic quote with no
card, no icon and no border, so the component had no live counterpart, and the
rewrite left it with no callers. Removed rather than left to be reused. It is in
git history if a later page turns out to want a card.

---

## Site chrome — verified at all six breakpoints (2026-09-17)

The header, footer and copyright bar were built during the home-page work and
verified at 1920 only. Re-measured against live at 480/600/768/1024/1200/1920
and corrected; the whole page now totals within **1px of live at every
breakpoint** (exact at 1024, 768 and 600).

Four faults, three of them the same root cause — a breakpoint keyed to `lg`
(1024) where Elementor's desktop starts at 1025:

**1. The footer's padding was wrong in TWO bands.** It is `200px 0 100px` on
desktop, `100px 0` on tablet (768–1024) and `60px 0` on mobile, but was keyed
`lg:`/`xl:`. So 768–1023 took the mobile 60px — the band sat 40px high and 91px
short at 768 — and 1025–1199 took the tablet 100px instead of 200px. Now `md:`
and `desktop:`.

**2. The footer is TWO boxes, not one.** A boxed outer container carrying
Elementor's own responsive inset, and an inner section inside it padded
`0 10px` up to 1024 and `0 0 16px` on desktop. They had been collapsed into a
single `max-lg:px-2.5`, which put the columns 4px out at 768 and 10px out at
480 — the two insets stack, so the live copy starts at 30px at 480, not 20.

**3. The stacked columns' padding.** From 768 up every column wrap is 10px all
round. Once they stack it becomes `0 5px` on the first and `30px 5px 0` on the
other two — no vertical padding at all. The 25px spacer above each heading is
present in all three columns at every width; it had been hidden below `md`,
putting two headings 25px high.

**4. The header kept its top bar at 1024.** `hidden lg:block` on a 48px strip:
the live header is 110px at exactly 1024 and ours was 158. The logo swap
(222px mark vs 165px compact) had the same fault. Both now `desktop:`.

Verified after: header, banner, footer section and copyright bar all `dh0` at
1024 and 1200; the footer's nine heading positions and six particles exact at
all six widths.

## Home page — narrow-width state (2026-09-17)

The home page was verified at 1920 only. Re-measured against live at
1920/1200/1024/768/480 using a text-keyed signature (73 elements matched on both
sides without shared selectors), and largely corrected.

| width | elements >1px out, before | after | page height delta |
| ----- | ------------------------- | ----- | ----------------- |
| 1920  | 0                         | **0** | **0**             |
| 1200  | 4                         | **0** | **0**             |
| 1024  | 66                        | **0** | −44               |
| 768   | 66                        | **0** | −14 → −44         |
| 480   | 65                        | **0** | −61               |

**Every horizontal position and width now matches at every breakpoint**, and
1920 was never disturbed — that was the previously signed-off state.

The remaining page-height deltas are VERTICAL and are a separate finding; see
the end of this section.

### What was wrong

**Every Elementor-desktop rule was keyed to `lg`.** Confirmed with a boundary
test: measure each side at 1024 and again at 1025, and compare which elements
move. Live moved 94 elements and lost 262px of height across that boundary; ours
moved 76 and *gained* 164 — because our page was already in desktop layout at
1024. The feature-grid heading was 763px wide against the live 540, and the
icon-box bullets were indented 80px against 40. All of these are now `desktop:`,
and the two signatures now agree.

`max-lg:` had the mirror-image fault — Tailwind's is `max-width: 1023.98px`, so
it is simply absent at 1024 where the live rule still applies. `max-desktop:`
(`max-width: 1024px`) now pairs with `desktop:`.

**The containers were flush at every width.** `gutter={false}` keeps the 1220px
box but drops Elementor's own responsive inset (3 / 4 / 10 / 20px as the
viewport narrows), which is exactly the `dx−3 / −4 / −20` measured. Most sections
are now `gutter="elementor"`.

**But not all of them** — and this is the part worth remembering. Two sections
(`7eebc1a` Student Benefits' heading band, `e112963` the trial band) carry
`padding: 0 20px` on the SECTION and take no container inset, which is the
opposite arrangement to every other section on the page. Applying one blanket
rule fixed 54 elements and broke 10. They are measured individually now.

### The last three, traced and fixed

Each needed the live ancestry walked element by element; none was guessable from
the stylesheets alone.

**The Student Benefits list.** Two faults in one. The list band's section really
does carry `padding: 0 20px`, but unlike the heading band's it is DESKTOP ONLY
and drops to 0 at ≤1024 — removing it along with the heading band's was wrong.
And the live inner column's widget-wrap adds 10px at every width, which the
desktop rules replace rather than add to. The full live chain at 1200 is

```
section 1200 → pad 20 → container 1160 → column 696 (60%) → widget-wrap 0
  → inner-section → pad-right 20 → container 676 → inner-column 676
  → widget-wrap pad 10 → widget 656 → ul pad-left 10 → li
```

**The FAQs heading.** TWO live paddings stack, and only one is constant: the top
column's widget-wrap (10px, 0 below 768) plus the inner section's own (0 on
desktop, 5px at ≤1024). Reading only the inner section's 5px left the tablet
band 10px narrow. Now 5 / 15 / 10px.

Its column's `margin-right: 30px` was also on `md:` — the section's own header
note already said "· 0 ≤1024", so this one contradicted a comment two screens
above it. That 30px ran the whole 768–1024 band.

**The testimonials heading.** The live column's widget-wrap keeps its 10px gap
from 768 up and drops it entirely on mobile, where the heading runs the full
440px. Ours held 10px throughout.

### Vertical drift below 1200 — five causes found and fixed

With the horizontal values correct, a vertical difference became visible that
they had been masking. The method that found each one: compare the GAP between
every consecutive pair of landmarks rather than absolute positions, so a single
bad gap does not smear across everything below it.

**1. Feature-grid cards, mobile — the big one.** 18px short per card,
compounding to −166px by the twelfth. Two causes of exactly 8 and 10: the live
icon's gap is 18px once it sits ABOVE the content rather than beside it (ours
kept the flex-sibling 10px), and the live widget container has a 10px bottom
padding that exists only below 768. The note in `icon-box.tsx` saying there is
none is still right — it was measured at desktop.

**2. Feature-grid CTA bands, mobile.** The two margins SWAP below 768: on
desktop the block is `0 0 20px` around an inner container of `20px 0` (a 91px
band); at mobile the inner goes to zero and the block keeps its 20px (51px).
Ours had it backwards, making each of the three bands 20px tall.

**3. The trial form's label rhythm, mobile.** The live label has a mobile step:
14px on a 23.625px line box with 2px below, against the desktop 16px/27px/10px.
That is 11px per row, and over seven stacked fields it ran the band 90px long.
Verified mobile-only: at 1920 the live label and ours are identical to the pixel,
so deviation 23's desktop measurement stands.

**4. Student Benefits list.** The live `ul` carries `margin: 8px 0 18px`, and
below 1025 the widget-wrap adds a further 10px each way — 18 above, 28 below.
At desktop the column's own `pt-[18px] pb-[28px]` already covers the same box,
so the new rule is scoped `max-desktop:` and the two never double up.

**5. Testimonials heading.** The quote widget contributes its own 20px at ≤1024
on top of the heading's 20px padding and 4px margin. Reading only the heading's
two values left the quote 20px high.

**6. The trial form's label step is TABLET-and-below, not mobile-only.** The
first pass scoped it `max-md:` and fixed 480 while leaving 1024 and 768 out by
45px — the live label measures 24px tall at 1024 too. Now `max-desktop:`, and
the form matches live's height exactly at 1024 (`dh 0`).

Because the trial row is `items-center`, a form that is too tall also pushes the
copy beside it down. That band read as two separate faults and was one.

**7. The FAQ heading needs THREE values**, for the same reason as the
testimonials heading: 20px on desktop, 24px across the tablet band where the
first question widget adds its own 20px, and back to 4px below 768 where that
margin is gone. `md:max-desktop:` expresses the 768–1024 band exactly.

**8. A cluster of mobile-only values** found by the same gap method: the trial
submit is 40px tall below 768 (not 50), the testimonials spacer is 40px (not
50), its author sits on a 30px line box, its button block keeps 20px under it
(not 40) and the button itself is 28px tall, and the FAQ button block keeps
none.

### Result

| width | elements >1px out | page height |
| ----- | ----------------- | ----------- |
| 1920  | **0**             | **0**       |
| 1200  | **0**             | **0**       |
| 1024  | **0**             | **0**       |
| 768   | **0**             | **0**       |
| 480   | **0**             | +5          |

Four of the five breakpoints are now exact in both axes. 480 is within 5px of
9976 — 0.05% — from two gaps that nearly cancel (`Connecticut → FAQs` +10 and
`FAQs → Contact Our Support Team` −3), both under the threshold where further
tuning would be chasing rounding rather than a rule.

Desktop was exact before this work and is exact after: every correction is
scoped to a band below 1025.

### The method, which is the reusable part

Compare the GAP between every consecutive pair of landmarks, not their absolute
positions. One bad gap otherwise smears across everything below it and looks
like a dozen faults in a dozen sections. The gap view named each cause exactly
once, and each fix collapsed one row of the report.

A text-keyed signature (`TAG|first 32 chars`) matches live and local elements
without shared selectors, which is what makes this work across two completely
different DOMs.

## Open questions — awaiting a visual decision

Do not resolve these unilaterally.

- **Sub-1024 parity has never been agreed.** The live site does have tablet and
  mobile rules and our page does not match them: −344px of page height at 1024,
  −108px at 768, with every anchor out at 1024. Requirement 2 asks for parity at
  every viewport; requirement 3 adds responsiveness the live site does not have.
  Those two pull in opposite directions below 1025 and the conflict has never
  been resolved, only logged as deviation 2. Decide which wins before any further
  work below 1024 — the answer changes whether this is a bug list or a feature.

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
