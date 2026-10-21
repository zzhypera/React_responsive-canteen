# Project Phases and Checkpoints

This schedule adapts the supplied 14-day assessment outline to the Campus Canteen Ordering System. Project details and feature names follow the attached capstone presentation; the point values are copied from the supplied rubric. No point value was provided for the final polish phase.

| Days | Phase | Checkpoint output (what the instructor checks) | Points |
|---|---|---|---:|
| 1–2 | Planning | **CP1 (end of Day 2):** Mater Dei College students and canteen staff identified as the clients; problem statement covering long queues, misread orders, unknown menu availability, and manual sales totals; the nine-feature list; ERD; wireframes for key pages; GitHub repository created and instructor invited as collaborator. | 5 |
| 3–6 | Backend build | **CP2 (end of Day 6):** migrations and Eloquent models/relationships for users, categories, menu items, pickup slots, orders, and order items; seeded menu, demo accounts, and realistic sample orders across the order statuses; Sanctum registration/login/logout/current-user endpoints; student/admin authorization; catalog CRUD and order/status workflow endpoints. Exercise requests in Postman or Thunder Client and export a Postman collection to `docs/`. | 10 |
| 7–11 | Frontend and integration | **CP3 (end of Day 11):** React student and admin routes use the Laravel API; students can browse/search/filter available menu items, place an order with a pickup slot, view order history, and cancel only while Pending; staff can manage menu data and move orders through Pending → Preparing → Ready → Completed. Check role restrictions and field-level validation responses. | 10 |
| 12–13 | Polish, documentation, and slides | Finish keyword/category/availability/status filters and pagination; dashboard summaries (orders, sales, best seller, busiest slot); validation messages, loading/empty states, toasts, confirmations, and responsive UI; README, screenshots, realistic seed data, 5–8 minute backup demo video, and presentation slides. | Not specified |

## Evidence checklist

- **CP1:** [`erd.svg`](erd.svg), canteen problem and feature description in the [root README](../README.md), wireframes, and repository collaborator setup.
- **CP2:** Laravel migrations, Eloquent relationships, seeders, Sanctum auth, role checks, and API routes in `backend/`; Postman/Thunder Client request evidence and exported collection in `docs/`.
- **CP3:** student ordering and staff management shown in the React app against the Laravel API, including pickup capacity and the order status flow.
- **Polish:** search/filter and pagination examples; dashboard summaries; validation and UI feedback; API endpoint reference and demo-video link in the [root README](../README.md); screenshots in [`screenshots/`](screenshots/); presentation slides in `docs/`.

## Current repository notes

This section helps distinguish completed artifacts from checkpoint targets; update it as the project changes.

- The ERD and endpoint table are present. The API route definitions, migrations, models, and database seeder are in `backend/`.
- The attached presentation describes the React screens, Laravel migrations, Sanctum auth, API routes, and slot-capacity transaction as built. It lists connecting the menu/cart/orders to live API data, mapping API fields, handling 403/422 errors, and testing the complete workflow as next steps.
- Repository README likewise says registration and login are connected while other ordering pages still use local preview data. Treat CP3 as in progress until those API workflows are demonstrated end to end.
- The screenshot folder has guidance but no application captures yet. The presentation slides are in `docs/`; a Postman collection is still not included.
- The Drive folder linked from the README is the supplied demo-video location. Confirm that the final 5–8 minute video is uploaded there.

## GitHub collaborator reminder

Invite the instructor through the repository host's collaborator settings and confirm the invitation is accepted. This is an account-level action, so it is not represented by a local file in the repository. Record the invitation or repository URL in the project submission materials if required by the course.
