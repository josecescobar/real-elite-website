# Test Coverage Analysis

## Current State: Zero Test Coverage

The codebase has **no test files, no testing framework, and no testing dependencies**. There are 35 TypeScript source files across pages, components, and utilities — none have corresponding tests.

---

## Priority 1: Business Logic (High Impact)

### `src/lib/blog.ts` — Blog utilities
This module has the most testable pure logic in the codebase:

| Function | What to test |
|----------|-------------|
| `getAllPosts()` | Returns posts sorted by date descending; filters only `.md`/`.mdx` files; correctly parses frontmatter fields |
| `getPostBySlug(slug)` | Returns correct post for valid slug; returns `null` for nonexistent slug; tries both `.md` and `.mdx` extensions |
| `getRecentPosts(count)` | Returns correct number of posts; defaults to 3; handles case where fewer posts exist than requested |
| `formatDate(dateStr)` | Formats dates correctly in `en-US` locale; handles edge cases like invalid date strings |

**Why:** File system operations and date parsing are classic sources of bugs, especially across environments.

### `src/components/shared/EstimateForm.tsx` — Form validation
The `validateForm()` function contains regex-based validation logic that is critical to the user-facing contact flow:

| Validation | What to test |
|-----------|-------------|
| Email regex `^[^\s@]+@[^\s@]+\.[^\s@]+$` | Valid emails pass; invalid formats rejected (missing @, spaces, double dots) |
| Phone regex `^[\d\s\-\+\(\)]+$` | Standard formats accepted (e.g., `(304) 555-0123`, `+1-304-555-0123`); letters rejected |
| Required fields | Empty/whitespace-only values caught for all 5 fields |
| Message length | Messages under 10 characters rejected |
| Error clearing | Errors clear when user types in the errored field |
| Submission flow | Form resets on success; shows success message; disables button during submission |

**Why:** Form validation bugs directly impact lead generation — the core purpose of this website.

---

## Priority 2: Component Behavior (Medium Impact)

### `src/components/shared/Button.tsx` — Polymorphic rendering
This component renders as 4 different elements based on the `href` prop:

| Scenario | Expected element |
|----------|-----------------|
| No `href` | `<button>` |
| `href="tel:..."` or `href="mailto:..."` | `<a>` (no target) |
| `href="https://..."` | `<a target="_blank" rel="noopener noreferrer">` |
| `href="/about"` (internal) | Next.js `<Link>` |

Also test: variant styles (`primary`/`secondary`/`outline`), size classes (`sm`/`md`/`lg`), `ref` forwarding, className merging.

**Why:** Incorrect link rendering could break navigation or create security issues (missing `rel="noopener"`).

### `src/components/shared/GalleryGrid.tsx` — Category filtering
| Scenario | What to test |
|----------|-------------|
| "All" selected | Shows all images |
| Specific category | Filters to matching images only |
| Category with no matches | Shows "No projects found" message |
| Filter button active state | Correct button highlighted |

### `src/components/layout/Header.tsx` — Mobile menu
| Scenario | What to test |
|----------|-------------|
| Menu toggle | Opens/closes on button click |
| Services dropdown | Expands/collapses sub-nav |
| Link click | Closes mobile menu (except Services) |
| Desktop vs mobile | Menu button hidden on `lg:` breakpoints |

---

## Priority 3: Data Integrity (Lower Impact, Easy Wins)

### `src/lib/constants.ts` — Static data validation
Snapshot or structural tests to catch accidental data corruption:

- `SERVICES` array: each entry has `slug`, `title`, `description`, `href`
- `NAV_LINKS`: all `href` values are valid routes; Services has `children`
- `SERVICE_AREAS`: no duplicate entries across primary/secondary/expansion
- `TESTIMONIALS`: each has `name`, `text`, `rating`
- `BUSINESS`: phone numbers are valid format; address fields present

---

## Priority 4: Page-Level Smoke Tests (Nice to Have)

Smoke tests to verify pages render without crashing:

- Home page renders all sections (Hero, TrustBar, ServicesGrid, etc.)
- Service pages render with correct content
- Blog listing and individual post pages render
- Contact page includes the EstimateForm
- 404/error handling for invalid slugs

---

## Recommended Setup

### 1. Install dependencies
```bash
npm install -D vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event @vitejs/plugin-react jsdom
```

### 2. Create `vitest.config.ts`
```ts
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    globals: true,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
```

### 3. Create `src/test/setup.ts`
```ts
import '@testing-library/jest-dom/vitest';
```

### 4. Add test script to `package.json`
```json
"scripts": {
  "test": "vitest",
  "test:coverage": "vitest --coverage"
}
```

### 5. Suggested test file structure
```
src/
├── lib/
│   ├── blog.ts
│   ├── blog.test.ts          ← Priority 1
│   └── constants.test.ts     ← Priority 3
├── components/
│   └── shared/
│       ├── EstimateForm.test.tsx  ← Priority 1
│       ├── Button.test.tsx        ← Priority 2
│       └── GalleryGrid.test.tsx   ← Priority 2
```

---

## Summary

| Priority | Area | Files | Estimated Tests |
|----------|------|-------|----------------|
| 1 - High | Blog utilities | `blog.ts` | ~12 tests |
| 1 - High | Form validation | `EstimateForm.tsx` | ~15 tests |
| 2 - Medium | Button component | `Button.tsx` | ~8 tests |
| 2 - Medium | Gallery filtering | `GalleryGrid.tsx` | ~5 tests |
| 2 - Medium | Header/mobile menu | `Header.tsx` | ~6 tests |
| 3 - Low | Constants validation | `constants.ts` | ~5 tests |
| 4 - Low | Page smoke tests | All pages | ~10 tests |
| **Total** | | | **~61 tests** |

Starting with Priorities 1 and 2 would cover the most critical business logic and interactive behavior with roughly 46 tests.
