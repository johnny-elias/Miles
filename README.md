# Miles
# ✈️ AwardFlightFinder

**The open-source “Google Flights for miles.”**  
AwardFlightFinder crawls airline & partner award inventories, converts rewards prices into ¢/point, and sends real-time alerts when seats you care about appear—all in a modular, developer-friendly monorepo.

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
| 💰 **Point Economics** | 💵 Converts >20 loyalty programs to cash value · Transfer-partner optimizer |
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
| AI-Assist | GitHub Copilot · OpenAI function calling for entity extraction |

---

## Repository Layout

