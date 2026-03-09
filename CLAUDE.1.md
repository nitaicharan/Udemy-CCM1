# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Pocket Heist** is a starter project for the Claude Code Masterclass. It's a web app for creating and managing "tiny missions" with an office mischief theme. Currently a frontend skeleton with no backend, database, or authentication implemented.

## Commands

### Development

```bash
npm install        # Install dependencies
npm run dev        # Start dev server (http://localhost:3000)
npm run build      # Production build
npm start          # Run production server
```

### Testing

```bash
npm test            # Run all tests with Vitest
npm test -- <path>  # Run specific test file
npm test -- --watch # Run tests in watch mode
```

### Linting

```bash
npm run lint       # Run ESLint
```

## Architecture

### Tech Stack

- **Next.js 16** with App Router
- **React 19** with TypeScript 5
- **Tailwind CSS 4** + CSS Modules for styling
- **Vitest** + React Testing Library for unit tests

### Route Organization

The app uses Next.js **route groups** to organize related pages without affecting URLs:

- `app/(public)/` — Unauthenticated routes (splash, login, signup)
- `app/(dashboard)/` — Authenticated routes (heists management)
  - Has its own `layout.tsx` that includes the Navbar component

Routes automatically inherit their parent layout. The `(dashboard)` layout wraps all heist-related pages with the Navbar.

### Import Aliases

TypeScript path alias `@/*` maps to project root:

```typescript
import Navbar from "@/components/Navbar"; // Instead of "../../../components/Navbar"
```

### Styling Architecture

Multi-layered approach:

1. **Global Theme** (`app/globals.css`)
   - Tailwind CSS v4 using `@theme` directive
   - Custom color palette (purple/pink accents on dark background)
   - Typography base styles (h1–h4, body)
   - Utility classes (`.page-content`, `.center-content`, `.form-title`)

2. **Component Styles** (e.g., `components/Navbar/Navbar.module.css`)
   - CSS Modules for component-scoped styles
   - Use `@reference` to access global theme variables
   - Prevents style conflicts between components

3. **Tailwind Utilities** — Use inline for one-off styling needs

### Component Structure

Components follow barrel export pattern:

```
components/
└── Navbar/
    ├── Navbar.tsx        # Component implementation
    ├── Navbar.module.css # Scoped styles
    └── index.ts          # Re-exports for clean imports
```

### Testing Setup

- Tests in `tests/` directory mirror `components/` structure
- Vitest configured with jsdom environment and React Testing Library
- Globals enabled (no need to import `describe`, `it`, `expect`)
- Setup file: `vitest.setup.ts` imports `@testing-library/jest-dom`

## Additional Coding Preferences

- Do NOT use semicolons for JavaScript or TypeScript code.
- Do NOT apply Tailwind classes directly in component templates unless essential or just 1 at most. If an element needs more than a single Tailwind class, combine them into a custom class using the `@apply` directive.
- Use minimal project dependencies where possible.
- Use the `git switch -c` command to switch to new branches, not `git checkout`.
