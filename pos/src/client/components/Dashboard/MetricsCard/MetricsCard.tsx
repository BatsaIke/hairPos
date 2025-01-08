import React from 'react';
import styles from './MetricsCard.module.css';

interface MetricsCardProps {
  title: string;
  value: string;
}

const MetricsCard: React.FC<MetricsCardProps> = ({ title, value }) => {
  return (
    <div className={styles.card}>
      <h3 className={styles.title}>{title}</h3>
      <p className={styles.value}>{value}</p>
    </div>
  );
};

export default MetricsCard;
