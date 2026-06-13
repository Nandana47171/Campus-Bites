# Admin Server

This folder contains the admin server.

## Run

```bash
npm run dev
```

## Environment

Create an `.env` (not committed) or set environment variables in your host:

- `ADMIN_USERNAME` (required)
- `ADMIN_PASSWORD` (required)
- `ADMIN_EMAIL` (optional, enables email matching on the login form)
- `PORT` (optional, default `4000`)
- `RATE_LIMIT_MAX` (optional, default `5`)
- `RATE_LIMIT_WINDOW_MS` (optional, default `900000`)
- `IP_ALLOWLIST` (optional, comma-separated IPs)
- `ALLOW_DEFAULT_ADMIN` (set to `true` to permit demo creds; not recommended)

See `.env.example` for a template.

## Routes

- `/` or `/login` - admin login page
- `/api/login` - admin sign in
- `/dashboard` - protected admin dashboard
- `/api/logout` - admin sign out
- `/api/me` - current admin session info

## Deployment (Railway / Render)

Recommended: deploy the `admin-server` as a separate service and keep it behind an identity gate (Cloudflare Access) or an IP allowlist.

Railway / Render quick steps:

1. Create a new project/service and connect your GitHub repository.
2. Set the project root to `admin-server`.
3. Configure environment variables (`ADMIN_USERNAME`, `ADMIN_PASSWORD`, etc.) in the platform's Secrets/Environment settings.
4. Use the default `start` script (`node server.js`) or set the start command to `npm start`.
5. Deploy and verify the service URL.

## Protecting the admin server

- Use Cloudflare Access or Cloudflare Tunnel to restrict access to the admin URL to specific users/groups.
- Alternatively, set `IP_ALLOWLIST` with trusted admin IPs.
- Do not commit `.env` or any credentials.

## Security notes

- The server uses in-memory sessions by default — for production, use a shared session store (Redis) if you run multiple instances.
- Rotate admin credentials immediately if they were ever committed.
- Monitor login attempts and consider adding persistent rate-limiting or account lockouts.

## Example local run (PowerShell)

```powershell
cd admin-server
$env:ADMIN_USERNAME='adminuser'
$env:ADMIN_PASSWORD='YourStrongPass!'
npm start
```

After starting, open `http://localhost:4000/login` to sign in.
