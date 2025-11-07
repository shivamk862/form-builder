# Dynamic Form Builder

This is a full-stack application that allows administrators to create dynamic forms with configurable fields and validations. Users can then view these forms, fill them out, and submit them.

## Features

- **Dynamic Form Creation:** Admins can create forms with various field types (text, number, email, file, etc.).
- **Conditional Logic:** Show or hide fields based on the values of other fields.
- **Server-Side Validation:** Enforce validation rules (required, min, max, regex) on the backend.
- **Submission Management:** View, filter, and export form submissions as CSV.
- **File Uploads:** Supports file uploads, which are stored in MongoDB.
- **Dockerized:** The entire application (backend, frontend, and database) can be run with a single Docker command.

## Prerequisites

- [Docker](https://www.docker.com/products/docker-desktop) must be installed and running on your machine.

## How to Run

1. **Clone the repository:**
   ```sh
   git clone <repository-url>
   cd <repository-folder>
   ```

2. **Run the application with Docker Compose:**
   Open a terminal in the root directory of the project and run:
   ```sh
   docker-compose up --build
   ```
   - The `--build` flag will rebuild the Docker images if there are any code changes.

3. **Access the application:**
   - The frontend will be available at: **http://localhost:5173**
   - The backend API will be available at: **http://localhost:5000**

## Local Development (Without Docker)

For instructions on how to run the backend and frontend services locally without Docker, please see the `README.md` files in the `backend` and `frontend` directories.