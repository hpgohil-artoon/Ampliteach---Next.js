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
 * The `wipe` variant is the live `hover_type5` animation. Despite the name it
 * is a **cross-fade**, not a wipe — see the note on the variant below.
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
        /* `hover_type5`, and it is a CROSS-FADE — the name is the theme's, not
         * a description. The gt3 stylesheet does define a two-half centre-out
         * scaleX wipe, and that is what this variant used to reproduce, but
         * later rules in the same file switch the whole thing off:
         *
         *   .front:after, .back:after { display: none }   ← the halves, gone
         *   .front:before, .back:before { width: 100% }   ← now full-size
         *   ... { transform: none }                       ← no scaleX at all
         *   ... { transition: all .6s }                   ← 0.6s, not 0.5s
         *
         * Confirmed against the live page with Playwright rather than by
         * reading: at rest both `:after` compute to `display: none`, the red
         * `:before` to `opacity: 1` and the black one to `0`; on hover they
         * swap. So: red fades out, `#0B0B0B` fades in, 600ms `ease`.
         *
         * `-inset-0.5` is the live `top/left/right/bottom: -2px` on the covers,
         * with `overflow: visible`. It is not decoration — the coloured box is
         * 4px wider and taller than the anchor (272.44 × 35 on a 268.44 × 31
         * button), which is exactly the 3–4px every measured button width was
         * short by before.
         *
         * The button keeps NO background of its own: the live anchor is
         * transparent and both colours are layers. `::after` paints over
         * `::before`, matching the live DOM order (front, then back). */
        wipe: "text-primary-foreground relative isolate border-transparent before:absolute before:-inset-0.5 before:-z-10 before:rounded-[inherit] before:bg-primary before:opacity-100 before:transition-opacity before:duration-[600ms] before:ease-[ease] before:content-[''] after:absolute after:-inset-0.5 after:-z-10 after:rounded-[inherit] after:bg-foreground after:opacity-0 after:transition-opacity after:duration-[600ms] after:ease-[ease] after:content-[''] hover:before:opacity-0 hover:after:opacity-100",
      },
      size: {
        default:
          "gap-2 px-5 py-[13px] has-data-[icon=inline-end]:pr-4 has-data-[icon=inline-start]:pl-4",
        xs: "gap-1 px-3 py-1.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2 [&_svg:not([class*='size-'])]:size-3",
        sm: "gap-1.5 px-4 py-2.5 has-data-[icon=inline-end]:pr-3 has-data-[icon=inline-start]:pl-3 [&_svg:not([class*='size-'])]:size-3.5",
        lg: "gap-2 px-[31px] py-4 has-data-[icon=inline-end]:pr-6 has-data-[icon=inline-start]:pl-6",
        /* The gt3 CTA — the hero's button and the three in the feature grid.
         * A 14px label with 20px of side padding, no border, in a box whose
         * height the live anchor DECLARES: `height: 31px`. Read off the live
         * element's computed style, together with the 21px line box on its
         * label span, which leaves 5px above and below.
         *
         * 35px was the previous value, derived from the anchor's own 11.42px
         * font-size (`.714em`) plus the label's 14px struts. The arithmetic was
         * plausible but the live box is simply 31px, and the 4px showed up
         * three times over in the feature grid.
         *
         * Width needs no declaration: 20px either side plus the 228.44px label
         * gives the live 268.44px box. */
        cta: "h-[31px] gap-2 border-0 px-5 text-sm leading-[21px]",
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
