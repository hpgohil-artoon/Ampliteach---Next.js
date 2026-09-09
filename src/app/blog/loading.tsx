import { Container, Section } from "@/components/common";
import { Skeleton } from "@/components/ui/skeleton";

/** Shown while the blog index streams in (server builds only). */
export default function BlogLoading() {
  return (
    <Section>
      <Container className="flex flex-col gap-12">
        <div className="mx-auto flex max-w-3xl flex-col items-center gap-4">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>

        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }, (_, index) => (
            <li key={index} className="flex flex-col gap-3">
              <Skeleton className="aspect-16/9 w-full rounded-xl" />
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-4 w-4/5" />
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  );
}
