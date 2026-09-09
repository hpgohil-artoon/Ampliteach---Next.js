---
name: setup-loader-system
description: |
  Set up a production-grade loader system using the adapter pattern in React+Vite+TypeScript+Zustand projects. Use this skill whenever a user mentions setting up loading states, loader components, progress indicators, loading spinners, or wants to implement a centralized, swappable loader infrastructure. Also triggers when users want to replicate a pluggable loader architecture that can switch between spinners, skeletons, NProgress, and other implementations without touching call sites.
compatibility:
  - React 18+
  - Vite
  - TypeScript
  - Zustand
  - TailwindCSS (for styling, optional)
---

# Loader System Setup for React+Vite+TypeScript

This skill automates setting up a production-grade loader system using the **Adapter Pattern**. It guides you through:

1. Creating the folder structure
2. Building the loader adapter interface
3. Implementing the loader service (singleton)
4. Setting up the Zustand store for React state
5. Creating UI components (Spinner, PageLoader, OverlayLoader, SectionLoader)
6. Building the LoaderProvider to render loaders
7. Creating the default SpinnerAdapter
8. Integrating into your app provider
9. Showing you how to use loaders across your application

## What You'll Get

After setup, your application will:

- **Centralized loader management** — Single `loaderService` to show/hide loaders from anywhere
- **Three loader variants** — `'page'` (full-page), `'overlay'` (modal), `'section'` (in-section)
- **Pluggable adapters** — Swap implementations (Spinner → NProgress → Skeleton) without changing call sites
- **React-integrated state** — Zustand store for reactive loading UI updates
- **No prop drilling** — Show loaders from async operations, form submissions, data fetching without lifting state
- **Consistent UX** — Reusable components with a unified loading experience

## Step 1: Create the Folder Structure

Create the following directories in your project:

```
src/
├── shared/
│   ├── loader/                      # Adapter system
│   │   ├── loader-adapter.interface.ts
│   │   ├── loader-service.ts
│   │   ├── loader-store.ts
│   │   ├── loader-provider.tsx
│   │   ├── spinner-adapter.ts
│   │   └── index.ts
│   │
│   └── ui/loader/                   # UI components
│       ├── spinner.tsx
│       ├── page-loader.tsx
│       ├── overlay-loader.tsx
│       ├── section-loader.tsx
│       └── index.ts
```

**Create these directories:**

```bash
mkdir -p src/shared/loader
mkdir -p src/shared/ui/loader
```

## Step 2: Create the LoaderAdapter Interface

Create `src/shared/loader/loader-adapter.interface.ts`:

```ts
export type LoaderVariant = 'page' | 'overlay' | 'section';

export interface LoaderOptions {
  variant?: LoaderVariant;
  text?: string;
}

export interface LoaderAdapter {
  show(options?: LoaderOptions): void;
  hide(): void;
}
```

This interface defines the contract that all loader implementations must follow. Any custom adapter (NProgress, Skeleton, etc.) implements this interface.

## Step 3: Create the LoaderStore (Zustand)

Create `src/shared/loader/loader-store.ts`:

```ts
import { create } from 'zustand';
import type { LoaderOptions, LoaderVariant } from './loader-adapter.interface';

interface LoaderState {
  isVisible: boolean;
  variant: LoaderVariant;
  text?: string;
  show(options?: LoaderOptions): void;
  hide(): void;
}

export const useLoaderStore = create<LoaderState>((set) => ({
  isVisible: false,
  variant: 'page',
  text: undefined,

  show: (options?: LoaderOptions) =>
    set({
      isVisible: true,
      variant: options?.variant ?? 'page',
      text: options?.text,
    }),

  hide: () =>
    set({
      isVisible: false,
      variant: 'page',
      text: undefined,
    }),
}));
```

This Zustand store manages the loader's reactive state. React components subscribe to it and re-render when loading state changes.

## Step 4: Create the LoaderService (Singleton)

Create `src/shared/loader/loader-service.ts`:

```ts
import type { LoaderAdapter, LoaderOptions } from './loader-adapter.interface';
import { useLoaderStore } from './loader-store';

class LoaderService {
  private adapter: LoaderAdapter | null = null;

  setAdapter(adapter: LoaderAdapter): void {
    this.adapter = adapter;
  }

  show(options?: LoaderOptions): void {
    if (!this.adapter) {
      console.warn('LoaderService: No adapter set. Call setAdapter() at app startup.');
      return;
    }
    this.adapter.show(options);
  }

  hide(): void {
    if (!this.adapter) {
      console.warn('LoaderService: No adapter set. Call setAdapter() at app startup.');
      return;
    }
    this.adapter.hide();
  }
}

export const loaderService = new LoaderService();
```

The service delegates to the active adapter. You'll set the adapter once at app startup, then use `loaderService` throughout your app.

