---
name: logger-system-setup
description: Set up a pluggable color-coded debug logging system for development. Use this whenever a project needs a centralized logger with environment-based control, color-coded console output, or runtime enable/disable capabilities. Automatically creates the logging infrastructure and handles environment variable configuration. Great for Vite, Next.js, Node.js, or any TypeScript/JavaScript project.
compatibility: Node.js, npm/yarn, TypeScript projects
disable-model-invocation: true
---

# Logger System Setup

This skill sets up a professional, pluggable debug logging system that works across development, staging, and production environments. The logger provides:

- **Color-coded output** (DEBUG=gray, INFO=blue, WARN=orange, ERROR=red, SUCCESS=green)
- **Environment-based control** (silent in production by default)
- **Runtime toggling** (enable/disable from code or browser console)
- **Scoped logging** (namespace-aware for better organization)
- **Zero dependencies** (uses native browser `%c` CSS styling)

---

## What This Skill Does

The skill creates four core logger files in `src/core/logging/`:

1. **log-levels.ts** — Types, interfaces, and the LogLevel enum
2. **log-styles.ts** — CSS color styling for each log level
3. **logger.ts** — The Logger singleton class implementation
4. **index.ts** — Public API barrel export

It also:

- Creates/updates `.env.development`, `.env.staging`, `.env.production` with `VITE_ENABLE_LOGGING` flags
- Provides documentation on usage patterns
- Maintains compatibility with existing `settings.ts` configuration system

---

## How to Use the Logger in Your Code

### Basic Usage: Direct Logging

```typescript
import { logger } from '@/core/logging';

// Log an info message
logger.info('ModuleName', 'Operation completed', { userId: 123, status: 'success' });

// Log a warning
logger.warn('ApiClient', 'Retrying request', { url: '/api/users', attempt: 2 });

// Log an error
logger.error('LoginForm', 'Authentication failed', new Error('Invalid credentials'));

// Log success (positive confirmation event)
logger.success('InventoryList', 'Product deleted successfully');

// Log debug info (verbose, usually for development only)
logger.debug('DataProcessor', 'Processing chunk', { size: 512, offset: 1024 });
```

### Recommended: Scoped Logging

For files that log multiple times, create a scoped logger at the top of your module:

```typescript
import { logger } from '@/core/logging';

class ApiClient {
  private log = logger.scope('ApiClient');

  constructor() {
    this.log.info('Initializing', {
      baseURL: 'https://api.example.com',
      timeout: 60000,
    });
  }

  async fetchUsers() {
    try {
      this.log.debug('Fetching users from database');
      const response = await this.get('/users');
      this.log.success('Users fetched', { count: response.data.length });
      return response.data;
    } catch (error) {
      this.log.error('Failed to fetch users', error);
      throw error;
    }
  }

  private handleRetry(attempt: number, maxAttempts: number) {
    this.log.warn(`Retrying request (${attempt}/${maxAttempts})`, {
      url: '/users',
      lastStatus: 503,
    });
  }
}
```

### Output Format

When you log, the console output looks like this:

```
[14:32:07.451] ▸ INFO  ▸ [ApiClient] Users fetched  { count: 42 }
[14:32:08.120] ▸ WARN  ▸ [ApiClient] Retrying request (1/3)  { url: '/users', lastStatus: 503 }
[14:32:09.890] ▸ ERROR ▸ [LoginForm] Authentication failed  Error: Invalid credentials
[14:32:10.234] ▸  OK   ▸ [InventoryList] Product deleted successfully
```

**Color Coding:**

- **DEBUG** → Gray (dim, for verbose info)
- **INFO** → Blue (informational events)
- **WARN** → Orange (degraded operations, retries)
- **ERROR** → Red (failures, exceptions)
- **SUCCESS** → Green (positive confirmations)

---

## Logging Best Practices

### 1. Choose the Right Level

