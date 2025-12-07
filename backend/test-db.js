
const dotenv = require('dotenv');
dotenv.config();

console.log('Testing DB Connection...');
if (process.env.DATABASE_URL) {
    console.log('DATABASE_URL length:', process.env.DATABASE_URL.length);
    console.log('DATABASE_URL starts:', process.env.DATABASE_URL.substring(0, 15));
} else {
    console.log('DATABASE_URL MISSING');
}

const { PrismaClient } = require('@prisma/client');

try {
    const prisma = new PrismaClient({
        datasources: {
            db: {
                url: process.env.DATABASE_URL
            }
        }
    });
    console.log('Prisma initialized');

    prisma.$connect()
        .then(() => {
            console.log('Connected to DB successfully!');
            return prisma.$disconnect();
        })
        .catch(err => {
            console.error('Failed to connect:', err);
            process.exit(1);
        });

} catch (e) {
    console.error('Initialization error:', e);
}
