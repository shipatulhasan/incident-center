# Incident Center

[![Live App](https://img.shields.io/badge/Live%20App-Render-46E3B7?style=for-the-badge)](https://incident-center.onrender.com/)
[![CI/CD](https://img.shields.io/badge/CI%2FCD-GitHub%20Actions-2088FF?style=for-the-badge&logo=githubactions&logoColor=white)](.github/workflows/deploy.yml)
[![Frontend](https://img.shields.io/badge/Frontend-React%20%2B%20Vite-61DAFB?style=for-the-badge&logo=react&logoColor=111)](apps/web)
[![Backend](https://img.shields.io/badge/Backend-Express%20%2B%20MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](apps/api)

Incident Center is a full-stack incident management dashboard for tracking service reliability issues from report to resolution. It helps teams create incidents, assign ownership, follow status changes, monitor severity, review timeline activity, and keep visibility into operational metrics such as open incidents, critical issues, on-call users, and MTTR.

**Live application:** [https://incident-center.onrender.com/](https://incident-center.onrender.com/)

## Preview

> Add application screenshots here.

```text
docs/images/dashboard.png
docs/images/incident-details.png
```

## Features

- Authentication with JWT-based protected routes
- Incident creation, assignment, severity, and status management
- Dashboard metrics for total incidents, critical incidents, on-call coverage, and average MTTR
- Kanban-style incident workflow: open, investigating, and resolved
- Incident detail pages with timeline, comments, postmortem fields, impact, root cause, and resolution tracking
- Notification module for incident-related updates
- Responsive React interface with Tailwind CSS and reusable UI components
- REST API built with Express, TypeScript, MongoDB, and Mongoose

## Tech Stack

| Area           | Technology                                          |
| -------------- | --------------------------------------------------- |
| Frontend       | React, Vite, TypeScript, Tailwind CSS, React Router |
| State/Data     | TanStack Query, Axios                               |
| UI             | shadcn-style components, Lucide React, Sonner       |
| Backend        | Node.js, Express, TypeScript                        |
| Database       | MongoDB with Mongoose                               |
| Auth           | JWT, bcryptjs                                       |
| Validation     | Zod                                                 |
| CI/CD          | GitHub Actions, Render deploy hooks                 |
| Deployment     | Render                                              |
| Infrastructure | AWS EC2, PM2, Nginx deployment scripts              |

## Project Structure

```text
incident-center/
+-- apps/
|   +-- api/                 # Express API, MongoDB models, routes, services
|   +-- web/                 # React/Vite frontend application
+-- scripts/                 # Legacy AWS EC2 bootstrap and deploy scripts
+-- .github/workflows/       # GitHub Actions CI/CD workflow
+-- package.json             # Root workspace scripts
+-- package-lock.json
```

## Getting Started

### Prerequisites

- Node.js 22+
- npm
- MongoDB connection string

### Installation

```bash
npm install
```

### Environment Variables

Create an API environment file from the example:

```bash
cp apps/api/.env.example apps/api/.env
```

Update the values for your local or hosted environment:

```env
PORT=5001
MONGODB_URI=mongodb://127.0.0.1:27017/reliability_command_center
JWT_SECRET=change_this_secret
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
REMINDER_INTERVAL_MINUTES=15
```

Create a frontend environment file:

```env
VITE_API_URL=http://localhost:5001/api
```

## Running Locally

Run the frontend and backend together:

```bash
npm run dev
```

Run each app separately:

```bash
npm run dev:web
npm run dev:api
```

Build all workspaces:

```bash
npm run build
```

Start the production API build:

```bash
npm run start:api
```

## API Overview

The backend exposes REST endpoints under `/api`:

| Module        | Base Route           | Purpose                                                             |
| ------------- | -------------------- | ------------------------------------------------------------------- |
| Auth          | `/api/auth`          | Login, user access, and authentication-related operations           |
| Incidents     | `/api/incidents`     | Incident CRUD, status updates, stats, timeline, and postmortem data |
| Notifications | `/api/notifications` | Incident notification data                                          |

## CI/CD and Deployment

This project uses [GitHub Actions](.github/workflows/deploy.yml) for CI/CD.

On every push to the `main` branch, the workflow:

1. Checks out the repository
2. Sets up Node.js 22
3. Installs dependencies with `npm ci`
4. Builds all workspaces with `npm run build`
5. Triggers Render deploy hooks for both the backend and frontend services

Deployment is also available manually through `workflow_dispatch`.

### Render Deployment

The application is currently deployed on Render:

- **Live app:** [https://incident-center.onrender.com/](https://incident-center.onrender.com/)
- Backend and frontend deployments are triggered through Render deploy hook secrets:
  - `RENDER_DEPLOY_API_HOOK`
  - `RENDER_DEPLOY_WEB_HOOK`

# AWS Deployment Support

The project also includes AWS EC2 deployment automation.

Infrastructure setup included:

- EC2 server provisioning
- Nginx reverse proxy
- PM2 process manager
- SSH based deployment
- rsync deployment strategy
- Environment variable generation

Scripts:

```text
scripts/ec2-bootstrap.sh

scripts/ec2-deploy.sh
```

These scripts remain available for self-hosted deployments.

## Useful Links

- [Live Incident Center](https://incident-center.onrender.com/)
- [Frontend app](apps/web)
- [Backend API](apps/api)
- [CI/CD workflow](.github/workflows/deploy.yml)
- [AWS EC2 deployment scripts](scripts)
