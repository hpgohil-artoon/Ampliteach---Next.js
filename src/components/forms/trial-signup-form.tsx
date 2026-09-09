"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { trialSchema, type TrialInput } from "@/lib/validation";
import { submitTrial } from "@/lib/api/forms";
import { Input } from "@/components/ui/input";
import { fieldA11y, FormField } from "./form-field";
import { SubmitButton } from "./submit-button";

/** The 7-field homepage trial form. */
export function TrialSignupForm({ privacyNote }: { privacyNote: string }) {
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
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <FormField name="firstName" label="First Name" required error={errors.firstName?.message}>
          <Input
            {...register("firstName")}
            {...fieldA11y("firstName", errors.firstName?.message)}
            autoComplete="given-name"
          />
        </FormField>

        <FormField name="lastName" label="Last Name" required error={errors.lastName?.message}>
          <Input
            {...register("lastName")}
            {...fieldA11y("lastName", errors.lastName?.message)}
            autoComplete="family-name"
          />
        </FormField>

        <FormField
          name="companyName"
          label="School / Company Name"
          required
          error={errors.companyName?.message}
          className="sm:col-span-2"
        >
          <Input
            {...register("companyName")}
            {...fieldA11y("companyName", errors.companyName?.message)}
            autoComplete="organization"
          />
        </FormField>

        <FormField name="email" label="Email" required error={errors.email?.message}>
          <Input
            type="email"
            {...register("email")}
            {...fieldA11y("email", errors.email?.message)}
            autoComplete="email"
          />
        </FormField>

        <FormField name="phone" label="Phone" required error={errors.phone?.message}>
          <Input
            type="tel"
            {...register("phone")}
            {...fieldA11y("phone", errors.phone?.message)}
            autoComplete="tel"
          />
        </FormField>

        <FormField
          name="websiteUrl"
          label="Website URL"
          hint="Optional — include https://"
          error={errors.websiteUrl?.message}
        >
          <Input
            type="url"
            placeholder="https://"
            {...register("websiteUrl")}
            {...fieldA11y("websiteUrl", errors.websiteUrl?.message)}
          />
        </FormField>

        <FormField
          name="studentCount"
          label="Number of Students"
          required
          error={errors.studentCount?.message}
        >
          <Input
            type="number"
            min={1}
            {...register("studentCount")}
            {...fieldA11y("studentCount", errors.studentCount?.message)}
          />
        </FormField>
      </div>

      <p className="text-muted-foreground text-xs">{privacyNote}</p>

      <SubmitButton pending={isSubmitting} className="self-start">
        Start My Free Trial
      </SubmitButton>
    </form>
  );
}
