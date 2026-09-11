import { z } from "zod";

/**
 * Environment access, validated once.
 *
 * Import `env` instead of touching process.env anywhere else — a typo in a
 * variable name then fails the build with a readable message instead of
 * silently rendering `undefined` into a canonical URL.
 */
const schema = z.object({
  NEXT_PUBLIC_SITE_URL: z.string().url().default("http://localhost:3000"),
  CMS_API_URL: z.string().url().optional(),
  /** Hostname only (no scheme) — mirrored in next.config.ts's remotePatterns. */
  NEXT_PUBLIC_CMS_MEDIA_HOST: z.string().optional().or(z.literal("")),
  NEXT_PUBLIC_FORM_ENDPOINT: z.string().url().optional().or(z.literal("")),
  NEXT_BUILD_MODE: z.enum(["server", "export"]).optional(),
  NEXT_PUBLIC_GA_ID: z.string().optional().or(z.literal("")),
});

const parsed = schema.safeParse({
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  CMS_API_URL: process.env.CMS_API_URL,
  NEXT_PUBLIC_CMS_MEDIA_HOST: process.env.NEXT_PUBLIC_CMS_MEDIA_HOST,
  NEXT_PUBLIC_FORM_ENDPOINT: process.env.NEXT_PUBLIC_FORM_ENDPOINT,
  NEXT_BUILD_MODE: process.env.NEXT_BUILD_MODE,
  NEXT_PUBLIC_GA_ID: process.env.NEXT_PUBLIC_GA_ID,
});

if (!parsed.success) {
  throw new Error(
    `Invalid environment variables:\n${JSON.stringify(parsed.error.flatten().fieldErrors, null, 2)}`,
  );
}

export const env = parsed.data;

/** True when building the S3-safe static bundle (the default). */
export const IS_STATIC_EXPORT = env.NEXT_BUILD_MODE !== "server";
