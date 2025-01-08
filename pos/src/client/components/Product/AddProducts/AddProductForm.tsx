import React, { useState, useRef, useEffect } from 'react';
import { useProducts } from '../../context/ProductContext';
import FormRow from './FormRow';
import ImageUploader from './ImageUploader';
import styles from './AddProductForm.module.css';
import Spinner from '../../UI/Spinner';

export interface ProductFormData {
  id?: string;
  name: string;
  category: string;
  subCategory?: string;
  regularPrice: number;
  inStock: number;
  sku?: string;
}

export interface AddProductFormProps {
  onSubmit: (data: ProductFormData) => Promise<void>;
  onClose: () => void;
  initialData?: ProductFormData | null;
}

const AddProductForm: React.FC<AddProductFormProps> = ({ onSubmit, onClose, initialData }) => {
  const { addProduct, updateProduct } = useProducts();

  const [formData, setFormData] = useState<ProductFormData>(
    initialData || {
      name: '',
      category: '',
      subCategory: '',
      regularPrice: 0,
      inStock: 0,
      sku: '',
    }
  );

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const skuRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && document.activeElement === skuRef.current) {
        console.log('Barcode scanned:', formData.sku);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [formData.sku]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'regularPrice' || name === 'inStock' ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);

      const data = new FormData();
      if (selectedFile) {
        data.append('image', selectedFile);
      }
      Object.entries(formData).forEach(([key, value]) => {
        data.append(key, String(value));
      });

      if (initialData?.id) {
        await updateProduct(initialData.id, data);
        alert('Product updated successfully!');
      } else {
        await addProduct(data);
        alert('Product created successfully!');
      }

      onClose();
    } catch (err) {
      console.error('Error saving product:', err);
      alert('Failed to save product.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitting) {
    return (
      <div className={styles.spinnerOverlay}>
        <Spinner message="Saving product, please wait..." />
      </div>
    );
  }

  return (
    <form className={styles.formContainer} onSubmit={handleSubmit}>
      <h2 className={styles.formTitle}>{initialData ? 'Edit Product' : 'Add New Product'}</h2>

      <FormRow label="Product Name">
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className={styles.formInput}
          required
        />
      </FormRow>

      <FormRow label="Category">
        <input
          type="text"
          name="category"
          value={formData.category}
          onChange={handleChange}
          className={styles.formInput}
          required
        />
      </FormRow>

      <FormRow label="Sub-Category">
        <input
          type="text"
          name="subCategory"
          value={formData.subCategory || ''}
          onChange={handleChange}
          className={styles.formInput}
        />
      </FormRow>

      <FormRow label="Regular Price">
        <input
          type="number"
          name="regularPrice"
          value={formData.regularPrice}
          onChange={handleChange}
          className={styles.formInput}
          min={0}
          required
        />
      </FormRow>

      <FormRow label="In Stock">
        <input
          type="number"
          name="inStock"
          value={formData.inStock}
          onChange={handleChange}
          className={styles.formInput}
          min={0}
        />
      </FormRow>

      <FormRow label="SKU (Barcode)">
        <input
          type="text"
          name="sku"
          ref={skuRef}
          value={formData.sku || ''}
          onChange={handleChange}
          className={styles.formInput}
        />
      </FormRow>

      <ImageUploader onFileSelect={setSelectedFile} />

      <button className={styles.submitButton} type="submit">
        {initialData ? 'Update Product' : 'Create Product'}
      </button>
    </form>
  );
};

export default AddProductForm;
