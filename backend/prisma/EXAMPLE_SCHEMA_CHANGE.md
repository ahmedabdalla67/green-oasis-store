# Quick Example: Adding a Discount Field to Products

## Current Schema (Before)

```prisma
model Product {
  id             String      @id @default(uuid())
  name           String
  category       String
  description    String
  imageUrl       String
  price          Decimal
  weight         Decimal
  availableStock Int
  createdAt      DateTime    @default(now())
  updatedAt      DateTime    @updatedAt
  orderItems     OrderItem[]
}
```

## Modified Schema (After)

```prisma
model Product {
  id             String      @id @default(uuid())
  name           String
  category       String
  description    String
  imageUrl       String
  price          Decimal
  discount       Decimal?    @default(0)  // ✅ NEW: Discount percentage
  weight         Decimal
  availableStock Int
  featured       Boolean     @default(false)  // ✅ NEW: Featured product flag
  createdAt      DateTime    @default(now())
  updatedAt      DateTime    @updatedAt
  orderItems     OrderItem[]
}
```

## Steps to Apply

1. **Edit the file**: `backend/prisma/schema.prisma`
2. **Run migration**:
   ```bash
   npm run prisma:migrate
   # When prompted, enter: add_discount_and_featured_to_products
   ```
3. **Done!** The database is updated and Prisma Client is regenerated.

## Use in Code

```typescript
// Create product with new fields
const product = await prisma.product.create({
  data: {
    name: "Cactus Plant",
    category: "Indoor",
    description: "Beautiful cactus",
    imageUrl: "/images/cactus.jpg",
    price: 29.99,
    discount: 10,        // ✅ NEW FIELD
    featured: true,      // ✅ NEW FIELD
    weight: 0.5,
    availableStock: 50
  }
});

// Query featured products with discount
const featuredProducts = await prisma.product.findMany({
  where: {
    featured: true,
    discount: {
      gt: 0  // Greater than 0
    }
  }
});
```
