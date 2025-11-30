# 🔧 Database Setup Instructions

## Problem: "No tables found" in Prisma Studio

This happens because the database tables haven't been created yet. Follow these steps:

---

## Step 1: Check Environment Variables

Ensure `backend/.env` exists and contains:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/green_oasis_db"
JWT_SECRET="your-secret-key-change-this"
PORT=3000
```

**Replace:**
- `username` - Your PostgreSQL username (usually `postgres`)
- `password` - Your PostgreSQL password
- `green_oasis_db` - Database name (you can change this)

---

## Step 2: Create the Database

Open PostgreSQL command line:

```bash
# Windows: Open Command Prompt or PowerShell
psql -U postgres

# Then run:
CREATE DATABASE green_oasis_db;

# Exit psql
\q
```

**Alternative:** Use pgAdmin or any PostgreSQL GUI tool to create the database.

---

## Step 3: Run the Initial Migration

This creates all the tables in your database:

```bash
npm run prisma:migrate
```

When prompted for a migration name, enter: `initial_schema`

This will:
- ✅ Create all tables (User, Admin, Product, Order, etc.)
- ✅ Set up relationships
- ✅ Generate Prisma Client

---

## Step 4: Verify Tables Were Created

```bash
npm run prisma:studio
```

You should now see all your tables:
- User
- Admin
- Product
- Order
- OrderItem
- ShippingZone

---

## Troubleshooting

### Error: "Can't reach database server"

**Check if PostgreSQL is running:**
```bash
# Windows - Check services
services.msc
# Look for "postgresql" service
```

**Or verify connection:**
```bash
psql -U postgres -l
```

### Error: "Database does not exist"

Create the database first:
```bash
psql -U postgres
CREATE DATABASE green_oasis_db;
\q
```

### Error: "Authentication failed"

Check your `DATABASE_URL` in `backend/.env`:
- Username is correct
- Password is correct
- Database name exists

---

## Quick Commands Reference

```bash
# 1. Create database (in psql)
CREATE DATABASE green_oasis_db;

# 2. Run migration
npm run prisma:migrate

# 3. View tables
npm run prisma:studio

# 4. Reset database (if needed - deletes all data!)
cd backend
npx prisma migrate reset
```

---

## What Gets Created

After running the migration, you'll have these tables:

| Table | Description |
|-------|-------------|
| **User** | Customer accounts |
| **Admin** | Admin accounts |
| **Product** | Store products |
| **Order** | Customer orders |
| **OrderItem** | Individual items in orders |
| **ShippingZone** | Shipping costs by governorate |

---

## Next Steps After Setup

1. ✅ Tables are created
2. Create an admin user (via API or Prisma Studio)
3. Add some products
4. Start using the application!

---

**Need help?** Check `DATABASE_MANAGEMENT_GUIDE.md` for more details.
