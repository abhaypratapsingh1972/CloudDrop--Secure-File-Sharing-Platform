// src/features/auth/authSlice.js
import { createSlice } from '@reduxjs/toolkit';
import {
  registerUser,
  loginUser,
  updateUser,
  deleteUser,
  getUser,
} from './authThunk';

const normalizeUser = (user) => {
  if (!user || typeof user !== 'object') return null;

  return {
    ...user,
    id: user.id || user._id,
    _id: user._id || user.id,
  };
};

const stored = localStorage.getItem('user');

let parsedUser = null;

try {
  parsedUser =
    stored && stored !== 'undefined'
      ? normalizeUser(JSON.parse(stored))
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
          state.user = normalizeUser(JSON.parse(stored));
          state.isLoggedIn = !!state.user;
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
      .addCase(registerUser.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
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
        const user = normalizeUser(action.payload.user);
        state.user = user;
        state.isLoggedIn = !!user;

        if (user) {
          localStorage.setItem('user', JSON.stringify(user));
        }
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
        state.user = normalizeUser(action.payload);
        localStorage.setItem(
          'user',
          JSON.stringify(state.user)
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
        state.user = normalizeUser(action.payload);
      })
      .addCase(getUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || 'Get user failed';
      });
  },
});

export const { logoutUser, loadUserFromStorage } = authSlice.actions;
export default authSlice.reducer;
