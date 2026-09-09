import { IS_STATIC_EXPORT } from "@/config/env";

export class ApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly url: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

type RequestOptions = {
  /** Cache tags for revalidateTag(). Ignored under static export. */
  tags?: string[];
  /** Seconds. Ignored under static export — there is no runtime to revalidate on. */
  revalidate?: number;
  searchParams?: Record<string, string | number | undefined>;
};

/**
 * The single fetch wrapper. Nothing outside src/lib/api calls fetch directly.
 *
 * Under static export every request runs at BUILD time and the result is baked
 * into the HTML, so `tags` and `revalidate` are inert. Keeping them in the
 * signature means switching NEXT_BUILD_MODE=server turns ISR on with no code
 * changes anywhere else.
 */
export async function apiGet<T>(url: string, options: RequestOptions = {}): Promise<T> {
  const target = new URL(url);

  for (const [key, value] of Object.entries(options.searchParams ?? {})) {
    if (value !== undefined) target.searchParams.set(key, String(value));
  }

  const response = await fetch(target, {
    headers: { Accept: "application/json" },
    ...(IS_STATIC_EXPORT
      ? { cache: "force-cache" }
      : { next: { tags: options.tags, revalidate: options.revalidate ?? 3600 } }),
  });

  if (!response.ok) {
    throw new ApiError(
      `GET ${target.pathname} failed with ${response.status}`,
      response.status,
      target.toString(),
    );
  }

  return response.json() as Promise<T>;
}

/**
 * Reads a header from a response — WordPress returns pagination totals in
 * X-WP-Total / X-WP-TotalPages, which we need for the blog index.
 */
export async function apiGetWithHeaders<T>(
  url: string,
  options: RequestOptions = {},
): Promise<{ data: T; headers: Headers }> {
  const target = new URL(url);

  for (const [key, value] of Object.entries(options.searchParams ?? {})) {
    if (value !== undefined) target.searchParams.set(key, String(value));
  }

  const response = await fetch(target, {
    headers: { Accept: "application/json" },
    ...(IS_STATIC_EXPORT
      ? { cache: "force-cache" }
      : { next: { tags: options.tags, revalidate: options.revalidate ?? 3600 } }),
  });

  if (!response.ok) {
    throw new ApiError(
      `GET ${target.pathname} failed with ${response.status}`,
      response.status,
      target.toString(),
    );
  }

  return { data: (await response.json()) as T, headers: response.headers };
}
