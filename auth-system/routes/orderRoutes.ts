import express from 'express';
import {
  createOrder,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  deleteOrder,
} from '../controllers/orderController';
import { verifyRole, verifyToken } from '../middleware/authMiddleware';

const router = express.Router();

// Public or Private? Typically, orders are private.
router.post('/',verifyToken, createOrder); // Create an order
router.get('/',verifyToken,  getAllOrders); // Fetch all orders
router.get('/:id',verifyToken, verifyRole('admin'), getOrderById); // Fetch a specific order
router.put('/:id',verifyToken, verifyRole('admin'), updateOrderStatus); // Update the status of an order
router.delete('/:id',verifyToken,verifyRole('admin'), deleteOrder); // Delete an order

export default router;
