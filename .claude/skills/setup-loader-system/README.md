# Setup Loader System Skill

This skill automates the setup of a production-grade loader system in React+Vite+TypeScript projects using the **Adapter Pattern**.

## What This Skill Does

Guides you through creating:

- **LoaderAdapter Interface** — Contract for loader implementations
- **LoaderService** — Singleton service for showing/hiding loaders
- **LoaderStore** — Zustand store for reactive loading state
- **UI Components** — PageLoader, OverlayLoader, SectionLoader, Spinner
- **LoaderProvider** — React component that renders loaders
- **SpinnerAdapter** — Default adapter using the Zustand store
- **Integration** — Wiring into your app provider

## Key Features

✅ **Pluggable adapters** — Swap implementations (Spinner → NProgress → Skeleton)  
✅ **Three loader variants** — page, overlay, section  
✅ **No prop drilling** — Use `loaderService` from anywhere  
✅ **React-integrated** — Zustand store for reactive updates  
✅ **Reusable** — Works in any React+Vite+TypeScript project

## When to Use This Skill

Mention any of these, and the skill will trigger:

- "Set up a loader system"
- "I need loading states"
- "How do I show spinners?"
- "Create a loader component"
- "Implement async operation loading"
- "Swappable loader implementations"
- "Centralized loading state"

## Getting Started

Just ask Claude Code: **"Set up a loader system"** or **"Create a loader system for my project"**

The skill will walk you through each step interactively.

## Documentation

See `SKILL.md` for the complete step-by-step guide.

## Architecture

The system follows the **Adapter Pattern** (same as the error handling system):

```
loaderService.show()
        ↓
  LoaderAdapter (interface)
        ↓
  SpinnerAdapter / NProgressAdapter / SkeletonAdapter
        ↓
  LoaderStore (Zustand)
        ↓
  LoaderProvider (renders UI)
```

## Examples

### Show an overlay loader

```ts
loaderService.show({ variant: 'overlay', text: 'Saving...' });
```

### Show a section loader

```ts
loaderService.show({ variant: 'section' });
```

### Tie to React Query

```tsx
useEffect(() => {
  isLoading ? loaderService.show() : loaderService.hide();
}, [isLoading]);
```

## Files Created

After setup, your project will have:

```
src/shared/loader/
├── loader-adapter.interface.ts
├── loader-service.ts
├── loader-store.ts
├── loader-provider.tsx
├── spinner-adapter.ts
└── index.ts

src/shared/ui/loader/
├── spinner.tsx
├── page-loader.tsx
├── overlay-loader.tsx
├── section-loader.tsx
└── index.ts
```

## Next Steps

1. Run the skill to create all files
2. Mount `LoaderProvider` in your app provider
3. Set the adapter at app startup
4. Use `loaderService` throughout your app
5. (Optional) Create custom adapters

## See Also

- Error Handling System (similar adapter pattern)
- Modal System (similar registry pattern)
