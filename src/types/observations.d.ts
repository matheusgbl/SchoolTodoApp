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
}

export interface ObservationsState {
  items: Observation[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  createStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

export interface PaginationState {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface UseObservationPaginationProps {
  observations: Observation[];
  itemsPerPage?: number;
}

export interface UseObservationPaginationReturn {
  activePagination: PaginationState;
  completedPagination: PaginationState;
  activeObservations: Observation[];
  completedObservations: Observation[];
  paginatedActiveObservations: Observation[];
  paginatedCompletedObservations: Observation[];
  goToNextPage: (tab: TabType) => void;
  goToPreviousPage: (tab: TabType) => void;
  goToPage: (page: number, tab: TabType) => void;
  resetPagination: (tab: TabType) => void;
}
