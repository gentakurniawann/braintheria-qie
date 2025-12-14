
# 🧩 Backend (NestJS)

This folder contains the **backend API** for Braintheria.
It handles:

- Auth (JWT + Google OAuth)
- Database access (PostgreSQL via Prisma)
- Caching/queues (Redis)
- Smart contract integration (RPC + contract address + server signer)

---

## 📁 Structure
```

backend/
├── src/
├── prisma/
│ ├── schema.prisma
│ └── migrations/
├── .env ← local only (DO NOT commit)
├── .env.example ← template (commit this)
├── package.json
└── README.md

````

---

## 📦 Prerequisites

You need:
- Node.js >= 18
- PostgreSQL running locally
- Redis running locally
- (Optional) Anvil + deployed contract if you want on-chain features

---

## 🌱 Environment Variables

### 1) Create `.env`

From the backend folder:

```bash
cp .env.example .env
````

Fill the values in `.env`.

### 2) Add to `.gitignore`

```gitignore
.env
```

---

## 🗄️ Database Setup (PostgreSQL + Prisma)

### 1) Install dependencies

```bash
npm install
# or
yarn
```

### 2) Generate Prisma client

```bash
npx prisma generate
```

### 3) Run migrations

```bash
npx prisma migrate dev
```

(Optional) Prisma Studio:

```bash
npx prisma studio
```

---

## 🧠 Redis Setup

### Option A — Run Redis with Homebrew (macOS)

```bash
brew services start redis
```

Check:

```bash
redis-cli ping
# should return: PONG
```

### Option B — Docker

```bash
docker run --name redis -p 6379:6379 -d redis:latest
```

---

## ⛓️ Blockchain Setup (Local)

If your backend sends on-chain transactions (server signer), you need:

1. Start Anvil:

```bash
anvil
```

2. Deploy your smart contract (Foundry) and copy the deployed address into:

```env
CONTRACT_ADDRESS=0x...
```

3. Use an Anvil funded private key for:

```env
SERVER_SIGNER_PRIVATE_KEY=0x...
```

> ⚠️ Never use this server signer key on mainnet. Local only.

---

## 🚀 Run Backend Locally

```bash
npm run start:dev
# or
yarn start:dev
```

Backend runs on:

- `http://localhost:3001`

---

## 🔐 Auth Notes

### Google OAuth Callback

Make sure Google OAuth console callback matches:

```
http://localhost:3001/auth/google/callback
```

### Frontend URL

Set:

```env
FRONTEND_URL=http://localhost:3000
```

This is commonly used for CORS and auth redirect.

---

## ✅ Typical Full-Stack Local Order

1. Start Postgres
2. Start Redis
3. Start Anvil
4. Deploy contract (Foundry)
5. Update backend `.env` (DATABASE_URL, CONTRACT_ADDRESS, SERVER_SIGNER_PRIVATE_KEY)
6. Run backend
7. Run frontend
