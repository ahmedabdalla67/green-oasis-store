
import { PrismaClient } from '@prisma/client';

// Use default configuration which picks up DATABASE_URL from environment
const prisma = new PrismaClient({
    log: ['warn', 'error'], // Optional: Add logging to see engine activity
});

export default prisma;
