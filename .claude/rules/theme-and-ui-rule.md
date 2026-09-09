# Theme & UI Component Rules

This document outlines the theming and UI-component rules that MUST be followed for **any design change** in this project. These rules ensure every screen respects the app-wide theme system (light/dark + presets) and reuses the shared ERP UI kit instead of re-inventing components.

> **Working on a form field / input?** → **[form-fields-rule.md](./form-fields-rule.md)** is the single rule for every input control: which component to use, how validation and required asterisks are declared, and the mandatory shared limits/formats for numeric, contact-no and GSTIN fields. This file still applies to it for **theming** (rule 1), but do not look here for which form component to reach for.

> Companion references: [THEME_SYSTEM.md](../../docs/THEME_SYSTEM.md) for the full token list, and `src/shared/ui/erp-ui/index.ts` for the ERP UI kit surface.

---

## Core Rules

### 1. Every Design Change Must Be Theme-Aware

**CRITICAL:** Any visual change — new component, layout, color, border, background, or text — MUST work in **both light and dark mode** and honor the theme-preset system. Never hardcode colors.

Colors are exposed as CSS variables in `src/index.css` (under `:root` and `.dark`) and wired to Tailwind utilities in `tailwind.config.js`. Always consume the **theme token**, never a literal color.

```tsx
// ❌ WRONG - hardcoded colors break dark mode and theme presets
<div className="bg-white text-[#2c313a] border border-[#e1e7ef]">
<button className="bg-[#007AFF] text-white">Save</button>
<span style={{ color: 'red' }}>Error</span>

// ✅ RIGHT - theme tokens adapt to light/dark and the active preset
<div className="bg-card text-card-foreground border border-border">
<button className="bg-primary text-primary-foreground">Save</button>
<span className="text-destructive">Error</span>
```

**Token cheat-sheet** (full table in [THEME_SYSTEM.md](../../docs/THEME_SYSTEM.md)):

| Purpose           | Use                                                                |
| ----------------- | ------------------------------------------------------------------ |
| Page background   | `bg-background`                                                    |
| Body text         | `text-foreground`                                                  |
| Card/panel        | `bg-card` / `text-card-foreground`                                 |
| Brand / primary   | `bg-primary` / `text-primary-foreground`                           |
| Muted/helper text | `text-muted-foreground`                                            |
| Borders           | `border-border` (form inputs: `border-input`)                      |
| Focus ring        | `ring-ring`                                                        |
| Status            | `text-success` / `text-warning` / `text-info` / `text-destructive` |

**Opacity note:** tokens resolve to bare hex `var()`s, so Tailwind's `/opacity` modifiers (`bg-primary/90`) emit **no CSS**. Use `color-mix()` instead:

```tsx
// ❌ WRONG - no alpha channel is applied
<div className="bg-primary/90">

// ✅ RIGHT
<div className="bg-[color-mix(in_srgb,var(--primary)_90%,transparent)]">
```

