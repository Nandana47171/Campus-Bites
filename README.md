# Canteen Frontend

This repository contains the user-facing frontend for the canteen app, built with React and Vite.

## Auth Flow

The current frontend separates the regular user flow from the admin flow:

- User screens: `/login`, `/register`, `/forgot-password`, `/verify-otp`
- Admin screens: `/admin/login`, `/admin/dashboard`

The user flow is neutral and does not ask whether the person is a student or faculty member. It accepts the college-issued ID and email, while the password fields enforce strong-password rules where users create or reset passwords.

## Admin Split

The admin UI now lives in a separate server under [admin-server](admin-server).

Recommended split:

1. User auth API for student/faculty sign-in and registration.
2. Admin auth API for admin sign-in.
3. Server-side role checks on all admin routes and admin actions.
4. Separate session or token handling for admin access.
5. Rate limiting and logging for admin authentication.

The root app is the user frontend only. The admin server is a separate process and should be kept isolated from the user app.

## Run

User app:

- `npm install`
- `npm run dev`

Admin server:

- `cd admin-server`
- `node server.js`

## Notes

This repo is now split into a user frontend at the root and a separate admin server under [admin-server](admin-server). For production security, the admin server should still be backed by a real database and stronger authentication than the demo credentials.
