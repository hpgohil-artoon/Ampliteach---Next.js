"use client";

import { Toaster as Sonner, type ToasterProps } from "sonner";
import {
  CircleCheckIcon,
  InfoIcon,
  TriangleAlertIcon,
  OctagonXIcon,
  Loader2Icon,
} from "lucide-react";

/**
 * NOTE — diverges from the shadcn CLI output on purpose. Do not restore the
 * `useTheme()` call on the next `shadcn add sonner`.
 *
 * The stock component reads `next-themes`' `useTheme()`, but this app mounts no
 * `ThemeProvider`. next-themes' hook is
 * `() => useContext(ctx) ?? { setTheme, themes: [] }` — the fallback has no
 * `theme` key at all, so the stock `const { theme = "system" }` resolved to
 * "system", and Sonner then followed `prefers-color-scheme`. A visitor with the
 * OS set to dark got a dark toast on a site that is light everywhere else
 * (nothing ever adds the `.dark` class).
 *
 * The site matches ampliteach.com, which is light-only, so the toast is pinned
 * to light. If dark mode is ever a real feature, add a ThemeProvider and read
 * the theme from it — not from a hook with no provider behind it.
 */
const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      theme="light"
      className="toaster group"
      icons={{
        success: <CircleCheckIcon className="size-4" />,
        info: <InfoIcon className="size-4" />,
        warning: <TriangleAlertIcon className="size-4" />,
        error: <OctagonXIcon className="size-4" />,
        loading: <Loader2Icon className="size-4 animate-spin" />,
      }}
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
          "--border-radius": "var(--radius)",
        } as React.CSSProperties
      }
      toastOptions={{
        classNames: {
          toast: "cn-toast",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
