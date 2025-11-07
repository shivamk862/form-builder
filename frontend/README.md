# Frontend - Dynamic Form Builder

This is the frontend for the Dynamic Form Builder application, built with React, Vite, and TypeScript.

## Features

### Admin Panel

- Create, edit, and delete forms.
- Add, edit, delete, and reorder fields within a form.
- Define validation rules (required, min, max, regex) for fields.
- Define conditional logic for fields (show/hide based on other field values).
- View and filter form submissions.
- Export submissions as CSV.
- Download uploaded files from submissions.

### User Form View

- Dynamically renders forms based on the definition from the backend.
- Supports conditional fields.
- Client-side validation hints (server-side validation is the source of truth).
- File uploads.

## Local Development (Without Docker)

1. **Navigate to the frontend directory:**
   ```sh
   cd frontend
   ```

2. **Install dependencies:**
   ```sh
   npm install
   ```

3. **Run the development server:**
   ```sh
   npm run dev
   ```
   The frontend application will be available at `http://localhost:5173`.
