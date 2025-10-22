// store/slices/filtersSlice.ts
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export interface FiltersState {
    Type?: string;
    MinWeight?: number;
    MaxWeight?: number;
    SearchQuery?: string;
}

const initialState: FiltersState = {};

const filtersSlice = createSlice({
    name: 'filters',
    initialState,
    reducers: {
        setFilters: (state, action: PayloadAction<FiltersState>) => {
            return { ...state, ...action.payload };
        },
        clearFilters: () => {
            return initialState;
        },
        resetFilter: (state, action: PayloadAction<keyof FiltersState>) => {
            delete state[action.payload];
        },
    },
});

export const { setFilters, clearFilters, resetFilter } = filtersSlice.actions;
export default filtersSlice.reducer;