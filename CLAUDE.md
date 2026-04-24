# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

EGR-econ-helper — Interactive engineering economy tutor web app based on Newnan's *Engineering Economic Analysis* (14th ed., Chapters 1-8). Acts as a "mock professor" with lessons, animated walkthroughs, practice problems with AI feedback, an equations reference, and a playground/calculator.

## Commands

- `npm run dev` — Start Vite dev server (frontend at http://localhost:5173)
- `npm run server` — Start Express API proxy server (http://localhost:3001, requires `.env` with `ANTHROPIC_API_KEY`)
- `npm run dev:all` — Start both servers
- `npm run build` — Type-check and build for production
- `npm run lint` — Run ESLint
- `npx tsc --noEmit` — Type-check only

## Architecture

**Frontend:** React + TypeScript + Vite, styled with Tailwind CSS v4, animations via Framer Motion.

**Backend:** Minimal Express server (`server.js`) that proxies requests to the Claude API. Keeps the API key server-side.

### App Structure (5 tabs)
- **Lessons** (`src/pages/Lessons.tsx`) — Chapter cards → AI chat tutor per chapter
- **Walkthroughs** (`src/pages/Walkthroughs.tsx`) — Step-by-step animated problem solutions with SVG cash flow diagrams
- **Equations** (`src/pages/Equations.tsx`) — Searchable reference, progressively unlocked by lesson completion
- **Practice** (`src/pages/Practice.tsx`) — Interactive problems with answer checking, AI feedback, and slide-out calculator panel
- **Playground** (`src/pages/Playground.tsx`) — Interactive cash flow diagram builder + engineering economy calculator + interest factor lookup

### Key Modules
- `src/utils/calc.ts` — All engineering economy math: interest factors (F/P, P/F, F/A, A/F, A/P, P/A, P/G, A/G), PW, FW, AW, IRR, payback
- `src/utils/ai.ts` — Frontend API client for the Claude proxy server
- `src/utils/storage.ts` — localStorage-based progress tracking
- `src/data/chapters.ts` — Chapter metadata
- `src/data/equations.ts` — Equation definitions with formulas, variables, descriptions
- `src/data/problems.ts` — Walkthrough and practice problem content
- `src/components/CashFlowDiagram.tsx` — SVG-based interactive/animated cash flow diagram
- `src/components/CalculatorPanel.tsx` — Slide-out panel with basic calculator + econ factor calculator

### AI Integration
The Express server (`server.js`) has two endpoints:
- `POST /api/chat` — General tutor chat (used by Lessons)
- `POST /api/feedback` — Problem-specific feedback when a student answers incorrectly (used by Practice)

Both use a system prompt that frames Claude as an engineering economy tutor covering Chapters 1-8.
