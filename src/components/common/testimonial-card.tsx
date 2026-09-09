import { Quote } from "lucide-react";
import type { Testimonial } from "@/types";
import { Card, CardContent } from "@/components/ui/card";

export function TestimonialCard({ quote, author, location, role }: Testimonial) {
  return (
    <Card className="h-full">
      <CardContent className="flex h-full flex-col gap-5">
        <Quote className="text-primary/30 size-8" aria-hidden />
        <blockquote className="flex-1 text-lg leading-relaxed">{quote}</blockquote>
        <footer className="text-sm">
          <p className="font-semibold">{author}</p>
          <p className="text-muted-foreground">{[role, location].filter(Boolean).join(" · ")}</p>
        </footer>
      </CardContent>
    </Card>
  );
}
