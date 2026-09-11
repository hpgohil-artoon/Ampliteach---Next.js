import type { NextConfig } from "next";

/**
 * Build mode
 * ----------
 * Default is `export` — a fully static site that can be dropped on S3 +
 * CloudFront with no Node runtime. Set NEXT_BUILD_MODE=server to build for a
 * Node host (Vercel / Amplify / Docker) instead, which unlocks ISR and Route
 * Handlers.
 *
 * The default is deliberately the MORE restrictive mode: if a feature that S3
 * cannot support sneaks into the code, `npm run build` fails today rather than
 * on deployment day. See docs/nextjs-architecture-plan.html.
 */
const isStaticExport = process.env.NEXT_BUILD_MODE !== "server";

/**
 * The host the CMS serves uploaded media from.
 *
 * Editors pick images in the CMS, so their URLs are absolute and point at the
 * CMS's own domain — next/image refuses a remote host that is not listed here.
 * This file is one of the two places allowed to read process.env directly (the
 * other is src/config/env.ts); next.config cannot import from src.
 */
const cmsMediaHost = process.env.NEXT_PUBLIC_CMS_MEDIA_HOST;

const nextConfig: NextConfig = {
  output: isStaticExport ? "export" : undefined,

  // Emits `/pricing/index.html` instead of `/pricing.html`, so CloudFront can
  // serve clean URLs from S3 without a rewrite function. Also matches the
  // existing WordPress URLs, which all end in a slash.
  trailingSlash: true,

  images: {
    // The Next.js image optimizer needs a server. Under static export the
    // <Img> wrapper falls back to plain, pre-sized images.
    unoptimized: isStaticExport,
    remotePatterns: [
      { protocol: "https" as const, hostname: "www.ampliteach.com" },
      { protocol: "https" as const, hostname: "ampliteach.com" },
      ...(cmsMediaHost ? [{ protocol: "https" as const, hostname: cmsMediaHost }] : []),
    ],
  },

  typescript: { ignoreBuildErrors: false },

  // NOTE: `redirects`, `rewrites`, `headers` and middleware are all ignored
  // under `output: 'export'`. If we ever need them on S3 they have to be
  // implemented as a CloudFront Function instead.
};

export default nextConfig;
