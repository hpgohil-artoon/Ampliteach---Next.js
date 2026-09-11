/**
 * The site's bullet: two dots, one black and one brand red, then the text.
 *
 * Both dots come from a SINGLE pseudo-element — a 7px circle plus a `box-shadow`
 * circle offset −18px — which is what guarantees they are the same size and on
 * the same baseline. Earlier attempts used the native `list-style` marker for
 * the black dot, and it cannot be made to cooperate: `::marker` takes its size
 * from a font-size, so it can only be nudged in whole-pixel jumps (18px → 5px,
 * 20px → 6px, 22px → 7px), and scaling it moves it horizontally too, because
 * the marker is right-aligned against the content edge. Drawing both dots
 * ourselves removes every one of those constraints.
 *
 * The geometry reproduces the live spacing exactly. Applied to an `<li>` inside
 * a `<ul>` that keeps its live `padding-left` — 80px in a feature card, 10px in
 * the Student Benefits list — it lands each part where the live site puts it:
 *
 *   red dot   at the list's content edge          (live: the `:before` glyph)
 *   black dot 18px to its left, so an 11px gap    (live: the `list-style` disc,
 *                                                  which hangs in the padding)
 *   text      17px in, so 10px after the red dot  (live: `margin-right: 10px`)
 *
 * `padding-left` on the `li` rather than a margin on the dots is what keeps
 * wrapped lines aligned with the TEXT instead of tucking under the dots — the
 * behaviour `list-style-position: outside` gives on the live site.
 *
 * `top-[10px]` centres the dots on the first line: the lists run a 27–28px line
 * box, so (27 − 7) / 2 = 10.
 */
export const BULLET =
  "relative pl-[17px] before:absolute before:top-[10px] before:left-0 before:size-[7px] before:rounded-full before:bg-primary before:shadow-[-18px_0_0_0_var(--color-foreground)] before:content-['']";
