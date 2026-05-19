---
name: testing-easycontext
description: Test the EasyContext frontend app end-to-end. Use when verifying UI changes, Supabase integration, or production readiness.
---

# Testing EasyContext App

## Prerequisites

- Node.js and npm installed
- No Supabase env vars needed for frontend-only testing (the app gracefully degrades)

## Dev Server

```bash
cd /home/ubuntu/repos/context-canvas
npm install
npm run dev -- --host 0.0.0.0 --port 5173
```

The app will be available at `http://localhost:5173/`.

## Testable Pages

| Page | URL | Key Things to Check |
|---|---|---|
| Landing | `/` | Hero renders, gradient text visible, nav scroll anchors work, footer present |
| Pricing | `/pricing` | Two plan cards (Free $0, Pro $19), "Popular" badge on Pro, FAQ accordion expands |
| Auth | `/auth` | Google button, email/password fields, guest mode at bottom after divider |
| Terms | `/terms` | Heading, date, 9 sections, "Back to home" link, footer |
| Privacy | `/privacy` | Heading, date, 9 sections, "Back to home" link, footer |
| Dashboard | `/dashboard` | Access via guest mode from auth page; empty state with "No canvases yet" |

## Critical Fix: Supabase Graceful Init

The most important thing to verify is that the app **renders without Supabase env vars**. Previously, the Supabase client would crash with `"supabaseUrl is required"` causing a white screen on deployment. The fix uses placeholder URLs so the app loads without a backend.

**How to test:** Simply start the dev server without setting `VITE_SUPABASE_URL` or `VITE_SUPABASE_PUBLISHABLE_KEY`. If the landing page renders, the fix works. If you see a white screen, it's broken.

## Guest Mode Flow

1. Navigate to `/auth`
2. Click "Continue as guest →" at the bottom
3. App redirects to `/dashboard` in "Preview mode"
4. Empty state should show: icon, "No canvases yet", "Create your first canvas" button
5. Click "Exit preview" to return to landing page

## Nav Scroll Anchors

- Click "How it works" in nav → scrolls to section with heading "Three steps. Thirty seconds."
- Click "Features" in nav → scrolls to section with heading "Built for people who use AI seriously"

## Notes

- Without Supabase configured, auth (Google/email sign-in) won't work — this is expected
- The Pricing page redirects to `/auth` when clicking "Upgrade to Pro" if Supabase isn't configured
- No CI is configured on this repo; run `npm run build` and `npm run lint` locally to verify
- Build command: `npm run build`
- Lint command: `npm run lint`
