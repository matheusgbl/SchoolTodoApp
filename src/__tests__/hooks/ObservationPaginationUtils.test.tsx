// __tests__/observationPaginationUtils.test.ts
import {
  separateObservations,
  calculatePagination,
  paginateItems,
  getValidPage
} from '../../utils/observationPagination';
import { Observation } from '../../types/observations';

const mockObservations: Observation[] = [
  { id: '1', studentName: 'Alice', observation: 'Test 1', isFavorite: false, isCompleted: false, createdAt: '2023-01-01' },
  { id: '2', studentName: 'Bob', observation: 'Test 2', isFavorite: false, isCompleted: true, createdAt: '2023-01-02' },
  { id: '3', studentName: 'Charlie', observation: 'Test 3', isFavorite: false, isCompleted: false, createdAt: '2023-01-03' },
  { id: '4', studentName: 'David', observation: 'Test 4', isFavorite: false, isCompleted: true, createdAt: '2023-01-04' },
];

describe('observationPaginationUtils', () => {
  describe('separateObservations', () => {
    it('should separate active and completed observations', () => {
      const result = separateObservations(mockObservations);

      expect(result.activeObservations).toHaveLength(2);
      expect(result.completedObservations).toHaveLength(2);
      expect(result.activeObservations.map(obs => obs.id)).toEqual(['1', '3']);
      expect(result.completedObservations.map(obs => obs.id)).toEqual(['2', '4']);
    });

    it('should handle empty array', () => {
      const result = separateObservations([]);

      expect(result.activeObservations).toHaveLength(0);
      expect(result.completedObservations).toHaveLength(0);
    });
  });

  describe('calculatePagination', () => {
    it('should calculate pagination correctly', () => {
      const result = calculatePagination(10, 2, 3);

      expect(result).toEqual({
        currentPage: 2,
        totalPages: 4,
        totalItems: 10,
        itemsPerPage: 3,
        hasNextPage: true,
        hasPreviousPage: true,
      });
    });

    it('should handle edge cases', () => {
      const result = calculatePagination(0, 1, 5);

      expect(result.totalPages).toBe(1);
      expect(result.hasNextPage).toBe(false);
      expect(result.hasPreviousPage).toBe(false);
    });
  });

  describe('paginateItems', () => {
    it('should paginate items correctly', () => {
      const items = ['a', 'b', 'c', 'd', 'e', 'f'];
      const result = paginateItems(items, 2, 3);

      expect(result).toEqual(['d', 'e', 'f']);
    });

    it('should handle last page with fewer items', () => {
      const items = ['a', 'b', 'c', 'd', 'e'];
      const result = paginateItems(items, 2, 3);

      expect(result).toEqual(['d', 'e']);
    });
  });

  describe('getValidPage', () => {
    it('should clamp page to valid range', () => {
      expect(getValidPage(0, 5)).toBe(1);
      expect(getValidPage(10, 5)).toBe(5);
      expect(getValidPage(3, 5)).toBe(3);
    });
  });
});
