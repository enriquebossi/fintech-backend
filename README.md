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

### Webporting Add-ons

The front-end exposes a simple plug-in system powered by `public/blackboard.js`.
Any script can register a React component globally by calling:

```js
window.Blackboard.registerAddon(MyComponent);
```

Both `CosmicNexusApp` (in `index.html`) and the `Scriptment` view read
from this context and render all registered add-ons below the main
content. An example add-on is provided in `public/addons/HelloAddon.js`.

## Tests

Run API and contract tests:

```bash
npm test
npm run test:contracts
```
