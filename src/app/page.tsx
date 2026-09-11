import type { Metadata } from "next";
import { HomePage } from "@/features/home";
import { buildPageMetadata } from "@/lib/seo";
import { getHomeContent } from "@/lib/api/home";

/** `getHomeContent` is React-cached, so both calls share one CMS request. */
export async function generateMetadata(): Promise<Metadata> {
  const content = await getHomeContent();
  return buildPageMetadata(content);
}

export default async function Page() {
  const content = await getHomeContent();
  return <HomePage content={content} />;
}
