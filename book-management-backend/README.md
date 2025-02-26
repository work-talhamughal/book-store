# Book Management Backend

A Node.js backend API for managing books with TypeScript and Express.

## Features

- RESTful API endpoints for CRUD operations
- Data validation using class-validator
- Error handling with custom AppError
- SQLite database with TypeORM
- Unit and E2E testing with Jest
- Rate limiting and security middleware
- Pagination and search functionality

## Tech Stack

- Node.js
- TypeScript
- Express
- TypeORM
- SQLite
- Jest & Supertest
- Class Validator
- Helmet & Express Rate Limit

## API Endpoints

- `GET /api/books` - Get all books (with pagination and search)
- `GET /api/books/:id` - Get a specific book
- `POST /api/books` - Create a new book
- `PUT /api/books/:id` - Update a book
- `DELETE /api/books/:id` - Delete a book

## Getting Started

1. Install dependencies:

```bash
npm install
```

2. Start the development server:

```bash
npm run start
```

## Test Cases

For running the test cases:
both unit and e2e test cases:

```bash
npm run test
```
