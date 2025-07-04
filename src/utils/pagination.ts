import { Observation, PaginationState } from '../types/observations';

export const separateObservations = (observations: Observation[]) => {
  const activeObservations = observations.filter(obs => !obs.isCompleted);
  const completedObservations = observations.filter(obs => obs.isCompleted);
  return { activeObservations, completedObservations };
};

export const calculatePagination = (
  totalItems: number,
  currentPage: number,
  itemsPerPage: number
): PaginationState => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  return {
    currentPage,
    totalPages: Math.max(1, totalPages),
    totalItems,
    itemsPerPage,
    hasNextPage: currentPage < totalPages,
    hasPreviousPage: currentPage > 1,
  };
};

export const paginateItems = <T>(
  items: T[],
  currentPage: number,
  itemsPerPage: number
): T[] => {
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  return items.slice(startIndex, endIndex);
};
