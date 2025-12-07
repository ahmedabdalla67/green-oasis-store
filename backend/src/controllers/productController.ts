import { Request, Response } from 'express';
import prisma from '../lib/prisma';

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
        console.log('Incoming product data:', req.body);
        console.log('Incoming file:', req.file);

        const { name, category, description, price, weight, availableStock, stock, imageUrl, image } = req.body;

        if (!name || !category) {
            return res.status(400).json({ error: 'name and category are required' });
        }

        const finalImageUrl = req.file ? `/uploads/${req.file.filename}` : (imageUrl || image || '');

        const product = await prisma.product.create({
            data: {
                name,
                category,
                description: description || '',
                price: parseFloat(price) || 0,
                weight: parseFloat(weight) || 0,
                availableStock: parseInt(availableStock || stock || '0', 10),
                imageUrl: finalImageUrl,
            },
        });
        console.log('Product created successfully:', product);
        res.status(201).json(product);
    } catch (error) {
        console.error('Product creation error:', error);
        res.status(400).json({ error: 'Failed to create product', details: String(error) });
    }
};

export const updateProduct = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { name, category, description, price, weight, availableStock, stock, imageUrl, image } = req.body;

        const updateData: Record<string, unknown> = {};
        if (name) updateData.name = name;
        if (category) updateData.category = category;
        if (description !== undefined) updateData.description = description;
        if (price !== undefined) updateData.price = parseFloat(price);
        if (weight !== undefined) updateData.weight = parseFloat(weight);
        if (availableStock !== undefined || stock !== undefined) {
            updateData.availableStock = parseInt(availableStock || stock || '0', 10);
        }

        const finalImageUrl = req.file ? `/uploads/${req.file.filename}` : (imageUrl || image);
        if (finalImageUrl) updateData.imageUrl = finalImageUrl;

        const product = await prisma.product.update({
            where: { id },
            data: updateData,
        });
        res.json(product);
    } catch (error) {
        console.error('Product update error:', error);
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
