import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getDashboardStats = async (req: Request, res: Response) => {
    try {
        const totalUsers = await prisma.user.count();
        const totalOrders = await prisma.order.count();
        const totalRevenueResult = await prisma.order.aggregate({
            _sum: { totalPrice: true },
        });
        const totalRevenue = totalRevenueResult._sum.totalPrice || 0;

        // Best selling products
        const bestSelling = await prisma.orderItem.groupBy({
            by: ['productId'],
            _sum: { quantity: true },
            orderBy: { _sum: { quantity: 'desc' } },
            take: 5,
        });

        const bestSellingProducts = await Promise.all(
            bestSelling.map(async (item: { productId: string; _sum: { quantity: number | null } }) => {
                const product = await prisma.product.findUnique({ where: { id: item.productId } });
                return {
                    ...product,
                    totalSold: item._sum.quantity,
                };
            })
        );

        res.json({
            totalUsers,
            totalOrders,
            totalRevenue,
            bestSellingProducts,
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch dashboard stats' });
    }
};
