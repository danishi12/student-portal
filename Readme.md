# Student Portal

This is a simple student portal application that helps students manage their assignments and schedules efficiently.

## Project Structure

```
.bolt/            - Bolt project configuration directory
  config.json    - Configuration for the Bolt project template
.gitignore        - Specifies files to ignore in Git
.vscode/          - VS Code settings directory
  settings.json  - Configuration for the VS Code Live Server extension
assignments.html  - HTML page for managing assignments
counter.js        - JavaScript file for counters (if used in the project)
index.html        - Main entry point of the application
main.js           - Handles DOM interactions and functionality
package.json      - Contains project metadata and scripts
public/           - Public assets directory (if applicable)
Readme.md         - Project documentation
schedule.html     - HTML page for the schedule section
style.css         - Styles for the application

### Project Hierarchy

```
Project Directory
|
├── .bolt/
│   └── config.json
├── .vscode/
│   └── settings.json
├── assignments.html
├── counter.js
├── index.html
├── main.js
├── package.json
├── public/
├── Readme.md
├── schedule.html
└── style.css
```

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (Ensure it's installed on your system)
- npm (comes bundled with Node.js)

### Installation

1. Clone the repository or download the project files.
2. Navigate to the project directory:

   ```bash
   cd <project-directory>
   ```

3. Install the required dependencies:

   ```bash
   npm install
   ```

4. Start the development server:

   ```bash
   npm run dev
   ```

5. Build the project for production:

   ```bash
   npm run build
   ```

## Project Files

### `index.html`

The main entry point of the application. It includes:
- Navigation bar
- Hero section
- Dashboard
- Quick actions

### `style.css`

Contains styles for the application, including:
- Navigation bar
- Hero section
- Dashboard
- Assignments
- Schedule
- Quick actions
- Modal
- Responsive design

### `main.js`

Handles the DOM interactions and functionality, including:
- Toggling the mobile navigation menu
- Opening and closing modals
- Submitting the assignment form
- Formatting dates
- Showing notifications
- Initializing the current date in the schedule
- Handling quick action buttons

### Key Functionalities in `main.js`

- **Mobile Navigation**: Toggles the mobile navigation menu.
- **Modal Operations**: Opens and closes the modal for adding assignments.
- **Form Submission**: Submits new assignments and updates the UI dynamically.
- **Date Formatting**: Formats dates for display in the UI.
- **Notifications**: Displays temporary success/error messages to the user.
- **Schedule Management**: Highlights past events in the schedule.
- **Quick Actions**: Links to schedule page, and provides placeholders for additional features.

### `assignments.html`

A simple HTML page for the assignments section.

### `schedule.html`

A simple HTML page for the schedule section.

### `.vscode/settings.json`

Configuration for the VS Code Live Server extension.

### `.bolt/config.json`

Configuration file for the Bolt project template.

### `package.json`

Contains project metadata and scripts for development, building, and previewing the project.

## Usage

1. Run the development server using `npm run dev`.
2. Access the application via the browser at the specified development server URL.
3. Navigate between the pages (e.g., assignments, schedule) and use the features provided.
4. Build the project using `npm run build` for production deployment.

## Features

- **Assignments Management**: Track and manage your assignments.
- **Schedule Management**: Organize your schedule efficiently.
- **Responsive Design**: Optimized for both desktop and mobile views.
- **Quick Actions**: Access essential features directly from the dashboard.

