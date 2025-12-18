# Propman

A small property management example app (React + Express + PostgreSQL + Prisma).

## Table of contents

- [Requirements](#requirements)
- [Project structure](#project-structure)
- [Local setup](#local-setup)
- [Run the app](#run-the-app)
- [Database / Prisma](#database--prisma)
- [Testing](#testing)
- [Build / Production](#build--production)
- [Notes](#notes)

## Requirements

- Node.js (v16+ recommended)
- npm (or yarn)
- PostgreSQL (for the server / Prisma)

## Project structure

- `client/` — React front-end (Create React App + TypeScript)
- `server/` — Express API (TypeScript, Prisma, PostgreSQL)
- `prisma/` — Prisma schema and migrations (inside `server/prisma`)

## Local setup

1. Clone the repo and open the project root (this repo):

```bash
cd /path/to/propman
```

2. Install dependencies for both projects:

```bash
# from project root
cd client && npm install
cd ../server && npm install
cd ..
```

3. Create environment variables for the server from the example file:

```bash
# from project root
cp server/env.example server/.env
# then edit server/.env to set a DATABASE_URL and other secrets
```

4. Ensure PostgreSQL is running and reachable from `server/.env`.

## Run the app (development)

Open two terminals (or use your own process manager):

Terminal 1 — start the server in watch mode:

```bash
cd server
npm run dev
```

Terminal 2 — start the React client:

```bash
cd client
npm start
```

Server dev script uses `ts-node-dev` to run `src/index.ts` with automatic restarts.

## Database / Prisma

From `server/` you can run Prisma commands (the project defines useful npm scripts):

```bash
# generate Prisma client
cd server
npm run prisma:generate

# run migrations (development)
npm run prisma:migrate

# open Prisma Studio
npm run prisma:studio
```

If you add seed data, run `npm run prisma:seed` (if implemented in this repo).

## Testing

- Client (React):

```bash
cd client
npm test
```

- Server (Jest):

```bash
cd server
npm test
```

## Build / Production

- Client:

```bash
cd client
npm run build
# then serve `client/build` from any static file server
```

- Server:

```bash
cd server
npm run build
npm start
```
