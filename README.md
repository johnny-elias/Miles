# ✈️ Miles

**The open-source “Google Flights for miles.”**  
**Miles** crawls airline & partner award inventories, converts reward prices into ¢/point, and sends real-time alerts when seats you care about appear—all in a modular, developer-friendly monorepo.

---

## Table of Contents
1. [Features](#features)
2. [Screenshots](#screenshots)
3. [Tech Stack](#tech-stack)
4. [Repository Layout](#repository-layout)
5. [Quick Start](#quick-start)
6. [Configuration](#configuration)
7. [Architecture Overview](#architecture-overview)
8. [Roadmap](#roadmap)
9. [Contributing](#contributing)
10. [License](#license)
11. [Credits](#credits)

---

## Features

| Category | Highlights |
| -------- | ---------- |
| 🛰 **Search** | 🔎 Fuzzy O/D-date queries · Hybrid keyword + vector search (Typesense / Weaviate) |
| 💰 **Point Economics** | 💵 Converts &gt;20 loyalty programs to cash value · Transfer-partner optimiser |
| 📡 **Crawlers** | 🕷 Serverless Playwright scrapers for LifeMiles, Aeroplan, AAdvantage & more |
| 🔔 **Alerts** | 📧 Email / 📱 Push notifications when award space opens or drops below X ¢/pt |
| 🛠 **Developer DX** | Turbo-powered monorepo · pnpm workspaces · VS Code dev container |
| 🔒 **Security** | End-to-end type-safe APIs (tRPC) · Secrets in AWS SM · CI vuln scan |

---

## Screenshots

| Web Search | Award Calendar (heat-map) | Email Alert |
| ---------- | ------------------------- | ----------- |
| *Coming soon* | *Coming soon* | *Coming soon* |

---

## Tech Stack

| Layer | Technology |
| ----- | ---------- |
| Front-end | **Next.js 13** (App Router) · TypeScript · Tailwind CSS · shadcn/ui |
| API | **Fastify** + tRPC · Zod validation · Prisma ORM |
| Data | PostgreSQL · Redis · S3 · Typesense (search) |
| Crawlers | Playwright + Node in AWS Lambda (or Docker) |
| DevOps | Terraform (AWS) · GitHub Actions CI/CD · Datadog APM |
| AI Assist | GitHub Copilot · OpenAI function calling for entity extraction |

---

## Repository Layout

```

miles/
├─ apps/
│  ├─ web/          # Next.js UI
│  └─ api/          # Fastify + tRPC server
├─ services/
│  ├─ crawlers/     # one airline per folder
│  └─ alerts/       # background workers
├─ packages/
│  ├─ core/         # shared domain logic (¢/pt calc, schemas)
│  └─ ui/           # reusable React components
├─ infra/           # Terraform stacks
└─ docs/            # ADRs & onboarding

````

---

## Quick Start

> **Prerequisites:** Node ≥ 20, pnpm, Docker (for Postgres + Redis)

```bash
# 1. Clone & install
git clone https://github.com/your-handle/miles.git
cd miles
pnpm install

# 2. Spin up local services
docker compose up -d db redis

# 3. Seed DB & run dev servers (web + api + mock crawler)
pnpm dev
````

Visit **[http://localhost:3000](http://localhost:3000)** and search “JFK → ICN 03 May”.

### Running Tests

```bash
pnpm test            # unit + integration
pnpm lint && pnpm tsc
```

---

## Configuration

Copy the sample env file and fill in the blanks:

```bash
cp .env.example .env
```

| Variable                                 | Description                        |
| ---------------------------------------- | ---------------------------------- |
| `DATABASE_URL`                           | Postgres connection string         |
| `REDIS_URL`                              | Redis endpoint                     |
| `AMADEUS_API_KEY` / `AMADEUS_API_SECRET` | Optional cash-fare enrichment      |
| `EMAIL_FROM`                             | Verified SES/SendGrid sender       |
| `OPENAI_API_KEY`                         | (Optional) entity-extraction tasks |

---

## Architecture Overview

```mermaid
flowchart LR
    UI[Next.js Front-end] -- GraphQL/tRPC --> API[Fastify API]
    API --> DB[(PostgreSQL)]
    API --> Search[(Typesense)]
    subgraph Workers
        Crawler1[Lambda<br/>LifeMiles] --> DB
        Crawler2[Lambda<br/>Aeroplan] --> DB
        Alerts[SQS → Lambda<br/>Email/WebPush] <-- DB
    end
    API <--> Redis[(Cache / PubSub)]
```

*Each crawler publishes seat deltas; alert workers fan-out messages to subscribed users in <200 ms.*

---

## Roadmap

* [ ] **v0.1** – Single airline + cash/award side-by-side search
* [ ] **v0.2** – Multi-airline aggregation · Email alerts
* [ ] **v0.3** – Calendar heat-map · Mobile PWA wrapper
* [ ] **v1.0** – Stripe billing · Partner-transfer optimiser · Public API

---

## Contributing

1. **Fork** the repo & create your branch: `git checkout -b feature/my-awesome-thing`
2. **Commit** your changes: `pnpm cz` (commitizen)
3. **Push** and open a PR—small, focused, with context please!
4. Lint, tests, and preview deploy run automatically via GitHub Actions.

---

## License

Distributed under the **MIT License**. See [`LICENSE`](LICENSE) for details.

---

## Credits

*Heavily inspired by Google Flights, AwardFares, and countless FlyerTalk/Reddit data-points.*

---

> ⭐ **Star to keep tabs on development & join the conversation in Discussions!**

