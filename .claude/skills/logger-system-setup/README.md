# Logger System Setup Skill

A Claude skill for setting up a professional, pluggable debug logging system in any TypeScript/JavaScript project.

## What's Included

- **SKILL.md** — The complete skill with setup instructions and comprehensive usage documentation
- **scripts/find-console-calls.js** — Helper utility to find existing `console.*` calls that should be replaced
- **This README**

## Quick Start

1. **Install the skill** — Copy this directory to your `.claude/skills/` folder
2. **Ask Claude** — Mention you want to set up a logger system for your project
3. **Follow the prompts** — Claude will create the four logger files and handle environment setup

## What Gets Created

The skill creates these files in `src/core/logging/`:

```
src/core/logging/
├── log-levels.ts   (types, interfaces, LogLevel enum)
├── log-styles.ts   (color styling for console output)
├── logger.ts       (Logger singleton class)
└── index.ts        (public API exports)
```

And updates:

- `.env.development` — `VITE_ENABLE_LOGGING=true`
- `.env.staging` — `VITE_ENABLE_LOGGING=true`
- `.env.production` — `VITE_ENABLE_LOGGING=false`

## Usage Example

```typescript
import { logger } from '@/core/logging';

// Direct logging
logger.info('MyModule', 'Operation started', { userId: 123 });

// Scoped logging (recommended for classes/services)
const log = logger.scope('UserService');
log.success('User created', { email: user.email });
log.error('Failed to create user', error);
```

## Finding Console Calls to Replace

After setting up the logger, use the included helper script to find console calls:

```bash
node .claude/skills/logger-system-setup/scripts/find-console-calls.js src/
```

This will list all `console.log()`, `console.warn()`, and `console.error()` calls that should be replaced with the logger.

## Features

✅ **Color-coded output** — DEBUG (gray), INFO (blue), WARN (orange), ERROR (red), SUCCESS (green)
✅ **Environment-based control** — Silent in production by default
✅ **Runtime toggling** — `logger.enable()`, `logger.disable()`, `logger.setMinLevel()`
✅ **Browser console access** — `window.__logger` in development for real-time control
✅ **Scoped loggers** — Namespace-aware logging for better organization
✅ **Zero dependencies** — Uses native browser `%c` CSS styling

## Documentation

For comprehensive documentation on how to use the logger in your code, see the **SKILL.md** file. It includes:

- Basic usage patterns
- Best practices
- API reference
- Common patterns (error handling, React hooks, API clients)
- Runtime control from code and browser console
- Environment configuration
- Troubleshooting guide

## Support

If you have questions about the logger system, refer to the Troubleshooting section in SKILL.md or ask Claude Code to help you integrate it into your project.
