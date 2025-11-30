import { Router } from 'express';
import { register, login, adminLogin, createAdmin } from '../controllers/authController';
import { authenticate, authorizeAdmin } from '../middlewares/auth';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/admin/login', adminLogin);
router.post('/admin/create', authenticate, authorizeAdmin, createAdmin);

export default router;
