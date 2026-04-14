# University Web (Angular Frontend)

Frontend for a University Management System built with Angular standalone APIs.
The application provides authentication and CRUD flows for students, departments,
courses, and student results.

## Overview

This project is an Angular 21 single-page application that communicates with a
backend API hosted at `https://localhost:7030`.

Main capabilities:

- User registration and login.
- JWT-based authentication.
- Protected routes using a route guard.
- Auto-attach JWT token to HTTP requests using an interceptor.
- Manage departments, courses, students, and course results.
- Lazy-loaded student feature routes.

## Tech Stack

- Angular 21 (standalone components and router)
- TypeScript 5.9
- RxJS 7.8
- Bootstrap 5.3
- `jwt-decode` for token parsing
- Vitest (via Angular builder) for unit tests

## Prerequisites

- Node.js (LTS recommended)
- npm (project uses npm and has lockfile support)
- Running backend API at `https://localhost:7030`

## Getting Started

1. Install dependencies:

```bash
npm install
```

2. Start development server:

```bash
npm start
```

3. Open in browser:

`http://localhost:4200/`

The app reloads automatically on source changes.

## Available Scripts

- `npm start`: Run development server (`ng serve`).
- `npm run build`: Build the app.
- `npm run watch`: Build in watch mode with development configuration.
- `npm test`: Run unit tests.

## Routing

Default route behavior:

- Empty path redirects to `/login`.
- Unknown routes go to Not Found page.

Public routes:

- `/login`
- `/register`

Protected routes (guarded by `canloginGuard`):

- `/dashboard`
- `/home`
- `/about`
- `/contactus`
- `/departments`
- `/courses`
- `/results`
- `/students` (lazy-loaded feature)

## Authentication Flow

Authentication is handled in `src/app/_services/account-servic.ts`:

- Login sends credentials to `POST /api/user/login`.
- On success, token is stored in `localStorage` under `token`.
- App syncs auth state on startup and route checks.
- Token expiration is validated client-side.

Authorization is handled in `src/app/interceptors/auth-inter-interceptor.ts`:

- If token exists, requests are cloned with:
	`Authorization: Bearer <token>`

Route protection is handled in `src/app/guards/canlogin-guard.ts`:

- If not logged in, user is redirected to `/login`.

## API Integration

The frontend currently targets a local HTTPS backend:

- Base host: `https://localhost:7030`
- Students: `/api/students/`
- Departments: `/api/Department/`
- Courses: `/api/Course/`
- Users: `/api/user/`

If your backend host or port changes, update the base URLs inside service files
under `src/app/_services/`.

## Project Structure

High-level structure:

```text
src/
	app/
		_services/        # API and application services
		components/       # UI components and feature pages
		guards/           # Route guards
		interceptors/     # HTTP interceptors
		models/           # TypeScript interfaces/models
		app.config.ts     # App-level providers configuration
		app.routes.ts     # Main route definitions
```

Notable features:

- `components/student/` contains student feature pages and child routes.
- Shared UI elements include header, footer, and toast container.

## Build

Create a production build:

```bash
npm run build
```

Build output is generated in `dist/`.

## Testing

Run unit tests:

```bash
npm test
```

Spec files are located beside source files with `.spec.ts` suffix.

## Troubleshooting

- App starts but API calls fail:
	check that backend is running at `https://localhost:7030` and CORS is enabled.
- Unauthorized responses:
	log in again and verify token is present in browser `localStorage`.
- Guard always redirects to login:
	ensure token is valid and not expired.

## Future Improvements

- Move API base URLs to Angular environment files.
- Add role-based route protection using decoded token roles.
- Add e2e tests and CI workflow.
- Improve naming consistency (`account-servic` -> `account-service`).

## Useful References

- Angular CLI docs: https://angular.dev/tools/cli
- Angular docs: https://angular.dev
