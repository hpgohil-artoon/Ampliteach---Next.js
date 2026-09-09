import { buildMetadata } from "@/lib/seo";
import { Container, Section, SectionHeading } from "@/components/common";

export const metadata = buildMetadata({
  title: "Terms of Service",
  description: "The terms that govern your use of AmpliTeach.",
  path: "/terms-of-service",
});

/** TODO: same as the privacy policy — awaiting the client's approved copy. */
export default function TermsOfServicePage() {
  return (
    <Section>
      <Container size="narrow" className="flex flex-col gap-8">
        <SectionHeading as="h1" title="Terms of Service" align="left" />
        <p className="text-muted-foreground">Terms copy to be supplied by the client.</p>
      </Container>
    </Section>
  );
}
