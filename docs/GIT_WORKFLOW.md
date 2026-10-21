# Git Workflow

Use Git to show the project taking shape over time. Make a commit after each real work session, with a message that says what changed. The schedule below is a planning guide for this Campus Canteen Ordering System; adjust it to match the work actually completed. Do not create commits for work that was not done or backdate commits to make the history look longer.

## Suggested 14-day commit plan

Aim for at least 20 small, meaningful commits if the project work naturally supports them. A day can have more than one work session and commit. If a task takes longer, commit at a useful checkpoint rather than splitting changes artificially.

| Day | Example commit messages |
|---|---|
| 1 | `docs: add project proposal and initial ERD` · `chore: organize backend frontend and docs folders` |
| 2 | `chore: configure Laravel application` · `chore: scaffold React and Vite frontend` |
| 3 | `feat: add student and admin role fields` · `feat: create canteen catalog and ordering migrations` |
| 4 | `feat: add category menu item and pickup slot models` · `feat: define order and order item relationships` |
| 5 | `feat: implement registration and login endpoints` · `feat: protect API routes with Sanctum` |
| 6 | `feat: add public menu category and pickup slot endpoints` · `feat: add admin catalog management endpoints` |
| 7 | `feat: implement order creation and student order history` · `feat: add order cancellation and admin status workflow` |
| 8 | `feat: seed demo accounts menu and pickup slots` · `docs: document API endpoints and demo credentials` |
| 9 | `feat: add shared frontend app context and API client` · `feat: build home and menu pages` |
| 10 | `feat: add login and student registration screens` · `feat: add cart and favorites pages` |
| 11 | `feat: build checkout and order history screens` · `feat: add protected student and admin routes` |
| 12 | `feat: build admin dashboard and management screens` · `fix: handle API errors and loading states` |
| 13 | `style: refine responsive layouts for mobile` · `docs: add ERD screenshots guide and README` |
| 14 | `docs: add demo video link and Git workflow` · `chore: prepare project handoff` |

These are examples, not a record of commits already made. Use only messages that accurately describe the changes in each commit.

## Session workflow

1. Start a focused task and check `git status` before editing.
2. Keep each commit about one coherent change. Avoid committing generated dependencies or local secrets.
3. Review the staged diff with `git diff --cached` before committing.
4. Commit after the work session using a short prefix such as `feat:`, `fix:`, `docs:`, `style:`, or `chore:`.
5. Push the completed commit when the remote repository is available.

## Keep local and generated files out of Git

Commit each app's `.env.example`, but never commit a real `.env` file. Keep `backend/vendor/`, `frontend/node_modules/`, build output, and local database files out of commits. The root `.gitignore` includes these exclusions; review it before adding files.