**Adding a new color?** Follow the 3-step process in [THEME_SYSTEM.md](../../docs/THEME_SYSTEM.md#adding--modifying-colors): add the hex variable under **both** `:root` and `.dark` in `src/index.css`, wire it in `tailwind.config.js`, then document it. Never introduce a one-off color that only exists in light mode.

---

### 2. Reuse the ERP UI Kit — Don't Rebuild Components

**CRITICAL:** When a design needs a common component — a surface, a KPI tile, a button, a badge, a read-only detail field, a stepper — you MUST use the corresponding **ERP UI component** from `src/shared/ui/erp-ui`. Do not hand-roll a raw `<div>`/`<button>` or restyle a bare shadcn primitive for these cases.

**Why:** each ERP component owns its own styling in a single place (its `cva` variants) and shares surface tokens via `erp-control.ts`. This keeps a client-requested style change landing in exactly one file, and guarantees the component is already theme-aware.

```tsx
// ❌ WRONG - raw element, hardcoded styling, not theme-aware
<button className="bg-[#007AFF] px-3 py-2 text-white">Save</button>
<div className="rounded-xl border bg-white p-4">…</div>

// ✅ RIGHT - reuse the ERP UI kit (imported from the barrel)
import { ErpButton, ErpCard } from '@/shared/ui/erp-ui';

<ErpButton>{commonActions.save}</ErpButton>
<ErpCard title={t.sections.identity.title}>…</ErpCard>
```

**Non-form ERP components** (import from `@/shared/ui/erp-ui`):

| Need                 | Component                                                  |
| -------------------- | ---------------------------------------------------------- |
| Action button        | `ErpButton`                                                |
| Export action        | `ErpExportButton`                                          |
| Add-entry action     | `ErpAddEntryButton`                                        |
| Surface / panel      | `ErpCard`                                                  |
| Analytics / KPI tile | `ErpStatCard`                                              |
| Read-only view field | `ErpViewField`                                             |
| File / image preview | `ErpFilePreview` — see below                               |
| Badge / status pill  | `ErpBadge` / `ErpStatusBadge`                              |
| Avatar               | `ErpAvatar`                                                |
| Wizard steps         | `ErpStepper`                                               |
| Form section layout  | `ErpTwoColumnLayout` / `ErpThreeColumnLayout`              |
| Charts / bar list    | `ErpBarList` / `ErpGroupedBarChart` / `ErpDistributionBar` |

> **Analytics tiles:** the summary stat cards above a list screen (e.g. "Total Companies", "Active", "Inactive") MUST use `ErpStatCard` — pass `label`, `value`, and a `tone` (`success` / `destructive` / `warning` / `info`) for status-coloured metrics. Do not hand-roll a `<div>` with a number and a muted caption.

> **File / image previews:** every preview of an attached file — a logo thumbnail, a KYC scan, a bill PDF, on a view screen, a form picker, a list cell or a card — is rendered by the one shared **`ErpFilePreview`**, with the file resolved by `useAttachedFile` / `useStoredFilePreview` from `@/shared/storage`. Never add a per-screen preview component/file, a bare `<img src={…}>` thumbnail, or a hand-built lightbox `Dialog`; a variant the component lacks is added to `erp-file-preview.tsx`. Full rule: [file-upload-rule.md](./file-upload-rule.md) §0.

> **Read-only view/detail fields:** on a read-only View/detail screen, every label-over-value field MUST use `ErpViewField` (pass the label and the value as `children`). Do **not** hand-roll a `<div>` with a muted label + value, and do **not** re-declare a per-screen local `Field` component. See CLAUDE.md → "Add / Edit / View screens" and `company-view.tsx` / `branch-view.tsx`.

**If a needed component is missing from the kit:** add it to `src/shared/ui/erp-ui` (following the existing `erp-control.ts` pattern and exporting it from `index.ts`) rather than styling a one-off inline. Lower-level shadcn primitives in `src/shared/ui/` remain the building blocks for these, and for genuinely novel UI — but for the components listed above, always reach for the ERP wrapper first.

---

### 3. Form Fields Have Their Own Rule — Go There

**Every input control (which component, validation, required asterisks, shared limits and formats) is governed by [form-fields-rule.md](./form-fields-rule.md), not this file.** In short:

- A field inside a `<Form>` / bound to react-hook-form uses an adapter from **`@/shared/ui/form`** (`FormInput`, `FormSelect`, `FormNumber`, `FormMobile`, `FormGstin`, `FormDate`, …) — never a bare `erp-ui` control wired up by hand.
- A standalone control with no validation (a filter bar input, a search box, local `useState`) uses the bare control from **`@/shared/ui/erp-ui`** (`ErpSearchInput`, `ErpTextInput`, `ErpSelect`, …).
- Required asterisks and validation messages are derived from the zod schema; shared caps and formats come from `@/core/utils`.

What **this** rule still requires of a form field: it must be theme-aware (rule 1) — never restyle a control with hardcoded colors — and any genuinely new control must be added to the shared kit rather than styled inline (rule 2).

---

## Rule Checklist

Before marking any design/UI task as complete, verify:

- [ ] No hardcoded colors (hex, `rgb()`, named CSS colors, or inline `style` color) — only theme tokens
- [ ] Verified visually in **both** light and dark mode
- [ ] Any translucency uses `color-mix()`, not `/opacity` modifiers
- [ ] New colors added under both `:root` and `.dark`, wired in `tailwind.config.js`, and documented
- [ ] Buttons, cards, KPI tiles, badges, view fields and layouts use the `@/shared/ui/erp-ui` kit, not raw elements
- [ ] Any new reusable component was added to the ERP UI kit, not styled inline
- [ ] Imports use the barrel (`@/shared/ui/erp-ui`) and follow the architecture/naming rules in [eslint-rule.md](./eslint-rule.md)
- [ ] **If the change touches a form field, the [form-fields-rule.md](./form-fields-rule.md) checklist was run as well**

---

**Remember:** the theme system and ERP UI kit exist so a design tweak lands in one place and works everywhere. Bypassing them with hardcoded styles or one-off components is technical debt — always theme via tokens and compose from the shared kit. For anything input-shaped, [form-fields-rule.md](./form-fields-rule.md) is the rule.
