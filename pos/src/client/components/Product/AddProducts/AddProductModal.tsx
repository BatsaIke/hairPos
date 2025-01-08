import React from 'react';
import ReusableModal from '../../../UI/ReusableModal';
import AddProductForm, { ProductFormData } from './AddProductForm';

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  productToEdit?: ProductFormData | null; // Pass product data for editing
}

const AddProductModal: React.FC<AddProductModalProps> = ({ isOpen, onClose, productToEdit }) => {
  const handleFormSubmit = async (data: ProductFormData) => {
    // You can handle the form submission here if needed
    onClose(); // Close the modal after submission
  };

  return (
    <ReusableModal
      isOpen={isOpen}
      onClose={onClose}
      title={productToEdit ? 'Edit Product' : 'Add New Product'}
    >
      <AddProductForm
        onSubmit={handleFormSubmit}
        onClose={onClose}
        initialData={productToEdit} // Pass initial data for editing
      />
    </ReusableModal>
  );
};

export default AddProductModal;
