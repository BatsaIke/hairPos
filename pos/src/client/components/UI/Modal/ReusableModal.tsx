import React from "react";
import styles from "./Modal.module.css";

interface ModalProps {
  title: string;
  content: string | React.ReactNode;
  actions: React.ReactNode;
  onClose: () => void;
}

const Modal: React.FC<ModalProps> = ({ title, content, actions, onClose }) => {
  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <h2 className={styles.modalTitle}>{title}</h2>
        <div className={styles.modalBody}>{content}</div>
        <div className={styles.modalActions}>{actions}</div>
      </div>
    </div>
  );
};

export default Modal;
