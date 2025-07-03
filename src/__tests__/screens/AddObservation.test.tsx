import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import AddObservationScreen from '../../screens/AddObservation';
import { Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ThemeProvider } from 'styled-components/native';
import { testTheme } from '../../test-utils/theme';

jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useNavigation: jest.fn(), // <== necessário
}));

const mockAddObservation = jest.fn();
const mockResetCreateState = jest.fn();
const mockClearErrors = jest.fn();

jest.mock('../../hooks/useObservation', () => ({
  useObservations: () => ({
    addObservation: mockAddObservation,
    createStatus: 'idle',
    error: null,
    resetCreateState: mockResetCreateState,
    clearErrors: mockClearErrors,
  })
}));

const mockGoBack = jest.fn();

describe('AddObservationScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useNavigation as jest.Mock).mockReturnValue({
      goBack: mockGoBack,
    });
  });

  it('renders correctly with empty form', () => {
    const { getByPlaceholderText } = render(
    <ThemeProvider theme={testTheme}>
      <AddObservationScreen />
    </ThemeProvider>
    );

    expect(getByPlaceholderText('Digite o nome do aluno')).toBeTruthy();
    expect(getByPlaceholderText('Descreva sua observação sobre o aluno...')).toBeTruthy();
  });

  it('shows validation errors when form is invalid', async () => {
    const { getByText } = render(
      <ThemeProvider theme={testTheme}>
      <AddObservationScreen />
    </ThemeProvider>
    );

    fireEvent.press(getByText('Salvar'));

    await waitFor(() => {
      expect(getByText('Nome do aluno é obrigatório')).toBeTruthy();
      expect(getByText('Observação é obrigatória')).toBeTruthy();
      expect(getByText('Observação deve ter pelo menos 10 caracteres')).toBeTruthy();
    });
  });

  it('calls addObservation with valid input', async () => {
    const { getByPlaceholderText, getByText } = render(
      <ThemeProvider theme={testTheme}>
      <AddObservationScreen />
    </ThemeProvider>
    );

    fireEvent.changeText(getByPlaceholderText('Digite o nome do aluno'), 'João');
    fireEvent.changeText(getByPlaceholderText('Descreva sua observação sobre o aluno...'), 'Comportamento exemplar em sala.');
    fireEvent.press(getByText('Salvar'));

    await waitFor(() => {
      expect(mockAddObservation).toHaveBeenCalledWith({
        studentName: 'João',
        observation: 'Comportamento exemplar em sala.'
      });
    });
  });

  it('shows confirmation alert when cancelling with unsaved input', () => {
    (useNavigation as jest.Mock).mockReturnValue({ goBack: mockGoBack });

    jest.spyOn(Alert, 'alert');

    const { getByPlaceholderText, getByText } = render(
      <ThemeProvider theme={testTheme}>
        <AddObservationScreen />
      </ThemeProvider>
    );

    fireEvent.changeText(getByPlaceholderText('Digite o nome do aluno'), 'Maria');
    fireEvent.press(getByText('Cancelar'));

    expect(Alert.alert).toHaveBeenCalledWith(
      'Descartar alterações?',
      expect.any(String),
      expect.any(Array)
    );
  });

  it('navigates back immediately when cancel is pressed and form is empty', () => {
    (useNavigation as jest.Mock).mockReturnValue({ goBack: mockGoBack });

    const { getByText } = render(
      <ThemeProvider theme={testTheme}>
        <AddObservationScreen />
      </ThemeProvider>
    );
    fireEvent.press(getByText('Cancelar'));

    expect(mockGoBack).toHaveBeenCalled();
  });
});
