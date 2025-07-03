import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../store';
import {
  fetchObservations,
  createObservation,
  toggleFavorite,
  toggleCompleted,
  deleteObservation,
  resetCreateStatus,
  clearError,
} from '../store/slices/observationSlice';
import { useCallback } from 'react';
import { showSuccess, showError } from '../components/Toast'; // Importe suas funções de toast
import { CreateObservationData } from '../types/observations';

export const useObservations = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { items, status, createStatus, error } = useSelector((state: RootState) => state.observations);

  // Buscar observações
  const loadObservations = useCallback(() => {
    dispatch(fetchObservations());
  }, [dispatch]);

  // Criar nova observação
  const addObservation = useCallback(async (data: CreateObservationData) => {
    try {
      const result = await dispatch(createObservation(data));
      if (createObservation.fulfilled.match(result)) {
        showSuccess('Observação adicionada com sucesso!');
      }
      return result;
    } catch (err) {
      showError('Erro ao adicionar observação');
      throw err;
    }
  }, [dispatch]);

  // Alternar favorito
  const toggleObservationFavorite = useCallback(async (observation: any) => {
    try {
      const result = await dispatch(toggleFavorite(observation));
      if (toggleFavorite.fulfilled.match(result)) {
        const message = observation.isFavorite
          ? 'Removido dos favoritos'
          : 'Adicionado aos favoritos';
        showSuccess(message);
      }
      return result;
    } catch (err) {
      showError('Erro ao atualizar favorito');
      throw err;
    }
  }, [dispatch]);

  // Alternar status de conclusão
  const toggleObservationCompleted = useCallback(async (observation: any) => {
    try {
      const result = await dispatch(toggleCompleted(observation));
      if (toggleCompleted.fulfilled.match(result)) {
        const message = observation.isCompleted
          ? 'Observação reativada'
          : 'Observação marcada como concluída';
        showSuccess(message);
      }
      return result;
    } catch (err) {
      showError('Erro ao atualizar status');
      throw err;
    }
  }, [dispatch]);

  // Deletar observação
  const removeObservation = useCallback(async (id: string) => {
    try {
      const result = await dispatch(deleteObservation(id));
      if (deleteObservation.fulfilled.match(result)) {
        showSuccess('Observação removida com sucesso!');
      }
      return result;
    } catch (err) {
      showError('Erro ao remover observação');
      throw err;
    }
  }, [dispatch]);

  // Reset do status de criação
  const resetCreateState = useCallback(() => {
    dispatch(resetCreateStatus());
  }, [dispatch]);

  // Limpar erros
  const clearErrors = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  return {
    observations: items,
    status,
    createStatus,
    error,
    loadObservations,
    addObservation,
    toggleObservationFavorite,
    toggleObservationCompleted,
    removeObservation,
    resetCreateState,
    clearErrors,
  };
};

