import { CONTACT_PAGE } from "@/content/contact";
import { Container, MapEmbed, Section } from "@/components/common";

export function ContactMap() {
  return (
    <Section spacing="tight" tone="muted">
      <Container>
        <MapEmbed src={CONTACT_PAGE.map.src} title={CONTACT_PAGE.map.title} />
      </Container>
    </Section>
  );
}
