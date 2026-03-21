FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev 2>/dev/null || npm install --omit=dev

COPY . .

ENV NODE_ENV=production

EXPOSE 5000

# Default: API server (override in docker-compose for worker)
CMD ["node", "src/server.js"]
