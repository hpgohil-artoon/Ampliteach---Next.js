# TypeScript Rules & Best Practices

This document outlines the TypeScript rules and best practices that MUST be followed when working on this project. These rules ensure type safety, maintainability, and early error detection.

---

## Core Rules

### 1. No `any` Type Rule

**CRITICAL:** Never use the `any` type in any component, hook, utility, or module.

```typescript
// ❌ WRONG
function processUser(user: any) {
  return user.name;
}

// ✅ RIGHT - Define proper types
interface User {
  name: string;
  email: string;
}

function processUser(user: User) {
  return user.name;
}
```

**Exceptions (Rare):**

- When implementing type assertions with proper guards
- When interfacing with external libraries without types (create type definitions instead)

---

### 2. TypeScript Error Validation

**CRITICAL:** Always check for TypeScript errors after adding or updating any code.

**Before committing or marking work as complete:**

1. Run TypeScript compiler check: `npm run type-check` or `tsc --noEmit`
2. Fix all TypeScript errors (not just warnings)
3. Verify no implicit `any` types exist

**Verification Commands:**

```bash
# Check for TypeScript errors
npm run type-check

# Or use tsc directly
npx tsc --noEmit

# Watch mode during development
npx tsc --noEmit --watch
```

---

### 3. Import Validation Rule

**CRITICAL:** Always verify that imported components, functions, or variables actually exist before using them.

**Before using an import:**

1. Verify the exported name matches what you're importing
2. Check that the file exports the expected item
3. Ensure no circular dependencies exist

```typescript
// ❌ WRONG - Assume export exists without checking
import { Button } from './shared/ui/button';

// ✅ RIGHT - Verify the export exists in the source file
// In button.tsx: export const Button = (props) => { ... }
import { Button } from './shared/ui/button';
```

**Import Organization:**

```typescript
// 1. React and core libraries
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

// 2. Third-party libraries
import { clsx } from 'clsx';
import { useForm } from 'react-hook-form';

// 3. Internal shared imports
import { Button } from '@/shared/ui/button';

// 4. Feature/module imports
import { useAuth } from '@/modules/auth/hooks/use-auth';
```

---

### 4. Type Definition Standards

**All components and functions MUST have proper type definitions:**

```typescript
// ✅ RIGHT - Full type safety
interface UserProfileProps {
  userId: string;
  name: string;
  email?: string; // Optional property
  onUpdate: (user: User) => void;
  roles: UserRole[];
}

export function UserProfile({ userId, name, email, onUpdate, roles }: UserProfileProps) {
  // Component implementation
}
```

**Generic Types:**

```typescript
// Use generics for reusable components
interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  onRowClick?: (item: T) => void;
}
```

---

### 5. Type Imports vs Value Imports

**Use `type` keyword for type-only imports:**

```typescript
// ✅ RIGHT - Type-only import
import type { User, UserRole } from '@/types/user-types';
import { fetchUsers } from '@/api/users';

// ❌ AVOID - Mixing types and values unnecessarily
import { User, UserRole, fetchUsers } from '@/api/users';
```

---

### 6. Strict Type Checking Rules

This project uses strict TypeScript configuration. Follow these rules:

**No Implicit Any:**

```typescript
// ❌ WRONG - Parameter has implicit any
function calculateTotal(price, quantity) {
  return price * quantity;
}

// ✅ RIGHT - Explicit types
function calculateTotal(price: number, quantity: number): number {
  return price * quantity;
}
```

**No Unused Variables:**

```typescript
// ❌ WRONG - Unused import
import { Button, Card } from '@/shared/ui';

// ✅ RIGHT - Only import what you use
import { Button } from '@/shared/ui';
```

---

### 7. Return Type Annotations

**Always explicitly declare return types for public functions:**

```typescript
// ✅ RIGHT - Explicit return type
export function getUserById(id: string): Promise<User | null> {
  return fetch(`/api/users/${id}`)
    .then((res) => res.json())
    .catch(() => null);
}

// Optional: For simple internal functions, inference is acceptable
const formatName = (first: string, last: string) => `${first} ${last}`;
```

---

### 8. Type Guards and Narrowing

**Use type guards for runtime type checking:**

```typescript
// ✅ RIGHT - Proper type guard
function isUser(data: unknown): data is User {
  return typeof data === 'object' && data !== null && 'name' in data && 'email' in data;
}

if (isUser(response)) {
  // TypeScript knows `response` is User here
  console.log(response.name);
}
```

---

### 9. Enum vs Union Types

**Prefer union types over enums for better type safety:**

```typescript
// ✅ PREFERRED - Union types
type UserRole = 'admin' | 'manager' | 'user' | 'guest';

// ❌ AVOID - Enums (use only for external constants)
enum UserRoleEnum {
  Admin = 'admin',
  Manager = 'manager',
  User = 'user',
}
```

---

### 10. Interface vs Type Aliases

**Use interfaces for object shapes that might be extended:**

```typescript
// ✅ RIGHT - Interface for extensible objects
interface BaseEntity {
  id: string;
  createdAt: Date;
}

interface User extends BaseEntity {
  name: string;
  email: string;
}
```

**Use type aliases for unions, intersections, and primitives:**

```typescript
// ✅ RIGHT - Type alias for unions
type Status = 'pending' | 'active' | 'inactive';

// ✅ RIGHT - Type alias for mapped types
type Nullable<T> = T | null;
type Optional<T> = T | undefined;
```

---

## Type Safety Checklist

Before marking any task as complete, verify:

- [ ] No `any` types are used
- [ ] All imports exist and are correctly named
- [ ] TypeScript compiler shows no errors (`tsc --noEmit`)
- [ ] All functions have proper parameter types
- [ ] Public functions have explicit return types
- [ ] No unused imports or variables
- [ ] Type-only imports use `import type`
- [ ] Props interfaces are properly defined for all components

---

## Common TypeScript Patterns

### Utility Types

```typescript
// Make all properties optional
type PartialUser = Partial<User>;

// Make all properties required
type RequiredUser = Required<PartialUser>;

// Pick specific properties
type UserContactInfo = Pick<User, 'email' | 'phone'>;

// Omit specific properties
type CreateUserDto = Omit<User, 'id' | 'createdAt'>;
```

### Generic Constraints

```typescript
// ✅ RIGHT - Constrained generic
function findById<T extends { id: string }>(items: T[], id: string): T | undefined {
  return items.find((item) => item.id === id);
}
```

---

## IDE Configuration

Ensure your TypeScript IDE settings align with these rules:

```json
{
  "typescript.preferences.preferTypeOnlyImports": true,
  "typescript.tsdk": "node_modules/typescript/lib",
  "typescript.enablePromptUseWorkspaceTsdk": true
}
```

---

**Remember:** TypeScript is your first line of defense against bugs. Type errors found at compile time are bugs that won't reach production.
