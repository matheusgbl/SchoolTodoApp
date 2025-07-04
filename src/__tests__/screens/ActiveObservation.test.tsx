import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Alert } from 'react-native';
import { useObservations } from '../../hooks/useObservation';
import { ThemeProvider } from 'styled-components/native';
import { testTheme } from '../../test-utils/theme';
import ActiveObservationsScreen from '../../screens/ActiveObservations';

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
        <TouchableOpacity testID="delete-button" onPress={onDelete}>
          <Text>Delete</Text>
        </TouchableOpacity>
        <TouchableOpacity testID="favorite-button" onPress={onToggleFavorite}>
          <Text>Favorite</Text>
        </TouchableOpacity>
        <TouchableOpacity testID="complete-button" onPress={onToggleCompleted}>
          <Text>Complete</Text>
        </TouchableOpacity>
      </>
    );
  };
});

const mockRemoveObservation = jest.fn();
const mockToggleFavorite = jest.fn();
const mockToggleCompleted = jest.fn();

beforeEach(() => {
  jest.clearAllMocks();

  (useObservations as jest.Mock).mockReturnValue({
    removeObservation: mockRemoveObservation,
    toggleObservationFavorite: mockToggleFavorite,
    toggleObservationCompleted: mockToggleCompleted,
  });

  jest.spyOn(Alert, 'alert').mockImplementation((title, message, buttons) => {
    const confirmButton = buttons?.find(
      (b) => b.style === 'destructive' || b.text === 'Excluir' || b.text === 'Concluir'
    );
    confirmButton?.onPress?.();
  });
});

describe('ActiveObservations', () => {
     it('renders list of active observations and excludes completed', () => {
     const observations = [
       { id: '1', studentName: 'Alice', observation: 'Obs 1', isCompleted: false, isFavorite: false, createdAt: '2023-01-01' },
       { id: '2', studentName: 'Bob', observation: 'Obs 2', isCompleted: true, isFavorite: true, createdAt: '2023-01-02' },
       { id: '3', studentName: 'Carol', observation: 'Obs 3', isCompleted: false, isFavorite: false, createdAt: '2023-01-03' },
     ];
     const { getByText, queryByText } = render(
       <ThemeProvider theme={testTheme}>
         <ActiveObservationsScreen observations={observations} onRefresh={() => {}} refreshing={false} />
       </ThemeProvider>
     );

     expect(getByText('Alice')).toBeTruthy();
     expect(getByText('Carol')).toBeTruthy();
     expect(queryByText('Bob')).toBeNull();
   });


     it('renders empty component when no active observations', () => {
     const { getByText } = render(
       <ThemeProvider theme={testTheme}>
         <ActiveObservationsScreen observations={[]} onRefresh={() => {}} refreshing={false} />
       </ThemeProvider>
     );

     expect(getByText('Nenhuma observação ativa')).toBeTruthy();
     expect(getByText(/Todas as suas observações foram concluídas!/i)).toBeTruthy();
   });

    it('calls removeObservation after pressing delete and confirming alert', () => {
     const observations = [{ id: '1', studentName: 'Alice', observation: 'Obs 1', isCompleted: false, isFavorite: false, createdAt: '2023-01-01' }];
     const { getByTestId } = render(
       <ThemeProvider theme={testTheme}>
         <ActiveObservationsScreen observations={observations} onRefresh={() => {}} refreshing={false} />
       </ThemeProvider>
     );

     fireEvent.press(getByTestId('delete-button'));
     expect(Alert.alert).toHaveBeenCalled();
     expect(mockRemoveObservation).toHaveBeenCalledWith('1');
   });


  it('calls toggleObservationFavorite after pressing favorite button', () => {
     const observations = [{ id: '1', studentName: 'Alice', observation: 'Obs 1', isCompleted: false, isFavorite: false, createdAt: '2023-01-01' }];
     const { getByTestId } = render(
       <ThemeProvider theme={testTheme}>
         <ActiveObservationsScreen observations={observations} onRefresh={() => {}} refreshing={false} />
       </ThemeProvider>
     );

     fireEvent.press(getByTestId('favorite-button'));
     expect(mockToggleFavorite).toHaveBeenCalledWith(observations[0]);
   });

    it('calls toggleObservationCompleted after pressing complete button and confirming alert', () => {
     const observations = [{ id: '1', studentName: 'Alice', observation: 'Obs 1', isCompleted: false, isFavorite: false, createdAt: '2023-01-01' }];
     const { getByTestId } = render(
       <ThemeProvider theme={testTheme}>
         <ActiveObservationsScreen observations={observations} onRefresh={() => {}} refreshing={false} />
       </ThemeProvider>
     );

     fireEvent.press(getByTestId('complete-button'));
     expect(Alert.alert).toHaveBeenCalled();
     expect(mockToggleCompleted).toHaveBeenCalledWith(observations[0]);
   });
});
