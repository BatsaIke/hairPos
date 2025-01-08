import { Router } from 'express';
import {
  getAllNotifications,
  getLatestNotifications,
  createNotification,
  markAsRead,
  deleteNotification,
  getUserNotifications, // Import the new user-specific function
} from '../controllers/notificationController';
import { verifyToken } from '../middleware/authMiddleware';

const router = Router();

// Get all notifications (Admin only or all users based on business logic)
router.get('/', verifyToken, getAllNotifications);

// Get notifications for the authenticated user
router.get('/user', verifyToken, getUserNotifications);

// Get the latest 5 notifications
router.get('/latest', verifyToken, getLatestNotifications);

// Create a new notification (Admin only or via specific triggers)
router.post('/', verifyToken, createNotification);

// Mark a notification as read
router.patch('/:id/read', verifyToken, markAsRead);

// Delete a notification
router.delete('/:id', verifyToken, deleteNotification);

export default router;
