/**
 * Google Maps iframe. `loading="lazy"` keeps a third-party frame off the
 * critical path — it only loads when the user scrolls to it.
 */
export function MapEmbed({ src, title }: { src: string; title: string }) {
  return (
    <div className="border-border overflow-hidden rounded-xl border">
      <iframe
        src={src}
        title={title}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        className="block h-[320px] w-full border-0 sm:h-[400px]"
      />
    </div>
  );
}
