import Link from "next/link";
import { Check } from "lucide-react";
import type { PricingPlan } from "@/types";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";

export function PricingCard({ plan }: { plan: PricingPlan }) {
  const isExternal = plan.cta.href.startsWith("http");

  return (
    <Card className={cn("flex h-full flex-col", plan.featured && "border-primary shadow-md")}>
      <CardHeader className="flex flex-col gap-2">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-heading text-lg font-semibold">{plan.name}</h3>
          {plan.featured ? <Badge>Most popular</Badge> : null}
        </div>

        <p className="flex items-baseline gap-1">
          <span className="font-heading text-4xl font-bold tabular-nums">{plan.priceLabel}</span>
          {plan.priceMonthly !== null ? (
            <span className="text-muted-foreground text-sm">/month</span>
          ) : null}
        </p>

        <p className="text-muted-foreground text-sm">{plan.studentLimitLabel}</p>
      </CardHeader>

      <CardContent className="flex flex-1 flex-col gap-4">
        <p className="text-muted-foreground text-sm leading-relaxed">{plan.description}</p>

        <ul className="flex flex-col gap-2 text-sm">
          {plan.features.map((feature) => (
            <li key={feature} className="flex items-start gap-2.5">
              <Check className="text-primary mt-0.5 size-4 shrink-0" aria-hidden />
              <span className="text-muted-foreground">{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>

      <CardFooter>
        <Button asChild className="w-full" variant={plan.featured ? "default" : "outline"}>
          <Link
            href={plan.cta.href}
            {...(isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
          >
            {plan.cta.label}
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
