# CodePrep — Coding Interview Platform

A browser-based coding interview platform built with Angular 19. Candidates practice problems with an AI interviewer, and real interviewers can create sessions, observe candidates live, and take private notes.

## Features

### For Candidates
- **Monaco Code Editor** — VS Code-grade editor with syntax highlighting, auto-complete, and multi-cursor editing (Python, JavaScript, Java, C++)
- **AI Mock Interviewer** — Practice with an AI that asks follow-up questions and probes your approach via text or voice (Web Speech API)
- **Context-Aware Hints** — Get targeted nudges without spoiling the solution
- **Test Case Runner** — Run and submit code against predefined test cases with pass/fail results
- **Countdown Timer** — Configurable timer to simulate interview time pressure
- **Problem Library** — Curated problems organized by difficulty (Easy, Medium, Hard)
- **Join Live Sessions** — Enter a join code from an interviewer to start a real interview

### For Interviewers
- **Dashboard** — Create interview sessions, select problems, set time limits, and generate shareable join codes
- **Live Code Observation** — Watch candidates code in real time via WebSocket-powered read-only editor view
- **Private Notes** — Timestamped note-taking panel during live sessions, auto-saved locally and invisible to candidates
- **Session Management** — Track sessions by status (waiting, active, completed)

### Platform
- **Role-Based Auth** — JWT authentication with interviewer and candidate roles
- **Route Guards** — Protected routes based on authentication and role
- **Auth-Aware Navigation** — Navbar adapts to show role-specific links (Dashboard, Join Session, Sign in/out)

## Tech Stack

| Technology | Purpose |
|---|---|
| Angular 19 | Frontend framework (standalone components, signals) |
| Monaco Editor | Code editing (via ngx-monaco-editor-v2) |
| WebSocket | Real-time code sync between candidate and interviewer |
| Tailwind CSS + Flowbite | Styling and UI components |
| Web Speech API | Voice input for AI interview mode |
| RxJS | Reactive state and async streams |
| JWT | Authentication tokens |

## Project Structure

```
src/app/
├── core/
│   ├── guards/           # Route guards (auth, role, guest)
│   ├── interceptors/     # HTTP auth interceptor
│   ├── models/           # TypeScript interfaces (auth, problem, AI)
│   └── services/
│       ├── auth-service/          # Login, register, JWT management
│       ├── session-service/       # Interview session CRUD
│       ├── collaboration-service/ # WebSocket real-time sync
│       ├── ai-service/            # AI interviewer mock
│       ├── code-execution/        # Run/submit code
│       ├── interview-service/     # Interview mode state
│       ├── problem-service/       # Problem data fetching
│       ├── speech-recognition/    # Web Speech API wrapper
│       ├── timer-service/         # Countdown timer
│       └── navigation-service/    # Sidebar state
├── features/
│   ├── auth/             # Login & Register pages
│   ├── dashboard/        # Interviewer dashboard
│   ├── join/             # Candidate join session page
│   ├── observe/          # Live observation view + notes panel
│   ├── home/             # Landing page
│   ├── problem/          # Problem solving page (editor, tests, interview panel)
│   ├── problemset/       # Problem browsing & search
│   └── about/            # About page
└── shared/
    ├── navigation/       # Navbar, sidebar, tabs
    ├── action-buttons/   # Run/submit buttons
    ├── timer/            # Timer component
    └── user/             # User avatar component
```

## Development server

```bash
ng serve
```

Navigate to `http://localhost:4200/`. The app auto-reloads on file changes.

The backend API is expected at `http://localhost:8000` (configured in `src/environments/environment.ts`).

## Building

```bash
ng build
```

Build artifacts go to `dist/coding-interview-platform`.

## Running tests

```bash
ng test
```
