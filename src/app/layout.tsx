import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import { env } from "@/config/env";
import { SITE } from "@/content/site";
import { organizationJsonLd } from "@/lib/seo";
import { cn } from "@/lib/utils";
import { Footer, Header } from "@/components/layout";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

/**
 * Poppins, matching ampliteach.com — the live theme sets it on body, the nav
 * and every heading (h1–h4 at 800, h5 700, h6 600).
 *
 * Poppins is not a variable font on Google Fonts, so the weights are listed
 * explicitly. The live site only requests `Poppins:400,500` yet its CSS asks
 * for 600/700/800, so every heading there is a browser-synthesised faux bold;
 * loading the real weights is the one place this deliberately differs.
 */
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-sans",
  display: "swap",
});

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
      <body className="flex min-h-dvh flex-col antialiased">
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

        <Toaster position="top-center" />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd()) }}
        />
      </body>
    </html>
  );
}
