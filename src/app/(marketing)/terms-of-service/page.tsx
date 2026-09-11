import { TermsOfServicePage } from "@/features/legal";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Terms of Service",
  description: "The terms that govern your use of AmpliTeach.",
  path: "/terms-of-service",
});

export default function Page() {
  return <TermsOfServicePage />;
}
