import { configureStore } from '@reduxjs/toolkit';
import authReducer from './features/authSlice';
import situationReducer from './features/situationSlice';
import savedReducer from './features/savedSlice';
import adminReducer from './features/adminSlice';

export const makeStore = () => {
    return configureStore({
        reducer: {
            auth: authReducer,
            situation: situationReducer,
            saved: savedReducer,
            admin: adminReducer,
        },
    });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
