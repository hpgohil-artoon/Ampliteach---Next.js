import NextImage, { type ImageProps } from "next/image";
import { IS_STATIC_EXPORT } from "@/config/env";

/**
 * The only place next/image is used.
 *
 * Under static export there is no image optimizer, so `unoptimized` is forced
 * on. Because every image in the app goes through this wrapper, switching
 * hosting later is a one-line change instead of a find-and-replace.
 */
export function Img({ alt, ...props }: ImageProps) {
  return <NextImage alt={alt} unoptimized={IS_STATIC_EXPORT || undefined} {...props} />;
}
