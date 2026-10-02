# Aurex Truck Parts — Admin Console (starter)

Standalone staff/admin dashboard for the Aurex Truck Parts platform.
**Stack:** React 19 · Vite · React Router · Tailwind CSS v4. Talks to the `truck-parts-api` backend.

> This is a **starter scaffold**: login, API client (with token + silent refresh),
> protected layout, and data-wired pages (Dashboard, Orders with status updates,
> Products, Categories, Promos with full CRUD, Enquiries with status, Customers,
> Settings). Create/edit forms for products & categories are the next build step
> (marked in the code).

## Quick start

```bash
npm install
cp .env.example .env     # set VITE_API_URL to your running API (default http://localhost:5000/api)
npm run dev              # http://localhost:5174
```

Make sure the API is running and seeded first (see the `truck-parts-api` repo), then log in with the
seeded admin account (default `admin@aurex.com.au` / `Admin123!` — change it).

## How it connects
- `src/api/client.js` — fetch wrapper: attaches the Bearer access token, sends the refresh cookie,
  and on a 401 does one silent `/auth/refresh` + retry.
- `src/store/auth.jsx` — restores the session on load via the refresh cookie, enforces `isAdmin`.
- `VITE_API_URL` must point at the API, and the API's `CLIENT_ORIGINS` must include this app's
  origin (`http://localhost:5174` in dev) for CORS + cookies to work.

## Structure
```
src/
  api/client.js        API fetch wrapper
  store/auth.jsx       admin auth context
  components/          Layout (sidebar), ProtectedRoute
  lib/                 useFetch hook, formatters
  pages/               Login, Dashboard, Orders, Enquiries, Customers,
                       Products, Categories, Promos, Settings
```

## Note on the existing admin
The storefront already has a built-in admin at `/admin`. This separate app is the path to a fully
decoupled staff console. You can run both during migration and retire the in-app one later.
# truck-parts-admin
