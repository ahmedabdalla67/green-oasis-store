import { Request, Response } from 'express';
import prisma from '../lib/prisma';
import { hashPassword, comparePassword } from '../utils/password';
import { generateToken } from '../utils/jwt';
import { z } from 'zod';

const registerSchema = z.object({
    name: z.string().min(2),
    phone: z.string().min(10),
    password: z.string().min(6),
});

const loginSchema = z.object({
    phone: z.string(),
    password: z.string(),
});

const adminLoginSchema = z.object({
    username: z.string(),
    password: z.string(),
});

export const register = async (req: Request, res: Response) => {
    try {
        const { name, phone, password } = registerSchema.parse(req.body);

        const existingUser = await prisma.user.findUnique({ where: { phone } });
        if (existingUser) {
            return res.status(400).json({ error: 'User already exists' });
        }

        const hashedPassword = await hashPassword(password);
        const user = await prisma.user.create({
            data: {
                name,
                phone,
                password: hashedPassword,
            },
        });

        const token = generateToken(user.id, 'USER');
        res.status(201).json({ token, user: { id: user.id, name: user.name, phone: user.phone, role: 'USER' } });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ error: error.errors });
        }
        res.status(500).json({ error: 'Registration failed' });
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        const { phone, password } = loginSchema.parse(req.body);

        const user = await prisma.user.findUnique({ where: { phone } });
        if (!user) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        const isMatch = await comparePassword(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        const token = generateToken(user.id, 'USER');
        res.json({ token, user: { id: user.id, name: user.name, phone: user.phone, role: 'USER' } });
    } catch (error) {
        res.status(500).json({ error: 'Login failed' });
    }
};

export const adminLogin = async (req: Request, res: Response) => {
    try {
        const { username, password } = adminLoginSchema.parse(req.body);

        const admin = await prisma.admin.findUnique({ where: { username } });
        if (!admin) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        const isMatch = await comparePassword(password, admin.password);
        if (!isMatch) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        const token = generateToken(admin.id, 'ADMIN');
        res.json({ token, role: 'ADMIN' });
    } catch (error) {
        res.status(500).json({ error: 'Login failed' });
    }
};

export const createAdmin = async (req: Request, res: Response) => {
    try {
        const { username, password } = adminLoginSchema.parse(req.body);
        const existingAdmin = await prisma.admin.findUnique({ where: { username } });
        if (existingAdmin) return res.status(400).json({ error: 'Admin exists' });

        const hashedPassword = await hashPassword(password);
        await prisma.admin.create({
            data: { username, password: hashedPassword }
        });
        res.status(201).json({ message: 'Admin created' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to create admin' });
    }
}
