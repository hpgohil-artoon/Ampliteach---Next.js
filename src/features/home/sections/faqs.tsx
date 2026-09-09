import { HOME_FAQS } from "@/content/faqs";
import { faqJsonLd } from "@/lib/seo";
import { Container, Section, SectionHeading } from "@/components/common";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

/**
 * The accordion is a client component (shadcn/Radix), but this section stays a
 * Server Component — only the accordion leaf ships JavaScript.
 */
export function Faqs() {
  return (
    <Section id="faqs">
      <Container size="narrow" className="flex flex-col gap-10">
        <SectionHeading title="FAQs" eyebrow="Questions" />

        <Accordion type="single" collapsible className="w-full">
          {HOME_FAQS.map((faq, index) => (
            <AccordionItem key={faq.question} value={`faq-${index}`}>
              <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </Container>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(HOME_FAQS)) }}
      />
    </Section>
  );
}
