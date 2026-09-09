import { env } from "@/config/env";
import type { ContactInput, NewsletterInput, TrialInput } from "@/lib/validation";

export type SubmitResult = { ok: true } | { ok: false; message: string };

/**
 * Form submission — the one place any form posts to.
 *
 * Static export has no Route Handlers, so the endpoint has to live outside this
 * app (API Gateway + Lambda, Formspree, HubSpot…). It is read from
 * NEXT_PUBLIC_FORM_ENDPOINT so changing provider never touches a component.
 *
 * With NEXT_BUILD_MODE=server you can instead point it at "/api/contact" and
 * add Route Handlers — the components stay identical either way.
 */
async function submit(kind: string, payload: unknown): Promise<SubmitResult> {
  const endpoint = env.NEXT_PUBLIC_FORM_ENDPOINT;

  if (!endpoint) {
    // Dev convenience: no endpoint configured yet, so log instead of failing.
    console.info(`[forms] ${kind} submission (no endpoint configured):`, payload);
    return { ok: true };
  }

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ form: kind, ...(payload as Record<string, unknown>) }),
    });

    if (!response.ok) {
      return { ok: false, message: "We could not send your message. Please try again." };
    }

    return { ok: true };
  } catch {
    return { ok: false, message: "Network error. Please check your connection and try again." };
  }
}

export const submitContact = (data: ContactInput) => submit("contact", data);
export const submitTrial = (data: TrialInput) => submit("trial", data);
export const subscribeToNewsletter = (data: NewsletterInput) => submit("newsletter", data);
