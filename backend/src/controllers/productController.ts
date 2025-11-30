import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();

const productSchema = z.object({
    name: z.string(),
    category: z.string(),
    description: z.string(),
    price: z.string().transform((val) => parseFloat(val)),
    weight: z.string().transform((val) => parseFloat(val)),
    availableStock: z.string().transform((val) => parseInt(val, 10)),
});

export const getProducts = async (req: Request, res: Response) => {
    try {
        const products = await prisma.product.findMany();
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch products' });
    }
};

export const getProductById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const product = await prisma.product.findUnique({ where: { id } });
        if (!product) return res.status(404).json({ error: 'Product not found' });
        res.json(product);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch product' });
    }
};

export const createProduct = async (req: Request, res: Response) => {
    try {
        const { name, category, description, price, weight, availableStock } = productSchema.parse(req.body);
        const imageUrl = req.file ? `/uploads/${req.file.filename}` : '';

        const product = await prisma.product.create({
            data: {
                name,
                category,
                description,
                price,
                weight,
                availableStock,
                imageUrl,
            },
        });
        res.status(201).json(product);
    } catch (error) {
        res.status(400).json({ error: 'Failed to create product', details: error });
    }
};

export const updateProduct = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const data = productSchema.partial().parse(req.body);
        const imageUrl = req.file ? `/uploads/${req.file.filename}` : undefined;

        const product = await prisma.product.update({
            where: { id },
            data: { ...data, ...(imageUrl && { imageUrl }) },
        });
        res.json(product);
    } catch (error) {
        res.status(400).json({ error: 'Failed to update product' });
    }
};

export const deleteProduct = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        await prisma.product.delete({ where: { id } });
        res.json({ message: 'Product deleted' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete product' });
    }
};
