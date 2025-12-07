import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Starting seeding...');

    // 1. Create Shipping Zones
    console.log('Creating shipping zones...');
    await prisma.shippingZone.upsert({
        where: { governorate: 'Cairo' },
        update: {},
        create: {
            governorate: 'Cairo',
            cost: 50.00,
        },
    });

    await prisma.shippingZone.upsert({
        where: { governorate: 'Giza' },
        update: {},
        create: {
            governorate: 'Giza',
            cost: 50.00,
        },
    });

    await prisma.shippingZone.upsert({
        where: { governorate: 'Alexandria' },
        update: {},
        create: {
            governorate: 'Alexandria',
            cost: 75.00,
        },
    });

    // 2. Create Admin User
    console.log('Creating admin user...');
    await prisma.admin.upsert({
        where: { username: 'admin' },
        update: {},
        create: {
            username: 'admin',
            password: 'adminpassword123',
        },
    });

    // 3. Create Products
    console.log('Creating products...');

    const products = [
        {
            name: 'Monstera Deliciosa',
            category: 'Indoor Plants',
            description: 'The Swiss Cheese Plant is a species of flowering plant native to tropical forests of southern Mexico, south to Panama.',
            imageUrl: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&q=80&w=800',
            price: 350.00,
            weight: 1.5,
            availableStock: 20,
        },
        {
            name: 'Snake Plant',
            category: 'Indoor Plants',
            description: 'Sansevieria trifasciata is a species of flowering plant in the family Asparagaceae, native to tropical West Africa from Nigeria east to the Congo.',
            imageUrl: 'https://images.unsplash.com/photo-1599598425947-735d56d97165?auto=format&fit=crop&q=80&w=800',
            price: 200.00,
            weight: 1.0,
            availableStock: 15,
        },
        {
            name: 'Peace Lily',
            category: 'Indoor Plants',
            description: 'Spathiphyllum is a genus of about 47 species of monocotyledonous flowering plants in the family Araceae, native to tropical regions of the Americas and southeastern Asia.',
            imageUrl: 'https://images.unsplash.com/photo-1593696954577-ab3d39317b97?auto=format&fit=crop&q=80&w=800',
            price: 280.00,
            weight: 1.2,
            availableStock: 25,
        },
        {
            name: 'Ceramic Pot',
            category: 'Pots',
            description: 'A beautiful white ceramic pot perfect for indoor plants.',
            imageUrl: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&q=80&w=800',
            price: 120.00,
            weight: 0.8,
            availableStock: 50,
        }
    ];

    for (const product of products) {
        const existing = await prisma.product.findFirst({
            where: { name: product.name }
        });

        if (!existing) {
            await prisma.product.create({
                data: product
            });
        }
    }

    console.log('✅ Seeding finished.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
