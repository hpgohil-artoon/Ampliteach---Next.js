import { SITE } from "@/content/site";

/**
 * The copyright bar — live section `ac7a524`, below the main footer.
 *
 *   ground   `#000`, FULL WIDTH (not the 1220px box), `padding: 20px 0 10px`
 *   text     16px/1.4em, white, centred, `letter-spacing: .5px` · 13px ≤767
 *   spacing  the widget adds `margin: 8px 0 17px`
 *
 * Those numbers are the whole height: 20 + 10 (column gap) + 8 + 22.4 (the
 * 16px line box) + 17 + 10 + 10 = **97.4px**, and the live bar measures 97.
 *
 * The live section also paints an `elementor-background-overlay` of `#000` at
 * 50% opacity on top of its `#000` background. Black over black is black, so
 * the overlay element is not reproduced — it changes nothing.
 *
 * The year is generated rather than hard-coded. Under `output: 'export'` it is
 * baked at build time, so a site left unbuilt across New Year would show the
 * old year — worth a scheduled rebuild, and the alternative (a client
 * component just for a number) costs more than it saves.
 */
export function FooterCopyright() {
  const year = new Date().getFullYear();

  return (
    <section className="bg-black py-[20px] pb-[10px]">
      {/* `p-2.5`, not `px-2.5`: Elementor's default column gap is 10px on all
       * four sides, and its two vertical halves are 20 of the bar's 97px. */}
      <div className="p-2.5">
        {/* The live copy has a stray space before the full stop — "AmpliTeach .
         * All Rights Reserved." — and it is visible on the page. Reproduced
         * verbatim rather than silently tidied; see PARITY. */}
        <p className="my-[8px] mb-[17px] text-center text-[13px] leading-[1.4] tracking-[0.5px] text-white md:text-[16px]">
          © {year} — {SITE.name} . All Rights Reserved.
        </p>
      </div>
    </section>
  );
}
