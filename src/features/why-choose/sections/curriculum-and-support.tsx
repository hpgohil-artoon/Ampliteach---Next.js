import { WHY_CHOOSE } from "@/content/why-choose";
import { Card, CardContent } from "@/components/ui/card";
import { Container, Section } from "@/components/common";

export function CurriculumAndSupport() {
  return (
    <Section>
      <Container className="grid gap-8 md:grid-cols-2">
        {WHY_CHOOSE.blocks.map((block) => (
          <Card key={block.heading} className="h-full">
            <CardContent className="flex flex-col gap-3">
              <h2 className="font-heading text-h4 text-balance">{block.heading}</h2>
              <p className="text-muted-foreground leading-relaxed">{block.body}</p>
            </CardContent>
          </Card>
        ))}
      </Container>
    </Section>
  );
}
