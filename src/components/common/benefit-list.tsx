import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export function BenefitList({
  items,
  className,
}: {
  items: readonly string[];
  className?: string;
}) {
  return (
    <ul className={cn("flex flex-col gap-3", className)}>
      {items.map((item) => (
        <li key={item} className="flex items-start gap-3">
          <Check className="text-primary mt-1 size-4 shrink-0" aria-hidden />
          <span className="text-muted-foreground leading-relaxed">{item}</span>
        </li>
      ))}
    </ul>
  );
}
