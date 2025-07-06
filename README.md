# Fintech Backend

## Project Tracker

The tracker endpoint `/api/tracker` serves the tasks defined in `project_tasks.json`.
Open `public/tracker.html` in a browser to see the list.

### Updating tasks
1. Edit `project_tasks.json` in the repository root.
2. Add or update task objects with fields:
   - `id`: unique number
   - `title`: short description
   - `status`: e.g. `pending`, `in progress`, `complete`
   - `progress`: 0-100
3. Restart the server so the changes are picked up.
