# Admin Architecture Plan

This project should be split into two logical systems:

## 1. User App

- Regular student/faculty login
- Registration with automatic role detection on the backend
- Forgot password and OTP reset flows
- Menu browsing and order placement

## 2. Admin App

- Separate admin login page
- Separate admin dashboard
- Protected admin actions only
- No student/faculty selection in the admin flow

## 3. Backend Services

To make the admin flow actually secure, the backend should enforce:

- Admin credentials checked only on the server
- Password hashing
- Role-based access control
- Protected admin APIs
- Rate limiting and audit logging
- Session or token validation on every admin request

## 4. Current Frontend Status

The current frontend already reflects the split UI:

- User auth pages are neutral and do not ask for student/faculty selection.
- Admin pages live under `/admin/login` and `/admin/dashboard`.
- The admin dashboard is guarded on the frontend.

This is a frontend separation only. For production security, the backend split still needs to be built.