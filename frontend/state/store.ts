import { configureStore, createAction, createReducer, createSlice } from '@reduxjs/toolkit';

const counterSlice = createSlice({
  name: 'counter',
  initialState: {
    ls_paths: [],
    cat_path: [],
  },
  reducers: {
    increment: (state, payload) => state + payload,
  },
});

export const store = configureStore({ reducer: counterSlice.reducer });
