import { AuthRequest } from '../types/AuthRequest';
import { Request, Response } from 'express';
import Order, { IOrder } from '../models/Orders';

export const createOrder = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.authUser) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const { customerName, customerPhone, items, totalAmount } = req.body;

    const newOrder: IOrder = new Order({
      customerName,
      customerPhone,
      items,
      totalAmount,
      createdBy: req.authUser.id, // Associate order with logged-in user
    });

    await newOrder.save();
    res.status(201).json({ message: 'Order created successfully', order: newOrder });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ message: 'Server error', error });
  }
};


export const getAllOrders = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.authUser) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const { start, end } = req.query;

    const filter: any = { createdBy: req.authUser.id }; // Filter by logged-in user
    if (start && end) {
      const startDate = new Date(start as string);
      const endDate = new Date(end as string);
      endDate.setHours(23, 59, 59, 999); // Include the entire day of 'end'

      if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        res.status(400).json({ message: 'Invalid date format' });
        return; // Ensure no further code execution
      }

      filter.createdAt = { $gte: startDate, $lte: endDate };
    }

    const orders = await Order.find(filter).select('createdAt totalAmount items');
    res.status(200).json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ message: 'Server error', error });
  }
};

export const getOrderById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.authUser) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const orderId = req.params.id;
    const order = await Order.findOne({ _id: orderId, createdBy: req.authUser.id }).populate('items.productId');

    if (!order) {
      res.status(404).json({ message: 'Order not found or access denied' });
      return;
    }

    res.status(200).json(order);
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ message: 'Server error', error });
  }
};
export const updateOrderStatus = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.authUser) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const orderId = req.params.id;
    const { status } = req.body;

    const updatedOrder = await Order.findOneAndUpdate(
      { _id: orderId, createdBy: req.authUser.id }, // Ensure user can only update their own orders
      { status },
      { new: true }
    );

    if (!updatedOrder) {
      res.status(404).json({ message: 'Order not found or access denied' });
      return;
    }

    res.status(200).json({ message: 'Order status updated successfully', order: updatedOrder });
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ message: 'Server error', error });
  }
};

export const deleteOrder = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.authUser) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const orderId = req.params.id;
    const deletedOrder = await Order.findOneAndDelete({
      _id: orderId,
      createdBy: req.authUser.id, // Ensure user can only delete their own orders
    });

    if (!deletedOrder) {
      res.status(404).json({ message: 'Order not found or access denied' });
      return;
    }

    res.status(200).json({ message: 'Order deleted successfully' });
  } catch (error) {
    console.error('Error deleting order:', error);
    res.status(500).json({ message: 'Server error', error });
  }
};
