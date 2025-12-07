import { Router } from 'express';
import { createOrder, getUserOrders, getAllOrders, updateOrderStatus } from '../controllers/orderController';
import { authenticate, authorizeAdmin } from '../middlewares/auth';

const router = Router();

// Public route for guest checkout (no auth required)
router.post('/', createOrder);
// Protected routes
router.get('/my-orders', authenticate, getUserOrders);
router.get('/all', authenticate, authorizeAdmin, getAllOrders);
router.put('/:id/status', authenticate, authorizeAdmin, updateOrderStatus);

export default router;
