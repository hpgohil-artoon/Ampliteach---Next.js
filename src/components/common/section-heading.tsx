import { cn } from "@/lib/utils";

/**
 * Every section title on the site. Because it is one component, changing the
 * heading scale is a one-file edit rather than forty.
 */
export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
  as: Tag = "h2",
  className,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  as?: "h1" | "h2" | "h3";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3",
        align === "center" && "mx-auto max-w-3xl text-center",
        className,
      )}
    >
      {eyebrow ? (
        <p className="text-primary text-xs font-semibold tracking-[0.16em] uppercase">{eyebrow}</p>
      ) : null}

      <Tag
        className={cn(
          "font-heading text-balance",
          Tag === "h1"
            ? "text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl"
            : "text-3xl font-bold tracking-tight sm:text-4xl",
        )}
      >
        {title}
      </Tag>

      {description ? (
        <p className="text-muted-foreground text-lg leading-relaxed">{description}</p>
      ) : null}
    </div>
  );
}
