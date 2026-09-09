import type { Feature } from "@/types";
import { Card, CardContent } from "@/components/ui/card";

/** Used 12× on the homepage and 9× on Features & Benefits. */
export function FeatureCard({ title, description, icon: Icon }: Feature) {
  return (
    <Card className="h-full transition-shadow hover:shadow-md">
      <CardContent className="flex flex-col gap-3">
        {Icon ? (
          <span className="bg-primary/10 text-primary flex size-11 items-center justify-center rounded-lg">
            <Icon className="size-5" aria-hidden />
          </span>
        ) : null}
        <h3 className="font-heading text-lg font-semibold">{title}</h3>
        <p className="text-muted-foreground text-sm leading-relaxed">{description}</p>
      </CardContent>
    </Card>
  );
}
