import React, { useEffect } from 'react';
import styles from './NotificationList.module.css';
import { useNotifications } from '../../context/NotificationContext';

const NotificationList: React.FC = () => {
  const { notifications, fetchLatestNotifications } = useNotifications();

  useEffect(() => {
    fetchLatestNotifications(); // Fetch latest notifications when the component loads
  }, [fetchLatestNotifications]);

  return (
    <div className={styles.notifications}>
      <h3 className={styles.title}>Recent Notifications</h3>
      <ul className={styles.list}>
        {notifications.slice(0, 5).map((notif) => (
          <li key={notif._id} className={styles.item}>
            {notif.message}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default NotificationList;
