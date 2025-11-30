import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { AuthRequest } from '../middlewares/auth';

const prisma = new PrismaClient();

const orderItemSchema = z.object({
    productId: z.string(),
    quantity: z.number().int().positive(),
});

const orderSchema = z.object({
    items: z.array(orderItemSchema),
    paymentMethod: z.string(),
    shippingAddress: z.string(),
    governorate: z.string(),
});

export const createOrder = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.userId;
        if (!userId) return res.status(401).json({ error: 'Unauthorized' });

        const { items, paymentMethod, shippingAddress, governorate } = orderSchema.parse(req.body);

        // Calculate delivery cost
        const shippingZone = await prisma.shippingZone.findUnique({ where: { governorate } });

        if (!shippingZone) {
            return res.status(400).json({ error: 'Invalid governorate' });
        }

        const deliveryCost = shippingZone.cost;

        // Calculate total price and verify stock
        let totalPrice = Number(deliveryCost);
        const orderItemsData = [];

        for (const item of items) {
            const product = await prisma.product.findUnique({ where: { id: item.productId } });
            if (!product) return res.status(400).json({ error: `Product ${item.productId} not found` });
            if (product.availableStock < item.quantity) return res.status(400).json({ error: `Insufficient stock for ${product.name}` });

            totalPrice += Number(product.price) * item.quantity;
            orderItemsData.push({
                productId: item.productId,
                quantity: item.quantity,
                price: product.price,
            });

            // Update stock
            await prisma.product.update({
                where: { id: item.productId },
                data: { availableStock: product.availableStock - item.quantity },
            });
        }

        const order = await prisma.order.create({
            data: {
                userId,
                totalPrice,
                paymentMethod,
                shippingAddress,
                governorate,
                deliveryCost,
                items: {
                    create: orderItemsData,
                },
            },
            include: { items: true },
        });

        res.status(201).json(order);
    } catch (error) {
        res.status(400).json({ error: 'Failed to create order', details: error });
    }
};

export const getUserOrders = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.userId;
        const orders = await prisma.order.findMany({
            where: { userId },
            include: { items: { include: { product: true } } },
        });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch orders' });
    }
};

export const getAllOrders = async (req: Request, res: Response) => {
    try {
        const orders = await prisma.order.findMany({
            include: { user: true, items: { include: { product: true } } },
        });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch orders' });
    }
};

export const updateOrderStatus = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const order = await prisma.order.update({
            where: { id },
            data: { status },
        });
        res.json(order);
    } catch (error) {
        res.status(400).json({ error: 'Failed to update order status' });
    }
};
