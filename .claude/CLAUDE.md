## Project Overview

This project is a scalable enterprise-grade ERP (Enterprise Resource Planning) platform built using modern frontend architecture principles.

The system is designed to support multiple business domains such as:

- Inventory Management
- Sales Management
- Purchase Management
- CRM
- HRMS
- Finance & Accounting
- Reporting & Analytics
- Role-Based Access Control (RBAC)
- Workflow & Approval Systems
- Notifications & Activity Tracking

- **React Vite**: Modern Vite-based React application

---

# Frontend Architecture Philosophy

The frontend architecture follows:

- Feature-based modular architecture
- Separation of concerns
- SOLID principles
- Reusable shared systems
- Scalable query management
- Centralized permission handling
- Dynamic and configurable UI systems

The project emphasizes:

- maintainability
- scalability
- clean responsibility boundaries
- enterprise-grade developer experience

---

## Project structure

always follow project structure when add any new file
See [PROJECT_STRUCTURE.md](../docs/PROJECT_STRUCTURE.md) for detailed project architecture.

## Engineering Philosophy

This codebase prioritizes:

- clarity over cleverness
- modularity over shortcuts
- scalability over quick hacks
- reusable systems over duplication
- predictable architecture over complexity

The goal is to build a long-term maintainable enterprise platform.

## File Naming Conventions

- Components: kebab-case.tsx (e.g., user-profile.tsx)
- Hooks: use-kebab-case.ts (e.g., use-discussions.ts)
- Utilities: kebab-case.ts (e.g., format-date.ts)
- Types: kebab-case.ts (e.g., api-types.ts)
- Folders: kebab-case throughout
- **Exception — `src/shared/ui/`:** shadcn CLI primitives are flat files (`button.tsx`, not `button/button.tsx`), matching the CLI's own output so upgrades stay a plain file overwrite. Composed multi-file systems on top of them (`ui/form/`, `ui/loader/`) still use folders. Don't restructure primitives back into folders. See [PROJECT_STRUCTURE.md](../docs/PROJECT_STRUCTURE.md#exception-srcsharedui-is-flat-not-folder-per-component).

## Page Component Structure

**Always keep the page's UI component in a `components/` folder in the same directory as `page.tsx`.** `page.tsx` is a thin route entry only — it imports that component, optionally applies the `withPageHeader` HOC, and default-exports. It must NOT define the screen's JSX inline. Any handler tied to the screen's data/state (export, submit, row actions) is defined **inside the component**, co-located with the data — never in `page.tsx`.

```
pages/<screen>/
├── components/
│   └── <screen>.tsx        # the actual screen component (named export) — owns its handlers
└── page.tsx                # thin route entry: imports the component, default-exports
```

Pick the header pattern by whether the header actions need the component's data:

**A. Static header (no data-bound actions)** — wire it in `page.tsx` with the `withPageHeader` HOC:

```tsx
// page.tsx
import { FleetDieselEntry } from './components/fleet-diesel-entry';
export default withPageHeader(FleetDieselEntry, { breadcrumbs: [...], title: t.title });
```

**B. Interactive header (Export/Add/etc. that act on page data)** — the component renders `<PageHeader>` itself so its handlers stay co-located; `page.tsx` just re-exports:

```tsx
// components/fleet-diesel-entry.tsx
export function FleetDieselEntry() {
  const handleExport = () => { /* uses this page's data */ };
  return (
    <>
      <PageHeader title={t.title} breadcrumbs={[...]}
        actions={<ErpExportButton onExport={handleExport} />} />
      {/* screen content */}
    </>
  );
}

// page.tsx
import { FleetDieselEntry } from './components/fleet-diesel-entry';
export default FleetDieselEntry;
```

```tsx
// ❌ WRONG — component or data-bound handler defined inline in page.tsx
function FleetDieselEntryPage() { … }
const handleExport = () => { … };
export default withPageHeader(FleetDieselEntryPage, { … });
```

### Add / Edit / View screens — in-place view-swap, NOT a popup; the URL may carry an id

**A create/edit form _and_ the read-only detail (View) for a list screen are in-place view swaps within the same container — do NOT open them in a modal/dialog/popup.** The screen's container component holds a `view` state (`'list' | 'form' | 'view'`), an `editing` record, and a `viewing` record, and renders **either** the list, the form, **or** the detail view. One form component serves both create/edit modes: opening it empty is "create", prefilling it from a row is "edit". The View is a separate read-only component. This keeps breadcrumbs and handlers co-located and avoids route/lazy-loading duplication for what is visually one screen.

**Where that `view`/`editing`/`viewing` state lives is now a choice, not fixed.** Every screen still MUST behave as one in-place swap (same header, no full navigation feel, no modal) — but there are two supported storage mechanisms for the state driving it:

- **Local `useState` (the default for most screens today).** `view`/`editing`/`viewing` are plain `useState`, the leaf route stays a single flat path, and the URL never changes between list/add/edit/view. This is still correct and is not being swept/migrated proactively — most of the app's ~500 screens use it.
- **URL-backed, via `useScreenRouteState` (`@/shared/routing`).** The screen's leaf route is nested into four children — `index` (list), `'new'` (add), `':id'` (view), `':id/edit'` (edit), all four `lazy`-importing the **same** page module — and the container calls `useScreenRouteState<TRow>()` instead of declaring its own `useState`. It returns the **exact same shape** (`view`, `editing`, `viewing`, `openCreate`, `openEdit`, `openView`, `backToList`) so the rest of the container is unchanged; only where the state is stored differs. Add/Edit/View each get their own URL (`/masters/masters-vehicle-master/new`, `/…/<id>`, `/…/<id>/edit`) — bookmarkable, refresh-safe, deep-linkable — while remaining the same in-place swap visually. `editing`/`viewing` only guarantee `.id` after a hard refresh (router state carrying the rest doesn't survive one); anything else still comes from the screen's own `use<Screen>Detail(id)` query, exactly as before. Reference implementations: `masters-vehicle-master.tsx`, `masters-diesel-advance-route.tsx`, `admin-roles.tsx`. Full routing-layer detail: [docs/ROUTING.md](../docs/ROUTING.md) → "Id-bearing Edit/View routes" (including "URL ids are encoded, not raw" — the `:id` segment is never the literal database id; `useScreenRouteState` encodes/decodes it transparently, so a screen never sees or builds the raw id in a URL).

Migrate a screen from local-state to URL-backed when it's next touched for other reasons, or when a client need (a deep link, a "share this record" link, refresh-safety) asks for it — this is not a standalone sweep to run across the whole app.

> **View is a page, not a popup, in BOTH variants.** The row's `viewAction` must swap the screen to the in-page detail view (`view='view'` + `viewing=row`, or `openView(row)` for the URL-backed variant) — never `modalService.open(...)`, a `Dialog`, or a drawer. A record's full detail is a screen, not a dialog. (Small confirm/approve prompts still use the confirm modal per [modal-rule.md](./rules/modal-rule.md) — that's a different thing from viewing a record. So is blowing up a **single attached file** to full size: that's a media viewer, and it correctly uses `ModalType.PREVIEW` — see [file-upload-rule.md](./rules/file-upload-rule.md) §4a.)

Structure (extends the base layout above):

```
pages/<screen>/
├── components/
│   ├── <screen>.tsx        # container: owns view/editing/viewing state, renders PageHeader, switches list ↔ form ↔ view
│   ├── <screen>-list.tsx   # the DataTable list (calls onEdit(row) / onView(row) to hand a row up)
│   ├── <screen>-form.tsx   # the create/edit form (one component, both modes)
│   ├── <screen>-view.tsx   # the read-only detail view (ErpCard sections) — separate from the form
│   └── <screen>-data.ts    # shared mock data / types — DATA ONLY (no component), so both
│                           #   list and container can import it without tripping
│                           #   react-refresh/only-export-components
├── schema/<screen>-schema.ts
└── page.tsx                # thin re-export of the container
```

Rules for this pattern:

