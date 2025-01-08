import React from 'react';
import styles from './FormRow.module.css';

interface FormRowProps {
  label: string;
  children: React.ReactNode;
}

const FormRow: React.FC<FormRowProps> = ({ label, children }) => {
  return (
    <label className={styles.formRow}>
      <span className={styles.labelText}>{label}</span>
      {children}
    </label>
  );
};

export default FormRow;
