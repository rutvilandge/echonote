# 🎙️ EchoNote

> **AI-Powered Meeting Intelligence Platform**
> Meetings generate valuable decisions, but notes, action items, and
follow-ups are often forgotten. **EchoNote** centralizes meetings into
one intelligent workspace with AI-generated summaries, transcripts,
templates, workspaces, and analytics.

## 🌐 Live Demo

https://echonote-kxtr3j16v-rutvilandges-projects.vercel.app/

---

## ✨ Features

- 🔐 Authentication (Email/Password, Google, GitHub OAuth)
- 👥 Multi-workspace support with roles (Owner/Admin/Member)
- 🎥 Daily.co live video meetings
- 📝 AI-generated meeting summaries (Groq / Llama 3.3 70B)
- 📜 Meeting transcripts (drag-and-drop upload, chunked + embedded)
- 💬 Chat with meetings — RAG over transcripts via pgvector
- ✅ AI-extracted action items, tracked to completion
- 🧩 Meeting templates (Sprint Planning, Stand-up, Interview, and more)
- 📅 Calendar view + automatic Google Calendar sync
- 🔔 Real-time notifications, searchable and filterable
- 🔍 Global search (⌘K / Ctrl+K) across meetings, action items, members
- 📊 Analytics dashboard with real charts, computed from live data
- 🔗 Slack notifications via incoming webhook
- 🔑 Personal API keys (SHA-256 hashed, shown once)
- 🌙 Dark / light theme, command palette, toast notifications

---

## 🛠 Tech Stack

| Layer            | Technology                     |
|------------------|---------------------------------|
| Frontend         | Next.js 14 (App Router), React, TypeScript |
| Styling          | Tailwind CSS                    |
| Backend          | Next.js Route Handlers          |
| ORM              | Prisma                          |
| Database         | PostgreSQL + pgvector           |
| Authentication   | NextAuth (Google, GitHub, Credentials) |
| AI               | Groq (Llama 3.3 70B)            |
| Embeddings       | @xenova/transformers (local, free) |
| Video            | Daily.co                        |
| Animation        | Framer Motion                   |
| Charts           | Recharts                        |
| Command Palette  | cmdk                            |
| Email            | Resend (optional)               |
| Deployment       | Vercel                          |

---

## 🏗 Architecture

```text
Browser
   │
Next.js App (App Router)
   │
API Route Handlers
 ├── Prisma → PostgreSQL (+ pgvector)
 ├── Groq AI (summaries, RAG chat)
 ├── @xenova/transformers (local embeddings)
 ├── Daily.co (video rooms)
 ├── Slack (incoming webhook notifications)
 └── Resend (email, optional)
```

---

## 📂 Folder Structure

```text
echonote/
├── prisma/
│   └── schema.prisma
├── src/
│   ├── app/
│   │   ├── api/            # meetings, transcripts, summarize, chat,
│   │   │                   # notifications, templates, workspaces,
│   │   │                   # analytics, search, auth
│   │   ├── dashboard/
│   │   ├── meetings/
│   │   ├── calendar/
│   │   ├── members/
│   │   ├── templates/
│   │   ├── workspace/
│   │   ├── settings/
│   │   ├── analytics/
│   │   └── login/ register/
│   ├── components/
│   └── lib/                # auth, ai, prisma, daily, embeddings, notify
├── package.json
└── README.md
```

---

## 🚀 Getting Started

```bash
git clone https://github.com/rutvilandge/echonote.git
cd echonote
npm install
cp .env.example .env
npx prisma migrate dev --name init
npx prisma generate
npm run dev
```

Visit `http://localhost:3000`

---

## 🔑 Environment Variables

```env
DATABASE_URL=
NEXTAUTH_URL=
NEXTAUTH_SECRET=
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GROQ_API_KEY=
DAILY_API_KEY=
RESEND_API_KEY=
```

`DATABASE_URL` needs a PostgreSQL instance with the `vector` extension
enabled (`CREATE EXTENSION IF NOT EXISTS vector;`) — Neon and Prisma
Postgres both support this on their free tiers.

---

## 🤖 AI Workflow

```text
Meeting
   ↓
Video call (Daily.co) + Transcript upload
   ↓
Chunk + embed transcript (local, free)
   ↓
Groq AI → Summary + Decisions + Action Items
   ↓
pgvector similarity search
   ↓
Chat with meeting (RAG) + Dashboard analytics
```

---

## 🗄 Database Models

- User, Account, Session
- Workspace, WorkspaceMember, Invite
- Meeting, Transcript, TranscriptChunk
- Summary, ActionItem
- Template
- Notification
- ApiKey

---


## 💡 Challenges

- Designing a relational Prisma schema that supports multi-workspace RBAC
- Wiring RAG (retrieval-augmented generation) over meeting transcripts with pgvector
- Avoiding duplicate video call instances under React 18 strict mode
- Handling SSR/CSR hydration consistently for theme and locale-dependent UI
- Keeping the whole stack on free-tier infrastructure without sacrificing features
- Serverless deployment and environment variable management on Vercel

---

## 📚 What I Learned

- Full-stack development with the Next.js App Router
- Prisma ORM and relational schema design
- PostgreSQL + vector search with pgvector
- Multi-provider authentication with NextAuth
- Building RAG pipelines with local embeddings + an LLM API
- Real-time video integration with Daily.co
- Deploying and debugging a serverless app on Vercel

---

## 🤝 Contributing

Fork the repository, create a feature branch, commit your changes, and
open a Pull Request.

## 📄 License

MIT

---

<p align="center">
Built with ❤️ by <strong>Rutvi Landge</strong><br/>
⭐ If you like this project, consider starring the repository.
</p>
