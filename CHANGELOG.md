# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.0] - 2025-10-17

### Added

- SAP simulation for user data lookups via `SapService` and `SapModule`.
- Methods: `consultUserData(sapKey, requestId, userId)` and `consultAllUsers(sapKey, requestId)` with API key validation and basic tracing.
- Documentation in `README.md` including usage example and notes about the static API key.

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
