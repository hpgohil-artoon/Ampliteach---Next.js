import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Container } from "./container";
import { ParticleDecor } from "./particle-decor";
import { Section } from "./section";

/** The repeated "start your trial" band. Used ~10× across the site. */
export function CtaBanner({
  heading,
  body,
  cta,
}: {
  heading: string;
  body: string;
  cta: { label: string; href: string };
}) {
  const isExternal = cta.href.startsWith("http");

  return (
    <Section tone="accent" className="overflow-hidden">
      <ParticleDecor />
      <Container size="narrow" className="relative text-center">
        <h2 className="font-heading text-3xl font-bold tracking-tight text-balance sm:text-4xl">
          {heading}
        </h2>
        <p className="text-primary-foreground/80 mx-auto mt-4 max-w-2xl text-lg leading-relaxed">
          {body}
        </p>
        <Button asChild size="lg" variant="secondary" className="mt-8">
          <Link
            href={cta.href}
            {...(isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
          >
            {cta.label}
          </Link>
        </Button>
      </Container>
    </Section>
  );
}
