import { configureStore } from '@reduxjs/toolkit';
import authReducer from './features/authSlice';
import situationReducer from './features/situationSlice';

export const makeStore = () => {
    return configureStore({
        reducer: {
            auth: authReducer,
            situation: situationReducer,
        },
    });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