```typescript
// DEBUG — verbose diagnostic info, development-only usually
logger.debug('DataProcessor', 'Parsing JSON', { raw: jsonString });

// INFO — positive operational events
logger.info('AuthService', 'User logged in', { userId: user.id });

// WARN — degraded but recoverable (retries, fallbacks, deprecated code)
logger.warn('ApiClient', 'Slow response', { duration: 5000 });

// ERROR — failures that require attention
logger.error('FileUploader', 'Upload failed', uploadError);

// SUCCESS — user-visible positive confirmations
logger.success('SaveButton', 'Changes saved to database');
```

### 2. Include Meaningful Context

✅ **Good** — includes relevant state:

```typescript
logger.info('OrderProcessor', 'Processing order', {
  orderId: order.id,
  itemCount: order.items.length,
  total: order.total,
});
```

❌ **Bad** — vague or missing context:

```typescript
logger.info('OrderProcessor', 'Order processed');
```

### 3. Use Scoped Loggers for Classes/Modules

```typescript
// At the top of your service/class
const log = logger.scope('UserService');

export class UserService {
  async createUser(email: string) {
    log.debug('Creating new user', { email });

    const user = await db.users.create({ email });
    log.success('User created', { userId: user.id, email });

    return user;
  }
}
```

### 4. Pass Objects as Extra Arguments

The logger accepts multiple arguments after the message. Objects are expanded in DevTools:

```typescript
logger.error('PaymentGateway', 'Payment failed', {
  amount: 99.99,
  currency: 'USD',
  gateway: 'Stripe',
  errorCode: 'CARD_DECLINED',
});
// Output: [HH:MM:SS.ms] ▸ ERROR ▸ [PaymentGateway] Payment failed  { amount: 99.99, ... }
```

---

## Runtime Control

### From Code

```typescript
import { logger, LogLevel } from '@/core/logging';

// Disable all logging
logger.disable();

// Re-enable
logger.enable();

// Only show warnings and errors (filter out DEBUG and INFO)
logger.setMinLevel(LogLevel.WARN);

// Check current state
if (logger.isEnabled) {
  console.log('Logger is active');
}
```

### From Browser Console (Development Only)

In development, the logger is exposed on `window.__logger`:

```javascript
// Open DevTools console and type:

// Disable logging
window.__logger.disable();

// Re-enable
window.__logger.enable();

// Only show warnings and above
window.__logger.setMinLevel(2); // LogLevel.WARN = 2

// Check state
window.__logger.isEnabled; // → true/false
window.__logger.minLevel; // → 0-4
```

---

## Environment Configuration

The skill automatically sets `VITE_ENABLE_LOGGING` in your environment files:

```env
# .env.development
VITE_ENABLE_LOGGING=true

# .env.staging
VITE_ENABLE_LOGGING=true

# .env.production
VITE_ENABLE_LOGGING=false
```

**Development/Staging:** Logger is active and `window.__logger` is available
**Production:** Logger is silent; `window.__logger` is undefined

To override at build time:

```bash
VITE_ENABLE_LOGGING=false npm run dev  # Force silent mode in dev
```

---

## API Reference

### ILogger Interface

```typescript
interface ILogger {
  // Log methods (namespace, message, ...args)
  debug(namespace: string, message: string, ...args: unknown[]): void;
  info(namespace: string, message: string, ...args: unknown[]): void;
  warn(namespace: string, message: string, ...args: unknown[]): void;
  error(namespace: string, message: string, ...args: unknown[]): void;
  success(namespace: string, message: string, ...args: unknown[]): void;

  // Create a scoped logger (message, ...args, no namespace param)
  scope(namespace: string): ScopedLogger;

  // Runtime control
  enable(): void;
  disable(): void;
  setMinLevel(level: LogLevel): void;

  // State
  readonly isEnabled: boolean;
  readonly minLevel: LogLevel;
}

interface ScopedLogger {
  debug(message: string, ...args: unknown[]): void;
  info(message: string, ...args: unknown[]): void;
  warn(message: string, ...args: unknown[]): void;
  error(message: string, ...args: unknown[]): void;
  success(message: string, ...args: unknown[]): void;
}

enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
  SUCCESS = 4,
}
```

