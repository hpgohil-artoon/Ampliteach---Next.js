import Link from "next/link";
import { ROUTES } from "@/lib/constants/routes";
import { Button } from "@/components/ui/button";
import { Container, Section } from "@/components/common";

/**
 * Replaces the WordPress /page-not-found/ page. Next.js serves this for any
 * unmatched route — it should NOT be recreated as a real route.
 */
export default function NotFound() {
  return (
    <Section spacing="loose">
      <Container size="narrow" className="flex flex-col items-center gap-6 text-center">
        <p className="text-primary font-heading text-6xl font-bold">404</p>
        <h1 className="font-heading text-3xl font-bold tracking-tight">Page not found</h1>
        <p className="text-muted-foreground">
          That page has moved or never existed. Try the blog or head back home.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Button asChild>
            <Link href={ROUTES.home}>Back to home</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href={ROUTES.blog}>Read the blog</Link>
          </Button>
        </div>
      </Container>
    </Section>
  );
}
