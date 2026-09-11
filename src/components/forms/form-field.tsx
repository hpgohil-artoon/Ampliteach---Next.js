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
    // The live Elementor form rhythm, which every form on the site shares —
    // and it is built from MARGINS, not from a flex `gap`. Measured off the
    // live trial form, per row:
    //
    //   label   margin 10px 0, line box 27px   → first label sits 10px in
    //   control 41px, margin-bottom 15px
    //   pitch   10 + 27 + 10 + 41 + 15 = 103px, the live label-to-label step
    //
    // A `gap-3` + `mb-[26px]` pair reaches the same 103px total, which is why
    // this looked right, but it distributes the space differently: the label
    // landed 10px high and the control 11px high inside every row. Margins do
    // not collapse in a flex column, so the 15px below and the 10px above the
    // next label stay distinct, exactly as they do live.
    <div className={cn("mb-[15px] flex flex-col", className)}>
      <Label
        htmlFor={name}
        // `font-body`, NOT the inherited bare `Poppins` — the live labels
        // declare `Roboto, sans-serif` like the copy beside them, so they land
        // on Arial while the serif fallback is left to the footer and bullets.
        // 16px/400 with a 27px line box, not shadcn's 14px/500 and not
        // Tailwind's paired 24px.
        className={cn(
          "font-body my-[10px] text-base leading-[27px] font-normal",
          inverse && "text-primary-foreground",
          labelClassName,
        )}
      >
        {/* The asterisk is part of the label's OWN text run, not a coloured
         * span. The live label is a single text node — `" First name*"` — so
         * its asterisk inherits the label's colour and metrics; a
         * `text-destructive` span made it crimson and, being a separate flex
         * item, also picked up the label's gap. Measured: live "First name*"
         * inks 81.8px, which is "First name" at 75.58 plus the asterisk. */}
        {required ? `${label}*` : label}
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
