# 🗄️ Database Management Guide - Prisma

This guide shows you how to manage your database schema using Prisma ORM.

## 📍 Schema Location

Your database schema is defined in:
```
backend/prisma/schema.prisma
```

---

## ✏️ How to Modify the Database

### Step 1: Edit the Schema File

Open `backend/prisma/schema.prisma` and make your changes.

#### **Adding a New Column**

```prisma
model Product {
  id          Int      @id @default(autoincrement())
  name        String
  price       Float
  // ✅ Add a new column
  discount    Float?   @default(0)  // Optional field with default value
  createdAt   DateTime @default(now())
}
```

#### **Removing a Column**

```prisma
model Product {
  id          Int      @id @default(autoincrement())
  name        String
  price       Float
  // ❌ Delete this line to remove the column
  // oldField    String
  createdAt   DateTime @default(now())
}
```

#### **Adding a New Table (Model)**

```prisma
model Category {
  id          Int       @id @default(autoincrement())
  name        String
  description String?
  products    Product[] // Relation to Product
  createdAt   DateTime  @default(now())
}

model Product {
  id          Int       @id @default(autoincrement())
  name        String
  categoryId  Int       // Foreign key
  category    Category  @relation(fields: [categoryId], references: [id])
}
```

#### **Deleting a Table**

Simply remove the entire `model` block from the schema file.

---

### Step 2: Create a Migration

After editing the schema, create a migration:

```bash
npm run prisma:migrate
```

Or from the backend directory:

```bash
cd backend
npx prisma migrate dev --name your_migration_name
```

**Example migration names:**
- `add_discount_to_products`
- `remove_old_field`
- `create_categories_table`
- `add_user_roles`

This command will:
1. ✅ Compare your schema with the database
2. ✅ Generate SQL migration files
3. ✅ Apply changes to the database
4. ✅ Regenerate Prisma Client

---

### Step 3: Verify Changes

**Option A: Use Prisma Studio (Visual Database Browser)**
```bash
npm run prisma:studio
```
Opens at http://localhost:5555 - you can see all tables and data visually.

**Option B: Check Migration Files**
```
backend/prisma/migrations/
  └── 20231130_add_discount_to_products/
      └── migration.sql
```

---

## 🔧 Common Database Operations

### 1. **Add a New Column**

**Edit schema.prisma:**
```prisma
model User {
  id        Int      @id @default(autoincrement())
  email     String   @unique
  password  String
  // ✅ NEW: Add phone number
  phone     String?  // Optional field
  createdAt DateTime @default(now())
}
```

**Run migration:**
```bash
npm run prisma:migrate
# Enter name: add_phone_to_users
```

---

### 2. **Remove a Column**

**Edit schema.prisma:**
```prisma
model User {
  id        Int      @id @default(autoincrement())
  email     String   @unique
  password  String
  // ❌ REMOVED: oldField String
  createdAt DateTime @default(now())
}
```

**Run migration:**
```bash
npm run prisma:migrate
# Enter name: remove_old_field_from_users
```

⚠️ **Warning**: This will permanently delete data in that column!

---

### 3. **Rename a Column**

Prisma doesn't detect renames automatically. You need to use `@map`:

```prisma
model User {
  id           Int      @id @default(autoincrement())
  email        String   @unique
  fullName     String   @map("full_name") // Maps to existing 'full_name' column
  createdAt    DateTime @default(now())
}
```

Or manually create a migration:
```bash
cd backend
npx prisma migrate dev --create-only --name rename_column
```

Then edit the generated SQL file to add:
```sql
ALTER TABLE "User" RENAME COLUMN "old_name" TO "new_name";
```

Apply it:
```bash
npx prisma migrate dev
```

---

### 4. **Add a Relation Between Tables**

```prisma
model User {
  id       Int      @id @default(autoincrement())
  email    String   @unique
  orders   Order[]  // One user has many orders
}

model Order {
  id         Int      @id @default(autoincrement())
  userId     Int      // Foreign key
  user       User     @relation(fields: [userId], references: [id])
  totalAmount Float
  createdAt  DateTime @default(now())
}
```

```bash
npm run prisma:migrate
# Enter name: add_user_order_relation
```

---

### 5. **Change Column Type**

```prisma
model Product {
  id    Int    @id @default(autoincrement())
  price Decimal @db.Decimal(10, 2) // Changed from Float to Decimal
}
```

```bash
npm run prisma:migrate
# Enter name: change_price_to_decimal
```

---

## 🛠️ Useful Prisma Commands

