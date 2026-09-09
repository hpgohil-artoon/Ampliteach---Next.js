import { buildMetadata } from "@/lib/seo";
import { Container, Section, SectionHeading } from "@/components/common";

export const metadata = buildMetadata({
  title: "Privacy Policy",
  description: "How AmpliTeach collects, uses and protects your information.",
  path: "/privacy-policy",
});

/**
 * TODO: paste the client's approved policy copy into src/content/legal.ts and
 * render it here. Kept as a stub so the route, nav link and sitemap entry all
 * exist from day one.
 */
export default function PrivacyPolicyPage() {
  return (
    <Section>
      <Container size="narrow" className="flex flex-col gap-8">
        <SectionHeading as="h1" title="Privacy Policy" align="left" />
        <p className="text-muted-foreground">Policy copy to be supplied by the client.</p>
      </Container>
    </Section>
  );
}
