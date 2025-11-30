import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();

const shippingZoneSchema = z.object({
    governorate: z.string(),
    cost: z.number().positive(),
});

export const getShippingZones = async (req: Request, res: Response) => {
    try {
        const zones = await prisma.shippingZone.findMany();
        res.json(zones);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch shipping zones' });
    }
};

export const createShippingZone = async (req: Request, res: Response) => {
    try {
        const { governorate, cost } = shippingZoneSchema.parse(req.body);
        const zone = await prisma.shippingZone.create({
            data: { governorate, cost },
        });
        res.status(201).json(zone);
    } catch (error) {
        res.status(400).json({ error: 'Failed to create shipping zone' });
    }
};

export const updateShippingZone = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { cost } = shippingZoneSchema.partial().parse(req.body);

        const zone = await prisma.shippingZone.update({
            where: { id },
            data: { cost },
        });
        res.json(zone);
    } catch (error) {
        res.status(400).json({ error: 'Failed to update shipping zone' });
    }
};
