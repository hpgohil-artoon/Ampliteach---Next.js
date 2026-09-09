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
      { protocol: "https", hostname: "www.ampliteach.com" },
      { protocol: "https", hostname: "ampliteach.com" },
    ],
  },

  typescript: { ignoreBuildErrors: false },

  // NOTE: `redirects`, `rewrites`, `headers` and middleware are all ignored
  // under `output: 'export'`. If we ever need them on S3 they have to be
  // implemented as a CloudFront Function instead.
};

export default nextConfig;
