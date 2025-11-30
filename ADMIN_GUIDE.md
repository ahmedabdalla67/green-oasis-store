# How to Run the Admin Dashboard

## 🚀 Quick Start

### Step 1: Start the Application

You have **three options** to run the application:

#### **Option A: Run Everything Together (Recommended)**
```bash
npm run dev:all
```
This starts both frontend (port 8080) and backend (port 3000) simultaneously.

#### **Option B: Run Separately**

**Terminal 1 - Frontend:**
```bash
npm run dev
```

**Terminal 2 - Backend:**
```bash
npm run dev:backend:watch
```

#### **Option C: Use the Batch File (Windows)**
Double-click `start.bat` in the project root.

---

### Step 2: Access the Admin Dashboard

1. **Open your browser** and go to:
   ```
   http://localhost:8080/admin
   ```

2. **Login with admin credentials**
   - The login page will appear at `/admin`
   - After successful login, you'll be redirected to `/admin/dashboard`

3. **Admin Dashboard Features:**
   - **نظرة عامة (Overview)**: Statistics and recent orders
   - **المنتجات (Products)**: Manage products
   - **الطلبات (Orders)**: View and manage orders
   - **مناطق الشحن (Shipping)**: Configure shipping zones
   - **الاستشارات (Consultations)**: Handle customer consultations
   - **الإعدادات (Settings)**: Admin settings

---

## 🔐 Admin Routes

| Route | Description |
|-------|-------------|
| `/admin` | Admin login page |
| `/admin/dashboard` | Admin dashboard (requires authentication) |

---

## 🛠️ Backend API Endpoints

The backend provides these admin-related endpoints:

### Admin Authentication
- `POST /api/auth/login` - Admin login
- `POST /api/auth/register` - Create admin account

### Admin Management
- `GET /api/admin/*` - Various admin operations
- Protected routes require JWT authentication

---

## 📋 First Time Setup Checklist

- [ ] Install dependencies: `npm install`
- [ ] Set up PostgreSQL database
- [ ] Configure `backend/.env` file
- [ ] Run Prisma migrations: `npm run prisma:migrate`
- [ ] Generate Prisma Client: `npm run prisma:generate`
- [ ] Create admin user (via API or database)
- [ ] Start the application: `npm run dev:all`
- [ ] Access admin panel: `http://localhost:8080/admin`

---

## 🔧 Troubleshooting

### Backend Not Starting

If you see `TypeError: Unknown file extension ".ts"`:
```bash
# The package.json has been updated with the fix
npm run dev:backend:watch
```

### Port Already in Use

**Frontend (Vite):**
- Vite automatically uses the next available port
- Default is 5173, but may use 8080 or others

**Backend:**
- Change `PORT` in `backend/.env`
- Default is 3000

### Admin Login Not Working

1. Check if backend is running: `http://localhost:3000`
2. Verify database connection in `backend/.env`
3. Ensure Prisma Client is generated: `npm run prisma:generate`
4. Check if admin user exists in database

### Database Connection Error

```bash
# View database with Prisma Studio
npm run prisma:studio

# Reset database if needed
cd backend
npx prisma migrate reset
```

---

## 🎯 Development Workflow

1. **Start Development:**
   ```bash
   npm run dev:all
   ```

2. **Make Changes:**
   - Frontend changes auto-reload (Vite HMR)
   - Backend changes auto-reload (nodemon)

3. **Access Admin:**
   - Navigate to `http://localhost:8080/admin`
   - Login with credentials
   - Manage your store!

4. **View Database:**
   ```bash
   npm run prisma:studio
   ```
   Opens at `http://localhost:5555`

---

## 📱 Admin Dashboard Features

### Overview Tab
- Total products count
- Total orders count
- Pending consultations
- Shipping zones count
- Recent orders list

### Products Tab
- Add new products
- Edit existing products
- Delete products
- Upload product images
- Manage inventory

### Orders Tab
- View all orders
- Update order status
- Track shipping
- Customer information

### Shipping Tab
- Configure governorates
- Set delivery areas
- Manage shipping costs

### Consultations Tab
- View customer inquiries
- Respond to consultations
- Mark as resolved

### Settings Tab
- Admin profile settings
- System configuration

---

## 🌐 URLs Summary

| Service | URL |
|---------|-----|
| **Frontend** | http://localhost:8080 |
| **Admin Login** | http://localhost:8080/admin |
| **Admin Dashboard** | http://localhost:8080/admin/dashboard |
| **Backend API** | http://localhost:3000 |
| **Prisma Studio** | http://localhost:5555 |

---

**Happy Managing! 🌱**
