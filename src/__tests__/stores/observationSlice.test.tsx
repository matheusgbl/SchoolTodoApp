import {
  fetchObservations,
  createObservation,
  toggleFavorite,
  toggleCompleted,
  deleteObservation,
} from '../../store/slices/observationSlice';
import apiClient from '../../api/client';
import { Observation, CreateObservationData } from '../../types/observations';

jest.mock('../../api/client', () => ({
  get: jest.fn(),
  post: jest.fn(),
  put: jest.fn(),
  delete: jest.fn(),
}));


describe('observations async thunks', () => {
  let dispatch: jest.Mock;
  let getState: jest.Mock;

  beforeEach(() => {
    dispatch = jest.fn();
    getState = jest.fn();
    jest.clearAllMocks();
  });

  describe('fetchObservations', () => {
       it('dispatches fulfilled action with data on success', async () => {
     const mockData: Observation[] = [
       { id: '1', studentName: 'Alice', observation: 'Test', isFavorite: false, isCompleted: false, createdAt: '2023-01-01' },
     ];
     (apiClient.get as jest.Mock).mockResolvedValue({
       data: mockData,
       headers: { 'x-total-count': '1' },
     });

     // Past the correct parameters
     await fetchObservations({ page: 1, limit: 5, filter: 'all' })(dispatch, getState, undefined);

     expect(dispatch).toHaveBeenCalledWith(expect.objectContaining({ type: fetchObservations.pending.type }));
     expect(dispatch).toHaveBeenCalledWith(expect.objectContaining({
       type: fetchObservations.fulfilled.type,
       payload: {
         items: mockData,
         pagination: {
           currentPage: 1,
           totalPages: 1,
           totalItems: 1,
           itemsPerPage: 5,
           hasNextPage: false,
           hasPreviousPage: false,
         },
       },
     }));
   });


    it('dispatches rejected action on failure', async () => {
      const error = new Error('Network error');
      (apiClient.get as jest.Mock).mockRejectedValue(error);

      await fetchObservations({ page: 1, limit: 5, filter: 'all' })(dispatch, getState, undefined);

      expect(dispatch).toHaveBeenCalledWith(expect.objectContaining({ type: fetchObservations.pending.type }));
      expect(dispatch).toHaveBeenCalledWith(expect.objectContaining({ type: fetchObservations.rejected.type }));
    });
  });

  describe('createObservation', () => {
    it('dispatches fulfilled action with new observation on success', async () => {
      const observationData: CreateObservationData = {
        studentName: 'Bob',
        observation: 'New observation',
      };

      const createdObservation: Observation = {
        id: '2',
        studentName: 'Bob',
        observation: 'New observation',
        isFavorite: false,
        isCompleted: false,
        createdAt: new Date().toISOString(),
      };

      (apiClient.post as jest.Mock).mockResolvedValue({ data: createdObservation });

      await createObservation(observationData)(dispatch, getState, undefined);

      expect(dispatch).toHaveBeenCalledWith(expect.objectContaining({ type: createObservation.pending.type }));
      expect(dispatch).toHaveBeenCalledWith(expect.objectContaining({ type: createObservation.fulfilled.type, payload: createdObservation }));
    });

    it('dispatches rejected action on failure', async () => {
      const error = new Error('Failed to create');
      (apiClient.post as jest.Mock).mockRejectedValue(error);

      const observationData: CreateObservationData = { studentName: 'Bob', observation: 'New observation' };

      await createObservation(observationData)(dispatch, getState, undefined);

      expect(dispatch).toHaveBeenCalledWith(expect.objectContaining({ type: createObservation.pending.type }));
      expect(dispatch).toHaveBeenCalledWith(expect.objectContaining({ type: createObservation.rejected.type }));
    });
  });

  describe('toggleFavorite', () => {
    it('dispatches fulfilled action with updated observation on success', async () => {
      const obs: Observation = {
        id: '1',
        studentName: 'Alice',
        observation: 'Test',
        isFavorite: false,
        isCompleted: false,
        createdAt: '2023-01-01',
      };

      const updatedObs = { ...obs, isFavorite: !obs.isFavorite };

      (apiClient.put as jest.Mock).mockResolvedValue({ data: updatedObs });

      await toggleFavorite(obs)(dispatch, getState, undefined);

      expect(dispatch).toHaveBeenCalledWith(expect.objectContaining({ type: toggleFavorite.pending.type }));
      expect(dispatch).toHaveBeenCalledWith(expect.objectContaining({ type: toggleFavorite.fulfilled.type, payload: updatedObs }));
    });

    it('dispatches rejected action on failure', async () => {
      const obs: Observation = {
        id: '1',
        studentName: 'Alice',
        observation: 'Test',
        isFavorite: false,
        isCompleted: false,
        createdAt: '2023-01-01',
      };

      (apiClient.put as jest.Mock).mockRejectedValue(new Error('Failed to toggle'));

      await toggleFavorite(obs)(dispatch, getState, undefined);

      expect(dispatch).toHaveBeenCalledWith(expect.objectContaining({ type: toggleFavorite.pending.type }));
      expect(dispatch).toHaveBeenCalledWith(expect.objectContaining({ type: toggleFavorite.rejected.type }));
    });
  });

  describe('toggleCompleted', () => {
    it('dispatches fulfilled action with updated observation on success', async () => {
      const obs: Observation = {
        id: '1',
        studentName: 'Alice',
        observation: 'Test',
        isFavorite: false,
        isCompleted: false,
        createdAt: '2023-01-01',
      };

      const updatedObs = {
        ...obs,
        isCompleted: !obs.isCompleted,
        completedAt: new Date().toISOString(),
      };

      (apiClient.put as jest.Mock).mockResolvedValue({ data: updatedObs });

      await toggleCompleted(obs)(dispatch, getState, undefined);

      expect(dispatch).toHaveBeenCalledWith(expect.objectContaining({ type: toggleCompleted.pending.type }));
      expect(dispatch).toHaveBeenCalledWith(expect.objectContaining({ type: toggleCompleted.fulfilled.type, payload: updatedObs }));
    });

    it('dispatches rejected action on failure', async () => {
      const obs: Observation = {
        id: '1',
        studentName: 'Alice',
        observation: 'Test',
        isFavorite: false,
        isCompleted: false,
        createdAt: '2023-01-01',
      };

      (apiClient.put as jest.Mock).mockRejectedValue(new Error('Failed to toggle'));

      await toggleCompleted(obs)(dispatch, getState, undefined);

      expect(dispatch).toHaveBeenCalledWith(expect.objectContaining({ type: toggleCompleted.pending.type }));
      expect(dispatch).toHaveBeenCalledWith(expect.objectContaining({ type: toggleCompleted.rejected.type }));
    });
  });

  describe('deleteObservation', () => {
    it('dispatches fulfilled action with id on success', async () => {
      const id = '1';

      (apiClient.delete as jest.Mock).mockResolvedValue({});

      await deleteObservation(id)(dispatch, getState, undefined);

      expect(dispatch).toHaveBeenCalledWith(expect.objectContaining({ type: deleteObservation.pending.type }));
      expect(dispatch).toHaveBeenCalledWith(expect.objectContaining({ type: deleteObservation.fulfilled.type, payload: id }));
    });

    it('dispatches rejected action on failure', async () => {
      const id = '1';

      (apiClient.delete as jest.Mock).mockRejectedValue(new Error('Failed to delete'));

      await deleteObservation(id)(dispatch, getState, undefined);

      expect(dispatch).toHaveBeenCalledWith(expect.objectContaining({ type: deleteObservation.pending.type }));
      expect(dispatch).toHaveBeenCalledWith(expect.objectContaining({ type: deleteObservation.rejected.type }));
    });
  });
});
