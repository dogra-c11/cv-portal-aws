# Login App (Frontend + Backend)

This folder contains the full implementation of the login system used in the CV Portal. It's built using:

- **Frontend**: React (with Vite)
- **Backend**: Node.js + Express
- **Database**: MongoDB (for auth users)
- **Security**: JWT authentication, MFA (optional), rate limiting, input sanitization

---

## Features

- Email/password login with "Remember Me"
- Optional MFA
- Account lockout after repeated failed attempts
- Password strength check and feedback
- Forgot password workflow
- JWT-based auth with protected routes
- Frontend form validations with accessibility
- Fully responsive UI with external CSS

  **Note**: For now, MFA and Forgot Password do not send actual emails — the one-time code can be checked from db for testing purposes.

---

## Setup Instructions

### 1. Backend

```bash
cd login-app/server
npm install
cp .env.example .env  # Set the environment variables
npm run dev
```

### 2. Frontend

```bash
cd login-app/client
npm install
cp .env.example .env  # Set the environment variables
npm run dev
```

Make sure both backend and frontend are running in parallel.

---

## Environment Variables

In `server/.env`:

```
PORT=your_port_number
MONGO_URI=your_mongodb_connection
MONGO_DB_NAME=your_database_name
JWT_SECRET=your_secret_key
```

---

In `client/.env`:

```
VITE_API_URL=your_backend_url
```

---

## Security Features

- Rate limiting for login
- XSS-safe input handling using `express-validator`
- CSRF-safe since we're using stateless JWT + no cookies
- Strong password validation and storage via `bcrypt`

---
