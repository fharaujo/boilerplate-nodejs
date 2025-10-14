# Quick Start Guide

Get up and running with the NestJS boilerplate in minutes!

## Prerequisites

- Node.js 20+ and npm 9+
- Docker and Docker Compose (recommended)
- Git

## Option 1: Automated Setup (Recommended)

```bash
# Run the setup script
chmod +x scripts/setup.sh
./scripts/setup.sh
```

This will:
1. Install all dependencies
2. Create `.env` from `.env.example`
3. Setup git hooks
4. Generate Prisma Client
5. Optionally start Docker services and run migrations

## Option 2: Manual Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
```bash
cp .env.example .env
# Edit .env with your configuration
```

### 3. Start Infrastructure
```bash
# Start PostgreSQL, Redis, and RabbitMQ
docker-compose up -d postgres redis rabbitmq
```

### 4. Setup Database
```bash
# Generate Prisma Client
npx prisma generate

# Run migrations
npm run migrate
```

### 5. Start Development Server
```bash
npm run dev
```

## Verify Installation

Once the server is running, visit:

- **API**: http://localhost:3000/api/v1
- **Swagger Docs**: http://localhost:3000/docs

## Test the API

### Register a User
```bash
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Password123!",
    "name": "Test User"
  }'
```

### Login
```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Password123!"
  }'
```

### Get Profile (use the token from login)
```bash
curl -X GET http://localhost:3000/api/v1/users/me \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

## Next Steps

1. **Explore the codebase**: Check out the project structure
2. **Read the docs**: See README.md for detailed documentation
3. **Add features**: Start building your application
4. **Write tests**: See test examples in `src/` and `test/`

## Troubleshooting

### Port already in use
Change the `PORT` in `.env` file

### Database connection error
Ensure PostgreSQL is running:
```bash
docker-compose ps
```

### Prisma errors
Regenerate Prisma Client:
```bash
npx prisma generate
```

### Need help?
Open an issue in the repository

---

Happy coding! 🚀
