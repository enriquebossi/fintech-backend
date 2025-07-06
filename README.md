# Fintech Backend

This repository contains a small Express/Vercel backend used for experimentation. The server provides endpoints to query a Supabase database and to interact with AI-based assistants. It currently has no support for NFTs or any tokenization features, and there is no 28‑day subscription logic implemented.

## Endpoints

### `POST /api/query-supabase`
Uses Google's Gemini model to translate a natural language prompt into a SQL query and executes it on Supabase. Requires a JSON body with `prompt` and `tableName`.

### `POST /api/chat`
Creates a thread with OpenAI's assistant and returns its response. Also relays messages to Slack if configured. Accepts `role` and `message` in the request body.

### `/api/xibalba-mini`
A simple storage endpoint using Vercel Blob. `POST` saves a message and `GET` returns all stored messages.

## Environment Variables

The server depends on the following environment variables:

- `SUPABASE_URL` – Supabase project URL.
- `SUPABASE_ANON_KEY` – Supabase anonymous API key.
- `GEMINI_API_KEY` – API key for Google Generative AI.
- `OPENAI_API_KEY` – (for `/api/chat`) OpenAI API key.
- `ASSISTANT_ID` – ID of the OpenAI Assistant.
- `SLACK_WEBHOOK_URL` – Slack webhook URL for chat notifications.
- `SLACK_CHANNEL` – (optional) Slack channel name.
- `PORT` – Port for local Express server (defaults to 3001).

## TODO / Future Plans

Features like **Lunar Halo** integration or upcoming tools at **SnowGlaz.Club** are planned but not yet implemented. Contributions or ideas in these areas are welcome.

