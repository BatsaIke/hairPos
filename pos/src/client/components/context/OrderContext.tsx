import React, { createContext, useState, useContext, useCallback } from 'react';
import api from '../../api'; // your global axios instance

// Define the Order and Item structure
export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
}

export interface Order {
  _id: string; // MongoDB uses _id
  customerName: string;
  customerPhone: string;
  items: OrderItem[];
  totalAmount: number;
  status: string; // e.g., "Pending", "Completed", "Cancelled"
  createdAt?: string; // Optional timestamp
  updatedAt?: string; // Optional timestamp
}

interface OrderContextProps {
  orders: Order[];
  fetchAllOrders: () => Promise<void>;
  createOrder: (orderData: Omit<Order, '_id' | 'status' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  getOrderById: (id: string) => Promise<Order | null>;
  updateOrderStatus: (id: string, status: string) => Promise<void>;
  deleteOrder: (id: string) => Promise<void>;
}

const OrderContext = createContext<OrderContextProps | undefined>(undefined);

export const OrderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [orders, setOrders] = useState<Order[]>([]);

  // --------------------------------------------
  // 1) Fetch All Orders
  // --------------------------------------------
  const fetchAllOrders = useCallback(async () => {
    try {
      const response = await api.get('/orders');
      setOrders(response.data);
      console.log('Orders fetched:', response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  }, []);

  // --------------------------------------------
  // 2) Create Order
  // --------------------------------------------
  const createOrder = useCallback(
    async (orderData: Omit<Order, '_id' | 'status' | 'createdAt' | 'updatedAt'>) => {
      try {
        const response = await api.post('/orders', orderData);
        const newOrder = response.data.order || response.data;
  
        // Add the new order to the local state
        setOrders((prev) => [...prev, newOrder]);
      } catch (error) {
        console.error('Error creating order:', error);
        throw error;
      }
    },
    [setOrders] // Dependency array
  );
  

  // --------------------------------------------
  // 3) Get Single Order by ID
  // --------------------------------------------
  const getOrderById = async (id: string): Promise<Order | null> => {
    try {
      const response = await api.get(`/orders/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching order by ID:', error);
      return null;
    }
  };

  // --------------------------------------------
  // 4) Update Order Status
  // --------------------------------------------
  const updateOrderStatus = async (id: string, status: string) => {
    try {
      const response = await api.put(`/orders/${id}`, { status });
      const updatedOrder = response.data.order || response.data;

      // Update the local state
      setOrders((prev) =>
        prev.map((order) => (order._id === id ? { ...order, status } : order))
      );
    } catch (error) {
      console.error('Error updating order status:', error);
      throw error;
    }
  };

  // --------------------------------------------
  // 5) Delete Order
  // --------------------------------------------
  const deleteOrder = async (id: string) => {
    try {
      await api.delete(`/orders/${id}`);

      // Remove the order from the local state
      setOrders((prev) => prev.filter((order) => order._id !== id));
    } catch (error) {
      console.error('Error deleting order:', error);
      throw error;
    }
  };

  return (
    <OrderContext.Provider
      value={{
        orders,
        fetchAllOrders,
        createOrder,
        getOrderById,
        updateOrderStatus,
        deleteOrder,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};

export const useOrders = () => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error('useOrders must be used within an OrderProvider');
  }
  return context;
};
