import React, { useState } from 'react';
import styles from './DateFilter.module.css';

interface DateFilterProps {
  onDateChange: (range: { start: Date; end: Date } | null) => void;
}

const DateFilter: React.FC<DateFilterProps> = ({ onDateChange }) => {
  const [customRange, setCustomRange] = useState<{ start: string; end: string }>({
    start: '',
    end: '',
  });

  const handlePresetClick = (days: number) => {
    const now = new Date();
    const start = new Date();

    if (days === 1) {
      start.setHours(0, 0, 0, 0); // Midnight today
      now.setHours(23, 59, 59, 999); // End of today
    } else {
      start.setDate(now.getDate() - days);
      start.setHours(0, 0, 0, 0); // Midnight of the start date
    }

    onDateChange({ start, end: now });
  };

  const handleCustomChange = () => {
    if (customRange.start && customRange.end) {
      const startDate = new Date(customRange.start);
      const endDate = new Date(customRange.end);
      endDate.setHours(23, 59, 59, 999); // Include the full day of 'end'

      onDateChange({ start: startDate, end: endDate });
    }
  };

  return (
    <div className={styles.dateFilter}>
      <button onClick={() => onDateChange(null)}>All Time</button>
      <button onClick={() => handlePresetClick(1)}>Today</button>
      <button onClick={() => handlePresetClick(7)}>This Week</button>
      <button onClick={() => handlePresetClick(30)}>This Month</button>
      <div>
        <input
          type="date"
          value={customRange.start}
          onChange={(e) => setCustomRange((prev) => ({ ...prev, start: e.target.value }))}
        />
        <input
          type="date"
          value={customRange.end}
          onChange={(e) => setCustomRange((prev) => ({ ...prev, end: e.target.value }))}
        />
        <button onClick={handleCustomChange}>Apply</button>
      </div>
    </div>
  );
};

export default DateFilter;
