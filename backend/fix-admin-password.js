const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');
require('dotenv').config();

const prisma = new PrismaClient();

async function main() {
    const hashedPassword = await bcrypt.hash('admin123', 10);
    console.log('Hashed password:', hashedPassword);

    // Update the admin with the hashed password
    const admin = await prisma.admin.update({
        where: { username: 'admin' },
        data: { password: hashedPassword },
    });

    console.log('Admin updated:', admin.username);
    console.log('Password is now hashed!');
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
