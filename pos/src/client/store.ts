import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './features/cart/cartSlice';
import productsReducer from './features/products/productsSlice';
import loginReducer, { LoginState } from './features/auth/loginSlice';

export interface RootState {
  cart: ReturnType<typeof cartReducer>;
  products: ReturnType<typeof productsReducer>;
  login: LoginState;
}

const store = configureStore({
  reducer: {
    cart: cartReducer,
    products: productsReducer,
    login: loginReducer,
  },
});

export type AppDispatch = typeof store.dispatch;

export default store;
