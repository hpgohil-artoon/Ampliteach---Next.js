import Link from "next/link";
import { PRICING_PAGE } from "@/content/pricing-plans";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Container, Section } from "@/components/common";

export function EnterprisePricing() {
  const { enterprise } = PRICING_PAGE;

  return (
    <Section tone="muted">
      <Container size="narrow">
        <Card>
          <CardContent className="flex flex-col items-center gap-4 text-center">
            <h2 className="font-heading text-h3 text-balance">{enterprise.heading}</h2>
            <p className="text-muted-foreground leading-relaxed">{enterprise.body}</p>
            <p className="font-heading text-xl font-semibold">{enterprise.priceLabel}</p>
            <Button asChild size="lg">
              <Link href={enterprise.cta.href}>{enterprise.cta.label}</Link>
            </Button>
          </CardContent>
        </Card>
      </Container>
    </Section>
  );
}
