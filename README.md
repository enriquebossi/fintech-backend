# Fintech Backend

This project provides a Node.js/Express backend with Solidity smart contracts. A lightweight React front‑end is included in `public/index.html` to demonstrate the Agile planning blueprint.

## Prerequisites

- Node.js 18+
- npm
- An Ethereum RPC endpoint for contract interaction

## Environment Variables

The server requires several variables. Create a `.env` file or configure them in your hosting platform.

- `SUPABASE_URL` – Supabase instance URL
- `SUPABASE_ANON_KEY` – Supabase anonymous key
- `GEMINI_API_KEY` – Google Gemini API key
- `RPC_URL` – Ethereum RPC endpoint (default `http://127.0.0.1:8545`)
- `PRIVATE_KEY` – Private key used to sign transactions
- `CREDIT_TOKEN_ADDRESS` – Deployed `CreditToken` contract address
- `NFT_ADDRESS` – Deployed `DynamicMetadataNFT` contract address
- `OPENAI_API_KEY` – OpenAI key for `api/chat.js`
- `ASSISTANT_ID` – Assistant identifier for `api/chat.js`
- `SLACK_WEBHOOK_URL` – (optional) Slack webhook for chat notifications
- `SLACK_CHANNEL` – (optional) Slack channel for notifications

## Installation

1. Install dependencies:
   ```bash
   npm install
   ```
2. Compile the Solidity contracts (required before running tests):
   ```bash
   npx hardhat compile
   ```

## Running the Server

Start the Express server on port `3001`:

```bash
node index.js
```

Open `public/index.html` in your browser to view the React Agile blueprint.

## Tests

Run API and contract tests:

```bash
npm test
npm run test:contracts
```
