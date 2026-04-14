# University System

A full-stack web application for managing university operations, including students, departments, courses, and users.

## Project Structure

This repository contains both the frontend and backend applications:

- **`/api/UniversityApi`**: The backend RESTful API built with ASP.NET Core (.NET 9.0).
- **`/frontend/UniversityWeb`**: The frontend single-page application built with Angular.

## Features

- **Student Management**: Add, view, and manage student records.
- **Department & Course Management**: Organize academic departments and their respective courses.
- **User Authentication**: Secure access using user login, Angular route guards, and HTTP interceptors.
- **Data Transfer Objects (DTOs)**: Clean separation of concerns for API requests and responses using AutoMapper.

## Technologies Used

### Backend
- ASP.NET Core Web API (.NET 9.0)
- Entity Framework Core (EF Core)
- C#

### Frontend
- Angular
- TypeScript
- HTML & CSS

## Getting Started

### Prerequisites
- [.NET 9.0 SDK](https://dotnet.microsoft.com/download/dotnet/9.0)
- [Node.js and npm](https://nodejs.org/)
- [Angular CLI](https://angular.io/cli)
- A supported database (e.g., SQL Server) – update the connection string in `api/UniversityApi/appsettings.json`

### Running the Backend

1. Navigate to the API directory:
   ```bash
   cd api/UniversityApi
   ```
2. Apply database migrations to create the database schema:
   ```bash
   dotnet ef database update
   ```
3. Run the development server:
   ```bash
   dotnet run
   ```
   *The API will start and listen for requests (check your terminal for the exact local URL, usually `https://localhost:<port>` or `http://localhost:<port>`).*

### Running the Frontend

1. Navigate to the Angular web app directory:
   ```bash
   cd frontend/UniversityWeb
   ```
2. Install the necessary node modules:
   ```bash
   npm install
   ```
3. Start the Angular development server:
   ```bash
   ng serve
   ```
4. Open your web browser and navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.
