# Smart Coordinator-Centric LMS Backend

A Node.js backend for the Smart Coordinator-Centric Learning Management System.

## Prerequisites

- Node.js (v14 or higher)
- MySQL (v8.0 or higher)
- npm (Node Package Manager)

## Setup Instructions

1. Clone the repository and navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory with the following variables:
   ```
   DB_HOST=localhost
   DB_USER=your_mysql_username
   DB_PASS=your_mysql_password
   DB_NAME=smart_lms
   JWT_SECRET=your_jwt_secret_key
   PORT=5000
   ```

4. Set up the database:
   - Open MySQL command line or MySQL Workbench
   - Run the SQL commands from `database.sql`

5. Start the server:
   ```bash
   npm start
   ```

## API Endpoints

### Authentication
- `POST /api/auth/login`
  - Body: `{ "username": "string", "password": "string" }`
  - Returns: JWT token and user information

### Dashboard
- `GET /api/dashboard/admin` (Admin only)
- `GET /api/dashboard/coordinator` (Coordinator only)
- `GET /api/dashboard/student` (Student only)

## Authentication

All protected routes require a JWT token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

## Sample Users

The database comes with three sample users:
- Admin: username: `admin`, password: `password123`
- Coordinator: username: `coordinator`, password: `password123`
- Student: username: `student`, password: `password123`

## Error Handling

The API uses standard HTTP status codes:
- 200: Success
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Internal Server Error 