import { configureStore } from '@reduxjs/toolkit';
import filtersReducer from './slices/filtersSlice';

export const store = configureStore({
    reducer: {
        filters: filtersReducer,
    },
    devTools: import.meta.env.MODE !== 'production',
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;