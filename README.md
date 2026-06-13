# Buildr AI

<img width="41" height="40" alt="image" src="https://github.com/user-attachments/assets/099bec03-1d2f-4f4e-901a-1c8119f7921d" />

Buildr is an AI-powered app builder that generates complete, production-ready Next.js applications from plain text prompts. Describe what you want to build, and the AI agent writes the code, runs it in an isolated sandbox, and gives you a live preview — instantly.

## Features

- **Prompt-to-app generation** — describe your idea in natural language and get a working Next.js app
- **Live sandbox previews** — generated apps run in secure, isolated E2B environments with real URLs
- **Multi-turn conversations** — refine your app iteratively through follow-up prompts
- **Project management** — create and manage multiple projects, each with full conversation history
- **Usage/credit system** — free and pro tiers with per-generation credit tracking
- **Authentication** — user accounts and session management via Clerk

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (Turbopack), React 19, TypeScript |
| UI | Shadcn/UI, Radix UI, Tailwind CSS |
| Auth | Clerk |
| Database | PostgreSQL (Neon) via Prisma ORM |
| AI | OpenAI API (gpt-4.1 for generation, gpt-4o for titles/responses) |
| Code Execution | E2B Code Interpreter (sandboxed) |
| Async Workflows | Inngest |
| API Layer | tRPC |

## Getting Started

### Prerequisites

- Node.js 18+
- A [Neon](https://neon.tech) PostgreSQL database
- API keys for [Clerk](https://clerk.com), [OpenAI](https://platform.openai.com), [E2B](https://e2b.dev), and [Inngest](https://inngest.com)

### Installation

```bash
git clone https://github.com/iajay007/Buildr-AI.git
cd Buildr-AI
npm install
```

### Environment Variables

Create a `.env` file at the project root:

```env
# Database
DATABASE_URL="postgresql://user:password@host/database"

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_..."
CLERK_SECRET_KEY="sk_test_..."

# OpenAI
OPENAI_API_KEY="sk-proj-..."

# E2B Code Interpreter
E2B_API_KEY="e2b_..."

# Inngest
INNGEST_EVENT_KEY="..."
INNGEST_SIGNING_KEY="..."        # omit for local dev
INNGEST_DEV=1                    # set to 1 for local dev
```

### Run Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

For Inngest workflows in development, run the Inngest dev server in a separate terminal:

```bash
npx inngest-cli@latest dev
```

## Project Structure

```
src/
├── app/                  # Next.js pages and layouts
├── modules/              # Feature modules (projects, messages, usage, home)
│   ├── projects/         # Project creation and listing
│   ├── messages/         # Conversation and fragment display
│   └── usage/            # Credit tracking UI
├── inngest/              # Inngest agent and workflow definitions
├── trpc/                 # tRPC router and procedures
├── lib/                  # Utilities (db client, usage helpers)
├── prompt.ts             # System prompt for the AI agent
prisma/
└── schema.prisma         # Database models (Project, Message, Fragment, Usage)
```

## Database Models

- **Project** — a user's builder session
- **Message** — individual turns in a project conversation (user prompt or AI response)
- **Fragment** — generated code artifact attached to a message, with a live sandbox URL
- **Usage** — per-user credit consumption for rate limiting

## Deployment

This project is optimized for [Vercel](https://vercel.com). After importing the repository:

1. Add all environment variables from the `.env` template above in the Vercel project settings
2. Vercel will auto-detect Next.js and configure the build
3. Set `INNGEST_DEV` to `0` (or remove it) and add your `INNGEST_SIGNING_KEY` for production

## License

MIT

## Author

Built by [iajay007](https://github.com/iajay007)
