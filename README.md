# Project Documentation

## Overview

This project is a NestJS application designed to handle user authentication and registration, using JWT for secure token-based authentication. It includes two main modules: `Auth` and `User`, each with their own controllers, services, and DTOs.

## Installation

### Prerequisites

- Node.js (v14.x or later)
- Yarn (v1.x or later)
- Docker

### Steps

1. **Clone the repository:**

   ```sh
   git clone <repository-url>
   cd <repository-directory>
   ```

2. **Install dependencies:**

   ```sh
   yarn install
   ```

3. **Configure environment variables:**

   Create a `.env` file at the root of the project and add the following variables:

   ```env
   JWT_SECRET=set-your-key
   DB_HOST=localhost
   DB_PORT=3306
   DB_USERNAME=ntd_user
   DB_PASSWORD=set-your-password
   DB_NAME=ntd_calculator
   ```

4. **Run MySQL using Docker:**

   ```sh
   docker pull fernando0988/ntd_calculator_image:latest
   docker run --name ntd_calculator-container -e MYSQL_ROOT_PASSWORD=set-your-password -e MYSQL_DATABASE=ntd_calculator -e MYSQL_USER=ntd_user -e MYSQL_PASSWORD=set-your-password -p 3306:3306 -d fernando0988/ntd_calculator_image:latest
   ```

5. **Start the application:**

   ```sh
   yarn start
   ```

## Main Concepts

### Authentication

The application uses JWT for authentication. The `AuthService` handles user validation, token generation, and token validation.

### User Registration

Users can register using the `/auth/register` endpoint, which creates a new user in the database.

### Token Validation

Tokens are validated using a custom `JwtStrategy` and `JwtAuthGuard`, ensuring that only authenticated requests can access certain endpoints.

## Detailed Explanation

### Controllers

#### AuthController

- **register**: Registers a new user.
- **login**: Authenticates a user and returns a JWT token.
- **validateToken**: Validates the provided JWT token.

#### UserController

Handles user-related operations (not fully shown in the provided code but typically includes CRUD operations for users).

### Services

#### AuthService

- **validateUser**: Validates a user's credentials.
- **login**: Generates a JWT token for authenticated users.
- **validateToken**: Validates the provided JWT token.

#### UserService

Handles user creation, retrieval, and other user-related operations.

### DTOs

#### CreateUserDto

Defines the structure for the user registration payload.

#### LoginUserDto

Defines the structure for the user login payload.

### Guards and Strategies

#### JwtAuthGuard

A guard that uses the `JwtStrategy` to protect routes by requiring a valid JWT token.

#### JwtStrategy

Defines how the JWT token is validated and what payload it expects.

### Pagination

While not explicitly shown in the provided code, pagination can be implemented using query parameters and additional methods in the `UserService` to limit and offset results.

## Running Tests

### Unit Tests

The application includes unit tests for the `AuthController` and `AuthService`. To run the tests, use:

```sh
yarn test
```

## Database Setup

The application uses MySQL as its database. The Docker setup command provided earlier will run a MySQL container pre-configured with the necessary database and user.

### Running MySQL with Docker

```sh
docker pull fernando0988/ntd_calculator_image:latest
docker run --name ntd_calculator-container -e MYSQL_ROOT_PASSWORD=set-your-password -e MYSQL_DATABASE=ntd_calculator -e MYSQL_USER=ntd_user -e MYSQL_PASSWORD=set-your-password -p 3306:3306 -d fernando0988/ntd_calculator_image:latest
```

## Environment Variables

- **JWT_SECRET**: Secret key used for signing JWT tokens.
- **DB_HOST**: Database host (e.g., `localhost`).
- **DB_PORT**: Database port (e.g., `3306`).
- **DB_USERNAME**: Database username.
- **DB_PASSWORD**: Database password.
- **DB_NAME**: Name of the database.