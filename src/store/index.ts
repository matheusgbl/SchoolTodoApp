import { configureStore } from '@reduxjs/toolkit';
import observationsReducer from './slices/observationSlice';

export const store = configureStore({
  reducer: {
    observations: observationsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
