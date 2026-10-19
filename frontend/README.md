# Campus Canteen Ordering System — React Frontend

This frontend converts the student-facing canteen design from the Vue reference into React components with Vite. It uses a vertically stacked responsive layout, React Router, an Axios API client, and a Context API store.

## Start the frontend

```powershell
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173`.

## Accounts

Student registration asks for a full name, student ID number, email address, and password. The registration and sign-in forms use the Laravel `/api/register` and `/api/login` endpoints. Public registration always creates a student account; administrator accounts must be provisioned by an administrator.

The sign-in page includes quick-fill buttons for the seeded local admin (`admin@canteen.local` / `admin123`) and demo student (`student@campus.local` / `student123`). The buttons fill the form; Laravel still performs the sign-in.

The rest of the ordering UI still has local preview data and actions. Those features are not yet fully connected to the Laravel API.

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

The `src/services/api.js` Axios instance adds a stored bearer token as an `Authorization` header. Registration and sign-in now use the Laravel endpoints. Menu, cart, orders, and admin actions still use local preview state, so the full application is not yet connected end to end.
