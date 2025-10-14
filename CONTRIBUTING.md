# Contributing Guide

Thank you for considering contributing to this project! 

## Development Setup

1. Fork the repository
2. Clone your fork: `git clone <your-fork-url>`
3. Install dependencies: `npm install`
4. Copy `.env.example` to `.env`
5. Start services: `docker-compose up -d postgres redis rabbitmq`
6. Run migrations: `npm run migrate`
7. Start dev server: `npm run dev`

## Code Style

This project uses ESLint and Prettier for code formatting.

- Run `npm run lint` to check for linting errors
- Run `npm run format` to format code
- Husky will automatically run these on commit

## Commit Messages

Follow conventional commits format:

```
feat: add new feature
fix: fix bug
docs: update documentation
test: add tests
refactor: refactor code
chore: update dependencies
```

## Pull Request Process

1. Create a new branch: `git checkout -b feature/my-feature`
2. Make your changes
3. Write/update tests
4. Ensure tests pass: `npm test`
5. Commit your changes
6. Push to your fork
7. Open a Pull Request

## Testing

- Write unit tests for services and utilities
- Write e2e tests for API endpoints
- Ensure coverage doesn't decrease

## Code Review

All submissions require review. Please be patient and address feedback.

## Questions?

Feel free to open an issue for any questions or concerns.
