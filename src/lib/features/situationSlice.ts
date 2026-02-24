import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:8000';

interface Situation {
    id: number;
    sport_type: string;
    athlete_age_group: string;
    situation_type: string;
    description: string;
    parent_behavior: string;
    channel: string;
    tone: string;
    urgency: string;
    primary_response?: string;
    alternate_responses?: string[];
    keywords?: string[];
    created_at: string;
}

interface SituationState {
    situations: Situation[];
    currentSituation: Situation | null;
    isLoading: boolean;
    error: string | null;
}

const initialState: SituationState = {
    situations: [],
    currentSituation: null,
    isLoading: false,
    error: null,
};

export const submitSituation = createAsyncThunk(
    'situation/submit',
    async (situationData: Omit<Situation, 'id' | 'created_at'>, thunkAPI: any) => {
        try {
            const token = thunkAPI.getState().auth.token;
            const response = await axios.post(`${API_URL}/situations/`, situationData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            return response.data;
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.response?.data?.detail || 'Failed to submit');
        }
    }
);

export const fetchHistory = createAsyncThunk(
    'situation/history',
    async (_, thunkAPI: any) => {
        try {
            const token = thunkAPI.getState().auth.token;
            const response = await axios.get(`${API_URL}/situations/`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            return response.data;
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.response?.data?.detail || 'Failed to fetch history');
        }
    }
);

const situationSlice = createSlice({
    name: 'situation',
    initialState,
    reducers: {
        clearCurrentSituation: (state) => {
            state.currentSituation = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(submitSituation.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(submitSituation.fulfilled, (state, action) => {
                state.isLoading = false;
                state.currentSituation = action.payload;
                state.situations.unshift(action.payload);
            })
            .addCase(submitSituation.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })
            .addCase(fetchHistory.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchHistory.fulfilled, (state, action) => {
                state.isLoading = false;
                state.situations = action.payload;
            });
    }
});

export const { clearCurrentSituation } = situationSlice.actions;
export default situationSlice.reducer;
