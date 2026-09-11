import type { SVGProps } from "react";

/**
 * The live site's contact glyphs, as inline SVG.
 *
 * ampliteach.com draws these with Font Awesome 5.15 **Solid** — `fa-phone-alt`
 * and `fa-envelope-open`. lucide's `Phone`/`MailOpen` are stroke icons with a
 * different silhouette and about 2px less optical weight at 14px, which is
 * visible in the header: the live envelope is a filled shape, lucide's is an
 * outline. So the outlines themselves are carried here, taken verbatim from
 * Font Awesome Free (Icons: CC BY 4.0).
 *
 * Same shape as `layout/social-icons.tsx` and for the same reason — the glyph is
 * part of the design, so it should not depend on an icon package's redraw.
 */
type IconProps = SVGProps<SVGSVGElement>;

const base = {
  viewBox: "0 0 512 512",
  fill: "currentColor",
  "aria-hidden": true,
} as const;

/** Font Awesome 5 Solid `phone-alt`. */
export function PhoneIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M497.39 361.8l-112-48a24 24 0 0 0-28 6.9l-49.6 60.6A370.66 370.66 0 0 1 130.6 204.11l60.6-49.6a23.94 23.94 0 0 0 6.9-28l-48-112A24.16 24.16 0 0 0 122.6.61l-104 24A24 24 0 0 0 0 48c0 256.5 207.9 464 464 464a24 24 0 0 0 23.4-18.6l24-104a24.29 24.29 0 0 0-14.01-27.6z" />
    </svg>
  );
}

/** Font Awesome 5 Solid `envelope-open`. */
export function EnvelopeOpenIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M512 464c0 26.51-21.49 48-48 48H48c-26.51 0-48-21.49-48-48V200.724a48 48 0 0 1 18.387-37.776c24.913-19.529 45.501-35.365 164.2-121.511C199.412 29.17 232.797-.347 256 .003c23.198-.354 56.596 29.172 73.413 41.433 118.687 86.137 139.303 101.995 164.2 121.512A48 48 0 0 1 512 200.724V464zm-65.666-196.605c-2.563-3.728-7.7-4.595-11.339-1.907-22.845 16.873-55.462 40.705-105.582 77.079-16.825 12.266-50.21 41.781-73.413 41.43-23.211.344-56.559-29.143-73.413-41.43-50.114-36.37-82.734-60.204-105.582-77.079-3.639-2.688-8.776-1.821-11.339 1.907l-9.072 13.196a7.998 7.998 0 0 0 1.839 10.967c22.887 16.899 55.454 40.69 105.303 76.868 20.274 14.781 56.524 47.813 92.264 47.573 35.724.242 71.961-32.771 92.263-47.573 49.85-36.179 82.418-59.97 105.303-76.868a7.998 7.998 0 0 0 1.839-10.967l-9.071-13.196z" />
    </svg>
  );
}

/**
 * Font Awesome 5 Solid `map-marked-alt`, the footer's address glyph.
 *
 * Its own viewBox — 576 wide against the other two's 512 — so `base` is spread
 * first and then overridden. Sizing it with a square utility would squash it.
 */
export function MapMarkedIcon(props: IconProps) {
  return (
    <svg {...base} viewBox="0 0 576 512" {...props}>
      <path d="M288 0c-69.59 0-126 56.41-126 126 0 56.26 82.35 158.8 113.9 196.02 6.39 7.54 17.82 7.54 24.2 0C331.65 284.8 414 182.26 414 126 414 56.41 357.59 0 288 0zm0 168c-23.2 0-42-18.8-42-42s18.8-42 42-42 42 18.8 42 42-18.8 42-42 42zM20.12 215.95A32.006 32.006 0 0 0 0 245.66v250.32c0 11.32 11.43 19.06 21.94 14.86L160 448V214.92c-8.84-15.98-16.07-31.54-21.25-46.42L20.12 215.95zM288 359.67c-14.07 0-27.38-6.18-36.51-16.96-19.66-23.2-40.57-49.62-59.49-76.72v182l192 64V266c-18.92 27.09-39.82 53.52-59.49 76.72-9.13 10.77-22.44 16.95-36.51 16.95zm266.06-198.51L416 224v288l139.88-55.95A31.996 31.996 0 0 0 576 426.34V176.02c0-11.32-11.43-19.06-21.94-14.86z" />
    </svg>
  );
}
