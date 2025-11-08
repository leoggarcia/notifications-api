# Notifications API

![NestJS](https://img.shields.io/badge/nestjs-%23E0234E.svg?style=for-the-badge&logo=nestjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/typescript-%233178C6.svg?style=for-the-badge&logo=typescript&logoColor=white)
![Docker](https://img.shields.io/badge/docker-%232496ED.svg?style=for-the-badge&logo=docker&logoColor=white)

This project is a REST API to handle the creation of notifications that can be scheduled to be sent in the future. It includes user management and authentication.

## Features

- **Notification Management**: Create, read, update, and delete notifications.
- **Scheduling**: Schedule notifications to be sent at a future date and time.
- **User Management**: Basic user creation and management.
- **Authentication**: JWT-based authentication to protect endpoints.
- **Multiple Channels**: Support for different notification channels like SMS and Email.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher)
- [Docker Desktop](https://www.docker.com/products/docker-desktop/)

### Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/leoggarcia/notifications-api.git
    cd notifications-api
    ```
2.  Install the dependencies:
    ```bash
    npm install
    ```

### Running the Application

The application uses Redis for its queueing system. You can start the required Redis instance using Docker.

1.  **Start Redis service:**
    This project uses Redis for handling queues (BullMQ). Run the following command to start the Redis container:
    ```bash
    docker-compose up -d
    ```
    This will start Redis on port `6379`.

2.  **Verify Redis is running:**
    ```bash
    docker-compose ps
    ```
    You can also ping Redis to ensure it's responsive:
    ```bash
    redis-cli ping
    ```
    It should respond with `PONG`.

3.  **Run the NestJS application:**
    ```bash
    npm run start:dev
    ```
    The application will be running on `http://localhost:3000`.

4.  **Stopping services:**
    To stop the Redis service, run:
    ```bash
    docker-compose down
    ```

## Future Improvements

This project has a solid foundation, but there are several ways it could be enhanced:

-   **Push Notifications**: Add a new notification channel for sending push notifications to mobile or web clients.
-   **Dockerize the Application**: Create a `Dockerfile` for the NestJS application to make it fully portable and easier to deploy in different environments. This would allow running the entire stack (app + Redis) with a single `docker-compose up` command.
-   **Configuration Management**: Improve configuration handling to better manage environment variables for different environments (development, staging, production).
-   **More Comprehensive Testing**: Expand the test suite to include end-to-end tests and more detailed unit/integration tests for edge cases.
-   **API Documentation**: Enhance API documentation using tools like Swagger for better developer experience.

## API Documentation (Swagger)

This project includes API documentation generated with Swagger, providing a clear and interactive way to explore and test the available endpoints.

To access the Swagger UI, navigate to:

```
http://localhost:3000/api
```

Here you can find detailed information about each endpoint, including accepted parameters, response structures, and authentication requirements. You can also make direct API calls from the browser.

## Technologies Used

*   **Backend Framework**: NestJS
*   **Language**: TypeScript
*   **ORM**: TypeORM
*   **Database**: SQLite
*   **Queueing**: BullMQ
*   **Testing**: Jest
*   **Linting**: ESLint
*   **Formatting**: Prettier
*   **Containerization**: Docker (for Redis)