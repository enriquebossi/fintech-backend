# Fintech Backend

This service exposes a Node.js Express API which interacts with Supabase and optional blockchain functionality.

## SnowGlaz Membership Tracking

Two new tables should be created in Supabase:

- **memberships** – stores active club members.
  - `id` (uuid, primary key)
  - `email` (text)
  - `handle` (text)
  - `start_date` (timestamp)
  - `lunar_cycle` (integer) — cycle value when membership began
  - `active` (boolean)
  - `nft_token_id` (numeric, optional)

- **nft_issuances** – logs every NFT issued.
  - `id` (uuid, primary key)
  - `member_id` (uuid, references memberships.id)
  - `token_id` (numeric)
  - `tx_hash` (text)

When issuing an NFT the current cycle is also recorded on the `transactions` table using the existing `LunarCycle` column.

## Blockchain configuration

The server can connect to an ERC‑721 contract when the following environment variables are set:

- `RPC_URL` – JSON RPC endpoint
- `PRIVATE_KEY` – wallet key used to sign transactions
- `NFT_CONTRACT_ADDRESS` – deployed contract address

If any of these are missing the API will still function but transactions are stored only in Supabase.

