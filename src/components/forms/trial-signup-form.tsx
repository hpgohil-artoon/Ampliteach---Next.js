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
    /* `flex flex-col` so the row margins DO NOT collapse. As a block container
     * the last field row's 15px bottom margin and the submit's 18px top margin
     * collapsed to a single 18px, which put the button 15px high and left the
     * form 465px against the live 495px. Flex items keep both, and the live
     * 33px gap falls out of 15 + 18. */
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col">
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

      {/* Not the shared `Button`: this is the form's own white-on-red
       * treatment and the only place on the site that uses it. Every value
       * below is read off the live control's own computed style, which is
       * `input[type=submit].wpcf7-submit`:
       *
       *   height 50px (DECLARED, with border-box) · padding 10px 30px
       *   border 2px solid #FF1616 · radius 5px · white ground, red label
       *   12px/23px, weight 500, letter-spacing 0.2px, UPPERCASE
       *   margin 0 0 15px — no top margin of its own
       *
       * `font-sans`, NOT `font-body`. The live rule is `font-family: Poppins`,
       * so this label is the one piece of the form set in Poppins while its
       * labels and inputs declare Roboto and paint Arial. Weight 500 is a real
       * loaded face here, not a synthesised one.
       *
       * This was previously built as a 46px box with an 11.5px Arial label,
       * from an ink scan of a screenshot. That scan could not see the 2px red
       * border — it is the same brand red as the band behind the button — so
       * it measured the padding box, 245px, and 11.5px was then solved to fit
       * it. docs/PARITY.md warns about exactly this: "a box's own colour
       * disqualifies it as the ink test".
       *
       * The 33px above the button is `mt-[18px]` plus the 15px the field row
       * above already carries, and the row arithmetic then closes on the live
       * form exactly: 4 rows × 103 + 18 + 50 + 15 = 495px. */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="bg-background text-primary hover:bg-foreground hover:text-primary-foreground border-primary mx-auto mt-[18px] mb-[15px] flex h-[50px] items-center justify-center gap-2 rounded-[5px] border-2 px-[30px] font-sans text-[12px] leading-[23px] font-medium tracking-[0.2px] uppercase transition-colors disabled:opacity-70"
      >
        {isSubmitting ? <Loader2 className="size-3.5 animate-spin" aria-hidden /> : null}
        Start your free trial today
      </button>
    </form>
  );
}
