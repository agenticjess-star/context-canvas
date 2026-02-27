
# ParsePad — Context-as-a-Service

## Overview
ParsePad transforms scattered information (text, URLs, files) into clean, LLM-optimized context pages accessible via a single shareable URL. Premium SaaS design with optional user accounts.

---

## Phase 1: Landing Page & Core UI

### Landing Page
- Hero section with clear value prop: "Turn messy info into AI-ready context in 30 seconds"
- How-it-works steps (Add sources → Generate → Share URL → Better AI responses)
- CTA button leading to the workspace/editor
- Premium SaaS aesthetic: clean typography, subtle gradients, polished feel

### Workspace / Editor Page
- Multi-input area supporting:
  - **Text/notes**: Rich text paste area for freeform context
  - **URL input**: Paste a link to extract and include its content
  - **File uploads**: Drag-and-drop zone for PDFs and images
- Source list showing all added items with remove/reorder capability
- "Generate Context URL" primary action button
- Optional title and description for the context page

---

## Phase 2: Context Generation & Sharing

### Context Page Generation
- Combine all sources into a single, clean, LLM-optimized page
- Store content in Supabase (database for metadata, storage bucket for files)
- Generate a unique unlisted URL (e.g., parsepad.app/c/abc123)

### Generated Context Page (Public View)
- Clean, readable layout optimized for both humans and AI consumption
- Structured sections from each source
- Copy-URL button for easy sharing
- Optional expiry setting (1 hour, 1 day, 7 days, 30 days, never)

### URL Parsing
- Use a Supabase Edge Function to fetch and extract content from pasted URLs
- Convert to clean markdown/text for inclusion in context pages

### File Handling
- PDF text extraction via Edge Function
- Image storage in Supabase Storage bucket
- Display images inline on the context page

---

## Phase 3: Optional Accounts & Management

### Authentication (Optional)
- Google and email sign-in via Supabase Auth
- App works without login — anonymous users can create context pages
- Logged-in users get a dashboard to manage their pages

### Dashboard (Logged-in Users)
- List of previously created context pages
- View, edit, delete, or extend expiry
- Usage stats (views, number of pages created)

---

## Design Direction
- **Premium SaaS** aesthetic throughout
- Dark/light mode support
- Polished typography, generous spacing, subtle shadows and gradients
- Responsive design for desktop and mobile