| Command | Description |
|---------|-------------|
| `npm run prisma:migrate` | Create and apply migration |
| `npm run prisma:generate` | Regenerate Prisma Client |
| `npm run prisma:studio` | Open visual database browser |
| `cd backend && npx prisma migrate reset` | Reset database (⚠️ deletes all data) |
| `cd backend && npx prisma migrate status` | Check migration status |
| `cd backend && npx prisma db push` | Push schema without migration (dev only) |
| `cd backend && npx prisma db pull` | Pull schema from database |

---

## 📋 Field Type Reference

Common Prisma field types:

```prisma
model Example {
  // Numbers
  id          Int      @id @default(autoincrement())
  count       Int
  price       Float
  precise     Decimal  @db.Decimal(10, 2)
  
  // Text
  name        String
  description String?  // Optional (nullable)
  longText    String   @db.Text
  
  // Boolean
  isActive    Boolean  @default(true)
  
  // Dates
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  birthDate   DateTime?
  
  // JSON
  metadata    Json?
  
  // Enums
  status      Status   @default(PENDING)
  
  // Relations
  userId      Int
  user        User     @relation(fields: [userId], references: [id])
}

enum Status {
  PENDING
  ACTIVE
  COMPLETED
  CANCELLED
}
```

---

## 🔄 Complete Workflow Example

### Example: Add "Stock Quantity" to Products

**1. Edit `backend/prisma/schema.prisma`:**
```prisma
model Product {
  id          Int      @id @default(autoincrement())
  name        String
  price       Float
  stock       Int      @default(0)  // ✅ NEW FIELD
  createdAt   DateTime @default(now())
}
```

**2. Create migration:**
```bash
npm run prisma:migrate
# When prompted, enter: add_stock_to_products
```

**3. Verify in Prisma Studio:**
```bash
npm run prisma:studio
```

**4. Use in your code:**
```typescript
// The Prisma Client is automatically updated!
const product = await prisma.product.create({
  data: {
    name: "Plant",
    price: 29.99,
    stock: 100  // ✅ New field available
  }
});
```

---

## ⚠️ Important Notes

### Before Making Changes:

1. **Backup your data** if in production
2. **Test migrations** in development first
3. **Review generated SQL** in migration files
4. **Coordinate with team** if working with others

### After Making Changes:

1. ✅ Always run `npm run prisma:generate` to update Prisma Client
2. ✅ Restart your backend server to use the new schema
3. ✅ Update your TypeScript code to use new fields
4. ✅ Test your API endpoints

### Migration Files:

- Located in: `backend/prisma/migrations/`
- **Never edit** old migration files
- **Commit** migration files to version control
- Each migration has a timestamp and name

---

## 🚨 Troubleshooting

### "Migration failed"
```bash
# Check what went wrong
cd backend
npx prisma migrate status

# If needed, reset and try again (⚠️ loses data)
npx prisma migrate reset
```

### "Prisma Client not updated"
```bash
npm run prisma:generate
```

### "Database out of sync"
```bash
cd backend
npx prisma migrate dev
```

### "Need to rollback"
```bash
# Prisma doesn't support rollback directly
# You need to create a new migration that reverses the changes
```

---

## 📚 Additional Resources

- **Prisma Docs**: https://www.prisma.io/docs
- **Schema Reference**: https://www.prisma.io/docs/reference/api-reference/prisma-schema-reference
- **Migrations Guide**: https://www.prisma.io/docs/concepts/components/prisma-migrate

---

## 🎯 Quick Reference Card

```bash
# Make schema changes
1. Edit: backend/prisma/schema.prisma
2. Migrate: npm run prisma:migrate
3. Verify: npm run prisma:studio

# Common operations
Add column    → Add field to model → migrate
Remove column → Delete field → migrate
Add table     → Add model → migrate
Delete table  → Remove model → migrate
```

**Remember**: Always run migrations after schema changes! 🚀

---

## 📊 Data Management & Control

### 1. **Visual Management (Prisma Studio)**

The easiest way to view, add, edit, and delete data is using Prisma Studio.

```bash
npm run prisma:studio
```

- Opens a web interface at `http://localhost:5555`
- You can double-click cells to edit
- Click "Add record" to create new entries
- Select rows and click "Delete" to remove them
- **Save changes** by clicking the green "Save" button

### 2. **Seeding Initial Data**

We have created a seed script to populate your database with essential data (Admin, Shipping Zones, Sample Products).

**To run the seed script:**
```bash
npx prisma db seed
```

This will:
- Create default Shipping Zones (Cairo, Giza, Alexandria)
- Create an Admin user (username: `admin`, password: `adminpassword123`)
- Add sample Products

**When to use:**
- After resetting the database (`npx prisma migrate reset`)
- When setting up the project for the first time

### 3. **Resetting the Database**

If you want to wipe everything and start fresh:

```bash
cd backend
npx prisma migrate reset
```
*Note: This will delete all data, run migrations, and then automatically run the seed script.*

