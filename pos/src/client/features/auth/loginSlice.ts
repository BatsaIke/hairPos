import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface LoginState {
  isLoggedIn: boolean;
  token: string | null;
  userDetails: {
    name: string;
    email: string;
  } | null;
  error: string | null;
}

const initialState: LoginState = {
  isLoggedIn: false,
  token: null,
  userDetails: null,
  error: null,
};

const loginSlice = createSlice({
  name: 'login',
  initialState,
  reducers: {
    loginSuccess(state, action: PayloadAction<{ token: string; userDetails: { name: string; email: string } }>) {
      state.isLoggedIn = true;
      state.token = action.payload.token;
      state.userDetails = action.payload.userDetails;
      state.error = null;
    },
    logout(state) {
      state.isLoggedIn = false;
      state.token = null;
      state.userDetails = null;
      state.error = null;
    },
    loginFailure(state, action: PayloadAction<string>) {
      state.error = action.payload;
    },
  },
});

export const { loginSuccess, logout, loginFailure } = loginSlice.actions;

export default loginSlice.reducer;
