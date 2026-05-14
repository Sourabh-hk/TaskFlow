# TaskFlow SaaS

TaskFlow is a modern, production-ready SaaS Task Management System built with a powerful MERN-like stack utilizing PostgreSQL. It features a fully responsive, aesthetically stunning UI built with React and Tailwind CSS, and a robust Node.js/Express backend.

## 🚀 Features

- **Secure Authentication**: JWT-based auth with bcrypt password hashing and strict validation.
- **Multi-User Task Management**: True SaaS architecture with complete data isolation between users.
- **Full CRUD Operations**: Create, Read, Update, and Delete tasks with real-time optimistic UI updates.
- **Advanced Filtering & Sorting**: Quickly find tasks by search, status, priority, and sort by various metrics.
- **Pagination**: Efficient server-side pagination for handling large datasets.
- **Premium UI/UX**: Dark-themed, modern interface with glassmorphism, smooth animations, and responsive design (mobile-first).
- **Responsive Dashboard**: Get a quick overview of your progress with interactive stats and charts.

## 🛠 Tech Stack

### Frontend
- **React 18**
- **Vite**
- **Tailwind CSS** (Custom dark brand palette)
- **React Router DOM v6**
- **Axios** (Centralized API client with interceptors)
- **Context API** (State management)
- **React Hot Toast** (Notifications)

### Backend
- **Node.js**
- **Express.js**
- **PostgreSQL**
- **Sequelize ORM**
- **JWT** (JSON Web Tokens)
- **Bcryptjs** (Password hashing)
- **Express Validator**
- **Helmet, CORS, Express Rate Limit** (Security)

## 📁 Project Structure

```
taskflow/
├── backend/                  # Node.js / Express API
│   ├── src/
│   │   ├── config/           # Database & environment configurations
│   │   ├── controllers/      # Route handlers
│   │   ├── middleware/       # Auth, error handling, validation
│   │   ├── migrations/       # Database migrations
│   │   ├── models/           # Sequelize models (User, Task)
│   │   ├── routes/           # Express routes
│   │   ├── seeders/          # Initial database seed data
│   │   ├── services/         # Business logic layer
│   │   ├── utils/            # Helpers (AppError, catchAsync, JWT)
│   │   ├── app.js            # Express app setup
│   │   └── server.js         # Entry point
│   ├── package.json
│   └── vercel.json           # Vercel deployment config
│
├── frontend/                 # React SPA
│   ├── src/
│   │   ├── components/       # Reusable UI components & Layouts
│   │   ├── context/          # AuthContext & TaskContext
│   │   ├── layouts/          # DashboardLayout
│   │   ├── pages/            # Page views (Dashboard, Tasks, Login, etc.)
│   │   ├── routes/           # Protected & Public route wrappers
│   │   ├── services/         # Axios API calls
│   │   ├── App.jsx           # Root component & Routing
│   │   ├── main.jsx          # React entry point
│   │   └── index.css         # Global Tailwind styles
│   ├── package.json
│   ├── tailwind.config.js    # Tailwind theme configuration
│   └── vite.config.js
```

## ⚙️ Local Development Setup

### Prerequisites
- Node.js (v18+ recommended)
- PostgreSQL (v14+ recommended)

### 1. Database Setup
Ensure PostgreSQL is running and create a database for the project:
```sql
CREATE DATABASE taskflow_db;
```

### 2. Backend Setup
```bash
cd backend
npm install
```

Configure environment variables:
Edit `backend/.env` and update the `DATABASE_URL` with your PostgreSQL credentials:
```env
PORT=5000
DATABASE_URL=postgresql://username:password@localhost:5432/taskflow_db
JWT_SECRET=your_super_secret_jwt_key_here_min_32_chars
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

Run database migrations and seed demo data:
```bash
npm run migrate
npm run seed
```

Start the backend development server:
```bash
npm run dev
```

### 3. Frontend Setup
```bash
cd frontend
npm install
```

Ensure environment variables are set:
`frontend/.env`:
```env
VITE_API_BASE_URL=http://localhost:5000/api
```

Start the frontend development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`.

### Demo Accounts
If you ran `npm run seed`, you can log in with:
- **Email**: `alice@example.com` | **Password**: `Password@123`
- **Email**: `bob@example.com` | **Password**: `Password@123`

## 🌍 Deployment Guide

### Database (Render or Supabase)
1. Provision a PostgreSQL instance.
2. Get the external connection string (Database URL).

### Backend (Render)
1. Create a new "Web Service" on Render.
2. Connect your repository.
3. Set the Root Directory to `backend`.
4. Build Command: `npm install && npm run migrate` (Note: run migrations during build).
5. Start Command: `npm start`.
6. Add Environment Variables (`DATABASE_URL`, `JWT_SECRET`, `CLIENT_URL`, etc.).

### Frontend (Vercel)
1. Import your repository into Vercel.
2. Set the Root Directory to `frontend`.
3. Framework Preset: Vite.
4. Build Command: `npm run build`.
5. Output Directory: `dist`.
6. Add Environment Variables (`VITE_API_BASE_URL` pointing to your Render backend URL).
7. Deploy!
