import { cache } from "react";
import type { HomePageContent } from "@/types";
import { HOME_PAGE } from "@/content/home";
import { parseHomePageContent } from "@/lib/cms/page-content";
import { getPageContent } from "./pages";

/**
 * The home page's content: the CMS's if it has any, ours otherwise.
 *
 * `cache()` because both `generateMetadata` and the page itself need it — this
 * makes that one CMS request per build instead of two.
 */
export const getHomeContent = cache(async (): Promise<HomePageContent> => {
  return getPageContent("home", HOME_PAGE, parseHomePageContent);
});
