## Setup Project

### Option A — Run API on your machine (MySQL + Redis in Docker)

1. `docker compose up -d mysql redis` (only DB + Redis)
2. `npm install`
3. `npm run setup-db`
4. `npm run seed` (optional)
5. Terminal 1: `npm run dev`
6. Terminal 2: `npm run worker:email`

Use `.env` with `DB_HOST=localhost`, `DB_PORT=3307`, `REDIS_URL=redis://localhost:6379`.  
Set `ENABLE_REDIS_CACHE=true` if you want Redis caching for user lists; otherwise omit or set `false` (BullMQ still uses `REDIS_URL`).

### Option B — API + BullMQ worker in Docker (MySQL + Redis + app in Docker)

1. Ensure `.env.docker` exists (see repo file — uses `DB_HOST=mysql`, `DB_PORT=3306`, `REDIS_URL=redis://redis:6379`, `ENABLE_REDIS_CACHE=false`).
2. `docker compose build`
3. `docker compose up -d`
4. Initialize DB once (from host, pointing at published MySQL port):  
   `npm run setup-db`  
   (uses `.env` — keep `DB_PORT=3307` to match `3307:3306` mapping)  
   Or: `docker compose exec api node src/scripts/setupDb.js` if you inject env into `api` container.

API: `http://localhost:5000`  
Worker logs: `docker compose logs -f worker`

BullMQ data lives in Redis; inspect with `docker exec -it redis redis-cli` and `SCAN 0 MATCH "bull:*" COUNT 100`.
