# 🚀 How to Run the Green Oasis Store

## Quick Start Guide

### ✅ Prerequisites Checklist
- [ ] Node.js installed
- [ ] PostgreSQL installed and running
- [ ] Dependencies installed (`npm install`)
- [ ] Database configured in `backend/.env`
- [ ] Prisma Client generated

---

## 📝 Step-by-Step Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Up Environment Variables
Copy the example file and configure your database:
```bash
cp backend/.env.example backend/.env
```

Edit `backend/.env`:
```env
DATABASE_URL="postgresql://username:password@localhost:5432/green_oasis_db"
JWT_SECRET="your-secret-key"
PORT=3000
```

### 3. Set Up Database
```bash
# Generate Prisma Client
npm run prisma:generate

# Run migrations
npm run prisma:migrate
```

### 4. Run the Application

**Option A: Run Everything Together (Recommended)**
```bash
npm run dev:all
```

**Option B: Run Separately**

Terminal 1 - Frontend:
```bash
npm run dev
```

Terminal 2 - Backend:
```bash
npm run dev:backend:watch
```

**Option C: Windows Batch File**
```bash
start.bat
```

---

## 🌐 Access the Application

| Service | URL |
|---------|-----|
| **Frontend (Customer)** | http://localhost:8080 |
| **Admin Login** | http://localhost:8080/admin |
| **Admin Dashboard** | http://localhost:8080/admin/dashboard |
| **Backend API** | http://localhost:3000 |
| **Prisma Studio** | http://localhost:5555 (run `npm run prisma:studio`) |

---

## 🎯 Admin Dashboard Access

1. **Navigate to**: http://localhost:8080/admin
2. **Login** with your admin credentials
3. **Access Dashboard** at: http://localhost:8080/admin/dashboard

### Admin Dashboard Features:
- **نظرة عامة (Overview)**: Statistics and recent orders
- **المنتجات (Products)**: Manage products, add/edit/delete
- **الطلبات (Orders)**: View and manage customer orders
- **مناطق الشحن (Shipping)**: Configure shipping zones and costs
- **الاستشارات (Consultations)**: Handle customer inquiries
- **الإعدادات (Settings)**: Admin settings

---

## 📜 Available Scripts

### Development
| Command | Description |
|---------|-------------|
| `npm run dev` | Start frontend only (Vite) |
| `npm run dev:backend` | Start backend only |
| `npm run dev:backend:watch` | Start backend with auto-reload |
| **`npm run dev:all`** | **Start both frontend & backend** ⭐ |

### Database
| Command | Description |
|---------|-------------|
| `npm run prisma:generate` | Generate Prisma Client |
| `npm run prisma:migrate` | Run database migrations |
| `npm run prisma:studio` | Open Prisma Studio (DB GUI) |

### Build
| Command | Description |
|---------|-------------|
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |

---

## 🛠️ Troubleshooting

### Backend Won't Start
- Check if PostgreSQL is running
- Verify `DATABASE_URL` in `backend/.env`
- Run `npm run prisma:generate`

### Port Already in Use
- Frontend: Vite will auto-select next available port
- Backend: Change `PORT` in `backend/.env`

### Database Connection Error
```bash
# Check if database exists
psql -U postgres -l

# Reset database if needed
cd backend
npx prisma migrate reset
```

### Admin Login Issues
- Ensure backend is running
- Check database for admin user
- Verify JWT_SECRET is set in `backend/.env`

---

## 📁 Project Structure

```
green-oasis-store/
├── backend/                    # Express backend
│   ├── prisma/                # Database schema
│   │   └── schema.prisma
│   ├── src/
│   │   ├── controllers/       # API controllers
│   │   ├── routes/            # API routes
│   │   ├── utils/             # Utilities
│   │   ├── app.ts             # Express app
│   │   └── server.ts          # Server entry
│   ├── uploads/               # File uploads
│   ├── .env                   # Environment variables
│   └── nodemon.json           # Nodemon config
├── src/                       # React frontend
│   ├── components/            # UI components
│   │   └── admin/             # Admin components
│   ├── pages/                 # Pages
│   │   └── admin/             # Admin pages
│   ├── contexts/              # React contexts
│   └── App.tsx                # Main app
├── package.json               # Dependencies & scripts
├── start.bat                  # Windows quick start
├── SETUP_GUIDE.md             # Detailed setup guide
└── ADMIN_GUIDE.md             # Admin dashboard guide
```

---

## 🔐 Creating Admin User

You'll need to create an admin user to access the dashboard. This can be done via:
1. API endpoint: `POST /api/auth/register`
2. Directly in the database using Prisma Studio
3. Database seed script (if available)

---

## 📚 Additional Resources

- **Setup Guide**: See `SETUP_GUIDE.md` for detailed instructions
- **Admin Guide**: See `ADMIN_GUIDE.md` for admin dashboard details
- **Backend Config**: `backend/nodemon.json` for nodemon settings
- **Environment Template**: `backend/.env.example`

---

## 🎉 You're Ready!

Run `npm run dev:all` and access:
- **Customer Store**: http://localhost:8080
- **Admin Panel**: http://localhost:8080/admin

**Happy Selling! 🌱**
