# Admin Server

This folder contains the admin server.

## Run

```bash
npm run dev
```

## Defaults

The server uses demo credentials unless you override them with environment variables:

- `ADMIN_USERNAME` defaults to `admin`
- `ADMIN_PASSWORD` defaults to `Admin@123`
- `PORT` defaults to `4000`

## Routes

- `/` or `/login` - admin login page
- `/api/login` - admin sign in
- `/dashboard` - protected admin dashboard
- `/api/logout` - admin sign out
- `/api/me` - current admin session info

## Notes

Use this server for admin login and dashboard access.
