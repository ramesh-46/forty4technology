User Management Dashboard
A full-stack CRUD app for managing user profiles with React, Node.js, Express, and MongoDB.
Here’s a clear, structured breakdown of your README.md and API documentation for your React + Node.js + Express + MongoDB user management app. This covers the UI, API, and model structure in a concise, developer-friendly way.

User Management Dashboard
A full-stack CRUD app for managing user profiles with React, Node.js, Express, and MongoDB.

1. UI Representation
Frontend Overview

Tech Stack: React, React Router, Axios, Font Awesome Icons
Views:

Dashboard: Lists users in card/table view, with search, fetch, and CRUD actions.
Create User: Form to add new users.
Edit User: Modal to update user details.
User Details: Modal to view user info.



Key Components
ComponentPurposeDashboardMain page: Displays users, search, fetch buttons, and view toggles.UserCardCard UI for each user with edit/delete buttons.UserTableTable UI for users with edit/delete buttons.UserDetailModalModal to show detailed user info (ID, name, email, address, etc.).EditUserModalModal form to edit user details.CreateUserPageStandalone page to create new users.
UI Features

Responsive Design: Works on mobile/desktop.![Uploading image.png…]()

Interactive Elements: Hover effects, focus states, loading spinners.<img width="1920" height="1080" alt="Screenshot 2025-09-13 130218" src="https://github.com/user-attachments/assets/77f6ef94-5942-4a20-a845-25c19f1c283d" />

Validation: Form validation for email, phone, and required fields.
View Modes: Toggle between card and table layouts.


2. API Documentation
Base URL
http://localhost:5000/api/users
Endpoints
MethodEndpointDescriptionRequest BodyResponseGET/Get all usersNoneArray of user objects
GET/:idGet user by IDNoneUser object or 404 error
POST/Create a new userUser object (see model below)Created user object
PUT/:idUpdate user by IDUpdated user objectUpdated user object
DELETE/:idDelete user by IDNoneSuccess/failure message

Example Requests
Create User
 POST /api/users
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "1234567890",
  "company": "Acme Inc",
  "address": {
    "street": "123 Main St",
    "city": "New York",
    "zipcode": "10001",
    "geo": { "lat": "40.7128", "lng": "-74.0060" }
  }
}
<img width="1920" height="1080" alt="Screenshot 2025-09-13 130510" src="https://github.com/user-attachments/assets/f74ef851-0d95-4af8-971e-799016f24069" />
Update User
PUT /api/users/68c448c1d5fa9e28e4f3bae5
Content-Type: application/json

{
  "name": "John Smith",
  "email": "john.smith@example.com"
}
<img width="1920" height="1080" alt="Screenshot 2025-09-13 130616" src="https://github.com/user-attachments/assets/c60529b7-2cb7-4988-9802-4afc1f58455c" />

3. Data Model
User Schema (MongoDB)
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  company: { type: String, required: true },
  address: {
    street: String,
    city: String,
    zipcode: String,
    geo: {
      lat: String,
      lng: String
    }
  }
});
Example User Object
{
  "_id": "68c448c1d5fa9e28e4f3bae5",
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "1234567890",
  "company": "Acme Inc",
  "address": {
    "street": "123 Main St",
    "city": "New York",
    "zipcode": "10001",
    "geo": { "lat": "40.7128", "lng": "-74.0060" }
  }
}
4. Setup & Run
Prerequisites

Node.js (v14+)
MongoDB (local or Atlas)
React (v18+)Backend:
 Copycd backend
npm install express mongoose cors body-parser
node server.js

Frontend:
 Copycd frontend
npm install axios react-icons react-router-dom
npm start


Environment Variables

MONGODB_URI: Your MongoDB connection string.
PORT: Backend port (default: 5000).


5. Key Features

CRUD Operations: Full create, read, update, delete functio
nality.
Search & Filter: Search users by name, email, or ID.
<img width="1920" height="1080" alt="Screenshot 2025-09-13 130819" src="https://github.com/user-attachments/assets/5879c9ce-faba-47f8-b005-4fed404689c3" />
Responsive UI: Works on all devices.
Error Handling: Validates inputs and handles API errors gracefully.



