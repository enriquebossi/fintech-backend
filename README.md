# Fintech Backend and Dashboard

This repository contains an Express API along with two dashboard options:

1. A static HTML dashboard located in `public/dashboard.html`.
2. A React implementation under `frontend/` built with Vite.

## Running Locally

Install dependencies for the backend:

```bash
npm install
```

Start the API server:

```bash
node index.js
```

Open [http://localhost:3001/dashboard](http://localhost:3001/dashboard) after running the server to view the static dashboard.

To work on the React version:

```bash
cd frontend
npm install
npm run dev
```

The development server will start on a local port (defaults to 5173).

## Deployment

### Static Dashboard

The `vercel.json` file routes `/dashboard` requests to `public/dashboard.html`. Deploy the project to Vercel from the repository root:

```bash
vercel --prod
```

### React Dashboard

Build the React app before deploying:

```bash
cd frontend
npm install
npm run build
```

The built files are output to `frontend/dist`. Deploy this directory as a static site with Vercel or your preferred host:

```bash
vercel --prod
```

Both versions of the dashboard can be hosted independently if desired.
