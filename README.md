# Fintech Backend

This Node.js project exposes a set of serverless endpoints for interacting with Supabase and OpenAI services. It runs on Express and is designed to be deployed on platforms such as Vercel.

## Endpoints

### `POST /api/query-supabase`
Transforms a natural language prompt into an SQL statement using Google's Gemini model and executes it against Supabase. The response contains the generated SQL and the query result.

### `POST /api/chat`
Chat endpoint powered by OpenAI assistants. Sends user messages to an OpenAI assistant and optionally relays the response to a Slack channel.

### `GET /api/xibalba-mini` and `POST /api/xibalba-mini`
Storage helper built on top of `@vercel/blob`. `POST` requests store message data, while `GET` retrieves all saved entries.

## Environment Variables

The server relies on several environment variables:

- `SUPABASE_URL` – URL of your Supabase instance.
- `SUPABASE_ANON_KEY` – public Supabase key used to authenticate the API client.
- `GEMINI_API_KEY` – API key for Google Generative AI (Gemini) used to convert prompts to SQL.
- `OPENAI_API_KEY` – key for accessing the OpenAI API.
- `ASSISTANT_ID` – OpenAI assistant identifier for the chat endpoint.
- `SLACK_WEBHOOK_URL` – optional Slack webhook to forward chat answers.
- `SLACK_CHANNEL` – Slack channel name (defaults to `#cosmic-nexus-it`).
- `PORT` – port for the Express server when running locally (default: `3001`).

Set these variables in your deployment environment before running the server.

## Lunar Halo Roadmap

The repository references the upcoming **Lunar Halo** concept. Features such as NFT integration and a 28‑day financial cycle are still in the planning phase and are **not implemented** in the current codebase. Future updates will introduce NFTs to represent key transactions and implement logic tied to the lunar cycle.

