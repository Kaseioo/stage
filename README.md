# Stage Management App (MonoRepo)

This repository contains the source code for the Stage Management application, separated into a frontend and backend.

## Overview

-   **/frontend**: Contains the React (Vite + TypeScript + Tailwind CSS) frontend application.
-   **/backend**: Contains the Node.js (Express + Sequelize + TypeScript) backend API. Uses SQLite3.

```markdown
Note that we have three separate node installations:

├─ frontend/package.json
├─ backend/package.json
├─ package.json
```
## Project Structure

```markdown
stage/
├── frontend/ # Vite + React Frontend Application
│ ├── public/
│ ├── src/
│ ├── package.json
├── backend/ # Node.js Backend Application
│ ├── src/
│ ├── package.json
│
├── package.json # Root package.json for concurrent execution & setup
└── README.md # This file
```
## Prerequisites

-   [Node.js](https://nodejs.org/) (LTS version recommended, e.g., v18 or v20)
-   [npm](https://www.npmjs.com/)

## Setup Instructions

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/Kaseioo/stage
    cd stage
    ```

2.  **Install all dependencies:**
    This command installs dependencies for the root, backend, and frontend.

    ```bash
    npm run install:all
    ```

## Running the Application (Development)

From the **root directory** (`stage/`), run the following command to start both the backend API and the frontend development server concurrently:

```bash
npm run dev
```


- The Backend API will typically be available at `http://localhost:PORT_BACKEND` (e.g., http://localhost:3001). Check backend console output.

- The Frontend App will typically be available at `http://localhost:PORT_FRONTEND` (e.g., http://localhost:5173). Check frontend console output.

If you want to change the port, you will also need to update /frontend/services/apiClient.ts as we don't have any environment variables setup.

Note that we currently do not have a proper production environment, so only `dev` will work.

# Tech Stack

Frontend: React, TypeScript, Vite, Tailwind CSS v4, React Router, i18next, React Icons
Backend: Node.js, Express, TypeScript, Sequelize, SQLite3
Development: Concurrently, Prettier, ESLint

### Completed ✅

-   **Repository Setup:** Monorepo structure (`/frontend`, `/backend`).
-   **Frontend Initialization:** React + TypeScript + Vite (`stage-frontend`).
-   **Frontend Styling:** Tailwind CSS (v4) installed and configured.
-   **Frontend Formatting:** Prettier configured (4 tabs, Tailwind plugin).
-   **Basic UI:** Mock Login Page, Main Layout with Sidebar.
-   **Routing:** Client-side routing using `react-router-dom`.
-   **Authentication:** Basic mock login/logout state in `App.tsx`.
-   **Sidebar:**
    -   Navigation links with icons (`react-icons`).
    -   Logout button.
    -   Collapsible functionality with burger menu toggle.
-   **Theming:** Light/Dark mode toggle using Context API and `localStorage`.
-   **Internationalization (i18n):** Setup using `i18next`, `react-i18next`, JSON files. Language selector component added.
-   **API Service Layer:** Basic `apiClient` and specific services (`processApi`, `areaApi`).
-   **Process CRUD:**
    -   Backend Model, Controller, Routes defined.
    -   Frontend page (`ProcessesPage`).
    -   Data fetching implemented.
    -   Table display (`ProcessTable`).
    -   Create/Edit form via Modal (`ProcessForm`, `Modal`).
    -   Hierarchical display with Collapse/Expand.
    -   Detail view modal (`ProcessDetailModal`).
-   **Area CRUD:**
    -   Backend Model, Controller, Routes defined.
    -   Frontend management via integrated modal (`AreaManagerModal`) on `ProcessesPage`.
-   **Root Execution:** `concurrently` setup in root `package.json` to run frontend/backend with `npm run dev`.
-   **Documentation:** Basic `README.md` created. You are here!

### Future Work / Improvements 🚧

-   **Authentication:**
    -   Implement real backend authentication (JWT, sessions, or OAuth).
    -   Create proper Login API endpoint.
    -   Protect backend routes based on authentication status.
    -   Securely store tokens/sessions on the frontend.
    -   Implement user registration / password reset flows.
-   **Authorization (RBAC):**
    -   Define user roles and permissions.
    -   Implement role-based access control on frontend and backend.
    -   Show/hide UI elements or restrict API actions based on roles.
-   **Users:**
    -   Implement a proper User model in the backend.
    -   Replace `related_users` text field with a relation to the User model (Many-to-Many likely).
    -   Build User Management UI.
-   **Database:**
    -   Implement robust database connection pooling.
    -   Refine database error handling in backend controllers.
    -   Consider more advanced migration strategies.
-   **Backend Validation:**
    -   Use a dedicated validation library (e.g., `joi`, `zod`, `express-validator`) for request bodies instead of manual checks.
-   **Frontend State Management:**
	- 	We have a LOT of useStates scattered around. This is a hell to maintain.
    -   Evaluate if Context API is sufficient or if a dedicated library (`Zustand`, `Redux Toolkit`) is needed for more complex global state.
    -   Consider using `React Query` or `SWR` for managing server state (API data caching, refetching, mutations).
-   **UI/UX Enhancements:**
    -   Implement toast notifications for success/error messages.
    -   Improve loading states (skeletons, spinners in specific areas).
    -   Add sorting, filtering, and pagination to tables (especially `ProcessTable`).
    -   Perform accessibility (a11y) audit and improvements.
    -   Refine mobile responsiveness. Currently it is almost unusable - the process table is extremely small.
-   **Visualizations Page:**
    -   Implement actual chart components using  `Chart.js`, `Plotly`, or another library.
    -   Define backend endpoints to provide data suitable for visualizations.
-   **Testing:**
    -   Add Unit Tests (frontend components/hooks/utils, backend controllers/services). (e.g., Vitest, Jest, React Testing Library).
    -   Add Integration Tests.
    -   Add End-to-End (E2E) Tests (e.g., Cypress, Playwright).
-   **Deployment:**
    -   Containerize applications using Docker (`Dockerfile`, `docker-compose.yml`).
    -   Set up CI/CD pipelines (e.g., GitHub Actions, GitLab CI).
-   **Documentation:**
    -   Generate API documentation (e.g., Swagger/OpenAPI).
    -   Consider component documentation (e.g., Storybook).
	-	Review all components for in-file documentation.
-   **Generative AI:**
    -   Explore integrating generative AI features (e.g., OpenAI API, Gemini API) for:
	-   Generating process descriptions or suggestions.
	-   Automating data entry or form filling.
	-   Possibly creating images for processes, if necessary.
    