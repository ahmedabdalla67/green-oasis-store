import { Router } from 'express';
import { getShippingZones, createShippingZone, updateShippingZone } from '../controllers/shippingController';
import { authenticate, authorizeAdmin } from '../middlewares/auth';

const router = Router();

router.get('/', getShippingZones);
router.post('/', authenticate, authorizeAdmin, createShippingZone);
router.put('/:id', authenticate, authorizeAdmin, updateShippingZone);

export default router;
