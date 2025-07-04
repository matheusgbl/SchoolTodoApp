import { useState, useMemo, useCallback, useEffect } from 'react';
import { PaginationState, UseObservationPaginationProps, UseObservationPaginationReturn } from '../types/observations';

export type TabType = 'active' | 'completed';

export function useObservationPagination({
  observations,
  itemsPerPage = 5
}: UseObservationPaginationProps): UseObservationPaginationReturn {
  const [activeCurrentPage, setActiveCurrentPage] = useState(1);
  const [completedCurrentPage, setCompletedCurrentPage] = useState(1);

  // Separar observações ativas e concluídas
  const activeObservations = useMemo(() =>
    observations.filter(obs => !obs.isCompleted),
    [observations]
  );

  const completedObservations = useMemo(() =>
    observations.filter(obs => obs.isCompleted),
    [observations]
  );

  // Calcular paginação para observações ativas
  const activePagination = useMemo((): PaginationState => {
    const totalItems = activeObservations.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    return {
      currentPage: activeCurrentPage,
      totalPages: Math.max(1, totalPages),
      totalItems,
      itemsPerPage,
      hasNextPage: activeCurrentPage < totalPages,
      hasPreviousPage: activeCurrentPage > 1,
    };
  }, [activeObservations.length, activeCurrentPage, itemsPerPage]);

  // Calcular paginação para observações concluídas
  const completedPagination = useMemo((): PaginationState => {
    const totalItems = completedObservations.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    return {
      currentPage: completedCurrentPage,
      totalPages: Math.max(1, totalPages),
      totalItems,
      itemsPerPage,
      hasNextPage: completedCurrentPage < totalPages,
      hasPreviousPage: completedCurrentPage > 1,
    };
  }, [completedObservations.length, completedCurrentPage, itemsPerPage]);

  // Observações paginadas para aba ativa
  const paginatedActiveObservations = useMemo(() => {
    const startIndex = (activeCurrentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return activeObservations.slice(startIndex, endIndex);
  }, [activeObservations, activeCurrentPage, itemsPerPage]);

  // Observações paginadas para aba concluída
  const paginatedCompletedObservations = useMemo(() => {
    const startIndex = (completedCurrentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return completedObservations.slice(startIndex, endIndex);
  }, [completedObservations, completedCurrentPage, itemsPerPage]);

  const goToNextPage = useCallback((tab: TabType) => {
    if (tab === 'active' && activePagination.hasNextPage) {
      setActiveCurrentPage(prev => prev + 1);
    } else if (tab === 'completed' && completedPagination.hasNextPage) {
      setCompletedCurrentPage(prev => prev + 1);
    }
  }, [activePagination.hasNextPage, completedPagination.hasNextPage]);

  const goToPreviousPage = useCallback((tab: TabType) => {
    if (tab === 'active' && activePagination.hasPreviousPage) {
      setActiveCurrentPage(prev => prev - 1);
    } else if (tab === 'completed' && completedPagination.hasPreviousPage) {
      setCompletedCurrentPage(prev => prev - 1);
    }
  }, [activePagination.hasPreviousPage, completedPagination.hasPreviousPage]);

  const goToPage = useCallback((page: number, tab: TabType) => {
    if (tab === 'active') {
      const validPage = Math.max(1, Math.min(page, activePagination.totalPages));
      setActiveCurrentPage(validPage);
    } else if (tab === 'completed') {
      const validPage = Math.max(1, Math.min(page, completedPagination.totalPages));
      setCompletedCurrentPage(validPage);
    }
  }, [activePagination.totalPages, completedPagination.totalPages]);

  const resetPagination = useCallback((tab: TabType) => {
    if (tab === 'active') {
      setActiveCurrentPage(1);
    } else if (tab === 'completed') {
      setCompletedCurrentPage(1);
    }
  }, []);

  // Auto-ajustar página atual se ela exceder o total de páginas
  useEffect(() => {
    if (activeCurrentPage > activePagination.totalPages && activePagination.totalPages > 0) {
      setActiveCurrentPage(activePagination.totalPages);
    }
  }, [activeCurrentPage, activePagination.totalPages]);

  useEffect(() => {
    if (completedCurrentPage > completedPagination.totalPages && completedPagination.totalPages > 0) {
      setCompletedCurrentPage(completedPagination.totalPages);
    }
  }, [completedCurrentPage, completedPagination.totalPages]);

  return {
    activePagination,
    completedPagination,
    activeObservations,
    completedObservations,
    paginatedActiveObservations,
    paginatedCompletedObservations,
    goToNextPage,
    goToPreviousPage,
    goToPage,
    resetPagination,
  };
}
