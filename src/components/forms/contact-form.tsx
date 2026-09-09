"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { contactSchema, type ContactInput } from "@/lib/validation";
import { submitContact } from "@/lib/api/forms";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { fieldA11y, FormField } from "./form-field";
import { SubmitButton } from "./submit-button";

export function ContactForm() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactInput>({ resolver: zodResolver(contactSchema) });

  const onSubmit = async (data: ContactInput) => {
    const result = await submitContact(data);

    if (result.ok) {
      toast.success("Thanks — we'll be in touch shortly.");
      reset();
    } else {
      toast.error(result.message);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-5">
      <FormField name="name" label="Name" required error={errors.name?.message}>
        <Input
          {...register("name")}
          {...fieldA11y("name", errors.name?.message)}
          autoComplete="name"
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

      <FormField name="phone" label="Phone Number" required error={errors.phone?.message}>
        <Input
          type="tel"
          {...register("phone")}
          {...fieldA11y("phone", errors.phone?.message)}
          autoComplete="tel"
        />
      </FormField>

      <FormField name="message" label="Message" error={errors.message?.message}>
        <Textarea
          rows={5}
          {...register("message")}
          {...fieldA11y("message", errors.message?.message)}
        />
      </FormField>

      {/* Honeypot — hidden from users, filled by bots. */}
      <div className="hidden" aria-hidden>
        <label htmlFor="website">Website</label>
        <input id="website" tabIndex={-1} autoComplete="off" {...register("website")} />
      </div>

      <SubmitButton pending={isSubmitting} className="self-start">
        Send Message
      </SubmitButton>
    </form>
  );
}
