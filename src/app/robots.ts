import type { MetadataRoute } from "next";
import { env } from "@/config/env";

/** Same requirement as sitemap.ts under `output: export`. */
export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  const base = env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");

  return {
    rules: [{ userAgent: "*", allow: "/" }],
    sitemap: `${base}/sitemap.xml`,
    host: base,
  };
}
