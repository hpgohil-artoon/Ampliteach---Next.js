import { env } from "@/config/env";
import { apiGet } from "./client";

/**
 * Fetches one page's content from the CMS, with the committed content as the
 * fallback.
 *
 * Three ways to end up on the fallback, all of them non-fatal:
 *   1. `CMS_API_URL` is unset — where we are today, so no request is made.
 *   2. The request fails (CMS down, 404, network).
 *   3. The payload fails validation — `parse` returns null.
 *
 * The page still builds in every case. A marketing site that 500s because the
 * CMS hiccupped during a deploy is a worse outcome than one showing the last
 * copy we committed.
 *
 * Under static export this runs at BUILD time and the result is baked into the
 * HTML, so publishing new copy means re-running the build (a CMS webhook).
 * Under `NEXT_BUILD_MODE=server` the same call revalidates on the `page:<slug>`
 * tag with no code change.
 */
export async function getPageContent<T>(
  slug: string,
  fallback: T,
  parse: (payload: unknown) => T | null,
): Promise<T> {
  if (!env.CMS_API_URL) return fallback;

  try {
    const payload = await apiGet<unknown>(`${env.CMS_API_URL}/pages/${slug}`, {
      tags: [`page:${slug}`],
    });

    return parse(payload) ?? fallback;
  } catch (error) {
    console.warn(`[pages] CMS fetch failed for "${slug}", using committed content.`, error);
    return fallback;
  }
}
