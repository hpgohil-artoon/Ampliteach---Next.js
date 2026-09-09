---
name: robust-error-handling
description: 'Set up enterprise-grade error handling in React+TypeScript projects. Use this skill whenever the user wants to: add robust error handling to a new project, decouple forms from error display logic, centralize API error management, implement pluggable error strategies (form/toast/alert errors), or create a reusable error handling system. Works with React+Vite+TypeScript+react-hook-form+Radix projects.'
compatibility:
  platforms:
    - Node.js
    - npm
    - yarn
    - TypeScript projects
  required_tools:
    - Bash
    - Read
    - Write
    - Edit
    - Glob
---

# Robust Error Handling System Setup

This skill sets up a complete enterprise-grade error handling system in your React+TypeScript project. After setup, you'll have:

- **Automatic error normalization** at the API layer (Axios interceptor)
- **Pluggable display strategies** — display errors as form validation, toasts, or alert dialogs
- **Config-driven modes** — switch error display without touching form components
- **Notification adapter pattern** — swap toast libraries without code changes
- **Type-safe error handling** — full TypeScript coverage with ApiError class

## How It Works

The system follows a three-layer architecture:

1. **Normalization** — Axios interceptor converts all API errors to a typed `ApiError` class with code, statusCode, and fieldErrors
2. **Strategy** — Error display strategies (FormErrorStrategy, ToastErrorStrategy, AlertErrorStrategy) are selected from a config file based on context
3. **Hook** — Single `useErrorDisplay` hook that forms use; reads config and creates the appropriate strategy

### Error Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                    USER SUBMITS FORM                             │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│              MUTATION CALLS API (via Axios)                      │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                   API RETURNS ERROR                              │
│         (e.g., 401 with { code, message, errors })              │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│        AXIOS INTERCEPTOR (Normalization Layer)                   │
│  ✓ Catch error                                                   │
│  ✓ Extract code, message, field errors                           │
│  ✓ Convert to typed ApiError                                     │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│      React Query Mutation rejects with ApiError                  │
│              Calls: onError(apiError)                            │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│        useErrorDisplay Hook (Integration Layer)                  │
│  1. Read errorDisplayConfig['context']                           │
│  2. Resolve error via resolveError()                             │
│  3. Create strategy based on config mode                         │
└────────────────────────┬────────────────────────────────────────┘
                         │
        ┌────────────────┼────────────────┐
        │                │                │
        ▼                ▼                ▼
    ┌───────────┐   ┌──────────┐   ┌──────────┐
    │   FORM    │   │  TOAST   │   │  ALERT   │
    │  Strategy │   │ Strategy │   │ Strategy │
    └─────┬─────┘   └────┬─────┘   └────┬─────┘
        │                │                │
        │ setError()     │ notify         │ openAlert()
        │                │                │
        ▼                ▼                ▼
   ┌────────────┐  ┌────────────┐  ┌─────────────┐
   │ Form State │  │Toast Notif │  │Alert Dialog │
   │ Updated    │  │ (top-right)│  │  (Modal)    │
   └────────────┘  └────────────┘  └─────────────┘
        │                │                │
        └────────────────┼────────────────┘
                         │
                         ▼
            ┌────────────────────────┐
            │ ERROR DISPLAYED TO USER│
            └────────────────────────┘
```

### Configuration-Driven Display

The **errorDisplayConfig** determines the strategy:

```
┌──────────────────────────────────────────────────────────────┐
│  errorDisplayConfig: Record<string, ErrorDisplayMode>        │
├──────────────────────────────────────────────────────────────┤
│  login: 'form'           → FormErrorStrategy                 │
│  register: 'form'        → FormErrorStrategy                 │
│  createOrder: 'toast'    → ToastErrorStrategy                │
│  deleteRecord: 'alert'   → AlertErrorStrategy                │
│  settingsUpdate: 'toast' → ToastErrorStrategy                │
└──────────────────────────────────────────────────────────────┘
```

**Change display mode = Edit config only (no form component changes)**

```
BEFORE:                      AFTER:
login: 'form'       ──→      login: 'toast'
  ↓                           ↓
  Inline errors       Same form component
                      Toast notification
