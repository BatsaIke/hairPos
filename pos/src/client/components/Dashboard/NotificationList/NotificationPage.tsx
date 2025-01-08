// src/pages/Notifications/NotificationPage.tsx
import React, { useEffect } from 'react';
import styles from './NotificationPage.module.css';
import { useNotifications } from '../../context/NotificationContext';
import Pagination from '../../UI/pagination/Pagination';

const NotificationPage: React.FC = () => {
  const { notifications, currentPage, totalPages, fetchPaginatedNotifications } = useNotifications();

  useEffect(() => {
    fetchPaginatedNotifications(1); // Fetch first page on load
  }, [fetchPaginatedNotifications]);

  const handlePageChange = (page: number) => {
    fetchPaginatedNotifications(page);
  };

  return (
    <div className={styles.notificationPage}>
      <h1 className={styles.title}>Notifications</h1>

      {notifications.length === 0 ? (
        <p className={styles.noNotifications}>No notifications available</p>
      ) : (
        <>
          <ul className={styles.notificationList}>
            {notifications.map((notif) => (
              <li key={notif._id} className={styles.notificationItem}>
                <p>{notif.message}</p>
                <span className={styles.timestamp}>
                  {new Date(notif.timestamp).toLocaleString()}
                </span>
              </li>
            ))}
          </ul>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </>
      )}
    </div>
  );
};

export default NotificationPage;
