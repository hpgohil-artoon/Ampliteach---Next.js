import { CONTACT_PAGE } from "@/content/contact";
import { Container, Section, SectionHeading } from "@/components/common";

export function ContactHero() {
  return (
    <Section spacing="tight">
      <Container size="narrow">
        <SectionHeading as="h1" title={CONTACT_PAGE.heading} description={CONTACT_PAGE.body} />
      </Container>
    </Section>
  );
}
