

# EasyContext Rebrand, Auth, Pseudo-Vector Engine, and Premium UI

## Overview

Three workstreams executed together: (1) full rebrand from ParsePad to EasyContext with auth + dashboard, (2) machine-first optimization on `/c/:slug` pages, (3) premium UI refinements including a "Copy for AI" export button.

---

## 1. Authentication and Dashboard

### Database Migration
- Add a `profiles` table (id, username, avatar_url, created_at) with FK to `auth.users` and auto-creation trigger
- Add a `user_roles` table (not on profiles) for future plan-gating
- Update `context_pages` to set `user_id = auth.uid()` when user is logged in during creation

### Auth Implementation
- Create `src/hooks/useAuth.ts` -- wraps `supabase.auth.onAuthStateChange` + `getSession`, exposes `user`, `loading`, `signIn`, `signUp`, `signOut`
- Create `src/pages/Auth.tsx` -- premium login/signup page (email+password), with "Sign in with Google" button (configured via Supabase dashboard)
- Create `src/pages/ResetPassword.tsx` -- handles `type=recovery` flow

### Route Changes
- Rename `/workspace` to `/dashboard` (keep `/workspace` as redirect for backwards compat)
- `/dashboard` route: if unauthenticated, redirect to `/auth`; if authenticated, show dashboard
- New canvas creation lives at `/dashboard/new` or inline within dashboard
- Keep `/c/:slug` public (no auth required)

### Dashboard Page (`src/pages/Dashboard.tsx`)
- List user's canvases (query `context_pages` where `user_id = auth.uid()`)
- Show title, created date, view count, expiry status
- Actions: view, delete, copy URL
- Canvas limit enforcement: free users can create up to 3 canvases; show upgrade prompt after limit
- "New Canvas" button opens the existing workspace editor (refactored into a component)
- Header with user avatar, sign-out button

### Workspace Refactor
- Extract the editor UI from `Workspace.tsx` into `src/components/CanvasEditor.tsx`
- Dashboard's "New Canvas" opens this editor
- On generate, set `user_id` to current auth user if logged in

---

## 2. Pseudo-Vector Static Engine (Context Page Optimization)

### Machine-First Navigation on `/c/:slug`

All changes in `src/pages/ContextPage.tsx`:

**Hidden System Instruction Block** (top of `<body>`, invisible to humans via `sr-only`):
```text
SYSTEM_INSTRUCTION: This is a structured EasyContext page. Use the index 
below to locate specific data points without reading the entire document. 
Every source has a unique #ID. When citing, use [Source Name](#source-ID).
```

**JSON-LD Structured Data Block** (in `<head>` via React Helmet or inline script):
```json
{
  "@context": "https://schema.org",
  "@type": "Dataset",
  "name": "...",
  "description": "...",
  "hasPart": [
    { "@type": "DataDownload", "name": "source-label", "contentUrl": "#source-id" }
  ]
}
```

**Markdown Table of Contents** (hidden `sr-only` block):
```
## Table of Contents
| # | Source | Type | Anchor |
|---|--------|------|--------|
| 1 | Meeting Notes | text | #src-abc123 |
| 2 | docs.example.com | url | #src-def456 |
```

**Anchor IDs**: Each source section gets `id="src-{source.id}"` so agents can deep-link.

**SEO Privacy**: Add `<meta name="robots" content="noindex, nofollow" />` to all `/c/:slug` pages via a `<Helmet>` or direct DOM injection in useEffect.

---

## 3. Premium UI Refinement

### Global Rebrand
- All references to "ParsePad" become "EasyContext" across:
  - `src/pages/Index.tsx` (landing page -- logo, nav, hero, footer)
  - `src/pages/ContextPage.tsx` (header, footer)
  - `src/pages/Workspace.tsx` / `CanvasEditor.tsx`
  - `index.html` (title, meta tags, OG tags)
- Update tagline to "AI-ready context in seconds" or similar
- URL bar mockup on landing page: `easycontext.me/c/a8f3k2m1`

### "Copy for AI" Button on Context Pages
- Prominent button in the header next to "Copy URL"
- On click: compiles all sources into a single compressed Markdown string:
  ```
  # {title}
  {description}
  
  ---
  ## Source 1: {label} (text)
  {content}
  
  ---
  ## Source 2: {label} (url)
  {content}
  ```
- Copies to clipboard with toast confirmation

### Reader Mode Polish
- Clean typography with generous line-height
- Source sections with clear visual demarcation (left border accent, numbered badges)
- Monospace rendering for code-like content auto-detected
- Tighter spacing, muted metadata, content-first hierarchy

---

## Technical Sequence

1. **Database migration**: profiles table, trigger, user_roles table
2. **Auth hook + Auth page + ResetPassword page**
3. **Route restructure**: `/dashboard`, `/auth`, `/reset-password`, redirect `/workspace`
4. **Dashboard page**: list canvases, canvas limit, delete
5. **CanvasEditor extraction** from Workspace
6. **Rebrand**: all ParsePad references to EasyContext
7. **Context page engine**: system instruction, JSON-LD, TOC, anchor IDs, noindex meta
8. **Copy for AI button** on context pages
9. **UI polish** across all pages

### New Files
- `src/hooks/useAuth.ts`
- `src/pages/Auth.tsx`
- `src/pages/ResetPassword.tsx`
- `src/pages/Dashboard.tsx`
- `src/components/CanvasEditor.tsx`
- Supabase migration for profiles + user_roles + trigger

### Modified Files
- `src/App.tsx` -- new routes
- `src/pages/Index.tsx` -- rebrand + auth nav links
- `src/pages/ContextPage.tsx` -- pseudo-vector engine + rebrand + Copy for AI
- `src/lib/api/context.ts` -- attach user_id on create if authenticated
- `index.html` -- rebrand meta tags

