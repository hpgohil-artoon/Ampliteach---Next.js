import { TESTIMONIALS, TESTIMONIALS_HEADING } from "@/content/testimonials";
import { Container, Section, SectionHeading, TestimonialCard } from "@/components/common";

export function Testimonials() {
  return (
    <Section tone="muted">
      <Container className="flex flex-col gap-10">
        <SectionHeading title={TESTIMONIALS_HEADING} />

        <ul className="mx-auto grid w-full max-w-4xl gap-6 md:grid-cols-2">
          {TESTIMONIALS.map((testimonial) => (
            <li key={testimonial.author} className="md:col-span-2">
              <TestimonialCard {...testimonial} />
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  );
}
