import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import FavoritesScreen from '../../screens/Favorite';
import { useObservations } from '../../hooks/useObservation';
import { ThemeProvider } from 'styled-components/native';
import { testTheme } from '../../test-utils/theme';

jest.mock('../../hooks/useObservation');
jest.mock('react-redux', () => ({
  useDispatch: jest.fn(),
  useSelector: jest.fn(),
}));
jest.mock('react-native-toast-message', () => ({
  show: jest.fn(),
}));
jest.mock('../../components/ObservationCard', () => {
  const { Text, TouchableOpacity } = require('react-native');

  return function ObservationCardMock({
    observation,
    onDelete,
    onToggleFavorite,
  }: {
    observation: { studentName: string };
    onDelete: () => void;
    onToggleFavorite: () => void;
  }) {
    return (
      <>
        <Text>{observation.studentName}</Text>
        <TouchableOpacity testID="delete-button" onPress={onDelete}>
          <Text>Delete</Text>
        </TouchableOpacity>
        <TouchableOpacity testID="favorite-button" onPress={onToggleFavorite}>
          <Text>Favorite</Text>
        </TouchableOpacity>
      </>
    );
  };
});

describe('FavoritesScreen', () => {
  const mockRemoveObservation = jest.fn();
  const mockToggleFavorite = jest.fn();
  const mockLoadObservations = jest.fn();

  const setupMock = (overrides = {}) => {
    (useObservations as jest.Mock).mockReturnValue({
      observations: [],
      status: 'idle',
      loadObservations: mockLoadObservations,
      removeObservation: mockRemoveObservation,
      toggleObservationFavorite: mockToggleFavorite,
      ...overrides,
    });
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('calls loadObservations when status is idle', () => {
    setupMock();
    render(
      <ThemeProvider theme={testTheme}>
        <FavoritesScreen />
      </ThemeProvider>
      );
    expect(mockLoadObservations).toHaveBeenCalled();
  });

  it('shows loading indicator when loading and no data', () => {
    setupMock({ status: 'loading' });
    const { getByTestId } = render(
      <ThemeProvider theme={testTheme}>
        <FavoritesScreen />
      </ThemeProvider>
      );
    expect(getByTestId('ActivityIndicator')).toBeTruthy();
  });

  it('renders only favorite observations', () => {
    const observations = [
      { id: '1', studentName: 'Alice', observation: 'Obs', isFavorite: true, isCompleted: false, createdAt: '2023-01-01' },
      { id: '2', studentName: 'Bob', observation: 'Obs', isFavorite: false, isCompleted: false, createdAt: '2023-01-02' },
    ];
    setupMock({ observations, status: 'succeeded' });
    const { getByText, queryByText } = render(
      <ThemeProvider theme={testTheme}>
        <FavoritesScreen />
      </ThemeProvider>
      );
    expect(getByText('Alice')).toBeTruthy();
    expect(queryByText('Bob')).toBeNull();
  });

  it('renders empty state when no favorites', () => {
    setupMock({ observations: [], status: 'succeeded' });
    const { getByText } = render(
      <ThemeProvider theme={testTheme}>
        <FavoritesScreen />
      </ThemeProvider>
      );
    expect(getByText('Nenhuma observação favorita')).toBeTruthy();
  });

  it('calls removeObservation when delete pressed', () => {
    const observations = [
      { id: '1', studentName: 'Alice', observation: 'Obs', isFavorite: true, isCompleted: false, createdAt: '2023-01-01' },
    ];
    setupMock({ observations, status: 'succeeded' });
    const { getByTestId } = render(
      <ThemeProvider theme={testTheme}>
        <FavoritesScreen />
      </ThemeProvider>
      );
    fireEvent.press(getByTestId('delete-button'));
    expect(mockRemoveObservation).toHaveBeenCalledWith('1');
  });

  it('calls toggleObservationFavorite when favorite pressed', () => {
    const observation = { id: '1', studentName: 'Alice', observation: 'Obs', isFavorite: true, isCompleted: false, createdAt: '2023-01-01' };
    setupMock({ observations: [observation], status: 'succeeded' });
    const { getByTestId } = render(
      <ThemeProvider theme={testTheme}>
        <FavoritesScreen />
      </ThemeProvider>
      );
    fireEvent.press(getByTestId('favorite-button'));
    expect(mockToggleFavorite).toHaveBeenCalledWith(observation);
  });
});
