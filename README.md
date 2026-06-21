# WAVES: AI-Powered Employee Wellbeing & Productivity Platform

This repository contains the complete source code for **WAVES**, a comprehensive platform designed to enhance employee wellbeing and productivity through a suite of modern, data-driven tools. The project has undergone a significant UI/UX overhaul and full-stack integration to provide a seamless, professional, and ready-to-use experience.

## 1. System Architecture

WAVES is built on a robust, decoupled architecture featuring modern frontends and powerful backends.

![Architecture Diagram](https://i.imgur.com/example-diagram.png)
*(Note: Placeholder for actual architecture diagram)*

#### Core Components
1.  **Public-Facing Homepage:** A new, responsive landing page for unauthenticated users, providing a clear product overview, feature highlights, and calls-to-action.
2.  **Personal Dashboard (React + Bottle API):** A private, interactive dashboard for employees, featuring a mood journal, goal tracker, and Kanban board. The UI is built with **React, TypeScript, and MUI**, enhanced with **Framer Motion** for smooth animations and `@dnd-kit` for drag-and-drop capabilities. The backend is a lightweight **Bottle** server.
3.  **Management Dashboard (React + FastAPI):** A professional dashboard for managers, offering an aggregated view of organization-wide wellness analytics, including KPIs, heatmaps, and trends. The UI is built with **React, TypeScript, and MUI**, and it connects to a robust **FastAPI** backend.

## 2. Key Features & Enhancements

This version introduces a comprehensive overhaul focused on user experience, performance, and full-stack integration.

| Feature                      | Before                                | After                                                                                             |
| ---------------------------- | ------------------------------------- | ------------------------------------------------------------------------------------------------- |
| **User Interface**           | Basic, functional UI                  | Modern, professional design with MUI, animated micro-interactions, and a consistent theme.        |
| **Homepage**                 | N/A (Direct to dashboard)             | New public-facing landing page with hero section, feature highlights, and onboarding guide.       |
| **Data Integration**         | Mock/placeholder data                 | All dashboards are now fully connected to live backend APIs with real-time data fetching.       |
| **Mobile Responsiveness**    | Limited / Inconsistent                | Fully responsive audit completed. All pages are optimized for various devices and breakpoints.    |
| **Error Handling**           | Basic alerts / console logs           | Comprehensive error handling with dedicated pages (404, 403, 500) and user-friendly notifications. |
| **Loading States**           | Simple "Loading..." text              | Skeleton loaders and spinners provide a polished user experience during data fetching.              |
| **Documentation**            | Outdated                              | Fully updated `README.md`, new component documentation, and user guides with screenshots.         |

---

## 3. Setup and Installation

### Prerequisites
-   Python 3.10+
-   Node.js 18+ and npm
-   A virtual environment tool (e.g., `venv`)

### Installation Steps

1.  **Clone the repository and set up the Python environment:**
    ```bash
    git clone <repository-url>
    cd <repository-name>
    python -m venv venv
    source venv/bin/activate  # On Windows: venv\Scripts\activate
    ```

2.  **Install Python Dependencies:**
    This installs dependencies for both the Bottle and FastAPI servers.
    ```bash
    pip install -r requirements.txt
    ```

3.  **Install Frontend Dependencies:**
    This project contains two separate Node.js frontends. You must install dependencies for both.

    - **Personal Dashboard (`agent_ui`):**
      ```bash
      npm install --prefix src/agent_ui/frontend
      ```
    - **Management Dashboard:**
      ```bash
      npm install --prefix src/management_dashboard
      ```

## 4. Running the Application

The WAVES platform consists of three main services that must be run concurrently in separate terminal sessions.

**1. Run the Management Dashboard Backend (FastAPI)**
This server provides wellness analytics data to the management dashboard.
```bash
# From the project root
uvicorn src.management_dashboard.server:app --reload --port 8001
```
-   **API Docs:** [http://127.0.0.1:8001/docs](http://127.0.0.1:8001/docs)

**2. Run the Personal Dashboard Backend (Bottle)**
This server provides API services for the personal kanban board and goals.
```bash
# From the project root
python src/agent_ui/main.py
```
-   **API available at:** `http://localhost:8080`

**3. Run the Frontend Development Servers**
-   **Personal Dashboard (`agent_ui`):**
    ```bash
    # From the project root
    npm run dev --prefix src/agent_ui/frontend
    ```
    -   Access at the URL provided by Vite (usually `http://localhost:5173`).

-   **Management Dashboard:**
    ```bash
    # From the project root
    npm run dev --prefix src/management_dashboard
    ```
    -   Access at the URL provided by Vite (usually `http://localhost:5174`).

---

## 5. UI/UX Overhaul & Screenshots

### Before & After

**Homepage:**
*Before:* N/A -> *After:*
`[Screenshot of new public-facing homepage (desktop)]`
`[Screenshot of new public-facing homepage (mobile)]`

**Personal Dashboard:**
*Before:*
`[Screenshot of old personal dashboard]`
*After:*
`[Screenshot of new personal dashboard with real data]`

**Management Dashboard:**
*Before:*
`[Screenshot of old management dashboard with mock data]`
*After:*
`[Screenshot of new management dashboard with real data]`

### Error Pages & Animations

-   **404 Not Found Page:** `[Screenshot of 404 page]`
-   **Loading Animation (GIF):** `[GIF demonstrating skeleton loaders]`
-   **Mobile Responsiveness (GIF):** `[GIF showing responsive navigation and layout]`

---

## 6. Development & Testing

### Running Tests
To ensure the integrity of the Python backend code, run the suite of unit tests:
```bash
python -m unittest discover tests
```

### Model Training (Optional)
For developers interested in retraining the ML models:
1.  **Generate Data:** `python src/data_training/synthetic_data_generator.py`
2.  **Preprocess Data:** `python src/data_training/preprocess_data.py`
3.  **Train Model:** `python scripts/train_model.py`
4.  **Validate Model:** `python scripts/validate_model.py`

## 7. Contributing
We welcome contributions! If you're interested in improving the platform, please fork the repository and submit a pull request.