# Smart Productivity Hub

Smart Productivity Hub is an AI-powered productivity platform that combines email generation, meeting note summarization, and task planning into a single modern web application. It helps professionals improve communication, organize information efficiently, and manage workloads more effectively.

> Live preview and published builds are managed through Lovable.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Available Scripts](#available-scripts)
- [Pages](#pages)
- [Responsible AI](#responsible-ai)
- [Roadmap](#roadmap)
- [License](#license)

## Features

### Smart Email Generator

* Generates context-aware professional emails
* Supports multiple tones:

  * Formal
  * Informal
  * Professional
  * Persuasive
* Adapts content based on audience:

  * Client
  * Manager
  * Team
  * Customer
* Automatically generates subject lines and email content

### Meeting Notes Summarizer

* Converts lengthy meeting notes into concise summaries
* Extracts:

  * Key discussion points
  * Decisions made
  * Action items
  * Deadlines
  * Responsibilities
* Produces structured meeting reports for quick review

### AI Task Planner

* Generates daily and weekly schedules
* Prioritizes tasks based on urgency and importance
* Organizes workload efficiently
* Provides productivity and time-management recommendations

### Dashboard

The application includes a centralized dashboard that provides:

* Productivity overview
* Quick access to all AI tools
* Recent activity tracking
* Summary statistics and insights

## Tech Stack

- **Framework:** React 19 + TanStack Start (Vite 7)
- **Language:** TypeScript (strict)
- **Styling:** Tailwind CSS v4, shadcn/ui
- **Icons:** Lucide React
- **Routing:** TanStack Router (file-based)
- **State:** React Context + `localStorage` persistence
- **AI logic:** Local mock generators in `src/lib/mock-ai.ts` (swap-ready for a real provider)

## Getting Started

Prerequisites: [Bun](https://bun.sh) (recommended) or Node.js 20+.

```bash
# install dependencies
bun install

# start the dev server
bun run dev

# build for production
bun run build
```

The app runs on `http://localhost:8080` by default.

## Project Structure

```
src/
  components/        Reusable UI + app shell and sidebar
    ui/              shadcn/ui primitives
  lib/
    mock-ai.ts       Email / meeting / planner generators
    store.tsx        Context store + localStorage persistence
  routes/            File-based routes (TanStack Router)
    __root.tsx       Root layout, head metadata
    index.tsx        Dashboard
    email.tsx        Smart Email Generator
    meetings.tsx     Meeting Notes Summarizer
    tasks.tsx        AI Task Planner
    history.tsx      Generated content history
    settings.tsx     User preferences
  styles.css         Tailwind v4 theme tokens
```

## Available Scripts

| Command | Description |
| --- | --- |
| `bun run dev` | Start the local dev server |
| `bun run build` | Build the production bundle |
| `bun run start` | Run the built app |
| `bun run lint` | Lint the project with ESLint |

## Pages

| Route | Description |
| --- | --- |
| `/` | Dashboard with stats, quick actions, recent activity |
| `/email` | Smart Email Generator |
| `/meetings` | Meeting Notes Summarizer |
| `/tasks` | AI Task Planner |
| `/history` | Searchable history of generated content |
| `/settings` | Dark mode, notifications, AI preferences |

## Responsible AI

AI-generated content may contain inaccuracies. Users should review outputs before making business decisions. You remain responsible for final communications, schedules, and decisions.

## Roadmap

- Real LLM integration (OpenAI / Gemini / Lovable AI Gateway)
- User authentication and cloud sync
- Export to PDF and Excel
- Calendar integration
- Team collaboration and sharing
- Advanced analytics and reporting

## License

MIT

---

**Smart Productivity Hub** — Simplifying communication, planning, and productivity with AI.
