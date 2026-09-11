import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import { env } from "@/config/env";
import { SITE } from "@/content/site";
import { organizationJsonLd } from "@/lib/seo";
import { cn } from "@/lib/utils";
import { BackToTop, Footer, Header } from "@/components/layout";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

/**
 * Poppins, matching ampliteach.com — the live theme sets it on `body`, the nav,
 * the footer, the feature-card bullets and the trial submit label.
 *
 * **WEIGHTS 400 AND 500 ONLY, and that is deliberate.** It is exactly what the
 * live site fetches (`css?family=Poppins:400,500|Rubik:400&display=swap`), while
 * its CSS asks for 600/700/800 — so every heavier weight on the live site is a
 * browser-synthesised faux bold off Poppins Medium. Verified: the live footer
 * heading declares weight 900 and Chrome reports it painting **Poppins Medium**.
 * Loading the real 600/700/800 faces would render those headings narrower and
 * cleaner than the live ones, which is the opposite of parity.
 *
 * Poppins is not a variable font on Google Fonts, so the weights are explicit.
 *
 * How to check this rather than trust it: `CSS.getPlatformFontsForNode` over
 * CDP reports the face Chrome actually rasterised. It must be run in REAL
 * Chrome — Playwright's bundled Chrome-for-Testing does not make the live
 * site's second Google Fonts request and so renders it in fallback faces. That
 * mistake is written up in docs/PARITY.md, deviation 3.
 */
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-sans",
  display: "swap",
});

/*
 * Roboto is deliberately NOT loaded, and this one IS confirmed in real Chrome:
 * the live home page's text widgets declare `font-family: "Roboto", Sans-serif`
 * and Chrome paints them **Arial** (Arial Black at weight 900). A Roboto woff2
 * does get fetched by an unrelated rule, but it never reaches this copy.
 * `--font-body` in globals.css therefore declares the same unloaded stack, so
 * we fall through to the same face. See deviation 17 in docs/PARITY.md.
 */

export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_SITE_URL),
  // "%s | AmpliTeach" for every page; the home page overrides with `absolute`.
  title: { default: `${SITE.name} — ${SITE.tagline}`, template: `%s | ${SITE.name}` },
  description: SITE.description,
  applicationName: SITE.name,
  openGraph: { siteName: SITE.name, locale: "en_US", type: "website" },
  icons: { icon: "/favicon.ico" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={cn("font-sans", poppins.variable)}>
      {/* No `antialiased`. ampliteach.com never sets `-webkit-font-smoothing`,
       * and forcing greyscale smoothing renders every glyph on the site a
       * touch lighter than the live one on macOS — a whole-site weight shift
       * from one utility class. */}
      <body className="flex min-h-dvh flex-col">
        <a
          href="#main"
          className="focus:bg-background sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-100 focus:rounded-md focus:px-4 focus:py-2"
        >
          Skip to content
        </a>

        <Header />
        <main id="main" className="flex-1">
          {children}
        </main>
        <Footer />

        {/* Site chrome, not footer content — the live button is fixed to the
         * viewport and lives outside the footer section. */}
        <BackToTop />

        <Toaster position="top-center" />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd()) }}
        />
      </body>
    </html>
  );
}
