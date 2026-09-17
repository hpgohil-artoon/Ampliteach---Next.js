import type { Metadata } from "next";
import { WhyChoosePage } from "@/features/why-choose";
import { getWhyChooseContent } from "@/lib/api";
import { buildPageMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata(await getWhyChooseContent());
}

export default async function Page() {
  return <WhyChoosePage content={await getWhyChooseContent()} />;
}
