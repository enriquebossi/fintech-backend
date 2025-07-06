# Fintech Backend

This project contains an Express backend along with a simple dashboard available as a static HTML file and as a React application.

## Running Locally

1. Install dependencies for the backend:

```bash
npm install
```

2. (Optional) Install dependencies for the React dashboard if you want to run it locally:

```bash
cd frontend
npm install
npm run dev
```

The backend runs with `node index.js` and exposes API endpoints on port `3001` by default. The React dashboard will be available at `http://localhost:5173` when running `npm run dev` from the `frontend` directory.

## Deployment

The project is configured for deployment on Vercel. `vercel.json` defines two builds:

- The Express API (`index.js`).
- The React dashboard located in `frontend/` and built with Vite.

Static requests to `/dashboard` serve `public/dashboard.html`. The React build is served from `/dashboard-react`.

To deploy, run:

```bash
vercel --prod
```

Ensure the required environment variables (`SUPABASE_URL`, `SUPABASE_ANON_KEY`, and `GEMINI_API_KEY`) are set in your Vercel project settings.
