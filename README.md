# Backend Platform Template (Node.js + MySQL + Redis + Docker)

## Overview

Production-oriented Node.js API with clean layering, auth, caching, background jobs, rate limiting, and Docker support.

## Tech stack

- Node.js + Express  
- MySQL  
- Redis  
- BullMQ (background jobs)  
- Docker Compose  
- JWT, Swagger, health checks  

## Architecture

Controller → Service → Repository → Database  

---

## Recommended local dev: **API on the machine, MySQL + Redis in Docker only**

You do **not** need MySQL or Redis installed on Windows. Run **only** the DB/cache containers, then the API with Node.

1. **Start MySQL + Redis (Docker only)**

   ```bash
   docker compose up -d mysql redis
   ```

2. **Configure `.env`** in this repo (host connects to published ports):

   - `DB_HOST=localhost`  
   - `DB_PORT=3307` (maps to MySQL `3306` in the container — see `docker-compose.yml`)  
   - `REDIS_URL=redis://localhost:6379`  
   - Plus `DB_USER`, `DB_PASSWORD`, `DB_NAME`, `JWT_SECRET`, `GEMINI_API_KEY`, etc.

3. **Install and migrate**

   ```bash
   npm install
   npm run setup-db
   npm run seed
   ```

4. **Run the API (and worker if you use queues)**

   ```bash
   npm run dev
   ```

   Optional second terminal: `npm run worker:email`

5. **Frontend** (if you use the sibling project): `npm start` there; API stays at `http://localhost:5000`.

**Summary:** MySQL/Redis = **Docker only**. Node API = **your machine**, talking to `localhost:3307` and `localhost:6379`.

---

## Full stack in Docker (API + worker + MySQL + Redis)

When you want everything containerized:

```bash
docker compose up -d --build
```

Uses `.env.docker` (service hostnames `mysql`, `redis`). See comments in `docker-compose.yml`.

---

## API docs

http://localhost:5000/api-docs  

## Sample seed user

email: `user1@test.com`  
password: `123456`
