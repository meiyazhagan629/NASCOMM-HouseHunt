# NASCOMM - HouseHunt - House Rent Management System

NASCOMM - HouseHunt is a full-stack house rental management platform connecting tenants, landlords, and administrators. It features property browsing, virtual tour previews, booking requests, owner management dashboards, and an admin panel.

---

## Tech Stack

- **Frontend**: React (Vite), Axios, Lucide Icons
- **Backend**: Node.js, Express, MongoDB (Mongoose), JWT, bcryptjs
- **Runtime / Package Manager**: Node.js or Bun (`npm` / `bun`)

---

## Project Structure

```text
NASCOMM/
├── client/              # Vite + React frontend application
│   ├── src/             # Components, pages, context, and API services
│   ├── .env.example     # Frontend environment template
│   └── package.json
├── server/              # Express backend API
│   ├── config/          # Database configuration
│   ├── controllers/     # Route logic for auth, properties, bookings, admin
│   ├── middleware/      # Auth verification & error handling
│   ├── models/          # Mongoose schemas (User, Property, Booking, Review)
│   ├── routes/          # API route definitions
│   ├── scripts/         # Test and verification scripts
│   ├── seed.js          # Database seeding script
│   ├── .env.example     # Backend environment template
│   └── server.js        # Express application entry point
├── .gitignore           # Root git ignore rules
├── package.json         # Workspace scripts
└── README.md
```

---

## Getting Started

### 1. Environment Setup

#### Backend (`server/.env`)
Copy the backend example file:
```bash
cp server/.env.example server/.env
```

Default variables:
```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://127.0.0.1:27017/househunt
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRE=7d
```

#### Frontend (`client/.env`)
Copy the frontend example file:
```bash
cp client/.env.example client/.env
```

Default variables:
```env
VITE_API_URL=http://localhost:5000
```

---

### 2. Installation

Install dependencies in both directories:

```bash
# Backend
cd server && npm install
# Or with Bun:
cd server && bun install

# Frontend
cd ../client && npm install
# Or with Bun:
cd ../client && bun install
```

---

### 3. Database Seeding

Ensure MongoDB is running locally on port `27017` (or update `MONGO_URI` in `server/.env`).

Seed initial users, landlords, and sample properties:
```bash
cd server
npm run seed
# Or with Bun:
bun run seed
```

**Default Test Accounts:**
- **Admin**: `admin@househunt.com` / `admin123`
- **Landlord**: `landlord@househunt.com` / `landlord123`
- **Tenant**: `tenant@househunt.com` / `tenant123`

---

### 4. Running the Application

#### Starting the Backend:
```bash
cd server
npm start
# Or with Bun:
bun run start
```
The backend API runs at: `http://localhost:5000`  
Health check: `http://localhost:5000/api/health`

#### Starting the Frontend:
```bash
cd client
npm run dev
# Or with Bun:
bun run dev
```
The frontend dev server runs at: `http://localhost:3000`

---

## API Overview

| Method | Endpoint | Description | Access |
|---|---|---|---|
| `GET` | `/api/health` | Service health status | Public |
| `POST` | `/api/auth/register` | Register new user (tenant/landlord) | Public |
| `POST` | `/api/auth/login` | Authenticate and obtain JWT | Public |
| `GET` | `/api/auth/me` | Fetch current user profile | Authenticated |
| `GET` | `/api/properties` | Search & filter property listings | Public |
| `GET` | `/api/properties/:id` | Get property details | Public |
| `POST` | `/api/properties` | Create new listing | Landlord / Admin |
| `POST` | `/api/bookings` | Book a property visit or rental | Tenant |
| `GET` | `/api/admin/stats` | Platform statistics | Admin |
