import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:8000';

interface User {
    id: number;
    email: string;
    name: string;
    sport_type?: string;
    experience_level?: string;
    organization?: string;
}

interface AuthState {
    user: User | null;
    token: string | null;
    isLoading: boolean;
    error: string | null;
}

const initialState: AuthState = {
    user: null,
    token: typeof window !== 'undefined' ? localStorage.getItem('token') : null,
    isLoading: false,
    error: null,
};

export const registerUser = createAsyncThunk('auth/register', async (userData: any, thunkAPI) => {
    try {
        const response = await axios.post(`${API_URL}/auth/register`, userData);
        return response.data;
    } catch (error: any) {
        return thunkAPI.rejectWithValue(error.response?.data?.detail || 'Registration failed');
    }
});

export const loginUser = createAsyncThunk('auth/login', async (credentials: any, thunkAPI) => {
    try {
        const formData = new FormData();
        formData.append('username', credentials.email);
        formData.append('password', credentials.password);
        const response = await axios.post(`${API_URL}/auth/login`, formData);
        localStorage.setItem('token', response.data.access_token);
        return response.data;
    } catch (error: any) {
        return thunkAPI.rejectWithValue(error.response.data.detail || 'Login failed');
    }
});

export const fetchCurrentUser = createAsyncThunk('auth/me', async (_, thunkAPI) => {
    try {
        const token = (thunkAPI.getState() as any).auth.token;
        if (!token) throw new Error('No token');
        const response = await axios.get(`${API_URL}/auth/me`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (error: any) {
        return thunkAPI.rejectWithValue(error.response?.data?.detail || 'Failed to fetch user');
    }
});

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout: (state) => {
            state.user = null;
            state.token = null;
            localStorage.removeItem('token');
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginUser.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.isLoading = false;
                state.token = action.payload.access_token;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })
            .addCase(registerUser.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(registerUser.fulfilled, (state) => {
                state.isLoading = false;
                state.error = null;
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })
            .addCase(fetchCurrentUser.fulfilled, (state, action) => {
                state.user = action.payload;
            });
    },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
