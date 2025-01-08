import React, { createContext, useState, useContext, useCallback } from 'react';
import api from '../../api'; // your global axios instance

// Define the Notification structure
export interface Notification {
  _id: string; // MongoDB uses _id
  message: string;
  type: string; // e.g., 'order', 'user', 'system'
  userId?: string; // Optional user reference
  timestamp: string;
  read: boolean;
}

interface NotificationContextProps {
  notifications: Notification[];
  currentPage: number;
  totalPages: number;
  fetchPaginatedNotifications: (page: number, limit?: number) => Promise<void>;
  fetchLatestNotifications: () => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
  deleteNotification: (id: string) => Promise<void>;
}

const NotificationContext = createContext<NotificationContextProps | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  // --------------------------------------------
  // 1) Fetch Paginated Notifications
  // --------------------------------------------
  const fetchPaginatedNotifications = useCallback(
    async (page: number, limit = 20) => {
      try {
        const response = await api.get('/notifications', { params: { page, limit } });
        setNotifications(response.data.notifications);
        setCurrentPage(response.data.currentPage);
        setTotalPages(response.data.totalPages);
        console.log('Paginated notifications fetched:', response.data);
      } catch (error) {
        console.error('Error fetching paginated notifications:', error);
      }
    },
    [],
  );

  // --------------------------------------------
  // 2) Fetch Latest Notifications
  // --------------------------------------------
  const fetchLatestNotifications = useCallback(async () => {
    try {
      const response = await api.get('/notifications/latest');
      setNotifications(response.data);
      console.log('Latest notifications fetched:', response.data);
    } catch (error) {
      console.error('Error fetching latest notifications:', error);
    }
  }, []);

  // --------------------------------------------
  // 3) Mark Notification as Read
  // --------------------------------------------
  const markAsRead = useCallback(async (id: string) => {
    try {
      const response = await api.patch(`/notifications/${id}/read`);
      setNotifications((prev) =>
        prev.map((notif) => (notif._id === id ? { ...notif, read: true } : notif)),
      );
      console.log('Notification marked as read:', response.data);
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  }, []);

  // --------------------------------------------
  // 4) Delete Notification
  // --------------------------------------------
  const deleteNotification = useCallback(async (id: string) => {
    try {
      await api.delete(`/notifications/${id}`);
      setNotifications((prev) => prev.filter((notif) => notif._id !== id));
      console.log('Notification deleted successfully');
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  }, []);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        currentPage,
        totalPages,
        fetchPaginatedNotifications,
        fetchLatestNotifications,
        markAsRead,
        deleteNotification,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};
