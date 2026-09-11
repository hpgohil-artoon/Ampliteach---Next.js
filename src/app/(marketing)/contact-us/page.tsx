import { ContactPage } from "@/features/contact";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Contact Us",
  description:
    "Questions about plans, migrating your data, or whether AmpliTeach fits your school? Call 203-934-2501, email Support@AmpliTeach.com, or send us a message.",
  path: "/contact-us",
});

/**
 * The PAGE is static — only the form SUBMISSION is dynamic, and that is handled
 * by a client component posting to an external endpoint. "Dynamic page" and
 * "dynamic form" are not the same thing; this needs no SSR.
 */
export default function Page() {
  return <ContactPage />;
}
