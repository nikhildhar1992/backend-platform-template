# Backend Platform Template (Node.js + MYsql + Redis + Docker)

🚀 Overview
A production-ready backend template built with Node.js, designed with clean architecture and scalability in mind.

Includes authentication, caching, background jobs, rate limiting, and Docker-based setup.

⚙️ Tech Stack
- Nodejs + Express
- MySQL
- Redis
- BullMQ (background jobs)
- Docker & Docker compose
- JWT Authentication
- Swagger (API Docs)

🏗️ Architecture
Controller → Service → Repository → Database
- Clean architecture
- Separation of concerns
- Scalable design

🔥 Features
- JWT Authentication & RBAC
- Pagination, Filtering, Sorting
- Redis Caching (with invalidation)
- Background Jobs (BullMQ)
- Retry & Failure Handling
- Rate Limiting (IP + User)
- Security (Helmet, CORS, Sanitization)
- Swagger API Documentation
- Health Check Endpoints
- Dockerized Setup

🐳 Setup Instructions
## Run with Docker
docker-compose up -d
npm run setup:db
npm run seed
npm run dev
📄 API Docs
http://localhost:5000/api-docs

🧪 Sample Credentials
email: user1@test.com  
password: 123456