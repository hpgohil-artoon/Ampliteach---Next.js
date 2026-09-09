import { CONTACT_PAGE } from "@/content/contact";
import { ContactForm } from "@/components/forms";
import { Card, CardContent } from "@/components/ui/card";
import { Container, Section } from "@/components/common";

export function ContactFormAndDetails() {
  return (
    <Section spacing="tight">
      <Container className="grid gap-10 lg:grid-cols-[1.4fr_1fr]">
        <Card>
          <CardContent>
            <ContactForm />
          </CardContent>
        </Card>

        <div className="flex flex-col gap-6">
          <h2 className="font-heading text-h4">Contact details</h2>
          <ul className="flex flex-col gap-5 text-sm">
            {CONTACT_PAGE.details.map((detail) => (
              <li key={detail.label} className="flex flex-col gap-1">
                <span className="text-muted-foreground text-xs font-semibold tracking-[0.14em] uppercase">
                  {detail.label}
                </span>
                <a
                  href={detail.href}
                  className="hover:text-primary"
                  {...(detail.href.startsWith("http")
                    ? { target: "_blank", rel: "noopener noreferrer" }
                    : {})}
                >
                  {detail.value}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </Section>
  );
}
