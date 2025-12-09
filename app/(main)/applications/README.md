# Applications Feature Documentation

This document explains how the **Applications Feature** works in the **Mirai Mentor** project. It includes both the High-Level Design (HLD) and Low-Level Design (LLD).

## High-Level Design (HLD)

### What is this feature?

The Applications feature helps users track their job applications in one place. Users can add new job applications, view them in a list, update their status (like "Applied" or "Interview"), and delete them if needed. It also has a special "Quick Add" feature that uses AI to read job descriptions and fill in the details automatically.

### Architecture Overview

The feature is built using **Next.js** and follows a standard web application architecture:

1.  **User Interface (Frontend):** The specific pages and buttons users interact with.
2.  **Server Actions (Backend Logic):** Functions that run on the server to handle data (saving, updating, deleting).
3.  **Database:** Organized storage (PostgreSQL) where all application data is kept.

### Key Workflows

- **Viewing Applications:** user visits the applications page -> server fetches their data -> page displays it in a table.
- **Adding an Application:** user clicks "Add" -> fills a form -> server saves it to the database.
- **Quick Add with AI:** user pastes a job description -> AI extracts info -> fills the form for the user.
- **Updating Status:** user selects a new status -> server updates the record and logs the change.

---

## Low-Level Design (LLD)

This section explains the specific code components and how they talk to each other.

### 1. Database Schema (Data Model)

We use **Prisma** to manage our database. The main changes happen in the `Application` table.

- **`Application` Table:** Stores the core details.
  - `id`: Unique ID for the application.
  - `companyName`: Name of the company.
  - `jobTitle`: The role being applied for.
  - `status`: Current state (e.g., WISHLIST, APPLIED, INTERVIEW).
  - `jobType`: Full-time, Intern, Remote, etc.
- **`ApplicationStatusHistory` Table:** Keeps a log every time a status changes, so users can see their progress over time.

### 2. Server Actions (`actions/application.js`)

These are the backend functions that handle the logic:

- **`getApplications(filters)`**: Fetches the list of applications for the current user. It can filter by status.
- **`createApplication(data)`**: Creates a new entry in the database.
- **`updateApplication(id, data)`**: Updates details of an existing application.
- **`updateApplicationStatus(id, status)`**: specialized function that updates the status AND adds an entry to the `ApplicationStatusHistory` table.
- **`deleteApplication(id)`**: Removes the application and any attached resume files.
- **`parseJobDetails(content)`**: Uses **Google Gemini AI** to read text input and extract company name, job title, etc.

### 3. UI Components (`app/(main)/applications/`)

#### `page.jsx` (Server Component)

- **Role:** The main container.
- **Action:** It calls `getApplications` to fetch data before the page loads.
- **Render:** Passes the data to the `ApplicationsList` component.

#### `_components/applications-list.jsx` (Client Component)

- **Role:** Displays the table of applications.
- **Features:**
  - **Filtering:** Filters by status or search text locally.
  - **Dropdown Actions:** Allows users to change status or delete an item directly from the table.
  - **Status Colors:** Uses a helper map to show different colors for different statuses (e.g., Green for Offer, Red for Rejected).

#### `_components/quick-add-dialog.jsx`

- **Role:** A pop-up modal for the AI feature.
- **Flow:**
  1.  User enters text (URL or description).
  2.  Calls `parseJobDetails` action.
  3.  Passes the AI result to the `ApplicationForm` so the user can review it before saving.

### 4. Code Flow Example: Updating a Status

1.  User clicks "Mark as Interview" in `ApplicationsList`.
2.  `handleStatusChange` function is called.
3.  It calls the server action `updateApplicationStatus(id, 'INTERVIEW')`.
4.  Database is updated:
    - `status` field becomes "INTERVIEW".
    - New row added to `ApplicationStatusHistory`.
5.  `router.refresh()` is triggered to reload the data and show the new status on screen.
