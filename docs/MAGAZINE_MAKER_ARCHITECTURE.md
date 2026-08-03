# AI Magazine Maker — Production Architecture & Migration Plan

Companion to [MAGAZINE_DESIGN_BIBLE.md](./MAGAZINE_DESIGN_BIBLE.md). This document covers the engineering side: what exists today, what changes, and how to get there in phases.

---

## 1. Codebase Audit (as of this document)

**Frontend** (`frontend/`, Vite + React 18 + TypeScript + Tailwind, React Router, TanStack Query, Framer Motion, Firebase Auth, `pdf-lib`, no state library beyond component state/context):
- `src/pages/PhotoZineMaker.tsx` — the entire current Mini Magazine feature, ~1,300 lines, one component. Contains: page grid UI, AI-background panel, text/photo sticker system, drag/resize logic, PDF export, WhatsApp share.
- `src/lib/huggingface.ts` — client-side Hugging Face calls (image gen + text gen), multi-token rotation.
- `src/lib/api.ts` — calls to the Express backend; currently disabled/stubbed per a prior commit ("Disable backend calls").
- No existing state management for multi-step wizards, no design-system component library, no canvas abstraction beyond raw `<canvas>` calls inside `PhotoZineMaker.tsx`.

**Backend** (`backend/`, Express + Prisma/Postgres + Cloudinary + Razorpay + Firebase Admin):
- `src/routes/aiRoutes.ts` — a server-side mirror of the Hugging Face image call, **not currently called by the frontend** (frontend calls HF directly from the browser instead). Effectively dead code right now.
- Prisma schema has `User`, `CoverTemplate`, `CoverDesign`, `Order`, `Payment`, `Referral`, `Review`, `AuditLog` — all for the existing Shagun-cover product line. **No magazine-related models exist.**
- Backend is not currently deployed/wired to the live frontend (per git history: "Disable backend calls, fix logo transparency...").

### Reusable as-is
- `pdf-lib` PDF export pipeline (page sizing, image embedding) — same technique still applies.
- `huggingface.ts` multi-token rotation + `generateAiCoverImage`/`generateMagazineText` — becomes the "Image Engine" and "Content Engine" backbone.
- `renderFinalPageCanvas`'s coordinate system (`xPct`/`yPct`/`widthPct`/`heightPct`, 800×1067 logical canvas, 3× export scale) — becomes the page-model's canonical layout format; no reason to reinvent this.
- `StickerItem`/`PhotoItem` data shapes — become the basis for the new `PageElement` schema (see §9).
- Firebase Auth (already wired app-wide) — reused as-is for user accounts.

### Must be removed / replaced
- The single 1,300-line `PhotoZineMaker.tsx` component — must be decomposed (see §4). Keeping it monolithic blocks the wizard/workspace redesign entirely.
- The current linear-form UI (one big scrolling page with all controls stacked) — replaced by the 3-pane Canva-like workspace.
- `aiRoutes.ts`'s single `/generate-cover` endpoint — replaced by a proper `/api/magazine/*` namespace (see §6); the underlying HF call logic can be lifted almost unchanged.

