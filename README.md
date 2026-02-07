# SpringBootAngularTemplate

A template project for Spring Boot and Angular applications.

## Table of Contents

- [Features](#features)
- [Technologies](#technologies)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
  - [Database Setup](#database-setup)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
- [Running the Application](#running-the-application)
- [Testing](#testing)

## Features

- **Authentication:** JWT-based authentication with access and refresh tokens.
- **Security:** Spring Security configuration with CORS support.
- **Database Migrations:** Flyway for version-controlled database schema changes.
- **UI Components:** Angular with Bootstrap and custom theme integration.
- **E2E Testing:** Cypress for end-to-end testing.

## Technologies

### Backend
- **Java 17+**
- **Spring Boot 3** (Web, Data JPA, Security, Validation)
- **MySQL**
- **Flyway**
- **Lombok**
- **JJWT** (JSON Web Token)

### Frontend
- **Angular 21**
- **Bootstrap 5** & **ngx-bootstrap**
- **RxJS**
- **Cypress** (E2E Testing)

## Prerequisites

Ensure you have the following installed:
- [Java Development Kit (JDK) 17+](https://www.oracle.com/java/technologies/downloads/)
- [Node.js](https://nodejs.org/) (Latest LTS)
- [MySQL Server](https://dev.mysql.com/downloads/installer/)
- [Maven](https://maven.apache.org/download.cgi) (optional, can use `./mvnw`)

## Getting Started

### Database Setup

1. Create a MySQL database named `myapp`:
   ```sql
   CREATE DATABASE myapp;
   ```
2. Update the database credentials in `backend/src/main/resources/application-default.properties`.

### Backend Setup

1. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```
2. Configure your JWT secrets in `application-default.properties`:
   ```properties
   app.config.jwt.access-token-secret=your_very_long_and_secure_access_token_secret
   app.config.jwt.refresh-token-secret=your_very_long_and_secure_refresh_token_secret
   ```
3. Build and run the backend:
   ```bash
   mvn clean install
   mvn spring-boot:run
   ```
   The backend will start on [http://localhost:8080](http://localhost:8080).

### Frontend Setup

1. Navigate to the `web` directory:
   ```bash
   cd web
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Angular development server:
   ```bash
   npm start
   ```
   The frontend will be available at [http://localhost:4200](http://localhost:4200).

## Running the Application

1. Ensure the MySQL server is running.
2. Start the Backend application.
3. Start the Frontend application.
4. Access the application via your browser at `http://localhost:4200`.

## Testing

### Frontend Tests
- To run unit tests: `npm test`
- To open Cypress for E2E tests: `npm run cy:open`
- To run Cypress tests in headless mode: `npm run cy:run`