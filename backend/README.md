# Backend - Dynamic Form Builder

This is the backend service for the Dynamic Form Builder application, built with Node.js, Express, and MongoDB.

## Features

- RESTful API for managing forms, fields, and submissions.
- Server-side validation based on configurable field rules.
- Conditional field logic.
- File uploads handled with Multer and stored in MongoDB.
- CSV export for submissions.
- Basic authentication for admin routes.

## API Endpoints

### Public Routes

- `GET /api/forms`: List all forms.
- `GET /api/forms/:id`: Get a single form by its ID.
- `POST /api/forms/:id/submit`: Submit a form.

### Admin Routes (Authentication Required)

- `POST /api/admin/login`: Login for admin users.
- `POST /api/admin/forms`: Create a new form.
- `PUT /api/admin/forms/:id`: Update a form.
- `DELETE /api/admin/forms/:id`: Delete a form.
- `POST /api/admin/forms/:id/fields`: Add a field to a form.
- `PUT /api/admin/forms/:id/fields/:fieldId`: Update a field in a form.
- `DELETE /api/admin/forms/:id/fields/:fieldId`: Delete a field from a form.
- `GET /api/admin/forms/:id/submissions`: Get all submissions for a form (with pagination).
- `GET /api/admin/forms/:id/submissions/export`: Export submissions as CSV.
- `GET /api/admin/submissions/:id/file`: Download a submitted file.

## Environment Variables

Create a `.env` file in the `backend` directory with the following variables:

```
MONGO_URI=mongodb://localhost:27017/formbuilder
PORT=5000
ADMIN_USERNAME=admin
ADMIN_PASSWORD=password
```

## Local Development (Without Docker)

1. **Navigate to the backend directory:**
   ```sh
   cd backend
   ```

2. **Install dependencies:**
   ```sh
   npm install
   ```

3. **Run the development server:**
   ```sh
   npm run dev
   ```
   The backend server will start on `http://localhost:5000`.