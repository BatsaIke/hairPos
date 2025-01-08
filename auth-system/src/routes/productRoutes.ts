import express from 'express';
import {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} from '../controllers/productController';
import { verifyToken, verifyRole } from '../middleware/authMiddleware';
import multer from 'multer';

const router = express.Router();
const upload = multer({ dest: 'uploads/' }); // Basic Multer configuration

// Routes for product management
router.post('/', verifyToken, verifyRole('admin'), upload.single('image'), createProduct);
router.get('/', verifyToken, getAllProducts); // Users can fetch products
router.get('/:id', verifyToken, getProductById);
router.put('/:id', verifyToken, verifyRole('admin'), upload.single('image'), updateProduct);
router.delete('/:id', verifyToken, verifyRole('admin'), deleteProduct);

export default router;