```

### Example: User enters wrong password

```
User submits form
  ↓
API returns 401 with { code: "INVALID_CREDENTIALS", message: "Invalid email or password" }
  ↓
Axios interceptor normalizes to ApiError
  ↓
TanStack Query mutation calls onError(apiError)
  ↓
useErrorDisplay('login') reads config: mode = 'form'
  ↓
resolveError() extracts: { message: "Invalid email...", code: "INVALID_CREDENTIALS", ... }
  ↓
createErrorStrategy('form') → returns FormErrorStrategy
  ↓
FormErrorStrategy.handle() calls setError('root', { message: '...' })
  ↓
Form re-renders with error displayed inline below header
```

**If config changed to `login: 'toast'`:**

- Same error flow up to strategy selection
- `createErrorStrategy('toast')` → returns ToastErrorStrategy
- `ToastErrorStrategy.handle()` → calls `notificationService.error(message)`
- Toast appears top-right, form unchanged ✓

### System Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                      REACT COMPONENT LAYER                          │
│  ┌─────────────┐  ┌──────────────┐  ┌─────────────────┐             │
│  │ LoginForm   │  │ RegisterForm │  │ Any Other Form  │             │
│  │ useError    │  │ useError     │  │ useError        │             │
│  │ Display()   │  │ Display()    │  │ Display()       │             │
│  └──────┬──────┘  └──────┬───────┘  └────────┬────────┘             │
│         │                │                   │                      │
└─────────┼────────────────┼───────────────────┼──────────────────────┘
          │                │                   │
          └────────────────┼───────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────────┐
│         USE-ERROR-DISPLAY HOOK (Integration Point)                  │
│  ┌─────────────────────────────────────────────────────────┐        │
│  │ useErrorDisplay(context, setErrorRef)                  │        │
│  │  • Reads errorDisplayConfig[context]                   │        │
│  │  • Calls resolveError(error)                           │        │
│  │  • Creates strategy: createErrorStrategy(mode)         │        │
│  │  • Returns { onError, serverError }                    │        │
│  └─────────────────────────────────────────────────────────┘        │
└──────────────────────────┬──────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────────┐
│              NORMALIZATION LAYER (Axios Interceptor)                │
│  ┌─────────────────────────────────────────────────────────┐        │
│  │ normalizeAxiosError(error)                              │        │
│  │  • Catch any error (network, HTTP, application)        │        │
│  │  • Extract code, message, field errors                 │        │
│  │  • Create typed ApiError class                         │        │
│  │  • Return consistent ApiError always                   │        │
│  └─────────────────────────────────────────────────────────┘        │
└──────────────────────────┬──────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────────┐
│               RESOLUTION LAYER (Error Resolver)                     │
│  ┌─────────────────────────────────────────────────────────┐        │
│  │ resolveError(error: unknown)                            │        │
│  │  • Handle ApiError (normal path)                        │        │
│  │  • Handle AxiosError (defensive)                        │        │
│  │  • Handle network errors (TIMEOUT, OFFLINE)            │        │
│  │  • Handle plain Error or unknown                       │        │
│  │  • Return: ResolvedError { message, code, ... }        │        │
│  └─────────────────────────────────────────────────────────┘        │
└──────────────────────────┬──────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────────┐
│           STRATEGY FACTORY (createErrorStrategy)                    │
│  ┌──────────────────────┬──────────────────┬─────────────────────┐  │
│  │ errorDisplayConfig   │                  │                     │  │
│  │ [context] = mode     │                  │                     │  │
│  └──────────────────────┴──────────────────┴─────────────────────┘  │
│         │                   │                   │                    │
│         ▼                   ▼                   ▼                    │
│    ┌──────────┐     ┌──────────────┐   ┌──────────────┐            │
│    │  'form'  │     │   'toast'    │   │   'alert'    │            │
│    └──────────┘     └──────────────┘   └──────────────┘            │
└────────┬────────────────────┬────────────────────┬──────────────────┘
         │                    │                    │
         ▼                    ▼                    ▼
    ┌──────────────┐  ┌──────────────┐  ┌──────────────────┐
    │FormError     │  │ToastError    │  │AlertError        │
    │Strategy      │  │Strategy      │  │Strategy          │
    └──────────────┘  └──────────────┘  └──────────────────┘
         │                    │                    │
         ▼                    ▼                    ▼
    ┌──────────────┐  ┌──────────────┐  ┌──────────────────┐
    │setError()    │  │notification  │  │useAlertStore     │
    │(RHF)         │  │Service       │  │.openAlert()      │
    └──────────────┘  └──────┬───────┘  └──────────────────┘
                             │
                             ▼
                      ┌──────────────┐
                      │SonnerAdapter │
                      │toast.error() │
                      └──────────────┘
                             │
                             ▼
                      ┌──────────────┐
                      │Sonner Toast  │
                      │(top-right)   │
                      └──────────────┘
```

