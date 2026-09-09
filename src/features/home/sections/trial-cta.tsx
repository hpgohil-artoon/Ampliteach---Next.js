import { TRIAL_CTA } from "@/content/home";
import { TrialSignupForm } from "@/components/forms";
import { Container, Section, SectionHeading } from "@/components/common";
import { Card, CardContent } from "@/components/ui/card";

export function TrialCta() {
  return (
    <Section id="free-trial">
      <Container size="narrow" className="flex flex-col gap-10">
        <SectionHeading
          title={TRIAL_CTA.heading}
          description={TRIAL_CTA.body}
          eyebrow="Free Trial"
        />

        <Card>
          <CardContent>
            <TrialSignupForm privacyNote={TRIAL_CTA.privacyNote} />
          </CardContent>
        </Card>
      </Container>
    </Section>
  );
}
