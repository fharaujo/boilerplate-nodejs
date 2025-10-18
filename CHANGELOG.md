# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.2.0] - 2025-10-18

### Added

- News module integration with NewsAPI to list sources: `GET /api/v1/news/sources`.
- JWT protection on news endpoint via `JwtAuthGuard`.
- Configuration via `NEWS_API_KEY` environment variable (loaded with `ConfigModule`).
- Strong typing for News responses in `src/modules/news/types/news.types.ts`.

### Changed

- `NewsService` refactored to use `ConfigService`, URL builder, and a request helper with timeout.
- `NewsController` now returns typed payloads and imports types from the new types file.

### Removed

- `ApiKeyGuard` and the `x-api-key` header requirement from the news endpoint.
- SAP simulation references and documentation (module not present in the codebase).

## [1.0.0] - 2024-01-XX

### Added

- Initial project setup with NestJS
- TypeScript configuration with path aliases
- Prisma ORM with PostgreSQL
- JWT authentication with refresh tokens
- User management module
- Redis caching integration
- RabbitMQ messaging support
- Swagger API documentation
- Global error handling and logging
- Rate limiting and security headers
- Docker and docker-compose setup
- GitHub Actions CI/CD pipeline
- Unit and e2e tests with Jest
- ESLint and Prettier configuration
- Husky pre-commit hooks
- Comprehensive README and documentation

### Security

- bcrypt password hashing
- JWT token authentication
- Helmet for secure headers
- CORS configuration
- Input validation with class-validator
- Rate limiting with throttler
