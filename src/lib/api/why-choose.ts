import { cache } from "react";
import type { WhyChoosePageContent } from "@/types";
import { WHY_CHOOSE_PAGE } from "@/content/why-choose";
import { parseWhyChoosePageContent } from "@/lib/cms/page-content";
import { getPageContent } from "./pages";

/**
 * The why-choose page's content: the CMS's if it has any, ours otherwise.
 *
 * `cache()` because both `generateMetadata` and the page itself need it — this
 * makes that one CMS request per build instead of two.
 */
export const getWhyChooseContent = cache(async (): Promise<WhyChoosePageContent> => {
  return getPageContent("why-choose", WHY_CHOOSE_PAGE, parseWhyChoosePageContent);
});
