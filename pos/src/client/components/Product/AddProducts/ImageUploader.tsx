// src/components/Products/ImageUploader.tsx
import React from 'react';
import styles from './ImageUploader.module.css';

interface ImageUploaderProps {
  onFileSelect: (file: File | null) => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onFileSelect }) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFileSelect(e.target.files[0]);
    } else {
      onFileSelect(null);
    }
  };

  return (
    <div className={styles.imageUploader}>
      <label htmlFor="productImage" className={styles.label}>
        Choose Product Image
      </label>
      <input
        type="file"
        id="productImage"
        accept="image/*"
        onChange={handleFileChange}
        className={styles.fileInput}
      />
    </div>
  );
};

export default ImageUploader;
