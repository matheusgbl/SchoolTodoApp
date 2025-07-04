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
  resetPagination,
  CreateObservationData,
  FetchObservationsParams
} from '../store/slices/observationSlice';
import { useCallback } from 'react';
import { showSuccess, showError } from '../components/Toast';

export const useObservations = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { items, status, createStatus, error, pagination } = useSelector((state: RootState) => state.observations);

  // Buscar observações com paginação
  const loadObservations = useCallback((params: FetchObservationsParams = {}) => {
    dispatch(fetchObservations(params));
  }, [dispatch]);

  // Navegar para a próxima página
  const goToNextPage = useCallback((filter?: 'all' | 'active' | 'completed' | 'favorites') => {
    if (pagination.hasNextPage) {
      loadObservations({
        page: pagination.currentPage + 1,
        limit: pagination.itemsPerPage,
        filter,
      });
    }
  }, [loadObservations, pagination]);

  // Navegar para a página anterior
  const goToPreviousPage = useCallback((filter?: 'all' | 'active' | 'completed' | 'favorites') => {
    if (pagination.hasPreviousPage) {
      loadObservations({
        page: pagination.currentPage - 1,
        limit: pagination.itemsPerPage,
        filter,
      });
    }
  }, [loadObservations, pagination]);

  // Navegar para uma página específica
  const goToPage = useCallback((page: number, filter?: 'all' | 'active' | 'completed' | 'favorites') => {
    if (page >= 1 && page <= pagination.totalPages) {
      loadObservations({
        page,
        limit: pagination.itemsPerPage,
        filter,
      });
    }
  }, [loadObservations, pagination]);

  // Recarregar a página atual
  const refreshCurrentPage = useCallback((filter?: 'all' | 'active' | 'completed' | 'favorites') => {
    loadObservations({
      page: pagination.currentPage,
      limit: pagination.itemsPerPage,
      filter,
    });
  }, [loadObservations, pagination]);

  // Criar nova observação
  const addObservation = useCallback(async (data: CreateObservationData) => {
    try {
      const result = await dispatch(createObservation(data));
      if (createObservation.fulfilled.match(result)) {
        showSuccess('Observação adicionada com sucesso!');
        // Recarregar a primeira página para mostrar o novo item
        loadObservations({ page: 1, limit: pagination.itemsPerPage });
      }
      return result;
    } catch (err) {
      showError('Erro ao adicionar observação');
      throw err;
    }
  }, [dispatch, loadObservations, pagination.itemsPerPage]);

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
  const removeObservation = useCallback(async (id: string, filter?: 'all' | 'active' | 'completed' | 'favorites') => {
    try {
      const result = await dispatch(deleteObservation(id));
      if (deleteObservation.fulfilled.match(result)) {
        showSuccess('Observação removida com sucesso!');

        // Se a página atual ficou vazia e não é a primeira página, voltar uma página
        if (items.length === 1 && pagination.currentPage > 1) {
          goToPreviousPage(filter);
        } else {
          // Caso contrário, recarregar a página atual
          refreshCurrentPage(filter);
        }
      }
      return result;
    } catch (err) {
      showError('Erro ao remover observação');
      throw err;
    }
  }, [dispatch, items.length, pagination.currentPage, goToPreviousPage, refreshCurrentPage]);

  // Reset do status de criação
  const resetCreateState = useCallback(() => {
    dispatch(resetCreateStatus());
  }, [dispatch]);

  // Limpar erros
  const clearErrors = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  // Reset da paginação
  const resetPaginationState = useCallback(() => {
    dispatch(resetPagination());
  }, [dispatch]);

  // Filtrar observações localmente (para uso em componentes que precisam de filtros rápidos)
  const getFilteredObservations = useCallback((filter: 'all' | 'active' | 'completed' | 'favorites') => {
    switch (filter) {
      case 'active':
        return items.filter(obs => !obs.isCompleted);
      case 'completed':
        return items.filter(obs => obs.isCompleted);
      case 'favorites':
        return items.filter(obs => obs.isFavorite);
      default:
        return items;
    }
  }, [items]);

  return {
    // Dados
    observations: items,
    status,
    createStatus,
    error,
    pagination,

    // Ações básicas
    loadObservations,
    addObservation,
    toggleObservationFavorite,
    toggleObservationCompleted,
    removeObservation,

    // Ações de paginação
    goToNextPage,
    goToPreviousPage,
    goToPage,
    refreshCurrentPage,

    // Utilitários
    resetCreateState,
    clearErrors,
    resetPaginationState,
    getFilteredObservations,
  };
};

