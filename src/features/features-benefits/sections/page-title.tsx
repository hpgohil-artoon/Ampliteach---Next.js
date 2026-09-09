import { ROUTES } from "@/lib/constants/routes";
import { Breadcrumbs } from "@/components/layout";
import { Container, Section } from "@/components/common";

export function PageTitle() {
  return (
    <Section spacing="tight" tone="muted">
      <Container className="flex flex-col gap-4">
        <Breadcrumbs
          items={[{ label: "Home", href: ROUTES.home }, { label: "Features & Benefits" }]}
        />
        <h1 className="font-heading text-h1">Features &amp; Benefits</h1>
      </Container>
    </Section>
  );
}
