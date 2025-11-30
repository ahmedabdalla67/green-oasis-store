# Green Oasis Store - Setup & Run Guide

This guide will help you set up and run the Green Oasis Store application, which consists of a React frontend and an Express backend with PostgreSQL database.

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **npm** (comes with Node.js)
- **PostgreSQL** (v14 or higher) - [Download](https://www.postgresql.org/download/)
- **Git** (optional, for version control)

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Database

#### Create PostgreSQL Database

```bash
# Login to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE green_oasis_db;

# Exit psql
\q
```

#### Configure Environment Variables

```bash
# Copy the example env file
cp backend/.env.example backend/.env
```

Edit `backend/.env` and update with your database credentials:

```env
DATABASE_URL="postgresql://your_username:your_password@localhost:5432/green_oasis_db"
JWT_SECRET="your-super-secret-jwt-key"
PORT=3000
```

#### Run Database Migrations

```bash
# Generate Prisma Client
npm run prisma:generate

# Run migrations to create database tables
npm run prisma:migrate
```

### 3. Run the Application

#### Option A: Run Everything Together (Recommended)

```bash
npm run dev:all
```

This will start:
- **Frontend** on `http://localhost:5173`
- **Backend** on `http://localhost:3000`

#### Option B: Run Frontend and Backend Separately

**Terminal 1 - Frontend:**
```bash
npm run dev
```

**Terminal 2 - Backend:**
```bash
npm run dev:backend:watch
```

## 📝 Available Scripts

### Development Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start frontend development server (Vite) |
| `npm run dev:backend` | Start backend server once (ts-node) |
| `npm run dev:backend:watch` | Start backend with auto-reload (nodemon) |
| `npm run dev:all` | Start both frontend and backend together |

### Database Scripts

| Script | Description |
|--------|-------------|
| `npm run prisma:generate` | Generate Prisma Client |
| `npm run prisma:migrate` | Run database migrations |
| `npm run prisma:studio` | Open Prisma Studio (database GUI) |

### Build Scripts

| Script | Description |
|--------|-------------|
| `npm run build` | Build frontend for production |
| `npm run build:dev` | Build frontend in development mode |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |

## 🗄️ Database Management

### View Database with Prisma Studio

```bash
npm run prisma:studio
```

This opens a GUI at `http://localhost:5555` to view and edit your database.

### Reset Database

```bash
cd backend
npx prisma migrate reset
```

### Create New Migration

```bash
cd backend
npx prisma migrate dev --name your_migration_name
```

## 🌐 API Endpoints

Once the backend is running, you can access:

- **API Base URL**: `http://localhost:3000`
- **Health Check**: `http://localhost:3000/`
- **Auth Routes**: `http://localhost:3000/api/auth/*`
- **Products**: `http://localhost:3000/api/products/*`
- **Orders**: `http://localhost:3000/api/orders/*`
- **Shipping**: `http://localhost:3000/api/shipping-zones/*`
- **Admin**: `http://localhost:3000/api/admin/*`

## 🛠️ Troubleshooting

### Port Already in Use

If port 3000 or 5173 is already in use:

```bash
# Change backend port in backend/.env
PORT=3001

# Vite will automatically try the next available port
```

### Database Connection Error

1. Verify PostgreSQL is running:
   ```bash
   # Windows
   pg_ctl status
   
   # Or check services
   services.msc
   ```

2. Check your `DATABASE_URL` in `backend/.env`
3. Ensure the database exists:
   ```bash
   psql -U postgres -l
   ```

### Prisma Client Not Generated

```bash
npm run prisma:generate
```

### Module Not Found Errors

```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

## 📁 Project Structure

```
green-oasis-store/
├── backend/                 # Express backend
│   ├── prisma/             # Database schema and migrations
│   │   └── schema.prisma
│   ├── src/
│   │   ├── controllers/    # Route controllers
│   │   ├── routes/         # API routes
│   │   ├── utils/          # Utility functions
│   │   ├── app.ts          # Express app setup
│   │   └── server.ts       # Server entry point
│   ├── uploads/            # File uploads directory
│   └── .env                # Environment variables
├── src/                    # React frontend
├── public/                 # Static assets
└── package.json            # Dependencies and scripts
```

## 🔐 Default Admin Access

After running migrations, you may need to create an admin user. Check if there's a seed script or create one manually through the API.

## 📚 Tech Stack

### Frontend
- React 18
- TypeScript
- Vite
- Tailwind CSS
- shadcn/ui
- React Router
- TanStack Query

### Backend
- Node.js
- Express
- TypeScript
- Prisma ORM
- PostgreSQL
- JWT Authentication
- Multer (file uploads)

## 🤝 Need Help?

- Check the [Prisma Documentation](https://www.prisma.io/docs)
- Check the [Vite Documentation](https://vitejs.dev)
- Review the API routes in `backend/src/routes/`

---

**Happy Coding! 🌱**
