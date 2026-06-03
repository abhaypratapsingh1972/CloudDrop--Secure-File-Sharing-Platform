// src/features/auth/authSlice.js
import { createSlice } from '@reduxjs/toolkit';
import {
  registerUser,
  loginUser,
  updateUser,
  deleteUser,
  getUser,
} from './authThunk';

const stored = localStorage.getItem('user');

let parsedUser = null;

try {
  parsedUser =
    stored && stored !== 'undefined'
      ? JSON.parse(stored)
      : null;
} catch (error) {
  console.error('Invalid user data in localStorage:', error);
  localStorage.removeItem('user');
  parsedUser = null;
}

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: parsedUser,
    isLoggedIn: !!parsedUser,
    loading: false,
    error: null,
  },

  reducers: {
    logoutUser: (state) => {
      state.user = null;
      state.isLoggedIn = false;
      localStorage.removeItem('user');
    },

    loadUserFromStorage: (state) => {
      const stored = localStorage.getItem('user');

      try {
        if (stored && stored !== 'undefined') {
          state.user = JSON.parse(stored);
          state.isLoggedIn = true;
        } else {
          state.user = null;
          state.isLoggedIn = false;
        }
      } catch (error) {
        console.error('Invalid user data in localStorage:', error);
        localStorage.removeItem('user');
        state.user = null;
        state.isLoggedIn = false;
      }
    },
  },

  extraReducers: (builder) => {
    builder
      // REGISTER
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isLoggedIn = true;
        localStorage.setItem('user', JSON.stringify(action.payload));
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Registration failed';
      })

      // LOGIN
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.isLoggedIn = true;
        localStorage.setItem(
          'user',
          JSON.stringify(action.payload.user)
        );
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Login failed';
      })

      // UPDATE USER
      .addCase(updateUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        localStorage.setItem(
          'user',
          JSON.stringify(action.payload)
        );
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || 'Update failed';
      })

      // DELETE USER
      .addCase(deleteUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteUser.fulfilled, (state) => {
        state.loading = false;
        state.user = null;
        state.isLoggedIn = false;
        localStorage.removeItem('user');
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || 'Delete failed';
      })

      // GET USER
      .addCase(getUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(getUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || 'Get user failed';
      });
  },
});

export const { logoutUser, loadUserFromStorage } = authSlice.actions;
export default authSlice.reducer;