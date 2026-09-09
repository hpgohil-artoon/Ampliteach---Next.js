import { WHY_CHOOSE } from "@/content/why-choose";
import { Container, Section } from "@/components/common";

export function ProfitClaim() {
  return (
    <Section tone="muted" spacing="tight">
      <Container size="narrow" className="text-center">
        <h2 className="font-heading text-h2 text-balance">{WHY_CHOOSE.profitClaim.heading}</h2>
        <p className="text-muted-foreground mt-4 text-lg leading-relaxed">
          {WHY_CHOOSE.profitClaim.body}
        </p>
      </Container>
    </Section>
  );
}
