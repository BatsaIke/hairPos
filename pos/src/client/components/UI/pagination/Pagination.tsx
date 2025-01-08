import React from 'react';
import styles from './Pagination.module.css'; 

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (newPage: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
  const handlePrev = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  return (
    <div className={styles.pagination}>
      <button
        className={styles.pageButton}
        onClick={handlePrev}
        disabled={currentPage === 1}
      >
        Prev
      </button>
      <span className={styles.pageInfo}>
        Page {currentPage} of {totalPages}
      </span>
      <button
        className={styles.pageButton}
        onClick={handleNext}
        disabled={currentPage === totalPages}
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
