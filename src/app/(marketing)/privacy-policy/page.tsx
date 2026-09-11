import { PrivacyPolicyPage } from "@/features/legal";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Privacy Policy",
  description: "How AmpliTeach collects, uses and protects your information.",
  path: "/privacy-policy",
});

export default function Page() {
  return <PrivacyPolicyPage />;
}
