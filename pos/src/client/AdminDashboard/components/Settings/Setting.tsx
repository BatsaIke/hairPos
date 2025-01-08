import React from 'react';
import styles from './Settings.module.css';

const Settings: React.FC = () => {
  return (
    <div className={styles.settings}>
      <h1>Settings</h1>
      <p>Manage application settings here.</p>
    </div>
  );
};

export default Settings;