// src/context/ProductContext.tsx
import React, { createContext, useState, useContext, useCallback } from 'react';
import api from '../../api'; // your global axios instance

export interface Product {
  _id: string;            // e.g. MongoDB uses _id
  name: string;
  category: string;
  subCategory?: string;
  regularPrice: number;
  discountPrice?: number;
  taxRate?: number;
  inStock: number;
  sku: string;
  imageUrl?: string;
  barcode?: string;
  qrCode?: string;
  createdAt?: string; // Include createdAt field
  updatedAt?: string; // I
  // etc. — add any other fields you need
}

interface ProductContextProps {
  /** The entire product list in local state */
  products: Product[];

  /** Fetch all products from the server (GET /products) */
  fetchAllProducts: () => Promise<void>;

  /** Create a product (POST /products) with image using FormData */
  addProduct: (formData: FormData) => Promise<void>;

  /** Get a single product by ID (GET /products/:id) */
  getProductById: (id: string) => Promise<Product | null>;

  /** Update a product by ID (PUT /products/:id), can use FormData if images are involved */
  updateProduct: (id: string, formData: FormData) => Promise<void>;

  /** Delete a product by ID (DELETE /products/:id) */
  deleteProduct: (id: string) => Promise<void>;
}

/**
 * Create the context. We may store multiple CRUD methods plus a `products` array.
 */
const ProductContext = createContext<ProductContextProps | undefined>(undefined);

export const ProductProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);

  // --------------------------------------------
  // 1) GET ALL PRODUCTS
  // --------------------------------------------
  const fetchAllProducts = useCallback(async () => {
    try {
      const response = await api.get('/products');
      setProducts(response.data);
      console.log("Products fetched:", response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  }, []); // Empty dependency ensures this function is memoized
  
  

  // --------------------------------------------
  // 2) CREATE (ADD) PRODUCT (w/ image)
  // --------------------------------------------
  const addProduct = async (formData: FormData) => {
    try {
      const response = await api.post('/products', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },

        
      });
      // On success, response.data might be { product: {...} } or just {...}
      const newProduct = response.data.product || response.data;

      setProducts((prev) => [...prev, newProduct]);
    } catch (error) {
      console.error('Error creating product:', error);
      throw error; // re-throw if you want calling code to handle it
    }
  };

  // --------------------------------------------
  // 3) GET SINGLE PRODUCT (BY ID)
  // --------------------------------------------
  const getProductById = async (id: string): Promise<Product | null> => {
    try {
      const response = await api.get(`/products/${id}`);
      return response.data; // or response.data.product
    } catch (error) {
      console.error('Error fetching product by ID:', error);
      return null;
    }
  };

  // --------------------------------------------
  // 4) UPDATE PRODUCT (BY ID, with optional image)
  // --------------------------------------------
  const updateProduct = async (id: string, formData: FormData) => {
    try {
      const response = await api.put(`/products/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      const updated = response.data.product || response.data;

      // Replace the old product in local state
      setProducts((prev) => prev.map((p) => (p._id === id ? updated : p)));
    } catch (error) {
      console.error('Error updating product:', error);
      throw error;
    }
  };

  // --------------------------------------------
  // 5) DELETE PRODUCT
  // --------------------------------------------
  const deleteProduct = async (id: string) => {
    try {
      await api.delete(`/products/${id}`);
      // Remove it from local state
      setProducts((prev) => prev.filter((p) => p._id !== id));
    } catch (error) {
      console.error('Error deleting product:', error);
      throw error;
    }
  };

  return (
    <ProductContext.Provider
      value={{
        products,
        fetchAllProducts,
        addProduct,
        getProductById,
        updateProduct,
        deleteProduct,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
};
