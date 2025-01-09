import { Request, Response } from 'express';
import Notification, { INotification } from '../models/Notifications';
import { AuthRequest } from '../types/types';

// Fetch all notifications
export const getAllNotifications = async (req: Request, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1; // Default to page 1
    const limit = parseInt(req.query.limit as string) || 20; // Default to 20 notifications per page
    const skip = (page - 1) * limit;

    const notifications = await Notification.find({})
      .sort({ timestamp: -1 }) // Sort by most recent
      .skip(skip)
      .limit(limit);

    const totalNotifications = await Notification.countDocuments();
    const totalPages = Math.ceil(totalNotifications / limit);

    res.status(200).json({
      notifications,
      currentPage: page,
      totalPages,
    });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ message: 'Server error', error });
  }
};

export const getLatestNotifications = async (req: Request, res: Response): Promise<void> => {
  try {
    const notifications = await Notification.find({})
      .sort({ timestamp: -1 }) // Sort by most recent
      .limit(5); // Limit to 5 notifications
    res.status(200).json(notifications);
  } catch (error) {
    console.error('Error fetching latest notifications:', error);
    res.status(500).json({ message: 'Server error', error });
  }
};

export const createNotification = async (req: Request, res: Response): Promise<void> => {
  try {
    const { message, type, userId } = req.body;

    const newNotification: INotification = new Notification({
      message,
      type,
      userId,
    });

    await newNotification.save();
    res.status(201).json({ message: 'Notification created successfully', notification: newNotification });
  } catch (error) {
    console.error('Error creating notification:', error);
    res.status(500).json({ message: 'Server error', error });
  }
};

export const markAsRead = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const updatedNotification = await Notification.findByIdAndUpdate(
      id,
      { read: true },
      { new: true }
    );

    if (!updatedNotification) {
      res.status(404).json({ message: 'Notification not found' });
      return;
    }

    res.status(200).json({ message: 'Notification marked as read', notification: updatedNotification });
  } catch (error) {
    console.error('Error marking notification as read:', error);
    res.status(500).json({ message: 'Server error', error });
  }
};

export const deleteNotification = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const deletedNotification = await Notification.findByIdAndDelete(id);

    if (!deletedNotification) {
      res.status(404).json({ message: 'Notification not found' });
      return;
    }

    res.status(200).json({ message: 'Notification deleted successfully' });
  } catch (error) {
    console.error('Error deleting notification:', error);
    res.status(500).json({ message: 'Server error', error });
  }
};


export const getUserNotifications = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.authUser) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const skip = (page - 1) * limit;

    const notifications = await Notification.find({ userId: req.authUser.id })
      .sort({ timestamp: -1 })
      .skip(skip)
      .limit(limit);

    const totalNotifications = await Notification.countDocuments({ userId: req.authUser.id });
    const totalPages = Math.ceil(totalNotifications / limit);

    res.status(200).json({ notifications, currentPage: page, totalPages });
  } catch (error) {
    console.error('Error fetching user notifications:', error);
    res.status(500).json({ message: 'Server error', error });
  }
};
