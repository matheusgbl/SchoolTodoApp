import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import apiClient from '../../api/client';
import { ObservationsState, Observation, CreateObservationData } from '../../types/observations';

const initialState: ObservationsState = {
  items: [],
  status: 'idle',
  createStatus: 'idle',
  error: null,
};

// Async Thunk para buscar observações
export const fetchObservations = createAsyncThunk(
  'observations/fetchObservations',
  async () => {
    const response = await apiClient.get<Observation[]>('/observations?_sort=createdAt&_order=desc');
    return response.data;
  }
);

// Async Thunk para criar uma nova observação
export const createObservation = createAsyncThunk(
  'observations/createObservation',
  async (observationData: CreateObservationData) => {
    const newObservation = {
      ...observationData,
      isFavorite: false,
      isCompleted: false,
      createdAt: new Date().toISOString(),
    };

    const response = await apiClient.post<Observation>('/observations', newObservation);
    return response.data;
  }
);

// Async Thunk para alternar favorito
export const toggleFavorite = createAsyncThunk(
  'observations/toggleFavorite',
  async (observation: Observation) => {
    const updatedObservation = {
      ...observation,
      isFavorite: !observation.isFavorite,
    };

    const response = await apiClient.put<Observation>(`/observations/${observation.id}`, updatedObservation);
    return response.data;
  }
);

// Async Thunk para alternar status de conclusão
export const toggleCompleted = createAsyncThunk(
  'observations/toggleCompleted',
  async (observation: Observation) => {
    const updatedObservation = {
      ...observation,
      isCompleted: !observation.isCompleted,
      completedAt: !observation.isCompleted ? new Date().toISOString() : undefined,
    };

    const response = await apiClient.put<Observation>(`/observations/${observation.id}`, updatedObservation);
    return response.data;
  }
);

// Async Thunk para deletar observação
export const deleteObservation = createAsyncThunk(
  'observations/deleteObservation',
  async (id: string) => {
    await apiClient.delete(`/observations/${id}`);
    return id;
  }
);

const observationsSlice = createSlice({
  name: 'observations',
  initialState,
  reducers: {
    // Reset do status de criação
    resetCreateStatus: (state) => {
      state.createStatus = 'idle';
    },
    // Limpar erros
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch observations
      .addCase(fetchObservations.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchObservations.fulfilled, (state, action: PayloadAction<Observation[]>) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchObservations.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Falha ao buscar observações';
      })

      // Create observation
      .addCase(createObservation.pending, (state) => {
        state.createStatus = 'loading';
      })
      .addCase(createObservation.fulfilled, (state, action: PayloadAction<Observation>) => {
        state.createStatus = 'succeeded';
        // Adiciona a nova observação no início da lista
        state.items.unshift(action.payload);
      })
      .addCase(createObservation.rejected, (state, action) => {
        state.createStatus = 'failed';
        state.error = action.error.message || 'Falha ao criar observação';
      })

      // Toggle favorite
      .addCase(toggleFavorite.fulfilled, (state, action: PayloadAction<Observation>) => {
        const index = state.items.findIndex(item => item.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })

      // Toggle completed
      .addCase(toggleCompleted.fulfilled, (state, action: PayloadAction<Observation>) => {
        const index = state.items.findIndex(item => item.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })

      // Delete observation
      .addCase(deleteObservation.fulfilled, (state, action: PayloadAction<string>) => {
        state.items = state.items.filter(item => item.id !== action.payload);
      });
  },
});

export const { resetCreateStatus, clearError } = observationsSlice.actions;
export default observationsSlice.reducer;