### Hard infrastructure realities (must be decided before implementation, not glossed over)
| Requested feature | Reality |
|---|---|
| CMYK export | Browsers and `pdf-lib` work in RGB only. True CMYK requires server-side raster processing with ICC profiles (e.g., Ghostscript, ImageMagick, or a paid API like Cloudinary's PDF/CMYK transforms). This needs a live backend — cannot be done client-only. |
| Google Photos import | Requires a registered Google Cloud project, OAuth consent screen, and the Google Photos Picker API. Needs backend token exchange. Real setup, real approval time. |
| Instagram import | Full API access requires a Meta Developer app + Instagram Business Login + app review — weeks of lead time and ongoing compliance. The only *currently* feasible Instagram path without that is parsing the user's own "Download Your Information" `.zip` export (client-side, no OAuth) — already effectively covered by the drag-and-drop/paste support just shipped. |
| Face/emotion detection | Feasible **client-side, free**, via `face-api.js` or MediaPipe Face Landmarker (runs in-browser, no server, no per-image cost) — recommended over a paid cloud vision API given prior cost constraints. |
| AI chat assistant | Needs a real LLM with structured/function-calling output, not just image gen. The existing Hugging Face instruct-model integration (`generateMagazineText`) can be extended to return structured JSON edit-commands; reuses existing token rotation, stays free. |
| Real page-flip animation | Pure frontend (Framer Motion 3D transforms or a library like `react-pageflip`) — no backend needed. |

---

## 2. New Architecture Overview

Three-pane Canva-like workspace, one route (`/magazine-maker`), replacing the single-page `PhotoZineMaker`:

```
┌─────────────┬──────────────────────────────┬─────────────────┐
│ LEFT        │ CENTER                       │ RIGHT           │
│ Workflow    │ Live Editor (current page)   │ Magazine        │
│ rail        │                              │ Preview         │
│             │                              │ (thumbnails +   │
│ Theme       │  [canvas / drag-drop editor] │  page-flip)     │
│ Photos      │                              │                 │
│ Story       │                              │                 │
│ Layouts     │                              │                 │
│ Text        │                              │                 │
│ Preview     │                              │                 │
│ Export      │                              │                 │
└─────────────┴──────────────────────────────┴─────────────────┘
       Floating AI Chat (bottom-right, all steps)
```

State lives in one `MagazineProject` object (see §9's JSON schema) held in a new `MagazineContext`, persisted to `localStorage` continuously (so refresh doesn't lose work) and to the backend once a user is signed in.

---

## 3. New User Flow (replaces the current linear form)

1. **Who is this for?** — relationship picker (reuses/extends current `TOPIC_PROMPTS`).
2. **Recipient name.**
3. **Upload photos** — drag/drop + paste (already shipped) + zip upload (client-side unzip, e.g. `fflate`) + Google Photos Picker (phase 3+, needs backend OAuth).
4. **AI photo report** — client-side face/quality/duplicate analysis, shown as a review screen ("12 photos analyzed, 2 look blurry, 1 duplicate found, best cover photo highlighted") — user can override, not just accept.
5. **Choose design style** — extends current `FRAME_PROMPTS`.
6. **Generate Complete Magazine** — single action replacing "Generate Background": runs Story Engine → Layout Engine → Content Engine → Image Engine together (see §7) and produces a full draft the user *reviews and edits*, not builds by hand.

---

## 4. React Components (new/changed)

```
MagazineMakerPage                    — route shell, 3-pane layout, replaces PhotoZineMaker.tsx
├── WorkflowSidebar                  — left rail: step nav (Theme/Photos/Story/Layouts/Text/Preview/Export)
│   ├── WorkflowStepItem
│   └── WorkflowProgressIndicator
├── StepPanels/
│   ├── RelationshipStep             — Step 1
│   ├── RecipientNameStep            — Step 2
│   ├── PhotoUploadStep              — Step 3 (extends existing drag/drop+paste)
│   │   ├── PhotoDropzone            — reuse existing drag/drop/paste handlers
│   │   ├── PhotoReportCard          — Step 4 AI report (per-photo score/flags)
│   │   └── PhotoThumbnailGrid
│   ├── DesignStyleStep              — Step 5 (extends FRAME_PROMPTS as selectable cards)
│   └── GenerateStep                 — Step 6, triggers full pipeline, shows progress
├── PageEditor/                      — CENTER pane
│   ├── PageCanvas                   — wraps existing renderFinalPageCanvas + live DOM overlay (photos/stickers), largely reuses current drag/resize code
│   ├── PageToolbar                  — Regenerate / Change Layout / Change Style / Change Story / Change Title / Change Quote / Replace Photo / Duplicate / Delete / Add Page
│   ├── PhotoElement                 — extracted from current inline photo-sticker JSX
│   ├── TextElement                  — extracted from current inline text-sticker JSX
│   └── LayoutPicker                 — new: pick from Layout Library presets for this page
├── PreviewPane/                     — RIGHT pane
│   ├── ThumbnailStrip
│   ├── PageFlipViewer               — new: react-pageflip or Framer-Motion 3D flip
│   └── FullscreenPreviewModal
├── AiChatAssistant/                 — floating, all steps
│   ├── ChatBubbleButton
│   ├── ChatPanel
│   └── ChatMessage
└── ExportStep/
    ├── ExportFormatPicker           — PDF / PNG / JPEG / (CMYK if backend available)
    └── ExportProgressModal
```

**Removed:** the monolithic `PhotoZineMaker.tsx` is decomposed into the above; nothing in it is thrown away wholesale — its logic is redistributed.

---

## 5. Hooks & Contexts

```
contexts/
  MagazineContext           — the single source of truth: MagazineProject state, dispatch actions
  AiChatContext             — chat history + pending AI actions queue

hooks/
  useMagazineProject()      — read/write the active project, autosave to localStorage + backend
  usePhotoAnalysis()        — runs face-api.js/MediaPipe analysis on newly-added photos, returns scores
  useDragAndResize()        — extracted from PhotoZineMaker's existing beginDrag/handleDragMove logic (kind-agnostic, reused by PhotoElement + TextElement)
  usePasteAndDrop()         — extracted from the paste/drag-drop handlers just shipped
  useLayoutEngine()         — given (storyPosition, relationship, theme, imageCount, orientation, emotion) → suggested layoutId (Design Bible §1/§6 rules)
  useStoryEngine()          — given relationship+theme+page count → ordered narrative beats (Design Bible §2)
  useAiGeneration()         — wraps generateAiCoverImage/generateMagazineText with per-page progress callbacks
  useAiChatCommand()        — parses a chat instruction into a structured page-edit action (extends generateMagazineText's model to function-calling-style JSON output)
  usePdfExport()            — wraps existing renderFinalPageCanvas + pdf-lib pipeline
```

---

## 6. API Endpoints (new `/api/magazine` namespace; requires the backend to actually be deployed/reconnected)

```
POST   /api/magazine/projects                — create a project
GET    /api/magazine/projects/:id             — load a project
PUT    /api/magazine/projects/:id             — save/update a project
DELETE /api/magazine/projects/:id             — delete

POST   /api/magazine/generate/background      — proxies Hugging Face image gen (lift logic from existing aiRoutes.ts)
POST   /api/magazine/generate/text             — proxies Hugging Face text gen (lift from client huggingface.ts)
POST   /api/magazine/generate/full             — orchestrates Story+Layout+Content+Image engines server-side for one full-magazine generation call

POST   /api/magazine/photos/analyze            — OPTIONAL server-side fallback if client-side face-api.js analysis is skipped (e.g. very old devices)

GET    /api/magazine/photos/google-photos/auth — Google OAuth kickoff (phase 3+)
GET    /api/magazine/photos/google-photos/callback

POST   /api/magazine/export/pdf                — existing client pipeline can do this; only needed server-side if CMYK is required
POST   /api/magazine/export/cmyk               — server-side only; requires Ghostscript/ImageMagick or a paid conversion service
```

---

## 7. AI Services

| Service | What it does | Where it runs | Cost |
|---|---|---|---|
| **Image Engine** | Background generation | Hugging Face (existing `huggingface.ts`, multi-token rotation) | Free |
| **Content Engine** | Titles/quotes/captions/letters, relationship-aware | Hugging Face instruct model (existing `generateMagazineText`, extended per Design Bible §9) | Free |
| **Story Engine** | Assigns narrative beat per page index | Pure logic, no AI call needed (rule table, Design Bible §2) | Free |
| **Layout Engine** | Picks a layout template per page | Pure logic + lookup table (Design Bible §1/§3/§6), not an AI call | Free |
| **Image Analysis Engine** | Face count, blur/quality score, duplicate detection | Client-side `face-api.js`/MediaPipe (no server round-trip) | Free |
| **AI Chat Command Parser** | Turns "make page 4 more emotional" into a structured edit | Hugging Face instruct model, prompted to output a JSON action (`{action: 'regeneratePage', pageIndex: 4, tone: 'reflective'}`) that the client applies | Free, but least reliable of all — needs strict validation + fallback to "I didn't understand, try rephrasing" |

---

## 8. Database Models (new Prisma models, additive — does not touch existing Shagun-cover schema)

```prisma
model MagazineProject {
  id            String   @id @default(uuid())
  userId        String
  user          User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  recipientName String?
  relationship  String?  // "Mameri", "Wedding", "Friend", etc.
  designStyle   String?  // "Luxury Editorial", "Modern Minimal", etc.
  pageCount     Int      @default(8)
  pagesJson     String   // serialized MagazinePage[] — see §9 schema
  status        MagazineStatus @default(DRAFT)
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt

  photos        MagazinePhoto[]
}

enum MagazineStatus {
  DRAFT
  GENERATING
  READY
  EXPORTED
}

model MagazinePhoto {
  id          String   @id @default(uuid())
  projectId   String
  project     MagazineProject @relation(fields: [projectId], references: [id], onDelete: Cascade)
  url         String   // Cloudinary URL after upload
  qualityScore Float?
  faceCount    Int?
  isDuplicateOf String? // id of the photo it duplicates, if any
  suggestedPageIndex Int?
  createdAt   DateTime @default(now())
}
```

---

## 9. Core JSON Schema (client-side project state — extends current `ZinePage`/`StickerItem`/`PhotoItem`)

```ts
interface MagazineProject {
  id: string;
  recipientName: string;
  relationship: string;
  designStyle: string;
  pages: MagazinePage[];
}

interface MagazinePage {
  index: number;
  narrativeBeat: 'invitation' | 'connection' | 'peak' | 'reflection' | 'milestone' | 'closing';
  layoutId: string;             // from the Layout Library
  background: string | null;    // data URL, same as today
  elements: PageElement[];      // unifies today's separate photos[]/stickers[] arrays
}

type PageElement = PhotoElement | TextElement;

interface PhotoElement {
  kind: 'photo';
  id: string; src: string;
  xPct: number; yPct: number; widthPct: number; heightPct: number;   // unchanged from today's PhotoItem
  rotationDeg?: number;          // new — enables true polaroid-stack tilt (Design Bible §5)
}

interface TextElement {
  kind: 'text';
  id: string; content: string; role: 'chapterLabel' | 'title' | 'quote' | 'caption';
  xPct: number; yPct: number; fontSizePx: number; font: string;
  colorMode: 'solid' | 'gradient'; color: string; gradientFrom: string; gradientTo: string; // unchanged from today's StickerItem
}
```

This is a strict superset of today's data model — existing pages migrate by wrapping `photos`+`stickers` into one `elements` array and tagging a default `layoutId`/`narrativeBeat` per page index.

---

## 10. Folder Structure

```
frontend/src/
  pages/
    MagazineMaker/
      MagazineMakerPage.tsx
  features/magazine-maker/
    components/
      WorkflowSidebar/
      StepPanels/
      PageEditor/
      PreviewPane/
      AiChatAssistant/
      ExportStep/
    hooks/
      useMagazineProject.ts
      usePhotoAnalysis.ts
      useDragAndResize.ts
      usePasteAndDrop.ts
      useLayoutEngine.ts
      useStoryEngine.ts
      useAiGeneration.ts
      useAiChatCommand.ts
      usePdfExport.ts
    contexts/
      MagazineContext.tsx
      AiChatContext.tsx
    engines/
      layoutEngine.ts        — pure functions, unit-testable, no React
      storyEngine.ts
      imageAnalysisEngine.ts
    data/
      layoutLibrary.ts        — layout presets (extends current FRAME_PROMPTS concept)
      themeLibrary.ts          — extends current TOPIC_PROMPTS
    types/
      magazine.ts              — the schema in §9
  lib/
    huggingface.ts             — existing, extended with chat-command parsing

backend/src/
  routes/
    magazineRoutes.ts          — replaces aiRoutes.ts's single endpoint with the §6 namespace
  services/
    imageEngine.ts             — lifted from huggingface.ts server-side mirror
    contentEngine.ts
    cmykExportService.ts       — new, only if CMYK is greenlit
  prisma/
    schema.prisma               — add §8 models
```

---

## 11. Implementation Phases & Complexity

| Phase | Scope | Complexity | Depends on |
|---|---|---|---|
| **0** | Decompose `PhotoZineMaker.tsx` into the component tree in §4, no behavior change | Medium (mechanical but risky — must not regress the working feature) | — |
| **1** | `MagazineContext` + unified `elements` schema migration (§9) | Medium | Phase 0 |
| **2** | 3-pane workspace shell + left-rail step navigation | Medium | Phase 1 |
| **3** | Story Engine + Layout Engine (pure logic, Design-Bible-rule-driven) | Low–Medium | Phase 1 |
| **4** | "Generate Complete Magazine" single action wiring Story+Layout+Content+Image engines | Medium | Phase 3 |
| **5** | Client-side Image Analysis Engine (face-api.js integration, quality/duplicate scoring) | Medium–High (new dependency, tuning thresholds) | Phase 1 |
| **6** | Page-flip preview pane | Low (library-driven) | Phase 2 |
| **7** | AI Chat Assistant with structured command parsing | High (reliability/validation is the hard part, not the UI) | Phase 4 |
| **8** | Backend reconnection: `MagazineProject`/`MagazinePhoto` Prisma models + save/load API | Medium | Backend must be redeployed (currently disabled) |
| **9** | Google Photos import | High (OAuth app review lead time is the real cost, not the code) | Phase 8 |
| **10** | CMYK export | High (infra decision: which conversion service/library, likely a paid step) | Phase 8 |

**Overall honest estimate:** Phases 0–7 (a working, AI-driven, single-user, no-login-required Canva-like editor with everything except cloud photo import and true CMYK) is a substantial multi-week rebuild, not a single session. Phases 8–10 add real external dependencies (OAuth review, paid conversion) with lead times outside engineering control.

---

## Recommended Starting Point

Given the size, I'd suggest **Phase 0 first, alone, as its own reviewable step** — decomposing the existing working `PhotoZineMaker.tsx` without changing behavior — before committing to the full rebuild. That de-risks everything after it (nothing downstream can be built cleanly on top of a 1,300-line monolith) and gives a natural checkpoint to confirm direction before the bigger phases begin.
