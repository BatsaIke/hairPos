import React, { createContext, useReducer, useEffect, ReactNode } from 'react';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl?: string
}

interface CartState {
  items: CartItem[];
}

export interface CartContextType {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  incrementItem: (id: string) => void;
  decrementItem: (id: string) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  checkout: () => void;
  imageUrl?: string;
}

// Safely parse local storage to avoid crashes if data is malformed
const getInitialCartItems = (): CartItem[] => {
  try {
    return JSON.parse(localStorage.getItem('cart') || '[]');
  } catch {
    console.warn('Invalid cart data in localStorage, resetting cart.');
    return [];
  }
};

const initialState: CartState = {
  items: getInitialCartItems(),
};

type CartAction =
  | { type: 'ADD_ITEM'; payload: CartItem }
  | { type: 'INCREMENT_ITEM'; payload: string }
  | { type: 'DECREMENT_ITEM'; payload: string }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'CLEAR_CART' };

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existingItem = state.items.find((item) => item.id === action.payload.id);
      if (existingItem) {
        return {
          ...state,
          items: state.items.map((item) =>
            item.id === action.payload.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          ),
        };
      }
      return { ...state, items: [...state.items, { ...action.payload, quantity: 1 }] };
    }
    case 'INCREMENT_ITEM':
      return {
        ...state,
        items: state.items.map((item) =>
          item.id === action.payload ? { ...item, quantity: item.quantity + 1 } : item
        ),
      };
    case 'DECREMENT_ITEM':
      return {
        ...state,
        items: state.items
          .map((item) =>
            item.id === action.payload ? { ...item, quantity: item.quantity - 1 } : item
          )
          .filter((item) => item.quantity > 0), // Removes item if quantity becomes 0
      };
    case 'REMOVE_ITEM':
      return { ...state, items: state.items.filter((item) => item.id !== action.payload) };
    case 'CLEAR_CART':
      return { ...state, items: [] };
    default:
      return state;
  }
};

export const CartContext = createContext<CartContextType | null>(null);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  useEffect(() => {
    try {
      localStorage.setItem('cart', JSON.stringify(state.items));
    } catch (error) {
      console.error('Failed to save cart to localStorage:', error);
    }
  }, [state.items]);

  const addItem = (item: CartItem) => dispatch({ type: 'ADD_ITEM', payload: item });
  const incrementItem = (id: string) => dispatch({ type: 'INCREMENT_ITEM', payload: id });
  const decrementItem = (id: string) => dispatch({ type: 'DECREMENT_ITEM', payload: id });
  const removeItem = (id: string) => dispatch({ type: 'REMOVE_ITEM', payload: id });
  const clearCart = () => dispatch({ type: 'CLEAR_CART' });

  const checkout = () => {
    if (state.items.length > 0) {
      console.log('Proceeding to checkout with:', state.items);
      clearCart();
    } else {
      console.warn('Checkout attempted with an empty cart.');
    }
  };

  return (
    <CartContext.Provider
      value={{
        items: state.items,
        addItem,
        incrementItem,
        decrementItem,
        removeItem,
        clearCart,
        checkout,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
