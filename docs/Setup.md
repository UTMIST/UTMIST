# Development Environment Setup

This is the only setup guide you need. If you get through it and `npm run dev`
serves the site at `http://localhost:3000`, you are ready to pick up an issue —
see [CONTRIBUTING.md](../CONTRIBUTING.md).

The site is a single full-stack Next.js app living in `client/`. Server-side
logic is in route handlers under `client/src/app/api/`. There is no separate
backend service to run.

## Prerequisites

### Node.js 22

The project is pinned to **Node 22**. Older versions fail in ways that do not
name the real cause — Next 16 refuses to start, and Jest crashes inside its own
config loader. `npm install` will stop you before you get that far.

The version is pinned in [`client/.nvmrc`](../client/.nvmrc) and
[`client/.tool-versions`](../client/.tool-versions), so a version manager will
pick it up automatically:

```bash
cd client

nvm use          # nvm — reads .nvmrc, add `nvm install` first time
mise install     # mise — reads .tool-versions
asdf install     # asdf — reads .tool-versions
```

No version manager? Install Node 22 LTS from
[nodejs.org](https://nodejs.org/). Then confirm:

```bash
node -v          # must print v22.x
```

### Operating system

macOS and Linux work directly.

On Windows, use **Windows Subsystem for Linux** — the tooling here assumes a
UNIX shell, and every command in this guide is written for one. See
[Microsoft's WSL installation guide](https://learn.microsoft.com/en-us/windows/wsl/install);
Ubuntu 22.04 or newer is a good default.

## Setup

### 1. Clone and install

```bash
git clone https://github.com/UTMIST/UTMIST.git
cd UTMIST/client
npm install
```

### 2. Configure environment variables

The app reads its configuration from `client/.env`. Copy the template:

```bash
cp env.example .env
```

Then fill in the values. [`client/env.example`](../client/env.example) documents
each one and marks which are required — the app will not boot without the
Supabase pair, and `npm run build` fails without the Google Maps key.

**You will not be able to fill these in on your own.** Ask a web team lead for
access to the shared credentials.

`.env` is gitignored. Never commit it.

### 3. Run it

```bash
npm run dev
```

The site is served at `http://localhost:3000`.

## Everyday commands

Run these from `client/`:

| Command | What it does |
| --- | --- |
| `npm run dev` | Development server with hot reload |
| `npm run build` | Production build |
| `npm start` | Serve a production build (run `build` first) |
| `npm run lint` | ESLint |
| `npm run lint:fix` | ESLint, fixing what it can automatically |
| `npm run typecheck` | Generate Next route types, then typecheck |
| `npm test` | Full Jest suite |
| `npm run test:watch` | Jest, re-running on change |

Before pushing, run the three checks CI gates on:

```bash
npm run lint && npm run typecheck && npm test
```

See [docs/client/Testing.md](client/Testing.md) for how the test suite is
organized and how to add tests.

## Troubleshooting

**`npm ERR! code EBADENGINE` … `Required: {"node":">=22.0.0"}`**

You are on the wrong Node version. This is the error working correctly — it is
telling you up front instead of letting Next or Jest fail confusingly later.
Switch to Node 22 (see [Prerequisites](#nodejs-22)) and re-run.

**`Missing Supabase environment variables. Please check your .env file.`**

`client/.env` is missing or incomplete. See
[step 2](#2-configure-environment-variables). Restart the dev server after
editing it — Next only reads env files at startup.

**`Google Maps API key is not defined`**

`NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` is unset. Only `/eigenai` breaks under
`npm run dev`, but `npm run build` fails outright because the page is
prerendered.

**`tsc` reports errors for every image import**

Run `npm run typecheck` rather than `tsc --noEmit` directly. The type
declarations for image imports live in `next-env.d.ts`, which Next generates and
git ignores; the `typecheck` script runs `next typegen` first to produce it.

**WSL problems**

See [Microsoft's WSL troubleshooting guide](https://learn.microsoft.com/en-us/windows/wsl/troubleshooting).

## Where to go next

- [CONTRIBUTING.md](../CONTRIBUTING.md) — branching, commits, PRs, picking an issue
- [docs/FileStructure.md](FileStructure.md) — how the repo is laid out
- [docs/client/](client/) — per-page and per-component reference
- [client/README.md](../client/README.md) — auth and architecture notes
