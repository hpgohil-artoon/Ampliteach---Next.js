import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "cn";
import { Slot } from "radix-ui";

/**
 * THE one place the site's button is defined. Every CTA — hero, pricing cards,
 * the CTA banner, form submits, the header's Log In — renders through here, so
 * a button change is this file and nothing else.
 *
 * The base layer is ampliteach.com's `gt3-core-button`, measured from its
 * stylesheets rather than styled to taste:
 *
 *   font-size 12px · weight 500 · letter-spacing 0.2px · UPPERCASE
 *   line-height 1.5 → an 18px line box
 *   padding 13px 20px · 1px border · 5px radius
 *   fill + border #FF1616, both going to #0B0B0B on hover, label staying white
 *
 * That comes to 46px tall and ~84px wide for "LOG IN", which is what the live
 * header measures. Two of those five properties are the easiest to miss and
 * were: `text-transform: uppercase` and `line-height: 1.5` live in the base
 * `.elementor-widget-gt3-core-button` rule, not in the header's own element
 * overrides — miss them and the button comes out 38px tall reading "Log In".
 *
 * Sizes are padding-based, not fixed heights, because the live buttons are: the
 * theme sets `padding` per widget and lets the line box set the height.
 * `default` is the 13/20 header size; `lg` is the live 16/31; `cta` is the
 * hero's — a 14px label with 5/20 padding and no border, measuring ~31px.
 *
 * The `wipe` variant is the live `hover_type5` animation on the hero CTA. The
 * live site needs four extra spans for it; two pseudo-elements do the same job
 * here with no extra DOM. Each covers half the button in brand red with its
 * transform-origin at the OUTER edge, so on hover both scale to zero: the red
 * retracts outwards while the button's own `#0B0B0B` shows through from the
 * centre. Same `.5s ease` centre-out wipe, same two colours.
 *
 * `font-body` is the label's family and it is NOT optional. The live rule is
 * `.elementor-widget-gt3-core-button .elementor_gt3_btn_text { font-family:
 * "Roboto", Sans-serif }` — in the BASE widget rule, so it applies to every
 * button on the site, and Roboto is declared-but-unloaded (deviation 17) so it
 * renders as Arial. Without it a button inherits Poppins from `body` and every
 * label comes out narrow: the FAQ button measured 254px against the live 263,
 * and the testimonials button 318 against 341.
 *
 * NOTE: `components/ui/` is otherwise shadcn-CLI territory. This file now holds
 * measured live values, so `npx shadcn@latest add button` would overwrite them —
 * see docs/PARITY.md.
 */
const buttonVariants = cva(
  "group/button font-body inline-flex shrink-0 items-center justify-center rounded-[5px] border border-transparent bg-clip-padding text-xs leading-normal font-medium tracking-[0.2px] whitespace-nowrap uppercase transition-colors outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default:
          "border-primary bg-primary text-primary-foreground hover:border-foreground hover:bg-foreground",
        outline:
          "border-border bg-background hover:border-foreground hover:bg-foreground hover:text-primary-foreground aria-expanded:bg-muted dark:border-input dark:bg-input/30",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-[color-mix(in_oklch,var(--secondary),var(--foreground)_5%)] aria-expanded:bg-secondary aria-expanded:text-secondary-foreground",
        ghost:
          "hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:hover:bg-muted/50",
        destructive:
          "bg-destructive/10 text-destructive hover:bg-destructive/20 focus-visible:border-destructive/40 focus-visible:ring-destructive/20 dark:bg-destructive/20 dark:hover:bg-destructive/30 dark:focus-visible:ring-destructive/40",
        link: "text-primary normal-case underline-offset-4 hover:underline",
        /* The two halves are `calc(50% + 1px)`, NOT `w-1/2`. At an odd box
         * width each half lands on a half-pixel — a 259px button gives
         * 129.5 — and the rounding leaves a 1px gap in the middle where the
         * `#0B0B0B` ground shows through as a hairline down the centre of the
         * button. Measured: x=633 read `rgb(11,11,11)` between two runs of
         * brand red. The 1px overlap is invisible (both halves are the same
         * colour) and harmless on hover, since each retracts towards its own
         * outer edge. */
        wipe: "bg-foreground text-primary-foreground relative isolate overflow-hidden border-transparent before:absolute before:inset-y-0 before:left-0 before:-z-10 before:w-[calc(50%+1px)] before:origin-left before:scale-x-100 before:bg-primary before:transition-transform before:duration-500 before:ease-[ease] before:content-[''] after:absolute after:inset-y-0 after:right-0 after:-z-10 after:w-[calc(50%+1px)] after:origin-right after:scale-x-100 after:bg-primary after:transition-transform after:duration-500 after:ease-[ease] after:content-[''] hover:before:scale-x-0 hover:after:scale-x-0",
      },
      size: {
        default:
          "gap-2 px-5 py-[13px] has-data-[icon=inline-end]:pr-4 has-data-[icon=inline-start]:pl-4",
        xs: "gap-1 px-3 py-1.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2 [&_svg:not([class*='size-'])]:size-3",
        sm: "gap-1.5 px-4 py-2.5 has-data-[icon=inline-end]:pr-3 has-data-[icon=inline-start]:pl-3 [&_svg:not([class*='size-'])]:size-3.5",
        lg: "gap-2 px-[31px] py-4 has-data-[icon=inline-end]:pr-6 has-data-[icon=inline-start]:pl-6",
        /* The hero CTA: 14px label, 5px/20px padding, no border — the live
         * `size_custom` + `hover_type5` combination, which measures 35px tall.
         *
         * The 25px line box is the measured height, not a derived one. Live it
         * emerges by accident: the anchor's own font-size is `.714em` (11.42px)
         * while the label span is 14px, so the line box is the two struts
         * combined rather than either alone. One declaration reproduces the
         * result without reproducing the accident. */
        cta: "gap-2 border-0 px-5 py-[5px] text-sm leading-[25px]",
        icon: "size-11 p-0",
        "icon-xs": "size-6 p-0 [&_svg:not([class*='size-'])]:size-3",
        "icon-sm": "size-8 p-0 [&_svg:not([class*='size-'])]:size-3.5",
        "icon-lg": "size-[54px] p-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot.Root : "button";

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
