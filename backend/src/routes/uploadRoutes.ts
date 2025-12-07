import { Router } from 'express';
import { upload, uploadImage, uploadMultipleImages, deleteImage } from '../controllers/uploadController';
import { authenticate, authorizeAdmin } from '../middlewares/auth';

const router = Router();

// Upload single image (admin only)
router.post('/image', authenticate, authorizeAdmin, upload.single('image'), uploadImage);

// Upload multiple images (admin only, max 5)
router.post('/images', authenticate, authorizeAdmin, upload.array('images', 5), uploadMultipleImages);

// Delete image (admin only)
router.delete('/:filename', authenticate, authorizeAdmin, deleteImage);

export default router;
