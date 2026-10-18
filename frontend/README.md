# Campus Canteen Ordering System — React Frontend

This frontend converts the student-facing canteen design from the Vue reference into React components with Vite. It uses a vertically stacked responsive layout, React Router, an Axios API client, and a Context API store.

## Start the frontend

```powershell
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173`.

## Local preview accounts

The frontend currently has a **local UI preview mode** for quickly checking the student and admin pages. It stores demo products, cart, orders, slot setup, and preview user in browser `localStorage`.

- Student: `student@campus.local` / `student123`
- Administrator: `admin@canteen.local` / `admin123`

These credentials are not secure server authentication and must not be used in production. Connect the forms to the Laravel API before deploying.

## Project organization

```text
src/
  components/    Shared header, footer, food card, status and toast UI
  context/       AppContext state and local preview persistence
  data/          Seed catalog for local preview
  pages/         Home, menu, cart, checkout, auth, orders, admin
  services/      Axios API client with bearer-token interceptor
  utils/         Currency, date and status formatting
  App.jsx
  index.css
  main.jsx
```

## Laravel API connection

Set `VITE_API_BASE_URL` in `.env` if the API is hosted separately, for example `VITE_API_BASE_URL=http://127.0.0.1:8000/api`. Vite proxies `/api` to Laravel on `http://127.0.0.1:8000` by default.

The `src/services/api.js` Axios instance already adds a stored bearer token as an `Authorization` header. Replace the local preview actions in `AppContext.jsx` and the login/registration pages with the Laravel endpoint calls. The starter backend in the submitted ZIP did not yet contain the proposal's application tables or API routes, so they need to be added and tested before the application is considered a connected full-stack system.
