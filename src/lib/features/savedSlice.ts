import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:8000';

interface SavedSituation {
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

interface SavedState {
    savedItems: SavedSituation[];
    isLoading: boolean;
    error: string | null;
}

const initialState: SavedState = {
    savedItems: [],
    isLoading: false,
    error: null,
};

export const fetchSaved = createAsyncThunk(
    'saved/fetch',
    async (_, thunkAPI: any) => {
        try {
            const token = thunkAPI.getState().auth.token;
            const response = await axios.get(`${API_URL}/saved/`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            return response.data;
        } catch (error: any) {
            // Return empty array if endpoint doesn't exist yet
            return [];
        }
    }
);

export const saveSituationResponse = createAsyncThunk(
    'saved/save',
    async (situationId: number, thunkAPI: any) => {
        try {
            const token = thunkAPI.getState().auth.token;
            const response = await axios.post(`${API_URL}/saved/${situationId}`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            return response.data;
        } catch (error: any) {
            // Fallback: use local state
            const situations = thunkAPI.getState().situation.situations;
            return situations.find((s: any) => s.id === situationId);
        }
    }
);

export const removeSaved = createAsyncThunk(
    'saved/remove',
    async (situationId: number, thunkAPI: any) => {
        try {
            const token = thunkAPI.getState().auth.token;
            await axios.delete(`${API_URL}/saved/${situationId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            return situationId;
        } catch {
            return situationId;
        }
    }
);

const savedSlice = createSlice({
    name: 'saved',
    initialState,
    reducers: {
        saveLocally: (state, action) => {
            const exists = state.savedItems.find(s => s.id === action.payload.id);
            if (!exists) {
                state.savedItems.unshift(action.payload);
            }
        },
        removeLocally: (state, action) => {
            state.savedItems = state.savedItems.filter(s => s.id !== action.payload);
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchSaved.fulfilled, (state, action) => {
                if (action.payload.length > 0) {
                    state.savedItems = action.payload;
                }
            })
            .addCase(saveSituationResponse.fulfilled, (state, action) => {
                if (action.payload) {
                    const exists = state.savedItems.find(s => s.id === action.payload.id);
                    if (!exists) {
                        state.savedItems.unshift(action.payload);
                    }
                }
            })
            .addCase(removeSaved.fulfilled, (state, action) => {
                state.savedItems = state.savedItems.filter(s => s.id !== action.payload);
            });
    }
});

export const { saveLocally, removeLocally } = savedSlice.actions;
export default savedSlice.reducer;
