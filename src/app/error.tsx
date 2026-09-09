"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Container, Section } from "@/components/common";

/** Error boundaries must be client components. */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Swap for your error reporter (Sentry, etc.) when one is chosen.
    console.error(error);
  }, [error]);

  return (
    <Section spacing="loose">
      <Container size="narrow" className="flex flex-col items-center gap-6 text-center">
        <h1 className="font-heading text-h1">Something went wrong</h1>
        <p className="text-muted-foreground">
          The page failed to load. Try again, and if it keeps happening let us know.
        </p>
        <Button onClick={reset}>Try again</Button>
      </Container>
    </Section>
  );
}
