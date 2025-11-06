# Backend

This is the backend of the Dynamic Form Builder application, built with Node.js, Express, and MongoDB.

## Development

To run the backend in development mode:

1.  Navigate to the `backend` directory.
2.  Install the dependencies:

    ```bash
    npm install
    ```

3.  Create a `.env` file with the following variables:

    ```
    MONGO_URI=mongodb://localhost:27017/formbuilder
    ADMIN_TOKEN=mysecuretoken
    PORT=5000
    ```

4.  Run the development server:

    ```bash
    npm run dev
    ```

The backend will be available at `http://localhost:5000`.
