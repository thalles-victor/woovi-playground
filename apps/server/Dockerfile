ARG PORT
# ---------------------------- Build Stage ----------------------------
FROM node:20-slim AS builder

WORKDIR /usr/src/app

COPY package*.json ./
COPY tsconfig*.json ./

RUN npm ci --legacy-peer-deps

COPY . .

RUN npm run build

# ---------------------------- Production Stage ----------------------------
FROM node:20-slim AS prod

WORKDIR /app

COPY --from=builder /usr/src/app/package*.json ./
RUN npm install --legacy-peer-deps

COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/.env ./
COPY --from=builder /usr/src/app/.env.example ./

EXPOSE $PORT

CMD ["npm", "run", "start"]

# ---------------------------- Development Stage ----------------------------
FROM node:20 AS dev

WORKDIR /usr/src/app

COPY package*.json ./
COPY tsconfig*.json ./
RUN npm install --legacy-peer-deps

COPY . .

EXPOSE $PORT 4000

CMD ["npm", "run", "dev"]