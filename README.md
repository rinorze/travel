# Travel

A full-stack trip booking app: browse a catalog of destinations, look at the details, book dates for a group, and manage or cancel your bookings. Admins manage the catalog and see every booking.

Built with React, Express and MongoDB. A portfolio project, not a real travel agency.

## Features

- **Catalog:** 14 seeded destinations, searchable by name or country (the text is matched literally) and filterable by category (beach, mountain, city, cultural, adventure).
- **Booking:** pick start and end dates, number of guests, budget and notes. Bookings start as *pending*.
- **My bookings:** see your bookings and cancel one at any time.
- **Accounts:** sign up, log in, edit your name and change your password.
- **Admin dashboard:** add, edit and delete destinations, and see all bookings. Admin rights come from the database role and are granted with `npm run make-admin`; registering never makes anyone an admin.

## Stack

| Part | Tools |
|---|---|
| Client | React 19, React Router 7, Vite 7, Tailwind CSS 4, lucide icons |
| API | Node.js, Express 5, Mongoose 9, express-validator, helmet |
| Auth | JWT sent as a Bearer token (kept in `localStorage`), bcrypt password hashes |
| Tests | `node:test`, supertest, an in-memory MongoDB |
| CI | GitHub Actions: API tests, plus client lint and build, on every pull request |

## Run it locally

You need Node.js 22 (what CI uses; Vite 7 needs at least 20.19) and MongoDB: a local server or a free Atlas cluster, set in `MONGODB_URI`.

```bash
# API
cd server
cp .env.example .env        # then set JWT_SECRET to a long random string
npm install
npm run seed                # adds the 14 destinations
npm run dev                 # http://localhost:5000

# Client (second terminal)
cd client
cp .env.example .env
npm install
npm run dev                 # http://localhost:5173
```

To make an account an admin: `npm run make-admin -- you@example.com` in `server/`.

Without MongoDB, `ALLOW_IN_MEMORY_DB=true` starts the API on an in-memory database. It is good for a quick look, but the catalog starts empty (the seed and make-admin scripts need a real `MONGODB_URI`) and everything is lost when the API stops.

## Deploy on Vercel

One Vercel project serves both parts: the client is built as static files, and the Express API runs as a single serverless function (`api/index.js`, which uses `server/src/vercel.js`). The API lives under `/api` on the same domain, so the browser needs no cross-origin setup.

1. Create a free MongoDB Atlas cluster and copy its connection string.
2. In the Vercel project, set these environment variables:
   - `MONGODB_URI`: the Atlas connection string;
   - `JWT_SECRET`: a long random string;
   - `CLIENT_URL`: the site's own URL, for example `https://your-app.vercel.app`;
   - `VITE_API_URL`: `/api`.
3. Deploy with `vercel deploy --prod`, then load the destinations once: `MONGODB_URI=... npm run seed --prefix server`.

## Tests

```bash
cd server && npm test
```

The tests cover the security fixes: passwords are stored only as bcrypt hashes, a hash is never returned by the API, admin rights cannot be gained by registering with a particular email, and admin routes refuse anonymous and normal users.

## Security notes

An earlier version stored passwords in plain text, made one hard-coded email an admin, and let anyone seed the database from the browser. All three are fixed (bcrypt, a database role set by `make-admin`, and an admin-only seed route plus `npm run seed`). The server also refuses to start without `JWT_SECRET`, and it logs only the database host, never the connection string.

## Project layout

```
client/   React app (pages in src/app/pages, shared parts in src/app/components)
server/   Express API (routes, controllers, Mongoose models, scripts, tests)
```
