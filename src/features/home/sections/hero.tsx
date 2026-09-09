import Link from "next/link";
import { HERO } from "@/content/home";
import { Button } from "@/components/ui/button";
import { Container, ParticleDecor, Section } from "@/components/common";

export function Hero() {
  return (
    <Section spacing="loose" className="overflow-hidden">
      <ParticleDecor />
      <Container className="relative grid items-center gap-12 lg:grid-cols-2">
        <div className="flex flex-col items-start gap-6">
          <h1 className="font-heading text-h1 text-balance">{HERO.heading}</h1>
          <p className="text-muted-foreground max-w-xl text-lg leading-relaxed">{HERO.body}</p>
          <Button asChild size="lg">
            <Link href={HERO.cta.href} target="_blank" rel="noopener noreferrer">
              {HERO.cta.label}
            </Link>
          </Button>
        </div>

        {/* TODO: drop the real hero asset into public/images/ and enable <Img>. */}
        <div className="bg-muted aspect-4/3 w-full rounded-xl" aria-hidden />
      </Container>
    </Section>
  );
}
