# Fintech Backend

This project provides a minimal Express API for interacting with Supabase and various generative AI services. It is designed for deployment on Vercel as a serverless function.

## Endpoints

### `POST /api/query-supabase`
Generates a SQL query using Google Gemini based on the user prompt and executes it on Supabase. Requires `prompt` and `tableName` in the request body.

### `POST /api/chat`
Uses OpenAI's Assistant API to run a conversation thread and optionally relays the response to Slack.

### `GET|POST /api/xibalba-mini`
Stores or retrieves JSON messages using Vercel Blob storage. This handler is included inside the `/api/chat` file but is also provided as a standalone function.

## Environment Variables

- `SUPABASE_URL` – URL for your Supabase instance.
- `SUPABASE_ANON_KEY` – Public anon key for Supabase.
- `GEMINI_API_KEY` – API key for Google Generative AI (Gemini).
- `OPENAI_API_KEY` – API key for OpenAI when using `/api/chat`.
- `ASSISTANT_ID` – ID of the OpenAI assistant used by `/api/chat`.
- `SLACK_WEBHOOK_URL` – Optional Slack webhook to relay chat responses.
- `SLACK_CHANNEL` – Optional Slack channel destination.
- `PORT` – (Local only) port for the Express server.

## Current Limitations

- **No NFT or tokenization logic** is present in this repository.
- **No 28‑day subscription management** code exists yet.

## Future Plans / TODO

The repository may later incorporate features from upcoming Lunar Halo or the SnowGlaz.Club project. These are still in the planning phase and not implemented.

