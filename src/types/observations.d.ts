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
