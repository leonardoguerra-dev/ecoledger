# EcoLedger — Industrial energy management dashboard

A high-performance B2B SaaS platform tailored for monitoring energy efficiency ($kWh$, $CO_2$ emissions, and financial impact) across multi-site industrial facilities. This project serves as an engineering playground to demonstrate modern full-stack frontend architectures using the latest JavaScript and TypeScript ecosystem.

## Project objectives

- **E2E type-safety:** Strict data validation from the database layer to the UI components
- **Performance under load:** Optimized React rendering cycles and non-blocking calculations for dense datasets
- **Product and business driven:** Visualizing technical metrics alongside financial indicators like ROI and payback period

## Tech stack

- **Framework:** Next.js (App Router)
- **Language:** TypeScript (Strict mode)
- **UI library:** Material UI (MUI v5)
- **Database:** PostgreSQL
- **Validation:** Zod
- **Testing:** Vitest

## Architecture decision records (ADR)

### ADR 001: MUI integration via standard emotion wrapper (Client-side hydration)

- **Context:** Next.js App Router shifts the paradigm towards React Server Components (RSC) by default. Material UI (v5) relies heavily on Emotion for runtime CSS-in-JS, which requires access to the browser's DOM and React context, causing a conflict with pure server-side rendering.
- **Options considered:**
  1. MUI Pigment CSS: Zero runtime CSS-in-JS, full compatibility with RSC. However, it is an emerging technology with shifting theme customization APIs.
  2. Standard MUI + Emotion registry: Client-side encapsulation of MUI layout components using an SSR injection registry to prevent flash of unstyled content (FOUC).
- **Decision:** Option 2. We chose the production-tested standard MUI configuration with an explicit style registry wrapper.
- **Consequences:** Pages executing database queries will remain Server Components. Interactive MUI sub-components like graphs, forms, and sliders will be explicitly isolated into Client Components using the `"use client"` boundary. This guarantees optimal data-fetching speed while maintaining standard design token scalability without early-adoption technical debt.
