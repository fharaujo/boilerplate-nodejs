# NestJS Boilerplate

Modern, production-ready NestJS boilerplate with clean architecture, TypeScript, and best practices for building scalable REST APIs.

## 🚀 Features

- **Modern Stack**: Node.js 20+, TypeScript, NestJS
- **Clean Architecture**: Modular structure with separation of concerns
- **Authentication**: JWT with refresh tokens
- **Database**: Prisma ORM with PostgreSQL
- **Caching**: Redis integration with ioredis
- **Message Queue**: RabbitMQ support
- **API Documentation**: Swagger/OpenAPI
- **Security**: Helmet, CORS, Rate Limiting
- **Validation**: class-validator for request validation
- **Logging**: Pino logger with pretty printing
- **Testing**: Jest with unit and e2e tests
- **Code Quality**: ESLint, Prettier, Husky pre-commit hooks
- **Containerization**: Docker and docker-compose
- **CI/CD**: GitHub Actions workflow

## 📁 Project Structure

```
src/
├── core/                    # Core functionality (filters, interceptors, guards)
│   ├── filters/            # Exception filters
│   ├── interceptors/       # Request/response interceptors
│   └── core.module.ts
├── infrastructure/          # External services and persistence
│   ├── database/           # Prisma service
│   ├── cache/              # Redis service
│   ├── messaging/          # RabbitMQ service
│   └── infrastructure.module.ts
├── modules/                 # Feature modules
│   ├── auth/               # Authentication module
│   │   ├── dto/
│   │   ├── guards/
│   │   ├── strategies/
│   │   └── decorators/
│   └── user/               # User module
│       ├── dto/
│       └── user.service.ts
├── app.module.ts           # Root module
└── main.ts                 # Application entry point
```

## 🛠️ Prerequisites

- Node.js >= 20.0.0
- npm >= 9.0.0
- PostgreSQL >= 14
- Redis >= 7
- RabbitMQ >= 3 (optional)
- Docker & Docker Compose (for containerized setup)

## 🏃 Quick Start

### Local Development

1. **Clone the repository**
   ```bash
   git clone git@gitlab.com:boilerplate-mfalzetta/boilerplate-nodejs.git
   cd boilerplate
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Setup environment variables**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` with your configuration.

4. **Start infrastructure services**
   ```bash
   docker-compose up -d postgres redis rabbitmq
   ```

5. **Run database migrations**
   ```bash
   npm run migrate
   ```

6. **Start development server**
   ```bash
   npm run dev
   ```

The API will be available at `http://localhost:3000/api/v1`
Swagger documentation at `http://localhost:3000/docs`

### Using Docker Compose

1. **Start all services**
   ```bash
   docker-compose up -d
   ```

2. **View logs**
   ```bash
   docker-compose logs -f app
   ```

3. **Stop services**
   ```bash
   docker-compose down
   ```

## 📜 Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Build production bundle |
| `npm start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run format` | Format code with Prettier |
| `npm test` | Run unit tests |
| `npm run test:watch` | Run tests in watch mode |
| `npm run test:cov` | Run tests with coverage |
| `npm run test:e2e` | Run e2e tests |
| `npm run migrate` | Run database migrations |
| `npm run migrate:deploy` | Deploy migrations (production) |
| `npm run prisma:studio` | Open Prisma Studio |

## 🔐 Authentication

The boilerplate includes a complete JWT authentication system with refresh tokens.

### Register a new user
```bash
POST /api/v1/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "Password123!",
  "name": "John Doe"
}
```

### Login
```bash
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "Password123!"
}
```

Response:
```json
{
  "statusCode": 200,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "name": "John Doe",
      "role": "USER"
    }
  }
}
```

### Refresh tokens
```bash
POST /api/v1/auth/refresh
Content-Type: application/json

{
  "refreshToken": "your-refresh-token"
}
```

### Protected routes
Add the `Authorization` header with the access token:
```bash
GET /api/v1/users/me
Authorization: Bearer your-access-token
```

## 🗄️ Database

### Migrations

```bash
# Create a new migration
npm run migrate

# Apply migrations in production
npm run migrate:deploy

# Reset database (development only)
npm run migrate:reset

# Open Prisma Studio
npm run prisma:studio
```

### Schema

Edit `prisma/schema.prisma` to modify your database schema, then run:
```bash
npm run migrate
```

## 🧪 Testing

### Unit Tests
```bash
npm test
```

### E2E Tests
```bash
npm run test:e2e
```

### Coverage Report
```bash
npm run test:cov
```

## 🔒 Security Features

- **Helmet**: Secure HTTP headers
- **CORS**: Configurable cross-origin resource sharing
- **Rate Limiting**: Throttle requests to prevent abuse
- **Password Hashing**: bcrypt with salt rounds
- **JWT**: Secure token-based authentication
- **Validation**: Input validation with class-validator

## 📊 Logging

The boilerplate uses Pino for high-performance logging:

```typescript
import { Logger } from '@nestjs/common';

const logger = new Logger('MyService');
logger.log('Info message');
logger.error('Error message');
logger.warn('Warning message');
logger.debug('Debug message');
```

## 🔄 Cache

Redis caching is configured and ready to use:

```typescript
import { RedisService } from '@infrastructure/cache/redis.service';

constructor(private redis: RedisService) {}

async example() {
  // Set cache
  await this.redis.set('key', 'value', 3600); // TTL in seconds
  
  // Get cache
  const value = await this.redis.get('key');
  
  // JSON support
  await this.redis.setJson('user:1', { name: 'John' }, 3600);
  const user = await this.redis.getJson('user:1');
}
```

## 📨 Message Queue

RabbitMQ service is available for async messaging:

```typescript
import { RabbitMQService } from '@infrastructure/messaging/rabbitmq.service';

constructor(private rabbitmq: RabbitMQService) {}

async example() {
  // Publish message
  await this.rabbitmq.publish('queue-name', { data: 'value' });
  
  // Consume messages
  await this.rabbitmq.consume('queue-name', async (message) => {
    console.log('Received:', message);
  });
}
```

## 🚢 Deployment

### Docker

Build and push your Docker image:
```bash
docker build -t your-app:latest .
docker push your-app:latest
```

### Environment Variables

Ensure all required environment variables are set in production:
- `DATABASE_URL`
- `JWT_SECRET`
- `JWT_REFRESH_SECRET`
- `REDIS_HOST`
- `RABBITMQ_URL`

### Health Checks

The services include health checks in docker-compose. Customize them as needed.

## 📝 API Documentation

Swagger documentation is automatically generated and available at:
```
http://localhost:3000/docs
```

Add API documentation to your endpoints using decorators:
```typescript
@ApiTags('users')
@ApiBearerAuth()
@ApiOperation({ summary: 'Get user profile' })
@ApiResponse({ status: 200, description: 'User profile' })
@Get('me')
getProfile() {
  // ...
}
```

## 🎯 Best Practices

1. **Module Organization**: Group related features in modules
2. **Dependency Injection**: Use NestJS DI system
3. **DTOs**: Use Data Transfer Objects for validation
4. **Error Handling**: Use NestJS exception filters
5. **Logging**: Log important events and errors
6. **Testing**: Write tests for critical paths
7. **Security**: Never commit secrets, use environment variables
8. **Code Quality**: Use ESLint and Prettier

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Commit changes: `git commit -am 'Add my feature'`
4. Push to branch: `git push origin feature/my-feature`
5. Submit a pull request

## 📄 License

MIT

## 🙋 Support

For issues and questions, please open an issue in the repository.

---

**Happy coding! 🎉**
