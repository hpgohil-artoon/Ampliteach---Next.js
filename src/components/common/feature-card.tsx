import type { Feature } from "@/types";
import { ICONS } from "@/lib/icons";
import { Card, CardContent } from "@/components/ui/card";
import { RichText } from "./rich-text";

/** Used 12× on the homepage and 9× on Features & Benefits. */
export function FeatureCard({ title, description, icon }: Feature) {
  // A lookup in a module-level table, not a component built here: an unknown
  // name from the CMS drops the icon instead of breaking the card.
  const Icon = icon ? (ICONS[icon] ?? null) : null;

  return (
    <Card className="h-full transition-shadow hover:shadow-md">
      <CardContent className="flex flex-col gap-3">
        {Icon ? (
          <span className="bg-primary/10 text-primary flex size-11 items-center justify-center rounded-lg">
            <Icon className="size-5" aria-hidden />
          </span>
        ) : null}
        <h3 className="font-heading text-h5">{title}</h3>
        <p className="text-muted-foreground text-sm leading-relaxed">
          <RichText runs={description} />
        </p>
      </CardContent>
    </Card>
  );
}
