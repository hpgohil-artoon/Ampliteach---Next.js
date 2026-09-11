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
  labelClassName,
  tone = "default",
  children,
}: {
  name: string;
  label: string;
  error?: string;
  required?: boolean;
  hint?: string;
  className?: string;
  labelClassName?: string;
  /**
   * `inverse` is for a form sitting on a coloured ground — the trial band is
   * brand red, where the default muted grey and `--destructive` red are both
   * invisible. The live site does the same: it recolours its validation tips
   * to white for exactly this section.
   */
  tone?: "default" | "inverse";
  children: ReactNode;
}) {
  const errorId = `${name}-error`;
  const hintId = `${name}-hint`;
  const inverse = tone === "inverse";

  return (
    // The live Elementor form rhythm, which every form on the site shares.
    // Solved from the trial band's measured positions, and the four values are
    // mutually consistent: a 24px label box, 12px to the control, a 41px
    // control and 26px beneath give the live 103px field-row pitch exactly,
    // and the whole band then comes out at its measured 666px.
    <div className={cn("mb-[26px] flex flex-col gap-3", className)}>
      <Label
        htmlFor={name}
        // `font-body`, NOT the inherited Poppins. Measured: live "Last name"
        // is 72px wide, Poppins renders it at 81px with the same 12px cap
        // height — the live labels are set in the body stack, like the copy
        // beside them. 16px/400 too, not shadcn's 14px/500.
        className={cn(
          "font-body text-base leading-normal font-normal",
          inverse && "text-primary-foreground",
          labelClassName,
        )}
      >
        {/* One flex item, so the asterisk sits in normal text flow 2px after
         * the last letter as it does live. Left as a direct child it becomes
         * a flex item of `Label` and picks up its `gap`, which put an 11px
         * hole before it. */}
        <span>
          {label}
          {required ? (
            <span className={inverse ? undefined : "text-destructive"} aria-hidden>
              *
            </span>
          ) : null}
        </span>
      </Label>

      {children}

      {hint && !error ? (
        <p
          id={hintId}
          className={cn("text-xs", inverse ? "text-primary-foreground" : "text-muted-foreground")}
        >
          {hint}
        </p>
      ) : null}

      {error ? (
        <p
          id={errorId}
          role="alert"
          className={cn("text-xs", inverse ? "text-primary-foreground" : "text-destructive")}
        >
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
