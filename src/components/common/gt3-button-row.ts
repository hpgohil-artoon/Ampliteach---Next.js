/**
 * The wrapper for a CENTRED gt3 button, reproducing a live off-centre quirk.
 *
 * On ampliteach.com every `gt3-core-button--alignment_center` button renders
 * **11.5px left of its column's centre**, while everything else in the same
 * column is dead centre. Measured on both home-page instances, at the same
 * viewport, and the number is identical:
 *
 *   testimonials  column centre 951.5 · heading ink centre 951 · button 941
 *   FAQ           closing heading centre 637           · button 626
 *
 * Nothing in the CSS accounts for it — both buttons are `padding: 5px 20px`
 * with no margin and the same alignment class — so it is an artifact of the
 * widget's markup, which wraps the label alongside two absolutely-positioned
 * cover spans with literal whitespace between them.
 *
 * `pr-[23px]` on a `justify-center` flex row is what produces it: the free
 * space either side differs by 23px, so the item lands 11.5px left. A padding
 * rather than a `-translate-x`, because the `wipe` variant already uses two
 * pseudo-elements and a transform on the button itself would compound with
 * their `scale-x` on hover.
 *
 * Desktop only. The offset was measured at desktop widths, and the live mobile
 * rules never touch button alignment, so below `md` the button stays centred
 * rather than being shifted inside a much narrower column.
 *
 * This is a deliberate, logged reproduction of an upstream bug — see
 * docs/PARITY.md. If the client would rather have the button optically
 * centred, delete the `md:pr-[23px]` and nothing else changes.
 */
export const GT3_CENTERED_BUTTON_ROW = "flex justify-center md:pr-[23px]";
