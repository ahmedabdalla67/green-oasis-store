import { Request, Response } from 'express';
import prisma from '../lib/prisma';
import { AuthRequest } from '../middlewares/auth';

export const createOrder = async (req: AuthRequest, res: Response) => {
    try {
        console.log('=== ORDER CREATION START ===');
        console.log('Request body:', JSON.stringify(req.body, null, 2));

        const authenticatedUserId = req.user?.userId;
        console.log('Authenticated userId:', authenticatedUserId);

        // Accept flexible field names from frontend
        const {
            items,
            paymentMethod,
            shippingAddress,
            address,
            governorate,
            area,
            customerName,
            phone,
            totalAmount,
            shippingCost,
            vodafoneNumber
        } = req.body;

        // Use shippingAddress or address
        const finalAddress = shippingAddress || address || '';

        if (!items || !Array.isArray(items) || items.length === 0) {
            return res.status(400).json({ error: 'items array is required' });
        }

        if (!governorate) {
            return res.status(400).json({ error: 'governorate is required' });
        }

        // Calculate delivery cost from shipping zone if not provided
        let deliveryCost = shippingCost;
        if (!deliveryCost) {
            const shippingZone = await prisma.shippingZone.findUnique({ where: { governorate } });
            deliveryCost = shippingZone ? Number(shippingZone.cost) : 50;
        }

        // Calculate total price and prepare order items
        let totalPrice = Number(deliveryCost);
        const orderItemsData = [];

        for (const item of items) {
            const productId = item.productId || item.product?.id;
            const quantity = item.quantity || 1;

            if (!productId) {
                console.error('Invalid item - no productId:', item);
                continue;
            }

            const product = await prisma.product.findUnique({ where: { id: productId } });
            if (!product) {
                console.error(`Product ${productId} not found`);
                continue;
            }

            totalPrice += Number(product.price) * quantity;
            orderItemsData.push({
                productId,
                quantity,
                price: product.price,
            });

            if (product.availableStock >= quantity) {
                await prisma.product.update({
                    where: { id: productId },
                    data: { availableStock: product.availableStock - quantity },
                });
            }
        }

        if (orderItemsData.length === 0) {
            return res.status(400).json({ error: 'No valid items in order' });
        }

        const finalTotal = totalAmount || totalPrice;

        // STEP 1: Determine or create the user FIRST
        let orderUserId: string;

        if (authenticatedUserId) {
            // Verify authenticated user exists
            const existingUser = await prisma.user.findUnique({ where: { id: authenticatedUserId } });
            if (existingUser) {
                orderUserId = existingUser.id;
                console.log('Using authenticated user:', orderUserId);
            } else {
                console.error('Authenticated user not found in DB:', authenticatedUserId);
                // Create a new user as fallback
                const newUser = await prisma.user.create({
                    data: {
                        name: customerName || 'User',
                        phone: `user-${Date.now()}`,
                        password: 'no-login',
                    }
                });
                orderUserId = newUser.id;
                console.log('Created fallback user for authenticated session:', orderUserId);
            }
        } else {
            // Guest order - create a new user
            const guestPhone = `guest-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;
            console.log('Creating guest user with phone:', guestPhone);

            const guestUser = await prisma.user.create({
                data: {
                    name: customerName || 'Guest',
                    phone: guestPhone,
                    password: 'guest-no-login',
                }
            });
            orderUserId = guestUser.id;
            console.log('Created guest user:', orderUserId);
        }

        // STEP 2: Verify the user exists before proceeding
        const verifyUser = await prisma.user.findUnique({ where: { id: orderUserId } });
        if (!verifyUser) {
            console.error('CRITICAL: User was created but not found:', orderUserId);
            return res.status(500).json({ error: 'User verification failed' });
        }
        console.log('User verified:', verifyUser.id, verifyUser.name);

        // STEP 3: Build shipping address with guest info
        let finalShippingAddress = finalAddress;
        if (!authenticatedUserId) {
            const guestInfo = `${customerName || 'Guest'} | ${phone || 'No phone'} | ${area || ''}`;
            finalShippingAddress = `${guestInfo}\n${finalAddress}`;
        }

        // STEP 4: Create the order with verified userId
        console.log('Creating order with userId:', orderUserId);

        const order = await prisma.order.create({
            data: {
                userId: orderUserId,
                totalPrice: finalTotal,
                paymentMethod: paymentMethod || 'cash',
                shippingAddress: finalShippingAddress,
                governorate,
                deliveryCost,
                status: 'pending',
                items: {
                    create: orderItemsData,
                },
            },
            include: { items: { include: { product: true } } },
        });

        console.log('=== ORDER CREATED SUCCESSFULLY ===', order.id);
        res.status(201).json(order);
    } catch (error) {
        console.error('=== ORDER CREATION ERROR ===', error);
        res.status(400).json({ error: 'Failed to create order', details: String(error) });
    }
};

export const getUserOrders = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.userId;
        if (!userId) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const orders = await prisma.order.findMany({
            where: { userId },
            include: { items: { include: { product: true } } },
            orderBy: { createdAt: 'desc' },
        });
        res.json(orders);
    } catch (error) {
        console.error('Error fetching user orders:', error);
        res.status(500).json({ error: 'Failed to fetch orders' });
    }
};

export const getAllOrders = async (req: Request, res: Response) => {
    try {
        const orders = await prisma.order.findMany({
            include: { user: true, items: { include: { product: true } } },
            orderBy: { createdAt: 'desc' },
        });
        res.json(orders);
    } catch (error) {
        console.error('Error fetching all orders:', error);
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
        console.error('Order status update error:', error);
        res.status(400).json({ error: 'Failed to update order status' });
    }
};
