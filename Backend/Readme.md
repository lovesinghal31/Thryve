### Backend 2025 SIH Solution

## Seeding / Dummy Data

You can populate the database with realistic dummy data for local testing (institutes, users across roles, resources, screenings, appointments, tasks, ideas, chat rooms/messages, AI chat sessions, intervention logs, admin dashboard snapshots, notifications).

### 1. Environment
Create a `.env` file (if not already) with at least:
```
MONGODB_URI=mongodb://127.0.0.1:27017
ACCESS_TOKEN_SECRET=devaccesssecret
REFRESH_TOKEN_SECRET=devrefreshsecret
ACCESS_TOKEN_EXPIRY=15m
REFRESH_TOKEN_EXPIRY=7d
PORT=5000
```

### 2. Install Dependencies
```
npm install
```

### 3. Run Seeder
Populate (will NOT wipe existing data unless you pass `--fresh`):
```
npm run seed
```
Fresh seed (clears collections first):
```
npm run seed -- --fresh
```

### 4. Clear All Seeded Data
```
npm run seed:clear
```

### 5. Adjust Volume
Edit `src/seed/seed.js` CONFIG object to change counts (institutes, users per institute, etc.).

### Generated Roles
- `admin` (per institute), `counselor`, `staff`, `student` (you can manually create `superadmin` if needed)

### Default Password
All seeded users share the password: `Password123!` (change inside `generatePassword()` in `seed.js`). Admins are created with the same password.

### Notes
- Seeder uses `@faker-js/faker`
- All password hashing triggers the Mongoose pre-save hook.
- Some relationships (appointments -> screenings, tasks -> screenings) are randomly optional.

## Scripts
| Command | Purpose |
|---------|---------|
| `npm run dev` | Start server with nodemon & dotenv |
| `npm start` | Start server once |
| `npm run seed` | Insert dummy data (add `-- --fresh` to wipe first) |
| `npm run seed:clear` | Remove all seeded collections |

## Troubleshooting
If you see `MongoServerSelectionError` ensure MongoDB is running locally (e.g. Docker or local service). For Docker quick start:
```
docker run -d --name mongo -p 27017:27017 mongo:7
```

If seeding seems to hang, add `--trace-warnings` or run with `node --inspect` for debugging.

## Safety
Never run the seeder against production without strict safeguards. Consider requiring `NODE_ENV!==production` in the script if promoting to prod.