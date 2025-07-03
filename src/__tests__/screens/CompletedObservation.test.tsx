// __tests__/screens/CompletedObservations.test.tsx
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import CompletedObservations from '../../screens/CompletedObservations';
import { Alert } from 'react-native';
import { useObservations } from '../../hooks/useObservation';
import { ThemeProvider } from 'styled-components/native';
import { testTheme } from '../../test-utils/theme';

jest.mock('../../hooks/useObservation', () => ({
  useObservations: jest.fn(),
}));

jest.mock('../../components/ObservationCard', () => {
  const { Text, TouchableOpacity } = require('react-native');
  return function ObservationCardMock({
    observation,
    onDelete,
    onToggleFavorite,
    onToggleCompleted,
  }: {
    observation: { studentName: string }; // mínimo necessário
    onDelete: () => void;
    onToggleFavorite: () => void;
    onToggleCompleted: () => void;
  }) {
    return (
      <>
        <Text>{observation.studentName}</Text>
        <TouchableOpacity testID="delete-button" onPress={onDelete}><Text>Delete</Text></TouchableOpacity>
        <TouchableOpacity testID="favorite-button" onPress={onToggleFavorite}><Text>Favorite</Text></TouchableOpacity>
        <TouchableOpacity testID="reactivate-button" onPress={onToggleCompleted}><Text>Reactivate</Text></TouchableOpacity>
      </>
    );
  };
});

describe('CompletedObservations', () => {
  const mockRemove = jest.fn();
  const mockToggleFavorite = jest.fn();
  const mockToggleCompleted = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useObservations as jest.Mock).mockReturnValue({
      removeObservation: mockRemove,
      toggleObservationFavorite: mockToggleFavorite,
      toggleObservationCompleted: mockToggleCompleted,
    });

    jest.spyOn(Alert, 'alert').mockImplementation((title, message, buttons) => {
      buttons?.find(b => b.text === 'Excluir' || b.text === 'Reativar')?.onPress?.();
    });
  });

  it('renders only completed observations', () => {
    const data = [
      { id: '1', studentName: 'Ana', observation: 'Obs 1', isCompleted: true, isFavorite: false, createdAt: '2023-01-01' },
      { id: '2', studentName: 'Bruno', observation: 'Obs 2', isCompleted: false, isFavorite: false, createdAt: '2023-01-02' }
    ];

    const { getByText, queryByText } = render(
      <ThemeProvider theme={testTheme}>
        <CompletedObservations observations={data} onRefresh={() => {}} refreshing={false} />
      </ThemeProvider>
    );

    expect(getByText('Ana')).toBeTruthy();
    expect(queryByText('Bruno')).toBeNull();
  });

  it('renders empty component when no completed observations', () => {
    const { getByText } = render(
      <ThemeProvider theme={testTheme}>
        <CompletedObservations observations={[]} onRefresh={() => {}} refreshing={false} />
      </ThemeProvider>
    );

    expect(getByText('Nenhuma observação concluída')).toBeTruthy();
  });

  it('calls removeObservation on delete confirmation', () => {
    const data = [{ id: '1', studentName: 'Ana', observation: 'Obs 1', isCompleted: true, isFavorite: false, createdAt: '2023-01-01' }];

    const { getByTestId } = render(
      <ThemeProvider theme={testTheme}>
        <CompletedObservations observations={data} onRefresh={() => {}} refreshing={false} />
      </ThemeProvider>
    );

    fireEvent.press(getByTestId('delete-button'));
    expect(mockRemove).toHaveBeenCalledWith('1');
  });

  it('calls toggleFavorite on favorite button press', () => {
    const data = [{ id: '1', studentName: 'Ana', observation: 'Obs 1', isCompleted: true, isFavorite: false, createdAt: '2023-01-01' }];

    const { getByTestId } = render(
      <ThemeProvider theme={testTheme}>
        <CompletedObservations observations={data} onRefresh={() => {}} refreshing={false} />
      </ThemeProvider>
    );

    fireEvent.press(getByTestId('favorite-button'));
    expect(mockToggleFavorite).toHaveBeenCalledWith(data[0]);
  });

  it('calls toggleCompleted (reactivate) on reactivate button press', () => {
    const data = [{ id: '1', studentName: 'Ana', observation: 'Obs 1', isCompleted: true, isFavorite: false, createdAt: '2023-01-01' }];

    const { getByTestId } = render(
      <ThemeProvider theme={testTheme}>
        <CompletedObservations observations={data} onRefresh={() => {}} refreshing={false} />
      </ThemeProvider>
    );

    fireEvent.press(getByTestId('reactivate-button'));
    expect(mockToggleCompleted).toHaveBeenCalledWith(data[0]);
  });
});
