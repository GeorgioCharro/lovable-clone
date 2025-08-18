<!-- Improved compatibility of back to top link: See: https://github.com/othneildrew/Best-README-Template/pull/73 -->

<a id="readme-top"></a>

<!--
*** Thanks for checking out the Best-README-Template. If you have a suggestion
*** that would make this better, please fork the repo and create a pull request
*** or simply open an issue with the tag "enhancement".
*** Don't forget to give the project a star!
*** Thanks again! Now go create something AMAZING! :D
-->

<!-- PROJECT SHIELDS -->
<!--
*** I'm using markdown "reference style" links for readability.
*** Reference links are enclosed in brackets [ ] instead of parentheses ( ).
*** See the bottom of this document for the declaration of the reference variables
*** for contributors-url, forks-url, etc. This is an optional, concise syntax you may use.
*** https://www.markdownguide.org/basic-syntax/#reference-style-links
-->

[![Contributors](https://img.shields.io/badge/Contributors--blue?style=for-the-badge)](https://github.com/GeorgioCharro/lovable-clone/graphs/contributors)
[![Forks](https://img.shields.io/badge/Forks--blue?style=for-the-badge)](https://github.com/GeorgioCharro/lovable-clone/network/members)
[![Stars](https://img.shields.io/badge/Stars--blue?style=for-the-badge)](https://github.com/GeorgioCharro/lovable-clone/stargazers)
[![Issues](https://img.shields.io/badge/Issues--blue?style=for-the-badge)](https://github.com/GeorgioCharro/lovable-clone/issues)
[![LinkedIn](https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=555)](https://www.linkedin.com/in/georgio-charro-59280a1b2/)

<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/GeorgioCharro/lovable-clone">
    <img src="./public/logo.svg" alt="Logo" width="80" height="80">
  </a>

  <h3 align="center">Lovable Clone</h3>

  <p align="center">
    <br />
    <a href="https://github.com/GeorgioCharro/lovable-clone"><strong>Explore the docs »</strong></a>
    <br />
    <br />
    <a href="https://lovable-clone-9d938huu7-georgiocharros-projects.vercel.app/">View Demo</a>
    &middot;
    <a href="https://github.com/GeorgioCharro/lovable-clone/issues/new?labels=bug&template=bug-report---.md">Report Bug</a>
    &middot;
    <a href="https://github.com/GeorgioCharro/lovable-clone/issues/new?labels=enhancement&template=feature-request---.md">Request Feature</a>
  </p>
</div>

<details>
  <summary>Table of Contents</summary>
  <ol>
    <li><a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li><a href="#-getting-started">🚀 Getting Started</a>
      <ul>
        <li><a href="#1-prerequisites">1. Prerequisites</a></li>
        <li><a href="#2-clone-the-repository">2. Clone the Repository</a></li>
        <li><a href="#3-configure-environment-variables">3. Configure Environment Variables</a></li>
        <li><a href="#4-install-dependencies">4. Install Dependencies</a></li>
        <li><a href="#5-prepare-the-database">5. Prepare the Database</a></li>
        <li><a href="#6-start-the-development-servers">6. Start the Development Servers</a></li>
      </ul>
    </li>
    <li><a href="#-usage">📖 Usage</a></li>
    <li><a href="#-project-structure">🧱 Project Structure</a></li>
    <li><a href="#-server-architecture">⚙️ Server Architecture</a></li>
    <li><a href="#-authentication-workflow">🔐 Authentication Workflow</a></li>
    <li><a href="#authentication-and-user-endpoints">Authentication & User Endpoints</a></li>
    <li><a href="#other-endpoints">Other Endpoints</a></li>
    <li><a href="#-data--transactions">🗃️ Data & Transactions</a></li>
    <li><a href="#-frontend">💻 Frontend</a></li>
    <li><a href="#-ai-setup">🧠 AI Setup</a></li>
    <li><a href="#-contributing">🤝 Contributing</a></li>
    <li><a href="#-license">📝 License</a></li>
    <li><a href="#-contact">📬 Contact</a></li>
    <li><a href="#-acknowledgments">🙏 Acknowledgments</a></li>
  </ol>
</details>


<!-- ABOUT THE PROJECT -->

## About The Project

[![Product Name Screen Shot][product-screenshot]](https://example.com)

Betrix is an online casino project developed out of my personal interest in gambling systems — not to promote gambling, but to explore how popular games like Plinkoo, Roulette, Mines, Keno, and Dice function behind the scenes. I'm fascinated by the logic that powers these games and how casinos build profitability through concepts like house edge.

This project is also a showcase of my full-stack development skills. It leverages modern technologies including:

GraphQL for flexible API interactions

PostgreSQL and Prisma for robust data modeling

React for building responsive and reactive user interfaces

Through Betrix, I’ve implemented provably fair game logic, real-time balance updates, and a modular architecture designed for scalability. It’s both a technical deep dive into game mechanics and a practical demonstration of building secure, production-grade web applications using modern tooling.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Built With

- [![Next.js][Next.js]][Next-url]
- [![React][React.js]][React-url]
- [![TypeScript][TypeScript.ts]][TypeScript-url]
- [![ShadCN][ShadCN.ui]][ShadCN-url]
- [![tRPC][tRPC.trpc]][tRPC-url]
- [![PostgreSQL][Postgres.pg]][Postgres-url]
- [![NeonDB][Neon.neon]][Neon-url]
- [![Prisma][Prisma.prisma]][Prisma-url]
- [![Tailwind][Tailwind.css]][Tailwind-url]
- [![Inngest][Inngest.inngest]][Inngest-url]
- [![OpenAI][OpenAI.openai]][OpenAI-url]
- [![Docker][Docker.docker]][Docker-url]
- [![E2B][E2B.e2b]][E2B-url]
- [![CSS][CSS.css]][CSS-url]

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- Badges -->

[Next.js]: https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white
[Next-url]: https://nextjs.org/
[React.js]: https://img.shields.io/badge/React-20232a?style=for-the-badge&logo=react&logoColor=61dafb
[React-url]: https://reactjs.org/
[TypeScript.ts]: https://img.shields.io/badge/TypeScript-3178c6?style=for-the-badge&logo=typescript&logoColor=white
[TypeScript-url]: https://www.typescriptlang.org/
[ShadCN.ui]: https://img.shields.io/badge/ShadCN/UI-111827?style=for-the-badge&logo=tailwindcss&logoColor=38bdf8
[ShadCN-url]: https://ui.shadcn.com/
[tRPC.trpc]: https://img.shields.io/badge/tRPC-2596be?style=for-the-badge&logo=trpc&logoColor=white
[tRPC-url]: https://trpc.io/
[Postgres.pg]: https://img.shields.io/badge/PostgreSQL-4169e1?style=for-the-badge&logo=postgresql&logoColor=white
[Postgres-url]: https://www.postgresql.org/
[Neon.neon]: https://img.shields.io/badge/Neon-00E599?style=for-the-badge&logo=neondatabase&logoColor=white
[Neon-url]: https://neon.tech/
[Prisma.prisma]: https://img.shields.io/badge/Prisma-2d3748?style=for-the-badge&logo=prisma&logoColor=white
[Prisma-url]: https://www.prisma.io/
[Tailwind.css]: https://img.shields.io/badge/Tailwind_CSS-38bdf8?style=for-the-badge&logo=tailwindcss&logoColor=white
[Tailwind-url]: https://tailwindcss.com/
[Inngest.inngest]: https://img.shields.io/badge/Inngest-000000?style=for-the-badge&logo=inngest&logoColor=white
[Inngest-url]: https://www.inngest.com/
[OpenAI.openai]: https://img.shields.io/badge/OpenAI-412991?style=for-the-badge&logo=openai&logoColor=white
[OpenAI-url]: https://openai.com/
[Docker.docker]: https://img.shields.io/badge/Docker-2496ed?style=for-the-badge&logo=docker&logoColor=white
[Docker-url]: https://www.docker.com/
[E2B.e2b]: https://img.shields.io/badge/E2B-ff6f61?style=for-the-badge&logoColor=white
[E2B-url]: https://e2b.dev/
[CSS.css]: https://img.shields.io/badge/CSS-264de4?style=for-the-badge&logo=css3&logoColor=white
[CSS-url]: https://developer.mozilla.org/en-US/docs/Web/CSS


## 🚀 Getting Started

Follow these steps to run the project locally:

### 1. Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/) (v18 or higher)
- [pnpm](https://pnpm.io/) (a fast, disk space-efficient package manager)

### 2. Clone the Repository

```sh
git clone https://github.com/GeorgioCharro/lovable-clone.git
cd lovable-clone
```

### 3. Configure Environment Variables

Create a `.env` file in the project root and provide values for:

```
DATABASE_URL="postgres://..."
OPENAI_API_KEY="..."
CLERK_SECRET_KEY="..."
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="..."
NEXT_PUBLIC_API_URL="..."
KILL_SANDBOX_ON_EXIT="false"
```
Adjust as needed for your setup.

> 🛠️ Fill in the `.env` files with your database URL, API secrets, and other required credentials.

### 4. Install Dependencies

```sh
pnpm install
```

This installs all packages across the monorepo using Turborepo and pnpm workspaces.

### 5. Prepare the Database

```bash
pnpm prisma migrate deploy
pnpm prisma generate
```
```

### 6. Start the Development Servers

```bash
pnpm dev
```
This starts the Next.js app at http://localhost:3000.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## 📖 Usage

Lovable Clone is a full-stack application built with Next.js and tRPC. The app exposes a type-safe API layer, executes background jobs with Inngest, and stores data using Prisma with a PostgreSQL database.

---

### 🧱 Project Structure

```
prisma/            Prisma schema and migrations
src/
  app/             Next.js route handlers and pages
  components/      Reusable UI components
  modules/         Feature modules (projects, messages, usage)
  trpc/            tRPC client and server setup
  inngest/         Background job definitions
```

### ⚙️ Server Architecture

- **Next.js** handles routing and server-side rendering.
- **tRPC** provides type-safe API routes at `/api/trpc`.
- **Prisma** connects to PostgreSQL and generates the client in `src/generated/prisma`.
- **Inngest** triggers background agent workflows that run OpenAI-powered code in isolated sandboxes.

### 🔐 Authentication Workflow

Authentication is managed by Clerk.

- The middleware in `src/middleware.ts` protects all routes except sign-in, sign-up, pricing, and API endpoints.
- Public routes are accessible without authentication.
- Protected routes require the user to be signed in; Clerk sessions are used to identify users on the server and client.

[Back to top](#lovable-clone)

### Authentication and User Endpoints
- Clerk manages sessions; middleware in `src/middleware.ts` protects all routes except sign-in, sign-up, pricing, and API routes.
- Authenticated procedures use `protectedProcedure`.
- `usage.status` returns the current user's remaining credits.

### Other Endpoints
- `projects.getOne`, `projects.getMany`, and `projects.create` manage project records and enqueue `code-agent/run` jobs.
- `messages.getMany` and `messages.create` read and append chat messages for a project, also triggering `code-agent/run`.

## 🗃️ Data & Transactions
- Prisma models persist projects, messages, and usage limits in PostgreSQL.
- `consumeCredits` and `getUsageStatus` in `src/lib/usage.ts` enforce per-user credit quotas via `rate-limiter-flexible`.

## 💻 Frontend
- Built with the Next.js App Router; pages live under `src/app`.
- UI elements reside in `src/components`, while feature logic is organized in `src/modules`.
- tRPC integrates with React Query for client-side data fetching and caching.

[Back to top](#lovable-clone)


## 🧠 AI Setup
- Inngest's coding agent uses OpenAI's ChatGPT models to generate code, titles, and final responses.
- Constant prompts (`PROMPT`, `FRAGMENT_TITLE_PROMPT`, `RESPONSE_PROMPT`) in `src/prompts.ts` train each agent with specific system instructions.
- Before every run, the last few project messages are loaded from the database and injected into the agent state, giving the model short-term memory.
- Generated summaries and messages are saved back to the database so the AI retains context across requests.
