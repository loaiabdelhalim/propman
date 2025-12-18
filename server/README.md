# Server

Express.js server with PostgreSQL using Prisma ORM, following routes, services, and controllers architecture.

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create a `.env` file in the server directory with the following variables:

```env
PORT=3001
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public"

# Groq AI Configuration (optional - for AI features)
GROQ_API_KEY=your_groq_api_key_here
GROQ_MODEL=llama-3.1-70b-versatile
GROQ_TEMPERATURE=0.7
GROQ_MAX_TOKENS=4096
```

Example:

```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/mydb?schema=public"
GROQ_API_KEY=gsk_xxxxxxxxxxxxx
```

3. Generate Prisma Client:

```bash
npm run prisma:generate
```

4. Run database migrations to create the tables:

```bash
npm run prisma:migrate
```

This will create the database schema based on the Prisma schema file at `prisma/schema.prisma`.

## Running the Server

- Development mode (with auto-reload):

```bash
npm run dev
```

- Build TypeScript:

```bash
npm run build
```

- Production mode:

```bash
npm start
```

## Testing

Automated tests have been added for the server (unit and integration tests).

What is included

- Jest + ts-jest as the test runner/transformer
- Supertest for HTTP endpoint integration tests
- Tests are written in TypeScript and use the `.spec.ts` naming convention

Where tests live

- Unit tests for services/controllers are colocated with source files: `src/**/*.spec.ts`
  - Example: `src/services/propertyService.spec.ts`, `src/controllers/propertyController.spec.ts`
- Integration tests (route-level) may be placed under `tests/` or `src/...` using the same `.spec.ts` pattern
- Test bootstrap and helpers:
  - `jest.config.ts` — Jest configuration
  - `tests/setupTests.ts` — global test setup

How tests mock external dependencies

- Prisma: tests mock the exported `prisma` instance (from `src/config/database`) using `jest.mock('../config/database')`.
  This keeps tests fast and deterministic without a live DB.
- External AI/GROQ or network calls: mock the service modules (e.g. `src/services/groqService.ts`) or use HTTP mocking libraries like `nock`.

Install test dev-dependencies (if not already installed):

```bash
npm install --save-dev jest ts-jest @types/jest @types/node supertest @types/supertest
```

Run tests

- Run all tests once:

```bash
npm test
```

- Run tests and collect coverage:

```bash
npm run test:coverage
```

- Run a specific test file (using npx jest or your IDE):

```bash
npx jest src/services/propertyService.spec.ts --runInBand
```

Notes

- The test setup uses `ts-jest` with `jest.config.ts` and `tests/setupTests.ts` for global config.
- The service tests mock the `prisma` object so they don't require a real database by default. If you prefer to run tests against a real DB, set `DATABASE_URL` to a test database and remove/adjust mocks.

## Prisma Commands

- Generate Prisma Client (after schema changes):

```bash
npm run prisma:generate
```

- Create and run migrations:

```bash
npm run prisma:migrate
```

- Open Prisma Studio (database GUI):

```bash
npm run prisma:studio
```

## Architecture

The server follows a clean architecture pattern:

- **Routes** (`src/routes/`): Define API endpoints and map them to controllers
- **Controllers** (`src/controllers/`): Handle HTTP requests and responses
- **Services** (`src/services/`): Contain business logic and database operations

## Example Usage

The `exampleRoutes.ts`, `exampleController.ts`, and `exampleService.ts` files demonstrate the architecture pattern. Uncomment the route import in `src/index.ts` to use the example routes.

## Database Schema

The database schema is defined in `prisma/schema.prisma`. After making changes to the schema:

1. Update the schema file
2. Generate Prisma Client: `npm run prisma:generate`
3. Create a migration: `npm run prisma:migrate`

The Prisma Client will be automatically generated and provides type-safe database access throughout your application.

## Groq AI Integration

The server includes Groq AI integration for processing documents and extracting property information. The Groq service is available at `src/services/groqService.ts`.

### Features

- **Text Prompts**: Send simple text prompts to Groq AI
- **Structured Prompts**: Use system and user messages for better AI responses
- **Document Extraction**: Extract property, building, and unit information from documents (Teilungserklärung)

### Usage Example

```typescript
import { groqService } from './services/groqService';

// Simple prompt
const response = await groqService.sendPrompt('Explain property management in Germany');

// Structured prompt
const result = await groqService.sendStructuredPrompt(
  'You are a property expert',
  'What is WEG management?'
);

// Extract property information from document text
const extractedData = await groqService.extractPropertyInfo(documentText);
```

### Configuration

Set the `GROQ_API_KEY` in your `.env` file. You can get an API key from [Groq Console](https://console.groq.com/).

Optional configuration:
- `GROQ_MODEL`: Model to use (default: `llama-3.1-70b-versatile`)
- `GROQ_TEMPERATURE`: Response creativity (0-1, default: 0.7)
- `GROQ_MAX_TOKENS`: Maximum tokens in response (default: 4096)