## Step 5: Create UI Components

### 5a. Spinner Component

Create `src/shared/ui/loader/spinner.tsx`:

```tsx
import { LuLoaderCircle } from 'react-icons/lu';

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const sizeMap = {
  sm: 'w-4 h-4',
  md: 'w-6 h-6',
  lg: 'w-8 h-8',
  xl: 'w-12 h-12',
};

export const Spinner = ({ size = 'md', className = '' }: SpinnerProps) => (
  <LuLoaderCircle className={`${sizeMap[size]} animate-spin ${className}`} />
);
```

### 5b. PageLoader Component

Create `src/shared/ui/loader/page-loader.tsx`:

```tsx
import { Spinner } from './spinner';

export const PageLoader = () => (
  <div className="fixed inset-0 flex items-center justify-center bg-white">
    <div className="flex flex-col items-center gap-4">
      <Spinner size="xl" />
      <p className="text-sm text-gray-600">Loading...</p>
    </div>
  </div>
);
```

### 5c. OverlayLoader Component

Create `src/shared/ui/loader/overlay-loader.tsx`:

```tsx
import { Spinner } from './spinner';

interface OverlayLoaderProps {
  text?: string;
}

export const OverlayLoader = ({ text }: OverlayLoaderProps) => (
  <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
    <div className="flex flex-col items-center gap-4 bg-white rounded-lg p-8">
      <Spinner size="lg" />
      {text && <p className="text-sm text-gray-700 mt-2">{text}</p>}
    </div>
  </div>
);
```

### 5d. SectionLoader Component

Create `src/shared/ui/loader/section-loader.tsx`:

```tsx
import { Spinner } from './spinner';

export const SectionLoader = () => (
  <div className="flex items-center justify-center p-8">
    <Spinner size="md" className="text-gray-400" />
  </div>
);
```

### 5e. Loader UI Barrel

Create `src/shared/ui/loader/index.ts`:

```ts
export { Spinner } from './spinner';
export { PageLoader } from './page-loader';
export { OverlayLoader } from './overlay-loader';
export { SectionLoader } from './section-loader';
```

## Step 6: Create the LoaderProvider Component

Create `src/shared/loader/loader-provider.tsx`:

```tsx
import { PageLoader, OverlayLoader, SectionLoader } from '@/shared/ui/loader';
import { useLoaderStore } from './loader-store';

export const LoaderProvider = () => {
  const { isVisible, variant, text } = useLoaderStore();

  if (!isVisible) return null;

  switch (variant) {
    case 'page':
      return <PageLoader />;
    case 'overlay':
      return <OverlayLoader text={text} />;
    case 'section':
      return <SectionLoader />;
    default:
      return null;
  }
};
```

## Step 7: Create the Default SpinnerAdapter

Create `src/shared/loader/spinner-adapter.ts`:

```ts
import type { LoaderAdapter, LoaderOptions } from './loader-adapter.interface';
import { useLoaderStore } from './loader-store';

export class SpinnerAdapter implements LoaderAdapter {
  show(options?: LoaderOptions): void {
    useLoaderStore.getState().show(options);
  }

  hide(): void {
    useLoaderStore.getState().hide();
  }
}
```

This is the default adapter that uses the Zustand store to drive the UI components.

## Step 8: Create the Loader Barrel

Create `src/shared/loader/index.ts`:

```ts
export type { LoaderAdapter, LoaderOptions, LoaderVariant } from './loader-adapter.interface';
export { LoaderProvider } from './loader-provider';
export { loaderService } from './loader-service';
export { useLoaderStore } from './loader-store';
export { SpinnerAdapter } from './spinner-adapter';
```

## Step 9: Integrate into Your App Provider

You need to:

1. **Mount LoaderProvider** in your `AppProvider`
2. **Set the adapter** at app startup (module level, not inside a component)

**Tell me:** What's the file path to your app provider? (e.g., `src/app/provider/index.tsx`)

Once you provide it, I'll add:

```tsx
import { LoaderProvider, loaderService, SpinnerAdapter } from '@/shared/loader';

// Module level (executed once at import)
loaderService.setAdapter(new SpinnerAdapter());

export const AppProvider = ({ children }) => (
  <YourOtherProviders>
    <LoaderProvider />
    {children}
  </YourOtherProviders>
);
```

**Key:** The `setAdapter()` call must be at module level, BEFORE any `loaderService.show()` calls.

## Step 10: Using Loaders in Your Application

### Basic Usage

```ts
import { loaderService } from '@/shared/loader';

// Show a loader
loaderService.show();

// Hide the loader
loaderService.hide();
```

### With Variant and Text

