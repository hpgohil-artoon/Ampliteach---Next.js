import { ContactFormAndDetails, ContactHero, ContactMap } from "./sections";

/** The Contact Us outline. One name per file in `./sections`. */
export function ContactPage() {
  return (
    <>
      <ContactHero />
      <ContactFormAndDetails />
      <ContactMap />
    </>
  );
}
