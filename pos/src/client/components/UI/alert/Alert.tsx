import React from 'react';
import { useSelector } from 'react-redux';
import './Alert.css';

// Define the structure of an Alert object
interface Alert {
  id: string;
  alertType: string;
  msg: string;
}

// Define the structure of the Redux state
interface RootState {
  alerts: Alert[];
}

const Alert: React.FC = () => {
  // Use TypeScript to specify the state type
  const alerts = useSelector((state: RootState) => state.alerts);

  return (
    <div className="alert-wrapper">
      {alerts.map((alert) => (
        <div key={alert.id} className={`alert alert-${alert.alertType}`}>
          {alert.msg}
        </div>
      ))}
    </div>
  );
};

export default Alert;