### Export

```typescript
import { logger, LogLevel } from '@/core/logging';
import type { ILogger, ScopedLogger } from '@/core/logging';
```

---

## Replacing Existing Console Calls

Once the logger is installed, manually replace existing `console.*` calls:

**Before:**

```typescript
console.log('User logged in');
console.error('Login failed:', error);
console.warn('Slow API response');
```

**After:**

```typescript
logger.success('LoginForm', 'User logged in');
logger.error('LoginForm', 'Login failed', error);
logger.warn('ApiClient', 'Slow API response');
```

The logger handles:

- ✅ Environment-based filtering (silent in production)
- ✅ Color-coding for visual scanning
- ✅ Runtime enable/disable without code changes
- ✅ Browser console DevTools filtering
- ✅ Consistent formatting across the codebase

---

## Common Patterns

### Error Handling

```typescript
const log = logger.scope('UserRepository');

async function getUser(id: string) {
  try {
    log.debug('Fetching user', { id });
    const user = await db.query('SELECT * FROM users WHERE id = ?', [id]);

    if (!user) {
      log.warn('User not found', { id });
      return null;
    }

    log.success('User fetched', { userId: id, email: user.email });
    return user;
  } catch (error) {
    log.error('Failed to fetch user', { id, error });
    throw error;
  }
}
```

### React Hooks

```typescript
import { useEffect } from 'react';
import { logger } from '@/core/logging';

const log = logger.scope('UserProfile');

export function UserProfile({ userId }: { userId: string }) {
  useEffect(() => {
    log.debug('Mounting component', { userId });

    return () => {
      log.debug('Unmounting component', { userId });
    };
  }, [userId]);

  const handleSave = async (data: UserData) => {
    log.debug('Saving user profile', { userId });

    try {
      await api.updateUser(userId, data);
      log.success('Profile saved', { userId });
    } catch (error) {
      log.error('Failed to save profile', { userId, error });
    }
  };

  return (
    <form onSubmit={() => handleSave(formData)}>
      {/* form fields */}
    </form>
  );
}
```

### API Client

```typescript
class ApiClient {
  private log = logger.scope('ApiClient');

  constructor(config: ApiConfig) {
    this.log.info('Initializing', {
      baseURL: config.baseUrl,
      timeout: config.timeout,
    });
  }

  async request<T>(url: string, options?: RequestOptions): Promise<T> {
    this.log.debug('Request started', { url, method: options?.method || 'GET' });

    try {
      const response = await fetch(url, options);

      if (!response.ok) {
        this.log.warn('Request failed', {
          url,
          status: response.status,
          statusText: response.statusText,
        });
        throw new HttpError(response.status);
      }

      const data = await response.json();
      this.log.success('Request completed', { url, status: response.status });
      return data;
    } catch (error) {
      this.log.error('Request error', { url, error });
      throw error;
    }
  }
}
```

---

## Troubleshooting

**Q: Logger doesn't appear in production build**

- This is expected. Production has `VITE_ENABLE_LOGGING=false`, so all logging is silent.

**Q: `window.__logger` is undefined in production**

- Correct. It's only registered in development/staging. Check `settings.features.enableLogging`.

**Q: How do I see only ERROR messages in DevTools?**

- Open DevTools → Console → filter level dropdown → "Errors"
- OR use `window.__logger.setMinLevel(3)` to silence everything below ERROR

**Q: Can I use the logger in Node.js backends?**

- The current implementation uses browser `%c` CSS styling, so it's frontend-focused. For Node backends, you may want to adapt it to use ANSI color codes instead.

---

## Next Steps

1. **Create the logger system** using this skill
2. **Review the four generated files** in `src/core/logging/`
3. **Update `.env` files** with the `VITE_ENABLE_LOGGING` flags
4. **Start replacing console calls** in your codebase with `logger.*` calls
5. **Test in DevTools** — open Console, trigger events, see colored output
6. **Try runtime control** — type `window.__logger.disable()` in DevTools
