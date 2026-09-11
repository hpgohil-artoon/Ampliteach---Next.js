"use client";

import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { trialSchema, type TrialInput } from "@/lib/validation";
import { submitTrial } from "@/lib/api/forms";
import { Input } from "@/components/ui/input";
import { fieldA11y, FormField } from "./form-field";

/**
 * The 7-field homepage trial form, measured off the live section.
 *
 *   rows    flex, `gap: 40px` · 10px ≤1024 · stacked, gap 0 ≤599
 *   label   Roboto 16px/400 white, 12px above its control
 *   input   41px tall, full width, 26px below, white, 4px radius,
 *           `padding: 0 10px`, Roboto 14px/500 — a 103px field-row pitch
 *   submit  white on brand red, centred, 46px tall, 31px of side padding,
 *           35px below the email input's box
 *
 * Field order follows the live form exactly: name, then company and phone,
 * then website and student count, then email on its own full-width row.
 *
 * Everything is `tone="inverse"` because the band is brand red — the default
 * grey hint and red error would both disappear into it. The live site does the
 * same, recolouring its validation tips to white.
 */

/** Shared by all seven controls; the live input styling in one place. */
const FIELD =
  "bg-background text-foreground h-[41px] w-full rounded-[4px] border-0 px-[10px] py-0 text-[14px] font-medium";

/**
 * A two-column row. `gap-10` is the live 40px, dropping to 10px on tablet and
 * to nothing once the fields stack, where each group's own bottom margin
 * spaces them.
 *
 * The 40px step is `lg`, not `xl`: the live rule is `min-width: 1025px`, which
 * is the `lg` boundary (see PARITY deviation 16 — the same mistake was made in
 * the hero).
 */
const ROW = "flex flex-col gap-0 sm:flex-row sm:gap-2.5 lg:gap-10";

/**
 * The privacy note is NOT rendered here. On the live page it is a separate
 * widget below the whole two-column block, centred across the full width, so
 * the section owns it.
 */
export function TrialSignupForm() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<TrialInput>({ resolver: zodResolver(trialSchema) });

  const onSubmit = async (data: TrialInput) => {
    const result = await submitTrial(data);

    if (result.ok) {
      toast.success("You're all set — check your inbox for trial details.");
      reset();
    } else {
      toast.error(result.message);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className={ROW}>
        <FormField
          name="firstName"
          label="First name"
          required
          tone="inverse"
          error={errors.firstName?.message}
          className="w-full"
        >
          <Input
            className={FIELD}
            {...register("firstName")}
            {...fieldA11y("firstName", errors.firstName?.message)}
            autoComplete="given-name"
          />
        </FormField>

        <FormField
          name="lastName"
          label="Last name"
          required
          tone="inverse"
          error={errors.lastName?.message}
          className="w-full"
        >
          <Input
            className={FIELD}
            {...register("lastName")}
            {...fieldA11y("lastName", errors.lastName?.message)}
            autoComplete="family-name"
          />
        </FormField>
      </div>

      <div className={ROW}>
        <FormField
          name="companyName"
          label="Company Name"
          required
          tone="inverse"
          error={errors.companyName?.message}
          className="w-full"
        >
          <Input
            className={FIELD}
            {...register("companyName")}
            {...fieldA11y("companyName", errors.companyName?.message)}
            autoComplete="organization"
          />
        </FormField>

        <FormField
          name="phone"
          label="Phone Number"
          required
          tone="inverse"
          error={errors.phone?.message}
          className="w-full"
        >
          <Input
            type="tel"
            className={FIELD}
            {...register("phone")}
            {...fieldA11y("phone", errors.phone?.message)}
            autoComplete="tel"
          />
        </FormField>
      </div>

      <div className={ROW}>
        {/* The one optional field, and the live label says so by omitting the
         * asterisk rather than adding a hint. */}
        <FormField
          name="websiteUrl"
          label="Website URL"
          tone="inverse"
          error={errors.websiteUrl?.message}
          className="w-full"
        >
          <Input
            type="url"
            className={FIELD}
            {...register("websiteUrl")}
            {...fieldA11y("websiteUrl", errors.websiteUrl?.message)}
            autoComplete="url"
          />
        </FormField>

        <FormField
          name="studentCount"
          label="Number of Students"
          required
          tone="inverse"
          error={errors.studentCount?.message}
          className="w-full"
        >
          <Input
            type="number"
            min={1}
            className={FIELD}
            {...register("studentCount")}
            {...fieldA11y("studentCount", errors.studentCount?.message)}
          />
        </FormField>
      </div>

      {/* Email is alone on its row and spans the full width, as on the live form. */}
      <FormField
        name="email"
        label="Your Email"
        required
        tone="inverse"
        error={errors.email?.message}
      >
        <Input
          type="email"
          className={FIELD}
          {...register("email")}
          {...fieldA11y("email", errors.email?.message)}
          autoComplete="email"
        />
      </FormField>

      {/* Not the shared `Button`: this one is the form's own white-on-red
       * treatment, 46px tall with 31px of side padding, and it is the only
       * place on the site that uses it.
       *
       * `font-body` for the same reason the shared `Button` needs it: the live
       * form CSS sets `font-family: "Roboto", sans-serif` on its inputs, and
       * Roboto is declared-but-unloaded (deviation 17), so the label renders
       * as Arial. This one is a plain `<button>` rather than `Button`, so it
       * did not pick up that fix.
       *
       * The size is solved from the ink, because the rule that would have
       * given it — `form .submit_forminput[type=submit]` — is a typo for
       * `form .submit_form input[...]` and matches nothing, so its 15px/600
       * and `padding: 5px 10px` never apply. Measured on the live page: a
       * 245px box, 30/31px of side padding, and a 184px label at a 9px cap
       * height. Weight is REGULAR: Arial ships only 400 and 700, so the
       * `font-semibold` this had before was synthesised and rendered wide —
       * at 13px semibold the box came out 272px, and at 12px regular 252px.
       *
       * 11.5px is solved from the box, and the fraction is the honest answer
       * rather than a tidy one: the 31px padding either side is measured, so
       * the label has to be 183px for the box to be the live 245px, and that
       * is what 11.5px Arial gives. */}
      <button
        type="submit"
        disabled={isSubmitting}
        // The live gap from the email input's box to the button is 35px, and
        // this is the whole of it — NOT 9px added to the email group's 26px.
        // Adjacent sibling margins collapse, so the pair would resolve to
        // max(26, 9) = 26 and the button would sit 9px high.
        // `mb-[9px]` is not decoration — it is 9px of the live form column's
        // height, and two other things depend on it. The copy column is
        // vertically centred against this column, so 9px here moves the copy
        // down 4.5px onto its live position; and the band's total height only
        // resolves to the measured 666px with it. Without it the copy sits
        // 3-4px high and the whole band is 9px short.
        className="font-body bg-background text-primary hover:bg-foreground hover:text-primary-foreground mx-auto mt-[35px] mb-[9px] flex h-[46px] items-center justify-center gap-2 rounded-[4px] px-[31px] text-[11.5px] font-medium uppercase transition-colors disabled:opacity-70"
      >
        {isSubmitting ? <Loader2 className="size-3.5 animate-spin" aria-hidden /> : null}
        Start your free trial today
      </button>
    </form>
  );
}
