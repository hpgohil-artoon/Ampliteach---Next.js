import { BUILD_MY_BIZ } from "@/content/features";
import { Container, ParticleDecor, Section, SectionHeading } from "@/components/common";

export function BuildMyBiz() {
  return (
    <Section className="overflow-hidden">
      <ParticleDecor />
      <Container className="relative flex flex-col gap-10">
        <SectionHeading title={BUILD_MY_BIZ.heading} description={BUILD_MY_BIZ.intro} />
        <ul className="mx-auto grid w-full max-w-4xl gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {BUILD_MY_BIZ.items.map((item) => (
            <li key={item} className="border-border bg-card rounded-lg border px-4 py-3 text-sm">
              {item}
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  );
}