### File Structure & Responsibilities

```
src/core/errors/
├── api-error.ts .......................... ApiError class (typed error container)
├── error-codes.ts ........................ All known error codes
├── error-registry.ts ..................... Fallback messages for synthetic errors
├── error-resolver.ts ..................... Converts any error to ResolvedError
├── error-display-config.ts ............... Context → DisplayMode mapping
├── strategies/
│   ├── error-display-strategy.interface.ts  Strategy interface
│   ├── form-error-strategy.ts ........... Inline form errors
│   ├── toast-error-strategy.ts ......... Toast notifications
│   ├── alert-error-strategy.ts ......... Modal alert dialogs
│   └── strategy-factory.ts ............. Creates strategies based on config
└── index.ts ............................ Barrel exports

src/shared/notifications/
├── notification-adapter.interface.ts .... Adapter contract
├── sonner-adapter.ts ................... Sonner implementation
├── notification-service.ts ............ Singleton service (holds adapter)
├── toast-provider.tsx ................. Mounts <Toaster /> component
└── index.ts .......................... Barrel exports

src/shared/alert/
├── alert-store.ts .................... Zustand store for modal state
├── alert-root.tsx .................... Radix UI dialog component
└── index.ts ......................... Barrel exports

src/shared/hooks/
└── use-error-display.ts .............. Integration hook for forms

src/lib/
├── axios/index.ts .................... Normalizes errors in interceptor
└── react-query/index.ts .............. Uses ApiError type
```

## Prerequisites

Your project must have:

- React 18+
- Vite
- TypeScript
- react-hook-form
- Radix UI (for dialog component)
- TailwindCSS (for styling)
- Axios (for API calls)
- @tanstack/react-query v5 (for mutations)
- Zustand (for state management)

### Choosing the Right Display Mode

```
                    ┌─── Which form/operation is this? ───┐
                    │                                      │
         ┌──────────┴──────────┬──────────────┬────────────┴──────────┐
         │                     │              │                       │
         ▼                     ▼              ▼                       ▼
    ┌─────────────┐    ┌────────────┐  ┌──────────────┐  ┌────────────────┐
    │ Validation  │    │  Non-      │  │Destructive   │  │  Async/Bulk    │
    │ & Auth      │    │ Blocking   │  │  Operation   │  │  Operation     │
    │ Form?       │    │  Update?   │  │  (delete,    │  │  (import,      │
    │             │    │  (create   │  │   void)?     │  │   upload)?     │
    │ • Login     │    │  order,    │  │              │  │                │
    │ • Register  │    │  save)     │  │              │  │                │
    │ • 2FA       │    │            │  │              │  │                │
    └──────┬──────┘    └─────┬──────┘  └──────┬───────┘  └────────┬───────┘
           │                 │                 │                   │
           │                 │                 │                   │
           ▼                 ▼                 ▼                   ▼
      ┌────────────┐  ┌──────────────┐  ┌──────────────┐  ┌───────────────┐
      │   FORM     │  │    TOAST     │  │    ALERT     │  │    TOAST      │
      │  MODE      │  │    MODE      │  │    MODE      │  │     MODE      │
      │            │  │              │  │              │  │               │
      │ • Inline   │  │ • Top-right  │  │ • Modal      │  │ • Background  │
      │   errors   │  │   popup      │  │   blocking   │  │   success msg │
      │ • Field    │  │ • Auto-      │  │ • Requires   │  │ • Non-urgent  │
      │   level    │  │   dismiss    │  │   user ACK   │  │   feedback    │
      │ • User     │  │ • Non-       │  │ • For failed │  │ • Can proceed │
      │   stays    │  │   blocking   │  │   deletes    │  │   without ACK │
      │   on form  │  │ • User can   │  │              │  │               │
      │            │  │   navigate   │  │              │  │               │
      └────────────┘  └──────────────┘  └──────────────┘  └───────────────┘
```

