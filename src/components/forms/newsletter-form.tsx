"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { newsletterSchema, type NewsletterInput } from "@/lib/validation";
import { subscribeToNewsletter } from "@/lib/api/forms";
import { Input } from "@/components/ui/input";
import { SubmitButton } from "./submit-button";

/** Inline subscribe box at the foot of every blog post. */
export function NewsletterForm() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<NewsletterInput>({ resolver: zodResolver(newsletterSchema) });

  const onSubmit = async (data: NewsletterInput) => {
    const result = await subscribeToNewsletter(data);

    if (result.ok) {
      toast.success("Subscribed — thanks for joining.");
      reset();
    } else {
      toast.error(result.message);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-3">
      <div className="flex flex-col gap-3 sm:flex-row">
        <Input
          id="newsletter-email"
          type="email"
          placeholder="you@yourschool.com"
          aria-label="Email address"
          aria-invalid={errors.email ? true : undefined}
          autoComplete="email"
          {...register("email")}
        />
        <SubmitButton pending={isSubmitting}>Subscribe</SubmitButton>
      </div>

      {errors.email ? (
        <p role="alert" className="text-destructive text-xs">
          {errors.email.message}
        </p>
      ) : null}
    </form>
  );
}
