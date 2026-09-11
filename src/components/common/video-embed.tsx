"use client";

import { useState } from "react";
import { Img } from "./img";

/**
 * A lazy YouTube embed behind a poster, matching the live site's Elementor
 * video widget (`lazy_load: yes`, `show_image_overlay: yes`,
 * `elementor-open-inline`): nothing from youtube.com loads until someone asks
 * for it, which is the entire point of the widget's lazy mode.
 *
 * Deliberately draws NO play button. The live markup has no
 * `.elementor-custom-embed-play` element — just the overlay div — because the
 * poster is a screenshot of the YouTube player with the badge, title bar and
 * avatar already baked in. Adding our own would show two.
 *
 * 16:9 is the widget's `aspect_ratio: 169`, and the poster ships at exactly
 * that ratio, so the image fills the box with nothing cropped.
 */
export function VideoEmbed({
  youtubeId,
  poster,
  title,
}: {
  youtubeId: string;
  /** Null while artwork is pending — the trigger renders as an empty panel. */
  poster: { src: string; width: number; height: number } | null;
  title: string;
}) {
  const [playing, setPlaying] = useState(false);

  if (playing) {
    return (
      <div className="relative aspect-video w-full overflow-hidden">
        <iframe
          className="absolute inset-0 size-full"
          src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1&rel=0`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setPlaying(true)}
      aria-label={`Play video: ${title}`}
      className="focus-visible:ring-ring/50 bg-muted relative block aspect-video w-full cursor-pointer overflow-hidden focus-visible:ring-3 focus-visible:outline-none"
    >
      {poster ? (
        <Img
          src={poster.src}
          alt=""
          width={poster.width}
          height={poster.height}
          className="absolute inset-0 size-full object-cover"
        />
      ) : null}
    </button>
  );
}