### Configuration Examples

```typescript
// src/core/errors/error-display-config.ts
export const errorDisplayConfig: Record<string, ErrorDisplayMode> = {
  // Auth Forms (FORM mode - user needs to fix input)
  login: 'form', // Wrong credentials? Show inline
  register: 'form', // Email taken? Show under field
  passwordReset: 'form', // Invalid token? Show at top
  twoFactorAuth: 'form', // Wrong code? Show inline

  // CRUD Operations (TOAST mode - non-blocking, user continues)
  createOrder: 'toast', // Order created but notification failed?
  updateProfile: 'toast', // Profile saved but image upload failed?
  addToCart: 'toast', // Item added but price sync failed?
  saveSettings: 'toast', // Settings saved but sync failed?

  // Destructive Operations (ALERT mode - blocking, needs acknowledgment)
  deleteRecord: 'alert', // "Delete is permanent"
  archiveProject: 'alert', // "Archived items can be restored"
  voidInvoice: 'alert', // "This cannot be undone"
  permanentlyDelete: 'alert', // "This will delete everything"
};
```

## Setup Steps

The skill will:

1. **Install dependencies** — `npm install sonner`
2. **Create error infrastructure** — TypeScript files in `src/core/errors/`
3. **Create alert system** — Zustand store + dialog component
4. **Create notification layer** — Adapter interface + Sonner implementation
5. **Create integration hook** — `useErrorDisplay` hook
6. **Modify Axios** — Add error normalization in interceptor
7. **Modify React Query types** — Update `MutationConfig` to use `ApiError`
8. **Modify AppProvider** — Initialize notification service + mount providers
9. **Wire example forms** — Login and Register forms (provide templates for other forms)
10. **Generate documentation** — Quick-start guide + developer reference

## What You Provide

Point the skill at your project directory. It will read:

- `package.json` to understand dependencies
- `src/app/provider/index.tsx` to find the AppProvider
- `src/modules/auth/pages/login/` to find example forms
- Radix UI components in `src/shared/ui/` (assumed path)

## Output Files Created

**Core error infrastructure** (`src/core/errors/`):

- `api-error.ts` — ApiError class with typed properties
- `error-codes.ts` — All known backend error codes
- `error-registry.ts` — Fallback messages for synthetic errors
- `error-resolver.ts` — Normalizes any error to ResolvedError
- `error-display-config.ts` — Maps contexts to display modes
- `strategies/` — Four strategy files (interface, form, toast, alert, factory)
- `index.ts` — Barrel export

**Alert system** (`src/shared/alert/`):

- `alert-store.ts` — Zustand store for alert state
- `alert-root.tsx` — Radix dialog component
- `index.ts` — Barrel export

**Notifications** (`src/shared/notifications/`):

- `notification-adapter.interface.ts` — NotificationAdapter interface
- `sonner-adapter.ts` — Sonner implementation
- `notification-service.ts` — Singleton service (replaces stub)
- `toast-provider.tsx` — Toaster component (replaces stub)
- `index.ts` — Barrel export

**Integration hook**:

- `src/shared/hooks/use-error-display.ts` — The single integration point for forms

**Files Modified**:

- `src/lib/axios/index.ts` — Add normalizeAxiosError() in interceptor
- `src/lib/react-query/index.ts` — Update MutationConfig error type
- `src/modules/auth/queries/login/login-query.ts` — Use ApiError type
- `src/modules/auth/queries/register/register-query.ts` — Use ApiError type
- `src/app/provider/index.tsx` — Initialize adapter, mount providers
- `src/modules/auth/pages/login/components/login-form.tsx` — Wire hook
- `src/modules/auth/pages/register/components/register-form.tsx` — Wire hook

