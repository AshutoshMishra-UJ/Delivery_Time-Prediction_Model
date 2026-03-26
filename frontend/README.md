# Frontend Application

This folder contains the Next.js frontend for the Delivery Time Prediction Model.

## Stack

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS 4
- lucide-react

## Development

From this folder:

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Backend Integration

The frontend uses a rewrite in `next.config.ts`:

- `/api/predict` -> `http://localhost:8000/predict`

So make sure the FastAPI backend is running before testing predictions.

## Build

```bash
npm run build
npm start
```

## Lint

```bash
npm run lint
```
