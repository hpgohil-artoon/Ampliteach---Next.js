import { WHY_CHOOSE } from "@/content/why-choose";
import { Card, CardContent } from "@/components/ui/card";
import { Container, Section } from "@/components/common";

export function PitchBlocks() {
  return (
    <Section tone="muted">
      <Container className="grid gap-8 lg:grid-cols-3">
        {WHY_CHOOSE.pitchBlocks.map((block) => (
          <Card key={block.heading} className="h-full">
            <CardContent className="flex flex-col gap-3">
              <h2 className="font-heading text-h5 text-balance">{block.heading}</h2>
              <p className="text-muted-foreground text-sm leading-relaxed">{block.body}</p>
            </CardContent>
          </Card>
        ))}
      </Container>
    </Section>
  );
}
