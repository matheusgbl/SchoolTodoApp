// __tests__/paginationUtils.test.ts
import {
  separateObservations,
  calculatePagination,
  paginateItems
} from '../../utils/pagination';
import { Observation } from '../../types/observations';

const mockObservations: Observation[] = [
  { id: '1', studentName: 'Alice', observation: 'Test 1', isFavorite: false, isCompleted: false, createdAt: '2023-01-01' },
  { id: '2', studentName: 'Bob', observation: 'Test 2', isFavorite: false, isCompleted: true, createdAt: '2023-01-02' },
  { id: '3', studentName: 'Charlie', observation: 'Test 3', isFavorite: false, isCompleted: false, createdAt: '2023-01-03' },
  { id: '4', studentName: 'David', observation: 'Test 4', isFavorite: false, isCompleted: true, createdAt: '2023-01-04' },
];

describe('paginationUtils', () => {
  describe('separateObservations', () => {
    it('should separate active and completed observations correctly', () => {
      const result = separateObservations(mockObservations);

      expect(result.activeObservations).toHaveLength(2);
      expect(result.completedObservations).toHaveLength(2);
      expect(result.activeObservations.map(obs => obs.id)).toEqual(['1', '3']);
      expect(result.completedObservations.map(obs => obs.id)).toEqual(['2', '4']);
    });

    it('should handle empty observations array', () => {
      const result = separateObservations([]);

      expect(result.activeObservations).toHaveLength(0);
      expect(result.completedObservations).toHaveLength(0);
    });

    it('should handle all active observations', () => {
      const allActive = mockObservations.map(obs => ({ ...obs, isCompleted: false }));
      const result = separateObservations(allActive);

      expect(result.activeObservations).toHaveLength(4);
      expect(result.completedObservations).toHaveLength(0);
    });

    it('should handle all completed observations', () => {
      const allCompleted = mockObservations.map(obs => ({ ...obs, isCompleted: true }));
      const result = separateObservations(allCompleted);

      expect(result.activeObservations).toHaveLength(0);
      expect(result.completedObservations).toHaveLength(4);
    });
  });

  describe('calculatePagination', () => {
    it('should calculate pagination correctly with multiple pages', () => {
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

    it('should handle first page', () => {
      const result = calculatePagination(10, 1, 3);

      expect(result.hasNextPage).toBe(true);
      expect(result.hasPreviousPage).toBe(false);
    });

    it('should handle last page', () => {
      const result = calculatePagination(10, 4, 3);

      expect(result.hasNextPage).toBe(false);
      expect(result.hasPreviousPage).toBe(true);
    });

    it('should handle single page', () => {
      const result = calculatePagination(3, 1, 5);

      expect(result.totalPages).toBe(1);
      expect(result.hasNextPage).toBe(false);
      expect(result.hasPreviousPage).toBe(false);
    });

    it('should handle empty items', () => {
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

    it('should handle first page', () => {
      const items = ['a', 'b', 'c', 'd', 'e', 'f'];
      const result = paginateItems(items, 1, 3);

      expect(result).toEqual(['a', 'b', 'c']);
    });

    it('should handle last page with fewer items', () => {
      const items = ['a', 'b', 'c', 'd', 'e'];
      const result = paginateItems(items, 2, 3);

      expect(result).toEqual(['d', 'e']);
    });

    it('should handle empty items', () => {
      const result = paginateItems([], 1, 3);

      expect(result).toEqual([]);
    });

    it('should handle page beyond available items', () => {
      const items = ['a', 'b', 'c'];
      const result = paginateItems(items, 5, 3);

      expect(result).toEqual([]);
    });
  });
});
