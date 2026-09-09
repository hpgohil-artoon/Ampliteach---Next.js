import type { ReactNode } from "react";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

/**
 * Label + control + error message, wired for accessibility.
 *
 * A deliberately small local wrapper instead of shadcn's <Form> stack: this
 * site has four short forms, and this keeps each form file under 70 lines
 * without pulling in a context provider per field.
 */
export function FormField({
  name,
  label,
  error,
  required,
  hint,
  className,
  children,
}: {
  name: string;
  label: string;
  error?: string;
  required?: boolean;
  hint?: string;
  className?: string;
  children: ReactNode;
}) {
  const errorId = `${name}-error`;
  const hintId = `${name}-hint`;

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <Label htmlFor={name}>
        {label}
        {required ? (
          <span className="text-destructive" aria-hidden>
            *
          </span>
        ) : null}
      </Label>

      {children}

      {hint && !error ? (
        <p id={hintId} className="text-muted-foreground text-xs">
          {hint}
        </p>
      ) : null}

      {error ? (
        <p id={errorId} role="alert" className="text-destructive text-xs">
          {error}
        </p>
      ) : null}
    </div>
  );
}

/** Props to spread onto the control so it announces its own error state. */
export function fieldA11y(name: string, error?: string) {
  return {
    id: name,
    "aria-invalid": error ? true : undefined,
    "aria-describedby": error ? `${name}-error` : undefined,
  } as const;
}
