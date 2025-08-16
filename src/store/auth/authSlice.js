import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { auth, githubProvider, googleProvider } from '../../config/firebase';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged, 
  signInWithPopup
} from 'firebase/auth';
import { setUserRole } from '../../utils/roleUtils';


// Thunk untuk sign-in dengan Google
export const signInWithGoogle = createAsyncThunk(
  'auth/signInWithGoogle',
  async (_, { rejectWithValue }) => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      
      // Set role for user
      const role = await setUserRole(user.uid, user.email);
      
      return {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        role: role
      };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Thunk untuk sign-in dengan GitHub
export const signInWithGithub = createAsyncThunk(
  'auth/signInWithGithub',
  async (_, { rejectWithValue }) => {
    try {
      const result = await signInWithPopup(auth, githubProvider);
      const user = result.user;
      
      // Set role for user
      const role = await setUserRole(user.uid, user.email);
      
      return {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        role: role
      };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Thunk untuk login
export const login = createAsyncThunk(
  'auth/login',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Set role for user
      const role = await setUserRole(user.uid, user.email);
      
      // Ekstrak data yang diperlukan
      return {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        role: role
      };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Thunk untuk signup
export const signup = createAsyncThunk(
  'auth/signup',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Set role for user (new users default to customer unless admin email)
      const role = await setUserRole(user.uid, user.email);
      
      // Ekstrak data yang diperlukan
      return {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        role: role
      };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Thunk untuk logout
export const logout = createAsyncThunk('auth/logout', async (_, { rejectWithValue }) => {
  try {
    await signOut(auth);
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

// Thunk untuk memonitor perubahan status autentikasi
export const monitorAuthState = createAsyncThunk(
  'auth/monitorAuthState',
  async (_, { dispatch }) => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Set/update user role (akan update jika email ada di daftar admin)
        const role = await setUserRole(user.uid, user.email);
        
        // Ekstrak data yang diperlukan
        dispatch(setUser({
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          role: role
        }));
      } else {
        dispatch(setUser(null));
      }
    });
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    loading: false,
    error: null,
    isAuthenticated: false,
  },
  reducers: {
    setUser(state, action) {
      state.user = action.payload;
      state.isAuthenticated = !!action.payload;
    },
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Signup
      .addCase(signup.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signup.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(signup.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Logout
      .addCase(logout.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(logout.fulfilled, (state) => {
        state.loading = false;
        state.user = null;
        state.isAuthenticated = false;
      })
      .addCase(logout.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Sign-in dengan Google
      .addCase(signInWithGoogle.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signInWithGoogle.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(signInWithGoogle.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Sign-in dengan GitHub
      .addCase(signInWithGithub.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signInWithGithub.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(signInWithGithub.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
  }
});
export const { setUser, clearError } = authSlice.actions;

export default authSlice.reducer;
