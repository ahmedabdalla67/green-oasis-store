import { Router } from 'express';
import { createOrder, getUserOrders, getAllOrders, updateOrderStatus } from '../controllers/orderController';
import { authenticate, authorizeAdmin } from '../middlewares/auth';

const router = Router();

router.post('/', authenticate, createOrder);
router.get('/my-orders', authenticate, getUserOrders);
router.get('/', authenticate, authorizeAdmin, getAllOrders);
router.put('/:id/status', authenticate, authorizeAdmin, updateOrderStatus);

export default router;