- **Use the interactive-header form (B above).** The container renders `<PageHeader>` itself; **Add** sets `view='form'` + `editing=null`, a row's `editAction` sets `view='form'` + `editing=row`. The header `actions` slot is **mode-switched**: list mode shows Export / Add-Entry; form mode shows **Cancel + Save** (see next point). The form has **no bottom footer** — all primary actions live in the header.
- **The PageHeader carries a title and nothing under it — no sub-description on a form, view or list screen.** Do not pass `description` to `<PageHeader>`, and do not add a locale key for one (`requiredHint`, `subtitle`, `formHint`, …). A line like "Fill in all required fields (\*)" restates what the asterisks already say, on every screen, forever — and no other module in this app shows one, so a screen that does looks like a different product. Required-ness is communicated by the asterisk the schema drives (see below); a rule that genuinely needs explaining belongs in the field's own **`description`** prop, next to the input it constrains, not at the top of the page. The `description` prop on an **`ErpCard` section** is a different thing and stays — it names what that group of fields is for.
- **Cancel / Save live in the PageHeader, not a form footer.** In form mode the header `actions` render `<ErpButton>` Cancel (`onClick` → back to list) and `<ErpButton type="submit" form={FORM_ID}>` Save. Give the `<Form>` a stable `id` (export a `const <SCREEN>_FORM_ID`) and point Save at it via the native **`form={id}`** attribute — that submits the `<form>` from the header even though the button sits outside it (runs the same zod validation / `onSubmit`). Do **not** put Cancel/Save in a footer inside the form.
- **Mode-switched header buttons MUST carry distinct, stable `key`s (prevents a phantom submit on Edit).** The `actions` slot renders a _different_ button at the same position per mode — view mode's **Edit** (`ErpButton type="button"`) and form mode's **Save** (`ErpButton type="submit" form={FORM_ID}`) sit in the same JSX slot. Without keys, clicking Edit makes React reconcile the two by **mutating the clicked `<button>` node's `type` to `submit`** and attaching `form={FORM_ID}` in place; when the edit detail is already cached the `<form>` mounts in the same commit, so the in-flight click fires a **phantom submit → an unintended update API call**, and the edit screen never appears. Give every mode's action buttons distinct keys (`key="edit"`, `key="save"`, `key="cancel"`, `key="back"`, `key="export"`, `key="add"`) so React unmounts the clicked node and mounts a fresh one instead of reusing it. The view-mode Edit button must be `type="button"` with `onClick={() => viewing && openEdit(viewing)}` — never `type="submit"`. Reference: `masters-diesel-advance-route.tsx`.
- **ONE headline shape app-wide: `New <Screen>` / `Edit <Screen>` / `View <Screen>`, and the trailing crumb repeats it verbatim.** The `<Screen>` is the screen's own `t.title` — the same name the sidebar and the list header show — so Vehicle Master reads "New Vehicle Master" / "Edit Vehicle Master" / "View Vehicle Master". Do **not** name the record instead: a view header showing `viewingDetail?.grnNo` (or a `?? f.viewTitle` chain behind it) is the shape this replaced, because the same screen then announced itself differently depending on which row you opened, and 30 screens each invented their own noun ("Vehicle Details", "Lead Details", "Agent Details", a bare reference number). The record identifies itself in the card below; the header identifies the screen. The trailing breadcrumb crumb is the **same expression** as the title — never a shortened `commonActions.view`, a separate `breadcrumb.editX` key, or a record number — so the two cannot drift. A status badge beside the headline is fine (the approval screens keep theirs); a record name in place of it is not. Enforced across all 102 list ↔ form ↔ view screens in the 2026-09-07 sweep.
- **Breadcrumb goes back.** In form mode, make the list crumb (e.g. "Company Master") return to the list via the breadcrumb's **`onClick`** (an in-page handler on `BreadcrumbItemConfig`, calling `backToList` — whether that's the local-state version or the one `useScreenRouteState` returns), and append a non-clickable trailing crumb for the current mode. Cancel and the crumb both return to the list. Use `onClick`, not `to`, even on a URL-backed screen — the crumb calls the same `backToList` the Cancel button does, so the two can't drift.
- **One form, mode-driven.** The form component takes `initialValues?` (prefill for edit) and `onSubmit` (cancel/save are the header's job now, so it does not take an `onCancel`). Build it per the theme + form rules: sections in `ErpCard`, field grids from `erp-form-layout` (`ErpTwoColumnLayout` / `ErpThreeColumnLayout`), fields via `@/shared/ui/form` adapters, validation + required asterisks from the zod schema. Repeatable sub-sections (addresses, line items, documents) use `useFormFieldArray`.
- **View mode — read-only detail, framed in `ErpCard`s (NOT a popup).** The row's `viewAction` sets `view='view'` + `viewing=row`; the container renders the `<screen>-view.tsx` component in place of the list. Build the detail as a **stack of `ErpCard` sections** — one card per logical group, mirroring the form's sections — with each field rendered via **`ErpViewField` from `@/shared/ui/erp-ui`** (the read-only label-over-value pair — the view counterpart of a form field) inside an `ErpThreeColumnLayout` (see `company-view.tsx`). **MANDATORY: every label/value field on a view/detail screen uses `ErpViewField` — never hand-roll a `<div>` with a muted label + value, and never re-declare a local `Field` component per screen.** `ErpViewField` is already theme-aware (`text-muted-foreground` label over `text-foreground` value); pass the value as its `children`. **Every value goes through a `display*` helper from `@/core/utils`** (`displayText`, `displayMobile`, `displayInr`, `displayNumber`, `displayCount`, `displayDate`, `displayDateTime`, `displayTime`) so a missing value renders the shared placeholder dash instead of an empty field — a blank value reads as a loading/rendering bug, not as "not recorded". Never hardcode `'—'` / `'N/A'` and never write a per-screen `value ? value : '—'` ternary; the same rule covers list cells, with the full helper table and edge cases (mapped labels, `0` is a value, the search haystack) in [data-table-rule.md](./rules/data-table-rule.md) §3y. **A date is the strictest case: every date anywhere in the app — view field, list cell, nested table, modal — renders through the one shared `displayDate` (`10/07/2026`), with `displayDateTime` / `displayTime` reserved for a moment whose time genuinely matters. A screen never formats a date itself.** The backend sends a day as a full timestamp (`2026-07-10T18:30:00.000Z` **is** 10 Jul), so formatting that instant in the viewer's zone printed 11/07/2026 in IST — a day out. `displayDate` reads the literal date part instead, which is also how the edit form's picker prefills, so View and Edit can't disagree. There is deliberately **one** date format and no variant helper: a screen wanting a different one changes `display-value.ts` for the whole app — see [data-table-rule.md](./rules/data-table-rule.md) §3x. If `ErpViewField` lacks something you need, extend it in `@/shared/ui/erp-ui` rather than building a one-off. Use the shared `<DataTable>` for any nested tabular block (e.g. KYC docs) — never a hand-rolled table. The view is **read-only**: no form controls, no footer.
  - **Header actions in view mode (MANDATORY — every preview/view page has BOTH):** the `actions` slot MUST render exactly two buttons — **Back** (`variant="outline"`, → back to list) and **Edit** (primary, → `openEdit(viewing)` to swap straight into the edit form for the record being viewed). This is non-negotiable: a read-only detail/preview screen without a Back **and** an Edit button in its header is incomplete. Never show Save in view mode (the view is read-only), and never drop the Edit button. The breadcrumb's list crumb clicks back to the list (same `onClick` pattern as form mode), with a non-clickable trailing crumb that reads **exactly the same string as the header title** (see the ONE-headline-shape bullet above). Reference: `admin-company.tsx` and `masters-diesel-advance-route.tsx`.
  - **Data:** when the list rows don't carry the full record, fetch the detail by id on view (a `use*Detail(id)` query enabled only when `viewing` is set — idle otherwise) and gate the view render on its loading state with a `SectionLoader`, exactly as edit-mode prefill does.
- Reference implementation (local-state variant): `src/modules/foundation/admin/pages/organisation/admin-company/` (`admin-company.tsx` container + `company-view.tsx`).
- Reference implementation (URL-backed variant): `masters-vehicle-master.tsx`, `masters-diesel-advance-route.tsx` — both use `useScreenRouteState` and a 4-child leaf route (see [docs/ROUTING.md](../docs/ROUTING.md) → "Id-bearing Edit/View routes").

#### Before finishing ANY list ↔ form ↔ view screen — verify these

Do not report a container component done until each line is checked **in the file you just wrote**. The `key` line below is the one that keeps regressing: it silently produces a wrong API call, not a visual bug, so it survives a code read that "looks right".

- [ ] **Every `<ErpButton>` / `<ErpAddEntryButton>` in the `PageHeader` `actions` slot has a distinct `key`** — `key="cancel"`, `key="save"`, `key="back"`, `key="edit"`, `key="add"`, `key="export"`. Not "the two that collide" — **all of them, in all three branches** of the `isForm ? … : isView ? … : …` ternary. A missing key on the Add button today becomes the collision after someone adds a fourth mode.
- [ ] The view-mode Edit button is `type="button"` with `onClick={() => viewing && openEdit(viewing)}` and `disabled={!viewing}` — never `type="submit"`, never carrying a `form={…}` attribute.
- [ ] Save is the **only** button in the header with `type="submit"` + `form={FORM_ID}`, and it renders **only** in form mode.
- [ ] Manually exercised the exact path this bug hides in: open a row's **View**, then click **Edit** → the edit form must appear with **no toast** and **no network call**. Passing "Add → Save" and "row Edit → Save" does **not** cover it; the phantom submit only fires on the view → edit transition.
- [ ] **Local-state variant:** `openEdit` clears the other mode's state (`setViewing(null)`) and `backToList` clears both. **URL-backed variant:** this is handled by `useScreenRouteState` itself (only one of `editing`/`viewing` is ever non-null, derived from the URL) — nothing to add per screen.
- [ ] **URL-backed variant only:** the leaf route in the module's `*-routes.ts` file is the 4-child shape (`index` / `'new'` / `':id'` / `':id/edit'`, all four importing the same page module) — a screen calling `useScreenRouteState` against a route that's still a flat single leaf will 404 the moment `openEdit`/`openView`/`openCreate` navigates.

Quick self-check on the file before finishing:

```bash
# every header action button should print a key= — count the ErpButtons in the
# actions slot and make sure none of them came back bare
grep -nE '<Erp(Button|AddEntryButton|ExportButton)' src/modules/**/pages/<screen>/components/<screen>.tsx
```

## Mandatory Rules — Read Before Any Change

Before adding or changing **anything** (component, layout, style, file, import), you MUST first respect the project rules in `.claude/rules/`. These are not optional — they override default behavior:

- **[form-fields-rule.md](./rules/form-fields-rule.md) — READ FIRST for any form field or input control.** This is the **single** rule for every input in the app — text, number, select, date, file, checkbox, phone, GSTIN, editable-grid cell. It covers: (1) **which component** — a validated field uses an adapter from `@/shared/ui/form` (`FormInput`, `FormSelect`, `FormNumber`, `FormMobile`, `FormGstin`, …), a standalone/unvalidated control uses the bare control from `@/shared/ui/erp-ui`; never a raw element, never a bare control hand-bound to react-hook-form; (2) **validation lives in the zod schema** — required asterisks and messages are derived from it, `noValidate` means no HTML5 bubbles, optional numbers need `optionalNumber(...)`, and **every string field starts from `z.string().trim()` with `.trim()` first** (otherwise whitespace-only satisfies a required field and padded values reach the database) — the shared text controls additionally refuse a **leading** space at the keystroke, so a field can never look empty while holding `"   "`; (2b) **a submit blocked by validation is never silent, and never a toast** — `<Form>` itself focuses and scrolls to the first invalid control, so screens add no `onInvalid` toast and no scroll code of their own (a toast carries the backend's message only), and any new control must mark its invalid state with `aria-invalid` / `data-invalid` so the form can find it; (2c) **a limit is REPORTED, never APPLIED (§2.8)** — no control truncates, rounds or clamps: a 60-character name in a 50-character field, a 17-character GSTIN, a third decimal in a 2-decimal amount all stay exactly as typed, and the field renders "{Label} cannot exceed 50 characters.", turns `aria-invalid`, and blocks submit. Truncating silently ate the tail of a pasted value, never told the user a limit existed, and saved rounded numbers nobody typed. **Character-class filters are a different thing and stay** (digits-only still refuses letters, a GSTIN still drops punctuation). It is all inherited from `src/shared/ui/form/field-limit.ts` — a screen writes nothing, and any **new** capped control must go through `useFieldLimitError` + `overLengthMessage`/`overDigitsMessage`/`overPrecisionMessage` rather than a native `maxLength` or a `.slice()`; (2d) **ONE timing for every message — the first Save attempt, then live (§2.9)** — required, format and cap rules all surface together when Save is pressed and all track each keystroke afterwards, enforced centrally by `useFieldLimitError` (which holds its message until `formState.isSubmitted`) and not overridable per field; the submit **block** is never deferred, so an over-limit value cannot be saved even on a screen whose schema missed the cap. Still **declare every cap TWICE, from one exported constant** — the schema `.max()` blocks Save, the input's `maxLength` drives the shared wording, a textarea's `showCount` counter and that backstop block. The timing is declared once, in `FORM_VALIDATION_TIMING` (`@/lib/react-hook-form`), and applied by the shared `<Form>` **after** a screen's own `options` so it cannot be overridden per screen. An `ErpEditableGrid` cell reports on `showErrors` (drive it off `formState.isSubmitted`; it defaults to `false`, and **every** cell error is held back by it — required, `validate`, `maxLength` and `limit` alike), and a **bare** capped control outside any `<Form>` waits for its own confirm (the remark modal, §2.8a). `FormTagInput` is no exception either — an uncommitted draft chip goes through the same `useFieldLimitError`, because blur commits the draft and so tabbing out of a tag field reported before Save; (2e) **ONE over-limit wording app-wide — "{Field} cannot exceed {n} characters." (§2.10)** — always **built** with `getMaxLengthMessage(max, fieldLabel)` (or `getMaxDigitsMessage` / `getMaxLimitMessage`) from `@/core/utils`, using the same label the input renders; a cap sentence is **never** written into a module locale, so there is no `*Max` / `maxLength` key per screen and no per-screen `maxLen()` helper. The app previously shipped six different wordings for the same event ("must be at most", "must not exceed", "or fewer", "Maximum N characters allowed", one with a typo, one naming no field at all) and hand-written numbers that drifted from the schema's `.max()`; re-wording is now a one-line edit to `common/validation.json`. A rule that is not a cap ("Year cannot be in the future") keeps its own locale key; (3) **mandatory shared limits/formats from `@/core/utils`, because a `maxLength` is not a format** — `NUMERIC_FIELD_LIMITS` for every bounded number (and a `limit` on every editable `type: 'number'` grid column, which now carries its decimal scale too), `FormMobile` + `CONTACT_NO_LENGTHS` for every contact number (a mobile is exactly 10 digits, and there is no country/dial-code picker anywhere), `FormGstin` + the 15-char pattern for every GSTIN, `FormPincode` + `optionalPincode()` for every pincode (exactly 6 digits), `optionalPlaceName()` for every city/state/country **name** (letters only), each mirrored in the schema so submit is blocked; (3b) **a form with BOTH a Country and a State field cascades them (§3.15)** — `useGeoCascade` from `@/shared/geo`, Country rendered first, State offering only that country's states and disabled ("Select country first") until one is picked; never two independent `useCountryOptions` + `useStateOptions` calls side by side, which let "India + California" save cleanly. A state field with no country field beside it is a different case and keeps its plain `useStateOptions()`; (4) layout, locale and placeholder rules. Add a missing preset/adapter to the shared file — never hardcode a cap, regex or message inline.
- **[file-upload-rule.md](./rules/file-upload-rule.md) — READ FIRST for any file attached to a record: picking it, uploading it, previewing it, or downloading it.** Every upload (logo, KYC/compliance document, attachment, bill) goes through the one shared service `@/shared/storage` (→ `POST /system/storage/files/upload`, field `file`), and it runs **on pick, not on submit**: the field itself uploads the file the moment the user chooses it and writes the returned registry id into a sibling form field, so **Save is a single request** that already carries every `<x>FileId`. A screen wires this with **two props on `FormFile` — `ownerType` + `fileIdName`** — and writes no upload code at all: no per-screen upload hook, nothing in the submit handler. Two obligations come with it: Save's `disabled` must include **`useIsUploadingFiles()`** (saving between the pick and the response writes the record with no attachment and still returns 200), and a failed upload reports the backend's message **under the field** and withdraws the pick — never a toast. On edit the stored id is carried through form state (like a row `id`) and re-sent untouched when the user doesn't replace the file. A picked-then-abandoned file is left for the backend's reaper; nothing client-side deletes it. **§5b — `fileId`/`<x>FileId` must be an explicit key (even `undefined`) on every seeded row, schema default, and edit-prefill mapper for that row/record**, because `FormFile` registers that key into react-hook-form's live values the instant it mounts (via `useController`); an object that omits the key entirely (rather than setting it to `undefined`) leaves the live values with one more key than `defaultValues`, and RHF's dirty check fails on key count before it even compares values — so `isDirty` reads `true` forever from mount and Save calls the update API on every edit open, even with zero changes. This shipped in Vehicle Master, Driver Master and Company Master simultaneously and was invisible in a manual click-through. **§0 — there is exactly ONE preview in this app, and it is never written twice: `ErpFilePreview` draws it, `openFilePreview` blows it up full-size, and `useAttachedFile` (view/detail) / `useStoredFilePreview` (edit picker) resolve the file for it.** **§4c — which side a preview comes from is decided by one question: does this browser already hold the file?** The file the user just **picked** previews from the local `File` (`ErpFileInput` owns the one object URL, and revokes it), so **no `/url` request is made for it — on an add form or an edit form**: uploading on pick produces the `fileId`, not the preview. A file the browser does **not** hold — a record's stored attachment on an edit prefill, a view screen, a list cell — previews from the backend's presigned URL, resolved by `useStoredFilePreview` / `useAttachedFile`. A screen still builds no object URL of its own. Whenever a file has to be shown — a view field, a form picker, a list or nested-table cell, a card — compose those; never add a per-screen preview component/file, a bare `<img>`/`<a>` thumbnail, a hand-built lightbox `Dialog`, or a re-composition of `useFileUrl` + `fileNameFromObjectName` + `useDownloadFile` + `modalService`. The only legitimate per-screen file is a thin cell/row wrapper that exists solely because a hook can't run in a table `cell` or a field-array row, and whose whole body is the shared hook + the shared component. A variant the kit lacks gets added to `erp-file-preview.tsx` / `@/shared/storage`, not forked. Reference: `admin-company` (logo + KYC docs), `fleet-maintenance-expenses-view.tsx` (view-screen preview).
- **[theme-and-ui-rule.md](./rules/theme-and-ui-rule.md) — READ FIRST for any design/UI change.** Every visual change must be theme-aware (light/dark + presets, no hardcoded colors — use theme tokens) and must reuse the ERP UI kit (`@/shared/ui/erp-ui`) instead of hand-rolling components (buttons, cards, KPI tiles, badges, view fields, layouts). Whenever you add or modify any component, layout, color, border, background or text, apply this rule first. **Form fields are governed by form-fields-rule.md above** — this rule still applies to them for theming.
- **[data-table-rule.md](./rules/data-table-rule.md) — READ FIRST for any list/grid/tabular screen.** Any screen that shows rows of data MUST use a shared table engine, composing its search/filter toolbar from the shared toolbar pieces (`DataTableSearch`, `DataTableFilterSelect`, `DataTableFacetedFilter`) and its row actions from `viewAction`/`editAction`/`deleteAction` — never a hand-rolled table, filter bar, pager, or row-action buttons. **Two engines, picked by shape:** a flat list of records uses `<DataTable>` from `@/shared/table` with `createActionsColumn`; rows nested under **collapsible group headers** (a report grouped by date/vehicle/party, per-group subtotals, a `TOTAL` footer) use **`<ExpandableDataTable>` from `@/shared/expandable-table`** with `expandableActionsColumn` — never a group row faked into a flat list's `data`, a per-screen open-keys `Set`, or a hand-summed footer row. The grouped engine takes either server-grouped `groups` (any field names, via `getGroupKey`/`getGroupLabel`/`getGroupItems`/`getGroupCount` accessors) or flat `data` + `groupBy`, and each column declares its own aggregation — `cell` (child row), `groupCell` (group header), `totalCell` (TOTAL footer). Its **defaults are an accordion** (`expandMode="single"` — one group open at a time; pass `"multiple"` to opt out) and **the first 10 child rows behind a "Show more" row** (`itemsPageSize`); Show more reveals loaded rows, then calls `onLoadMoreItems(group, { groupKey, loadedCount, totalCount })` so the **screen** fetches the next slice through its own hook → query → api chain (the table never fetches, and `loadingMoreGroupKeys` drives its spinner). Everything else (`toolbar`, `manualPagination` — which pages the **groups**, `surface`, loading/empty) is the same contract as `<DataTable>`, and the pieces both engines share live in `@/shared/table` — never forked. See [data-table-rule.md](./rules/data-table-rule.md) §0. It also owns the two **value-rendering** rules that apply to list **and** view screens alike: §3y — a missing value renders the shared placeholder dash via a `display*` helper, never a blank cell or a hardcoded `'—'`; and **§3x — every date in the UI renders through `displayDate` from `@/core/utils`** (`10/07/2026`), never a screen-local formatter, because formatting an API day locally shows the wrong day. Reference: `src/app/pages/erp-ui-preview/components/data-table-demo.tsx`.
- **[modal-rule.md](./rules/modal-rule.md) — READ FIRST for any modal, dialog, or confirmation prompt.** Every confirm/approve/delete prompt MUST open the reusable confirm modal via `modalService.open(ModalType.CONFIRM, …)` from `@/shared/modal` — never `window.confirm`, a hand-built `AlertDialog`/`Dialog`, or per-screen dialog state. Dialog-based create/edit forms use `ModalType.FORM`, side panels use `ModalType.DRAWER`, a full-size preview of one **attached file** uses `ModalType.PREVIEW`, and domain workflow modals register via `registerModalComponent()`. A modal needing more width than the shared `max-w-lg` passes `contentClassName`. Reference: the "Reusable modal" card in `src/app/pages/erp-ui-preview/page.tsx`.
- **[api-integration-rule.md](./rules/api-integration-rule.md) — READ FIRST for any backend call.** Every API integration MUST flow one direction through four layers — **Component → hook (`use-<screen>`) → query (`use-*Query`/`use-*Mutation` + key factory) → api (`apiClient` calls) → API**. The api file only talks to the network, the query file only wraps React Query + owns the key factory (no side effects), the hook owns business logic + `invalidateQueries`, and the component owns UI (toast/modal/nav). Never let a component call `apiClient` or hold `useQuery`/`useMutation`. **An edit form always sends the FULL update payload** — every field the form shows is present on every save, a cleared one as explicit `null` (`orNull` from `@/core/utils`), never dropped: an update is a `PATCH`, so an omitted key leaves the stored value untouched and clearing a field on screen silently never clears it on the server. Fields the form has no input for are omitted or echoed from the loaded record, never nulled. **A picked date goes out as the day the user selected** — `toIsoDate` on create, `orNullDate` on update, both from `@/core/utils`; **never `.toISOString()`**, which serializes the picker's local midnight as an instant and so sends the previous day from any UTC+ zone (a 7 Aug pick in IST left as `2026-08-06T18:30:00.000Z` and was stored, and then displayed, as the 6th). **Every toast — success and error — shows the message the backend sent** (`onSuccess: (result) => notificationService.success(result.message)`), never a locally-authored string, not even as a fallback or prefix; a mutation's api fn passes `skipEnvelopeUnwrap: true` and returns `{ message, data }` so that message survives. Reference: `src/modules/foundation/masters` fuel-types (`*.api.ts` / `*-query.ts` / `use-masters-fuel-types.ts`).
- **[eslint-rule.md](./rules/eslint-rule.md) — ZERO ESLint errors, always.** `npm run lint` must report **0 errors** before any change is reported as done — actually run it, never infer it from a passing `tsc` (the error-level React Compiler `react-hooks/*` rules are ESLint-only and invisible to the type-checker). Never silence a rule to get there (no `eslint-disable`, no rule downgrade). Also covers file/folder kebab-case naming, unidirectional architecture, no cross-feature imports, barrel-only imports, absolute `@/` imports.
- **[typescript-rule.md](./rules/typescript-rule.md)** — no `any`, proper types, `import type`, and a passing `tsc --noEmit`.

**Definition of done for ANY code change — run all three, in this order:**

```bash
npx prettier --write <files you changed>
npm run lint      # must end in "0 errors"
npx tsc --noEmit  # must be silent
```

A change that leaves an ESLint error behind is an unfinished change — this is not deferred to the pre-commit hook, and not something to clean up in a later pass.

## code design pattern

- use singleton desing pattern if applicable
- use barrel pattern if applicable

### Reuse shared utilities — never hand-roll a duplicate (MANDATORY)

**When a piece of logic is generic (not screen-specific) and a shared utility already exists for it, import that utility — never re-declare a local copy in a component, hook, or service.** Cross-cutting helpers live in `src/core/utils` (imported from the barrel `@/core/utils`); reach for them first, and if the helper you need is missing, **add it there** rather than defining a one-off inside a screen.

**This is a HARD rule, and the API boundary is where it keeps breaking.** Before writing _any_ small helper — a normalizer at the top of an `.api.ts` file, a mapper helper in a `components/` folder, a formatter in a hook — **open `src/core/utils/index.ts` and look for it first.** Do not write the function because it is "only four lines"; four lines copied into 13 files is the same defect as forty. Concretely: a fix (the whitespace check `firstText` gained, the timezone-safe day `parseApiDay` reads) lands in one copy and silently never reaches the other twelve, and the copies drift into subtly different answers for the same input.

**A different NAME is not a different function.** Every one of these was a copy of a helper that already existed, hidden behind a local name — `toNum`, `toStr`, `toId`, `toDate`, `parseDate`, `firstDefined`, `toOptionalNumber`. Match on what the body **does**, not what it is called.

**The helpers a screen keeps re-writing — import these, always:**

| Writing this by hand                                    | Use instead (`@/core/utils`)                                                                           |
| ------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| First non-blank string among several field spellings    | `firstText`                                                                                            |
| `Number(v)`, `undefined` when absent/invalid            | `toNumber`                                                                                             |
| Same, defaulting to `0`                                 | `toNumberOr0`                                                                                          |
| `String(id)`, `''` when absent                          | `toIdString`                                                                                           |
| `String(id)`, `undefined` when absent                   | `toOptionalId`                                                                                         |
| `value.slice(0, 10)` on an API datetime                 | `toDateOnly`                                                                                           |
| API datetime → a `Date` for a picker                    | **`parseApiDay`** — never `new Date(value)`, see below                                                 |
| `Date` → `"2026-07-10"` for a payload                   | `toIsoDate` (create) / `orNullDate` (update)                                                           |
| A date shown to the user                                | `displayDate` / `displayDateTime` / `displayTime`                                                      |
| A missing value shown as a dash                         | `displayText` / `displayInr` / `displayNumber` / …                                                     |
| Blank → `undefined` (create) / `null` (update)          | `orUndef`, `orUndefArray` / `orNull`, `orNullNumber`                                                   |
| Narrowing an `unknown` payload to an object             | `isRecord`                                                                                             |
| Summing a list, sorting a group, splitting a comma list | `sumBy`, `sortByGroupField`, `splitCommaList`                                                          |
| Saving a blob to disk                                   | `downloadBlob`                                                                                         |
| A limit, a format, a validation message                 | `NUMERIC_FIELD_LIMITS`, `field-formats.ts` — see [form-fields-rule.md](./rules/form-fields-rule.md) §3 |

`@/core/utils/index.ts` is the full list; this table is only the frequently-copied end of it.

**`new Date(value)` on an API date is never right.** A local `toDate` / `parseDate` built that way reads a day as an _instant_ and lands on the previous/next calendar day depending on the viewer's offset — so a record's View and its Edit form disagree by a day. `parseApiDay` reads the literal date part, exactly as `displayDate` does.

**If the helper genuinely does not exist, add it to `src/core/utils` and export it from the barrel** — a new file (`first-text.ts`-style, one helper per file), a doc comment saying why it exists, then import it. Never leave the one-off in the screen "for now". If a shared helper is _almost_ right, give the call site the difference explicitly (`toDateOnly(x) ?? ''`, `toNumber(x) ?? null`) rather than forking a variant.

**Audit before calling any change done** — these three greps are the whole check:

```bash
# 1. is any name exported from @/core/utils re-declared locally?
grep -rnE "^\s*(export )?function (firstText|toNumber|toNumberOr0|toDateOnly|toIsoDate|toIdString|toOptionalId|parseApiDay|orNull|orUndef|isRecord|sumBy|downloadBlob|displayDate)\b" src --include=*.ts --include=*.tsx | grep -v core/utils

# 2. the same functions under a local alias
grep -rnE "^\s*(export )?function (toNum|toStr|toId|toDate|parseDate|firstDefined|toOptionalNumber)\b" src --include=*.ts --include=*.tsx

# 3. the hand-rolled bodies themselves
grep -rn "slice(0, 10)\|createObjectURL\|toLocaleDateString" src --include=*.ts --include=*.tsx | grep -v core/utils
```

Greps 1 and 2 must come back **completely empty**. Grep 3 has exactly four legitimate hits, all in the shared kit — `erp-file-input.tsx` (the picked-file object URL it owns and revokes), `calendar.tsx` (a shadcn `data-day` attribute), `erp-editable-grid-cell.tsx` (its `Date` fallback stringifier) and two prose comments; **anything under `src/modules` is a violation.** Reference incident: a single `firstText` had **13** local copies, and `toNumber` / `toDateOnly` / `toIsoDate` / `toId` / `toDate` another **24** between them — all removed in the 2026-08-20 sweep, which also fixed four `new Date(value)` date-pickers in Driver Master and Vehicle Master as a side effect.

**File download is the canonical case.** Any component that triggers a browser download for a blob (export CSV/XLSX/PDF, any API blob response) MUST use `downloadBlob` from `@/core/utils` — do **not** re-implement the `URL.createObjectURL` → `<a download>` → `revokeObjectURL` dance inline.

```tsx
// ❌ WRONG — re-declaring the helper in every screen that exports
function downloadBlob(blob: Blob, fileName: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  link.click();
  URL.revokeObjectURL(url);
}

// ✅ RIGHT — import the shared utility from the barrel
import { downloadBlob } from '@/core/utils';

const handleExport = async (format: string) => {
  const blob = await exportAsync({ ...listParams, format });
  downloadBlob(blob, `${t.export.fileName}.${format}`);
};
```

Reference: `src/core/utils/download-blob.ts`; used by the fleet repairable-stock-outward, gate-expenses-master, and tyre-category-master export handlers.

**Showing a date is the other canonical case — and the one with a bug attached.** Whenever a date reaches the UI — a list cell, a view/detail field, a nested table, a KPI caption, a modal, an export label — it renders through **`displayDate` from `@/core/utils`** (`10/07/2026`). It is the app's only date formatter: no screen-local `formatDate`, no `toLocaleDateString`, no `Intl.DateTimeFormat`, no bare date-fns `format()`, and no second date format.

```tsx
// ❌ WRONG — formatting a date inside a screen prints the WRONG DAY. The backend
// sends a day as a full timestamp: 2026-07-10T18:30:00.000Z IS 10 Jul, but that
// instant is 11 Jul 00:00 in IST (+05:30), so this renders 11/07/2026.
{
  new Date(record.workDate).toLocaleDateString('en-GB');
}

// ✅ RIGHT — reads the literal date part, so no timezone can shift the day
import { displayDate } from '@/core/utils';
{
  displayDate(record.workDate);
}
```

`displayDate` already substitutes the placeholder dash for a missing value, so a screen needs no `!iso` branch of its own. Use `displayDateTime` / `displayTime` **only** for a moment whose time genuinely matters (`createdAt`, `lastLoginAt` shown with a clock) — never for a day-only field. A different format is a change to `src/core/utils/display-value.ts` for the whole app, never a new per-screen helper. Full rule: [data-table-rule.md](./rules/data-table-rule.md) §3x.

**Sending a date is the same case in reverse, with the same bug.** A date the user picked goes into the payload as **the day they picked**, via **`toIsoDate`** (create) or **`orNullDate`** (update) — never `.toISOString()`, and never a screen-local formatter:

```ts
// ❌ WRONG — `FormDate` stores LOCAL midnight, so serializing the instant sends
// the PREVIOUS day: a 7 Aug pick in IST leaves as "2026-08-06T18:30:00.000Z",
// is stored as the 6th, and `displayDate` then honestly renders the 6th.
expiryDate: doc.expiryDate ? doc.expiryDate.toISOString() : undefined,

// ✅ RIGHT — local calendar parts on the way out, exactly as displayDate reads
// them on the way in
import { orNullDate, toIsoDate } from '@/core/utils';

bookDate: values.bookDate ? toIsoDate(values.bookDate) : undefined,  // create
expiryDate: orNullDate(doc.expiryDate),                              // update (cleared → null)
```

The two halves fail in a way that frames the wrong one: with `.toISOString()` in the mapper the stored day is already wrong and the display is faithful, so **"the date shifts by a day after saving" is a payload bug, not a display bug** — check the request body before touching a cell. Full rule: [api-integration-rule.md](./rules/api-integration-rule.md) → "A Picked Date Goes Out as the Day the User Selected".

**Normalizing a raw API payload is the third canonical case — and the most duplicated.** Every `api/` file turns a raw payload into the module's record type, and the same handful of coercions do that work in all of them: an id that may arrive as `1` / `"1"` / `""` / `null`, a number that may arrive as `"200"`, a label that may arrive under three field-name spellings, a datetime cut back to its day, an unknown payload probed key by key. **All of them already exist in `@/core/utils`** — `toIdString` / `toOptionalId` / `toIdOrNull`, `toNumber` / `toNumberOr0` / `toNumberOrNull`, `firstText`, `toTextOrNull`, `toDateOnly`, `isRecord`, `toEnumOr` / `toEnumOrNull`. Import them; never declare a private copy above `normalize*()`.

```ts
// ❌ WRONG — a local copy at the top of the api file. This is how ~30 of these
// accumulated, each subtly different: this `firstText` lets a whitespace-only
// `"   "` win (it's truthy), so the record carries a blank-looking label instead
// of falling through to the next spelling.
function firstText(...values: (string | undefined | null)[]): string | undefined {
  return values.find((value): value is string => Boolean(value));
}
function toIdOrNull(value: string | number | null | undefined): string | null {
  return value === null || value === undefined || value === '' ? null : String(value);
}

// ✅ RIGHT
import { firstText, toIdOrNull } from '@/core/utils';
```

Pick the variant by the **empty value the record type declares** — `''` for a select's keyed value, omitted for a create body, `null` for a nullable FK; and `toNumberOrNull`, not `toNumberOr0`, for an optional measurement, or a missing tonnage prints a real-looking `0`. `normalize<Thing>()` itself stays local (it names that endpoint's own fields). `core/` sits below `modules/`, so this is never blocked by the cross-feature import rule. Full rule, including the audit grep and the grandfathered-violations note: [api-integration-rule.md](./rules/api-integration-rule.md) → "The api Layer's Normalizers Come From `@/core/utils`".

**Humanizing a raw backend value into a display label is another canonical case.** A status/type/outcome value the screen has no explicit translation for (`not_claimed`, `on-hold`, an unmapped lead type) still has to read naturally — Title Case, not the raw snake_case/kebab-case — instead of rendering blank. Every place that does this (a report's `format<X>Label()` fallback, `StatusBadge`, `ErpStatusBadge`) reduces to the exact same regex, so it MUST call **`titleCase`** from `@/core/utils` (`src/core/utils/title-case.ts`) rather than re-declaring a local `toTitleCase()`.

```ts
// ❌ WRONG — a private copy per file/component. This is how the identical
// function ended up duplicated five times (two badge components, three report
// `-data.ts` files) before it was consolidated into the shared util (2026-08-25).
function toTitleCase(value: string): string {
  return value.replace(/[-_]/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase());
}

// ✅ RIGHT
import { titleCase } from '@/core/utils';

return knownLabels[status] ?? titleCase(status);
```

Reference: `src/shared/table/table-badge.tsx` (`StatusBadge`), `src/shared/ui/erp-ui/erp-badge.tsx` (`ErpStatusBadge`), and a report screen's `format<X>Label()` fallback (`sales-sales-register-data.ts`, `sales-sales-visit-report-data.ts`, `fleet-vehicle-accident-report-data.ts`).

**Attached files are the other canonical case, and they live in `@/shared/storage`** (a hook can't live in `core/utils` — `core/` sits below `shared/`, so it may not import it). Never compose these by hand in a screen:

| Need                                                    | Use                                                                   |
| ------------------------------------------------------- | --------------------------------------------------------------------- |
| Show + download a stored file on a view/detail screen   | **`useAttachedFile`** → `<ErpFilePreview {...previewProps} />`        |
| Preview a stored file in an **edit form's** picker      | **`useStoredFilePreview`** → `{...pickerProps}` on `FormFile`         |
| Show a file in a list cell / nested table / card        | the same two hooks, in a thin cell wrapper (a hook needs a component) |
| Open one file full-size                                 | **`openFilePreview`** from `@/shared/modal` — the only PREVIEW caller |
| Download a stored file anywhere else (row action, menu) | **`useDownloadFile`**                                                 |
| Upload a picked file (on pick)                          | `FormFile` + `ownerType` + `fileIdName` — never manual in a screen    |
| Block Save while an upload is in flight                 | `useIsUploadingFiles`                                                 |
| Turn any stored reference into a loadable URL           | `useFileUrl` — it calls `GET /system/storage/files/{objectName}/url`  |

**A preview is COMPOSED from that table, never written again.** `ErpFilePreview` is the app's only file preview — it already owns the image-vs-document split, the hover eye, the download button, the theme tokens and the accessible labels, and every preview bug fixed so far was fixed _in it_. So a new preview component/file per screen, a bare `<img src={…}>` thumbnail, a hand-built lightbox `Dialog`, or a fresh `useFileUrl` + `fileNameFromObjectName` + `modalService` composition is a copy that starts out missing those fixes and never receives the next one. A variant the kit lacks is a prop on `erp-file-preview.tsx` (or a new return value on the hook), not a fork. Full rule: [file-upload-rule.md](./rules/file-upload-rule.md) §0.

```tsx
// ❌ WRONG — re-assembling the resolve → preview → download dance per screen
const { url } = useFileUrl(record.documentPath);
const { downloadFileAsync, isDownloading } = useDownloadFile();
const handleDownload = useCallback(async () => { … }, [ … ]);
const handlePreview = useCallback(() => modalService.open(ModalType.PREVIEW, { … }), [ … ]);

// ✅ RIGHT — one hook owns all of it
const document = useAttachedFile({
  reference: record.documentPath,
  fileName: record.documentName,
  fallbackLabel: v.labels.document,
});
<ErpFilePreview {...document.previewProps} />;
```

Each of those steps has a constraint that is invisible until it breaks — the `/download` endpoint is Bearer-authenticated (a plain `<a download>` 401s), the download must use the stored `objectName` rather than the presigned preview URL, and `modalService.open` props are a frozen snapshot so a live `isPending` flag never updates. Full rules: [file-upload-rule.md](./rules/file-upload-rule.md) §4a.

**Reading a stored file ALWAYS costs a request — the URL comes from the API response, never from the record.** What a record (or its detail response) holds is a **reference**: a bare `objectName`, or a serve path like `/api/v1/system/storage/files/company-kyc-document/a0efb0c8….jpg`. Neither is loadable — the serve route and `/download` are both Bearer-authenticated, so a browser can't fetch them for an `<img src>` / `<a href>`, and a `publicUrl` only resolves while the bucket is public. Before it is rendered anywhere, it is exchanged for a **presigned** URL:

```
GET /system/storage/files/{category}/{name}/url   →   { url: "https://…?X-Amz-…" }
```

and the response's `url` is the only thing that reaches an `<img>`, an `<a>`, or the preview modal. That call lives in `useFileUrl` (and is skipped when the reference already is a URL), so a screen only ever picks the hook for its situation:

```tsx
// ❌ WRONG — renders the reference itself: broken thumbnail, empty preview modal,
// and "Open in new tab" 401s. Nothing throws; the screen just looks broken.
<FormFile existingFileUrl={detail.logo?.url} … />
<img src={record.documentPath} />

// ✅ RIGHT — view/detail screen
const document = useAttachedFile({ reference: record.documentPath, … });
// ✅ RIGHT — EDIT form's picker
const storedLogo = useStoredFilePreview({
  reference: detail?.logo?.url,
  fileName: detail?.logo?.originalName,
});
<FormFile name="logo" control={control} label={fields.logo} {...storedLogo.pickerProps} />;
```

The presigned URL is what makes preview **and** "Open in new tab" work with nothing extra wired, and it expires — so it is fetched through React Query (`storageKeys.fileUrl`) rather than cached in state, and it resolves a moment after render (both hooks show the filename meanwhile instead of a thumbnail pointed at nothing). Never rebuild the endpoint path by hand: `storageKeyPath` encodes `:category/:name` as two segments, and `encodeURIComponent` over the whole key 404s every lookup. Full rule: [file-upload-rule.md](./rules/file-upload-rule.md) → "The one rule for READING a file" + §5a.

### Import from the barrel, never the deep file (MANDATORY)

**When a folder has a barrel (`index.ts` / `index.tsx`), import from the folder path — never from a specific file inside it.** The import specifier must end at the folder that owns the barrel; the barrel re-exports the symbol.

```ts
// ❌ WRONG — deep-imports a specific file even though the folder has a barrel
import { ErpButton } from '@/shared/ui/erp-ui/erp-button';
import { DataTable } from '@/shared/table/data-table';
import { useAdminRoles } from '@/modules/foundation/admin/hooks/users-access/use-admin-roles';
import type { AdminRole } from '@/modules/foundation/admin/types/users-access/admin-roles';

// ✅ RIGHT — import from the barrel folder
import { ErpButton } from '@/shared/ui/erp-ui';
import { DataTable } from '@/shared/table';
import { useAdminRoles } from '@/modules/foundation/admin/hooks';
import type { AdminRole } from '@/modules/foundation/admin/types';
```

**Scope — collapse to the barrel that owns the layer:**

- **Shared / core / lib** — always the barrel: `@/shared/ui/erp-ui`, `@/shared/ui/form`, `@/shared/table`, `@/shared/modal`, `@/shared/ui/loader`, `@/core/errors`, `@/core/notifications`, `@/locales`, etc.
- **Feature modules** — import each layer through **its layer barrel**: `@/modules/<group>/<module>/hooks`, `/api`, `/queries`, `/types`. Do **not** deep-import `.../hooks/<subfolder>/use-x` or `.../types/<subfolder>/x`.

**Two exceptions (keep the deep/relative path):**

1. **No barrel exists.** Sibling files inside a screen's own `pages/<screen>/components/` folder have no `index.ts` (adding one would trip `react-refresh/only-export-components` because those files mix data + components) — keep the relative import (`./role-list`, `./role-data`).
2. **A file must never import its own layer's barrel** (it would be a circular import — the barrel re-exports that same file). So an `api/` file importing `api/endpoints`, or a `queries/` file importing a sibling query, keeps the direct path (`@/modules/<group>/<module>/api/endpoints`). Only import a **different** layer's barrel (a query imports `.../api` + `.../types`; a hook imports `.../queries` + `.../types`; a component imports `.../hooks` + `.../types`).

The `src/shared/ui/` shadcn primitives remain the documented flat-file exception (import `@/shared/ui/button`, the file, since there is no per-primitive barrel — see the File Naming Conventions exception above).

## State Management

### When to use `useState` vs Zustand

**Use React's `useState`** for:

- Simple, isolated component state (single boolean, counter, form input)
- State that doesn't need to be shared across multiple components
- UI-only state (collapsible panels, dropdowns, modals)

**Use Zustand** for:

- Complex state with multiple related values (3+ states with interdependencies)
- State that needs to be shared across multiple modules or components
- State that needs persistence or synchronization across the app
- State with derived values or complex updates

**Example — App Layout:**

- ✅ Two simple booleans (`sidebarExpanded`, `panelOpen`) → `useState` is appropriate
- ❌ If adding group collapse memory, width preferences, animations → refactor to Zustand

**Zustand store location:** `src/modules/<feature>/stores/` (follow existing auth store pattern)

See existing `useAuthStore` in `src/modules/auth` for project-standard Zustand implementation.

## Internationalization / Static Text

No raw, hardcoded, user-facing strings in components, hooks, services, or config files — the app must support multiple languages. Every label, button text, message, title, or placeholder goes through the locale system.

- **Two tiers — pick the right one.** Cross-cutting text (2+ modules, or needed by core infra / always-rendered chrome) goes in the central `src/locales/en/labels/common/*.json`, read via `getLocale()` / **`useLocale()`** from `@/locales`. Domain-specific text (a screen title, column header, form label — the common case) goes in that feature's **own** `src/modules/<domain>/locales/en/*.json`, read via that module's own accessor pair — `getInventoryLocale()` / **`useInventoryLocale()`**, `getAuthLocale()` / **`useAuthLocale()`**, etc. — built with `createLocaleAccessor()` **and `createReactiveLocaleAccessor()`** from `@/locales`. Every module's `locales/index.ts` exports both from the same `<x>Locales` map (see `src/modules/settings/locales/index.ts`); `scripts/scaffold-module-layers.mjs` generates both automatically for a brand-new module, so this needs no manual setup going forward.
- **Why it matters:** central-only locale files funnel every domain's strings into the eager main bundle, because core infra (e.g. `core/errors`) imports the central locale object at boot. Module-owned locale files are only reachable from that module's own lazy-loaded route, so they code-split with the page instead. This was a real, verified bundle-bloat bug — see [LOCALE_SYSTEM.md](../docs/LOCALE_SYSTEM.md).
- **Inside a component, call the `useXLocale()` HOOK in the component/hook body — never cache `getXLocale()` in a module-level constant.** This used to be reversed advice ("prefer a module-level constant, evaluated once"), and it is exactly what made a language switch require a full `window.location.reload()`: `getXLocale()` reads a plain, non-reactive variable, so a `const t = getInventoryLocale().productList;` sitting at the top of a file is evaluated ONCE, the moment that file's chunk is first imported, and then never again — remounting the component doesn't help, because the module itself is cached by the JS engine for the life of the page. `useXLocale()` is the reactive twin: built on `useSyncExternalStore`, it re-renders the calling component the instant `setCurrentLanguage()` runs, with no reload. Use `getXLocale()` only where a hook genuinely cannot go — a zod schema factory invoked outside render, a non-React utility, a one-off read inside an event handler/callback (which re-reads fresh at call time anyway, so staleness isn't a concern there).

  ```tsx
  // ❌ WRONG — module-level constant: frozen at whatever language this chunk
  // loaded under; a language switch will never update this file's text again
  const t = getInventoryLocale().productList;
  export function ProductList() {
    return <h1>{t.title}</h1>;
  }

  // ✅ RIGHT — called inside the component body, re-renders on language switch
  export function ProductList() {
    const t = useInventoryLocale().productList;
    return <h1>{t.title}</h1>;
  }
  ```

  If a value from `useXLocale()` is used as a **default parameter value** in a destructured props signature (`confirmLabel = actions.confirm`), that default is captured from whatever was in scope at import time too — move the fallback inside the function body instead: destructure the prop with no default, call the hook, then `const resolvedConfirmLabel = confirmLabel ?? actions.confirm;` (see `src/shared/modal/components/confirm-modal.tsx`). Audit for a regression: `grep -rnE "^const t = get[A-Za-z]+Locale\(\)" src/modules --include=*.tsx` should return nothing for files that render text in a live component.

- **This bug has (at least) five shapes — a sweep or a new module isn't done after fixing only the `.tsx` one.** The frozen-`getXLocale()`-at-module-scope pattern above is the most common shape, but the same mistake recurs in four other file kinds that have no component body for a hook to live in. Each needs a different fix, because none of them can call `useXLocale()` directly:
  1. **A zod schema's validation MESSAGES** (`*-schema.ts`) — a `z.object({ name: z.string().min(1, v.nameRequired) })` built from a module-level `const v = getXLocale().xScreen.validation` bakes every error message into the schema object itself, at import time. Fix: make the schema a **factory function** that takes the resolved locale slice as a parameter (default: a non-reactive `getXLocale()` read, so a non-reactive caller still works), and have the form build it with `useMemo(() => xSchema(t), [t])` using its already-reactive `t`:

     ```ts
     // ❌ WRONG — v is frozen the moment this schema module first loads
     const v = getMastersLocale().mastersFuelTypes.validation;
     export const mastersFuelTypesSchema = z.object({
       code: z.string().min(1, v.codeRequired),
     });

     // ✅ RIGHT — a factory; same exported name, now callable
     type MastersFuelTypesLocale = ReturnType<typeof getMastersLocale>['mastersFuelTypes'];
     export function mastersFuelTypesSchema(
       t: MastersFuelTypesLocale = getMastersLocale().mastersFuelTypes
     ) {
       const v = t.validation;
       return z.object({ code: z.string().min(1, v.codeRequired) });
     }
     ```

     ```tsx
     // in the form component — t is already the reactive useMastersLocale() value
     const schema = useMemo(() => mastersFuelTypesSchema(t), [t]);
     <Form schema={schema} ...>
     ```

     Do **not** rename the schema export as part of this fix — only its shape changes (frozen object → callable factory), never its name. A nested sub-schema (line items, documents, repeatable rows) that itself reads locale text gets the identical factory treatment, composed into the top-level one; a sub-schema with no locale-derived messages needs no change. Reference implementation: `branch-schema.ts` / `company-schema.ts` (`admin-branch` / `admin-company`).

  2. **A DATA-ONLY helper file** (`*-data.ts`, `*-constants.ts` — deliberately no component, to dodge `react-refresh/only-export-components`) that exports a label map or option list built the same way (`TYPE_LABELS`, `STATUS_LABELS`, `MONTH_OPTIONS`, a re-exported locale sub-object). It can't call a hook either. Fix: the same parameter-injection shape — the export becomes a function taking the locale slice, called by the one `.tsx` consumer that already holds the reactive value (wrap the call in `useMemo` only if it's genuinely worth memoizing; a tiny object literal usually isn't). If one export is built from another in the same file (`TYPE_OPTIONS` built from `TYPE_LABELS`), thread the parameter through both.

  3. **Core/lib infra loaded once at app boot** (e.g. `src/core/errors/error-registry.ts`'s network/timeout/fallback error messages, read by the axios interceptor) — not a screen, not a schema, so it's easy to forget when auditing. If every call site already invokes the function fresh at the moment an error actually occurs (rather than caching the result), the fix is simpler than a hook: just move the `getLocale()` read **inside** the function body instead of module scope, so it re-evaluates on each call. This matches the "one-off read inside an event handler/callback" exemption below — no React involved at all.
  4. **A SHARED, widely-imported constant** (e.g. `@/shared/table`'s `ALL_STATUSES_PLACEHOLDER` — the "All Status" filter placeholder used by nearly every list screen) is the highest-blast-radius version of shape 2: because the barrel is imported so early and so widely, the frozen value looks like "this text is just permanently in the wrong language" rather than "this text never updates," and fixing only the one screen a bug was reported on leaves every other screen importing the same constant broken too. Same fix as shape 2 (a reactive `use*` hook alongside the deprecated constant, migrated one call site at a time), but **grep every consumer of the shared constant across the whole app before calling it done** — a shared export's fix is only as complete as its least-migrated caller.

  The one grep that catches all five shapes at once (run it broadly — not scoped to `.tsx`, not scoped to `src/modules`): `grep -rnE "^const [a-zA-Z]+ = get[A-Za-z]*Locale\(\)" src`. A factory-shaped function name (`getXSchema(...)`) does **not** prove the code inside it is reactive — confirm by reading it, since a mode-selector wrapping two still-frozen constants looks identical from the outside. For shape 4 specifically, also grep the shared constant's own name (e.g. `grep -rln "ALL_STATUSES_PLACEHOLDER" src`) to find every remaining non-reactive consumer, not just the screen a bug was reported against.

- Before adding a new string, check `common/actions.json` and `common/fields.json` first — generic labels (Save, Cancel, Confirm, Dismiss, Edit, Delete, …) likely already exist; don't duplicate them in a feature-specific file.
- Applies everywhere text reaches the user: React components, error registries/strategies (`src/core/errors`), notification/alert/modal defaults, validation messages — not just page-level copy.
- Exceptions (fine to leave hardcoded): brand/app name constants, and `sr-only`/`aria-label` text inside vendored shadcn primitives under `src/shared/ui/` (generated by the shadcn CLI — revisit only if the ERP requires localized screen-reader output).
- **Dropdown/select OPTION VALUES are always English — this is the big exception, and it's easy to under-scope.** Any `ErpSelectOption[]` / `FormSelect` option list backing a fixed, enum-like set of choices (a Status filter, a Type select, an Old Part / Outcome / Group-By select, a claim/approval/document-status select, …) is hardcoded in English, never sourced from the locale — **only the field's own label, its placeholder, and its column header stay localized.** The label text and the option text are two different things on the same field; don't conflate them. This applies **everywhere the same option value is displayed**, not just the dropdown itself — a list-column badge or a view-screen field rendering that same value must show the identical English text, or the same record reads as one thing in the dropdown and another in the badge. Build the label map first (e.g. `TYPE_LABELS`), then derive the dropdown's `ErpSelectOption[]` from it, so the two can't drift — see `fleet-maintenance-expenses-data.ts` (`TYPE_LABELS` → `TYPE_OPTIONS`) and the shared `STATUS_FILTER_OPTIONS` in `@/shared/table` (used by every screen's Active/Inactive filter, option values hardcoded English by design) for the pattern. The Status filter's **placeholder** (the localized "All Status" hint text, as opposed to its hardcoded-English option values) is a different thing and must stay reactive — call **`useAllStatusesPlaceholder()`** from `@/shared/table` inside the component body, never the deprecated `ALL_STATUSES_PLACEHOLDER` constant (frozen at whatever language the shared barrel first loaded under — see shape 4 above; the sibling `useAllTypesPlaceholder()` / `useAllPlaceholder()` cover the "All Types" / generic "All" placeholders the same way). When removing the locale accessor's last use in a file, also remove the now-dead `getXLocale()` import/const — don't leave it orphaned.
- Full reference: [LOCALE_SYSTEM.md](../docs/LOCALE_SYSTEM.md).
