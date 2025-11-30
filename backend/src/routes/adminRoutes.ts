import { Router } from 'express';
import { getDashboardStats } from '../controllers/adminController';
import { authenticate, authorizeAdmin } from '../middlewares/auth';

const router = Router();

router.get('/stats', authenticate, authorizeAdmin, getDashboardStats);

export default router;
