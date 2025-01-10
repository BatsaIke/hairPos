import React, { ReactNode } from 'react';
import styles from './ReusableModal.module.css';

interface ReusableModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  isDarkMode?: boolean;
}

const ReusableModal: React.FC<ReusableModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  isDarkMode = false,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className={`${styles.modalBackdrop} ${
        isDarkMode ? styles['dark-mode'] : ''
      }`}
    >
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <h2>{title || 'Modal Title'}</h2>
          <button className={styles.closeButton} onClick={onClose}>
            &times;
          </button>
        </div>
        <div className={styles.modalBody}>{children}</div>
      </div>
    </div>
  );
};

export default ReusableModal;