```ts
// Overlay loader for form submissions
loaderService.show({
  variant: 'overlay',
  text: 'Saving your changes...',
});
loaderService.hide();

// Section loader for data table refetch
loaderService.show({ variant: 'section' });
loaderService.hide();
```

### In a Form Component

```tsx
import { loaderService } from '@/shared/loader';
import { notificationService } from '@/shared/notifications'; // if using your error handling system

export const CreateProductForm = () => {
  const handleSubmit = async (data) => {
    loaderService.show({
      variant: 'overlay',
      text: 'Creating product...',
    });

    try {
      await createProduct(data);
      notificationService.success('Product created');
      // reset form, etc.
    } catch (error) {
      notificationService.error('Failed to create product');
    } finally {
      loaderService.hide();
    }
  };

  return <form onSubmit={handleSubmit}>...</form>;
};
```

### In Data Fetching

```tsx
import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { loaderService } from '@/shared/loader';

export const InventoryList = () => {
  const { data, isLoading } = useInventoryQuery();

  useEffect(() => {
    if (isLoading) {
      loaderService.show({ variant: 'section' });
    } else {
      loaderService.hide();
    }
  }, [isLoading]);

  return <table>{/* render data */}</table>;
};
```

## Creating Custom Adapters (Optional)

Once the basic setup is done, you can create custom adapters to swap loader implementations.

### NProgress Adapter Example

Create `src/shared/loader/nprogress-adapter.ts`:

```ts
import NProgress from 'nprogress';
import type { LoaderAdapter, LoaderOptions } from './loader-adapter.interface';

export class NProgressAdapter implements LoaderAdapter {
  show(options?: LoaderOptions) {
    NProgress.start();
    if (options?.text) {
      console.log(options.text);
    }
  }

  hide() {
    NProgress.done();
  }
}
```

Then in your app provider:

```ts
import { loaderService } from '@/shared/loader';
import { NProgressAdapter } from '@/shared/loader/nprogress-adapter';

loaderService.setAdapter(new NProgressAdapter());
```

### Skeleton Adapter Example

Create `src/shared/loader/skeleton-adapter.ts`:

```ts
import type { LoaderAdapter, LoaderOptions } from './loader-adapter.interface';
import { useLoaderStore } from './loader-store';

export class SkeletonAdapter implements LoaderAdapter {
  show(options?: LoaderOptions): void {
    useLoaderStore.getState().show(options);
  }

  hide(): void {
    useLoaderStore.getState().hide();
  }
}
```

Then create a `SkeletonProvider` that renders different skeletons based on the variant, and mount it instead of `LoaderProvider`.

## Troubleshooting

### Loader not showing

**Check:**

1. Is `LoaderProvider` mounted in `AppProvider`?
2. Is `loaderService.setAdapter()` called at module level in your provider?
3. Are there any console errors?

### Loader stuck (won't hide)

**Always call `hide()` in a `finally` block:**

```ts
try {
  await someOperation();
} finally {
  loaderService.hide(); // Guaranteed to run
}
```

### TypeScript errors

Ensure all imports use the barrel paths:

```ts
import { loaderService, LoaderProvider } from '@/shared/loader';
```

## Architecture Overview

```
LoaderAdapter Interface
        ↓
        └─→ SpinnerAdapter (default)
        └─→ NProgressAdapter (swappable)
        └─→ SkeletonAdapter (swappable)
             ↓
    LoaderService (singleton)
             ↓
    Zustand Store (loader-store)
             ↓
    LoaderProvider (renders UI)
```

The flow:

1. `loaderService.show()` is called from anywhere in your app
2. The service delegates to the active adapter
3. The adapter updates the Zustand store
4. `LoaderProvider` reads the store and renders the appropriate UI component

This decouples **what** you want (a loader) from **how** it's rendered (spinner, skeleton, NProgress).

## Best Practices

1. **Use overlay loaders for form submissions** — Users should not interact while saving
2. **Use section loaders for data refetches** — Non-blocking, less intrusive
3. **Always call `hide()` in finally blocks** — Ensures loader is hidden even on error
4. **Add helpful text to overlay loaders** — Especially for long operations
5. **Let React Query drive loading** — Use `isLoading` to automatically show/hide loaders
6. **Test adapter swaps locally** — Verify new adapters work before committing

## Next Steps

1. Create all the files above
2. Add `LoaderProvider` to your `AppProvider`
3. Set the adapter at module level
4. Test by calling `loaderService.show()` from a form or button
5. Gradually migrate existing loading states to use the loader service
6. (Optional) Create custom adapters for your specific use cases

## See Also

- For similar patterns, check the **error handling system** and **modal system** in your project
- Zustand docs: https://github.com/pmndrs/zustand
- react-icons: https://react-icons.github.io/react-icons/ — the project uses the Lucide set (`react-icons/lu`, `Lu*` names) for the spinner icon