**Documentation**:

- `docs/ERROR_HANDLING_SYSTEM.md` — Full developer reference
- `docs/ERROR_HANDLING_QUICK_START.md` — Quick-start guide

## After Setup

### Using the Error Handling System

For any form, add three things:

```tsx
import { useRef } from 'react';
import type { UseFormSetError } from 'react-hook-form';
import { useErrorDisplay } from '@/shared/hooks/use-error-display';

type MyFormSchema = z.infer<typeof myFormSchema>;

export const MyForm = () => {
  const setErrorRef = useRef<UseFormSetError<MyFormSchema> | null>(null);
  const { onError, serverError } = useErrorDisplay(
    'my-feature',
    setErrorRef as React.MutableRefObject<UseFormSetError<Record<string, unknown>> | null>
  );

  const { mutate } = useMyMutation({
    mutationConfig: { onError }, // single line
  });

  return (
    <Form schema={myFormSchema} onSubmit={(values) => mutate(values)}>
      {(methods) => {
        setErrorRef.current = methods.setError;
        return (
          <>
            {serverError && <Error errorMessage={serverError} />}
            {/* form fields */}
          </>
        );
      }}
    </Form>
  );
};
```

### Changing Display Mode

Edit one line in `src/core/errors/error-display-config.ts`:

```ts
export const errorDisplayConfig: Record<string, ErrorDisplayMode> = {
  login: 'form', // inline errors
  'my-feature': 'toast', // toast notification
  deleteRecord: 'alert', // modal dialog
};
```

Done. The form component never changes.

### Swapping Toast Library

1. Create a new adapter file implementing `NotificationAdapter`
2. In `src/app/provider/index.tsx`, change one line:
   ```ts
   notificationService.setAdapter(new NewLibraryAdapter());
   ```
3. Done. No other files touch the toast library.

## Backend API Contract

The backend should return errors in this shape:

```json
{
  "code": "ERROR_CODE",
  "message": "Human-readable message",
  "errors": {
    "fieldName": ["field error message"]
  }
}
```

- `code` — error code (stored for logging, not required)
- `message` — user-facing message (used directly, not looked up in registry)
- `errors` — optional field-level errors (FormErrorStrategy maps these to form fields)

If the backend sends no response body (e.g., HTML 500), the frontend derives a synthetic error code from the HTTP status and uses a fallback message from `error-registry.ts`.

## TypeScript Compilation

After setup, run `npx tsc --noEmit` to verify no errors. The system is fully type-safe.

## What Happens at Runtime

1. **Error occurs** → Axios interceptor catches it
2. **Normalization** → `normalizeAxiosError()` converts to `ApiError`
3. **Mutation rejection** → TanStack Query calls `onError(apiError)`
4. **Hook logic** → `useErrorDisplay('context')`:
   - Reads `errorDisplayConfig['context']` → mode ('form', 'toast', 'alert')
   - Creates strategy for that mode
   - Calls `resolveError(error)` → structured error object
   - Delegates to strategy: `strategy.handle(resolved, setError?)`
5. **Display** — Strategy executes:
   - Form: calls `setError()` to populate form state
   - Toast: calls `notificationService.error(message)`
   - Alert: opens modal dialog via Zustand store

## Next Steps After Setup

1. **Verify TypeScript**: `npx tsc --noEmit`
2. **Test the system**:
   - Go to login form, enter wrong credentials
   - Verify error displays inline (form mode is default)
   - Change `login: 'toast'` in error-display-config.ts
   - Test again — error now displays as toast (form unchanged)
3. **Extend to other forms**:
   - Copy the three-line pattern from examples
   - Add a new entry to `error-display-config.ts` for your context
4. **Add new error codes**: Only edit `error-registry.ts` if backend sends unstructured responses

See `docs/ERROR_HANDLING_SYSTEM.md` for detailed documentation.
