# Deploy Scramjet-App On Render

This folder is the upstream Mercury Workshop Scramjet-App code with Render deployment config added.

## Render Blueprint

Push this folder to a GitHub repo, then create a Render Blueprint from `render.yaml`.

The Blueprint creates a Node web service with:

```txt
Build Command: corepack enable && pnpm install --frozen-lockfile
Start Command: pnpm start
Health Check Path: /healthz
```

## Manual Render Web Service

If you create the service manually instead of using the Blueprint:

```txt
Runtime: Node
Build Command: corepack enable && pnpm install --frozen-lockfile
Start Command: pnpm start
Health Check Path: /healthz
```

Render sets `PORT` automatically. The existing Scramjet-App server listens on `0.0.0.0` and serves Wisp at `/wisp/`, so the deployed app uses:

```txt
wss://your-render-service.onrender.com/wisp/
```

Render supports inbound WebSocket connections for web services, which is why this deploy target can host both the frontend and the Scramjet/Wisp server in one service.
