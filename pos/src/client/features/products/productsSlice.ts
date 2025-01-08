// src/client/features/products/productsSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface ProductsState {
  items: { id: string; name: string; price: number; stock: number }[];
}

const initialState: ProductsState = {
  items: [],
};

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setProducts: (state, action: PayloadAction<ProductsState['items']>) => {
      state.items = action.payload;
    },
    updateStock: (state, action: PayloadAction<{ id: string; quantity: number }>) => {
      const product = state.items.find((item) => item.id === action.payload.id);
      if (product) {
        product.stock -= action.payload.quantity;
      }
    },
  },
});

export const { setProducts, updateStock } = productsSlice.actions;
export default productsSlice.reducer;
