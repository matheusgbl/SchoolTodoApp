import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import apiClient from '../../api/client';

export interface Observation {
  id: string;
  studentName: string;
  observation: string;
  isFavorite: boolean;
  isCompleted: boolean;
  createdAt: string;
  completedAt?: string;
}

export interface CreateObservationData {
  studentName: string;
  observation: string;
  isFavorite?: boolean;
  isCompleted?: boolean;
}

export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

interface ObservationsState {
  items: Observation[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  createStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  pagination: PaginationInfo;
}

const initialState: ObservationsState = {
  items: [],
  status: 'idle',
  createStatus: 'idle',
  error: null,
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 5, // 5 itens por página para melhor visualização
    hasNextPage: false,
    hasPreviousPage: false,
  },
};

// Interface para parâmetros de busca paginada
export interface FetchObservationsParams {
  page?: number;
  limit?: number;
  filter?: 'all' | 'active' | 'completed' | 'favorites';
}

// Async Thunk para buscar observações com paginação
export const fetchObservations = createAsyncThunk(
  'observations/fetchObservations',
  async (params: FetchObservationsParams = {}) => {
    const { page = 1, limit = 5, filter = 'all' } = params;
    let url = `/observations`;

    // Apply filters
    const queryParams = new URLSearchParams();
    if (filter === 'active') {
      queryParams.append('isCompleted', 'false');
    } else if (filter === 'completed') {
      queryParams.append('isCompleted', 'true');
    } else if (filter === 'favorites') {
      queryParams.append('isFavorite', 'true');
    }

    if (queryParams.toString()) {
      url += `?${queryParams.toString()}`;
    }

    const response = await apiClient.get(url);
    let items = response.data as Observation[];

    // Sort by date (most recent first) on client side
    items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    // Manual pagination after sorting
    const totalItems = items.length;
    const totalPages = Math.ceil(totalItems / limit);
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedItems = items.slice(startIndex, endIndex);

    return {
      items: paginatedItems,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems,
        itemsPerPage: limit,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    };
  }
);


// Async Thunk para criar uma nova observação
export const createObservation = createAsyncThunk(
  'observations/createObservation',
  async (observationData: CreateObservationData) => {
    const newObservation = {
      ...observationData,
      isFavorite: observationData.isFavorite || false,
      isCompleted: observationData.isCompleted || false,
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
    // Resetar paginação
    resetPagination: (state) => {
      state.pagination = initialState.pagination;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch observations
      .addCase(fetchObservations.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchObservations.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload.items;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchObservations.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Falha ao buscar observações';
      })

      // Create observation
      .addCase(createObservation.pending, (state) => {
        state.createStatus = 'loading';
      })
      .addCase(createObservation.fulfilled, (state, _action: PayloadAction<Observation>) => {
        state.createStatus = 'succeeded';
        // Não adiciona automaticamente à lista, pois pode estar em uma página diferente
        // A lista será recarregada após a criação
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
        // Atualizar contadores de paginação
        state.pagination.totalItems = Math.max(0, state.pagination.totalItems - 1);
        state.pagination.totalPages = Math.ceil(state.pagination.totalItems / state.pagination.itemsPerPage);
      });
  },
});

export const { resetCreateStatus, clearError, resetPagination } = observationsSlice.actions;
export default observationsSlice.reducer;

