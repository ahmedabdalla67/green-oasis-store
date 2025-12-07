import { Request, Response } from 'express';
import prisma from '../lib/prisma';

export const getShippingZones = async (req: Request, res: Response) => {
    try {
        const zones = await prisma.shippingZone.findMany();
        // Transform to match frontend expectations
        const transformedZones = zones.map(zone => ({
            id: zone.id,
            governorate: zone.governorate,
            areas: [], // TODO: Add areas after Prisma regeneration
            shippingCost: Number(zone.cost),
            addressDetails: '',
            createdAt: zone.createdAt,
            updatedAt: zone.updatedAt
        }));
        res.json(transformedZones);
    } catch (error) {
        console.error('Error fetching shipping zones:', error);
        res.status(500).json({ error: 'Failed to fetch shipping zones' });
    }
};

export const createShippingZone = async (req: Request, res: Response) => {
    try {
        console.log('Creating shipping zone with data:', req.body);

        const { governorate, cost, shippingCost, areas, addressDetails } = req.body;
        const actualCost = cost || shippingCost;

        if (!governorate || !actualCost) {
            return res.status(400).json({ error: 'governorate and cost are required' });
        }

        const zone = await prisma.shippingZone.create({
            data: {
                governorate,
                cost: Number(actualCost)
            },
        });

        console.log('Shipping zone created:', zone);

        // Return in frontend format
        res.status(201).json({
            id: zone.id,
            governorate: zone.governorate,
            areas: areas || [],
            shippingCost: Number(zone.cost),
            addressDetails: addressDetails || '',
            createdAt: zone.createdAt,
            updatedAt: zone.updatedAt
        });
    } catch (error) {
        console.error('Shipping zone creation error:', error);
        res.status(400).json({ error: 'Failed to create shipping zone', details: String(error) });
    }
};

export const updateShippingZone = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { cost, shippingCost, areas, addressDetails } = req.body;

        const actualCost = cost || shippingCost;
        const updateData: { cost?: number } = {};

        if (actualCost !== undefined) {
            updateData.cost = Number(actualCost);
        }

        const zone = await prisma.shippingZone.update({
            where: { id },
            data: updateData,
        });

        res.json({
            id: zone.id,
            governorate: zone.governorate,
            areas: areas || [],
            shippingCost: Number(zone.cost),
            addressDetails: addressDetails || '',
            createdAt: zone.createdAt,
            updatedAt: zone.updatedAt
        });
    } catch (error) {
        console.error('Shipping zone update error:', error);
        res.status(400).json({ error: 'Failed to update shipping zone' });
    }
};

export const deleteShippingZone = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        await prisma.shippingZone.delete({ where: { id } });
        res.json({ message: 'Shipping zone deleted' });
    } catch (error) {
        console.error('Shipping zone delete error:', error);
        res.status(500).json({ error: 'Failed to delete shipping zone' });
    }
};
