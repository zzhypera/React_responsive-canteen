# API integration notes

The uploaded project originally contained a clean Laravel starter and a clean React starter with no canteen schema or API routes. This package adds the proposal's database structure and Laravel endpoint foundation. PHP syntax checks passed for the added PHP files in the generation environment, but database migrations, Sanctum installation, endpoint authorization and browser-to-API integration still need to be exercised locally.

## API endpoints included

| Method | Path | Access |
|---|---|---|
| POST | `/api/register` | Public, new student |
| POST | `/api/login` | Public |
| GET | `/api/menu` | Public, paginated/searchable |
| GET | `/api/categories` | Public |
| GET | `/api/pickup-slots` | Public |
| GET | `/api/user` | Sanctum |
| POST | `/api/logout` | Sanctum |
| GET / POST | `/api/orders` | Sanctum, own orders / create order |
| GET | `/api/orders/{order}` | Sanctum, own order or admin |
| PATCH | `/api/orders/{order}/cancel` | Owner, Pending only |
| GET | `/api/admin/dashboard` | Admin |
| GET / POST / PUT / DELETE | `/api/admin/categories` | Admin, CRUD |
| GET / POST / PUT / DELETE | `/api/admin/menu-items` | Admin, CRUD |
| GET / POST / PUT / DELETE | `/api/admin/pickup-slots` | Admin, CRUD |
| GET | `/api/admin/orders` | Admin |
| PATCH | `/api/admin/orders/{order}/status` | Admin, status workflow |
| DELETE | `/api/admin/orders/{order}` | Admin |

Laravel resources return paginated records; menu items include their category. Order items record their purchase-time unit price. Pickup-slot capacity is checked inside a database transaction at order creation.

## What remains before a real full-stack demo

1. Run Composer and Sanctum installation and migrations on the target machine.
2. Configure MySQL/MariaDB and seed initial admin/student accounts and menu data.
3. Replace browser-only actions in `frontend/src/context/AppContext.jsx` and the login/register pages with calls to `frontend/src/services/api.js`.
4. Map payload properties between API snake_case fields and the React UI, and add authorization/validation error handling.
5. Test role checks, capacity concurrency, cancellation and status transitions through Postman and in the browser.

The demo login credentials in the React UI are only for the local browser preview. Real deployment must use the Laravel login/register endpoints and never trust a frontend-supplied role.
