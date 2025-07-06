# FinTech Backend & Dashboard

This repository contains an Express API along with a dashboard available as a static HTML file and a React application.

## Running Locally

1. Install dependencies for the backend:
   ```bash
   npm install
   ```
2. Start the API server:
   ```bash
   node index.js
   ```
   The server listens on the port specified by the `PORT` environment variable (defaults to `3000`).

### Dashboard

The dashboard is available as a static file at `public/dashboard.html`.
Open the file directly in a browser or visit `/dashboard` when deployed.

## React Frontend

A React version of the dashboard is located in the `frontend/` directory and uses Vite for building.

### Development

```bash
cd frontend
npm install
npm run dev
```

### Production Build

```bash
cd frontend
npm install
npm run build
```

The build output will be generated in `frontend/dist/`.

## Deployment

[Vercel](https://vercel.com/) can be used to deploy both the API and the React dashboard.
The `vercel.json` file configures:

- Node API build from `index.js`.
- Static build of the React app from `frontend/`.
- Route `/dashboard` pointing to `public/dashboard.html`.

After installing the [Vercel CLI](https://vercel.com/docs/cli), deploy with:

```bash
vercel --prod
```

