import React from 'react';
import { fireEvent } from '@testing-library/react-native';
import { ThemeProvider } from 'styled-components/native';
import { render } from '@testing-library/react-native';
import ObservationCard from '../../components/ObservationCard';
import { testTheme } from '../../test-utils/theme'; // 👈 Your test theme
import { Observation } from '../../types/observations';

const mockObservation: Observation = {
  id: '1',
  studentName: 'João da Silva',
  observation: 'Precisa melhorar em matemática.',
  isFavorite: false,
  isCompleted: false,
  createdAt: new Date().toISOString(),
  completedAt: undefined,
};

const renderWithTheme = (ui: React.ReactElement) =>
  render(<ThemeProvider theme={testTheme}>{ui}</ThemeProvider>);

describe('ObservationCard', () => {
  it('renders student name and observation text', () => {
    const { getByText } = renderWithTheme(
      <ObservationCard observation={mockObservation} />
    );

    expect(getByText('João da Silva')).toBeTruthy();
    expect(getByText('Precisa melhorar em matemática.')).toBeTruthy();
  });

  it('renders creation date correctly', () => {
    const { getByText } = renderWithTheme(
      <ObservationCard observation={mockObservation} />
    );

    expect(getByText(/Criada:/)).toBeTruthy();
  });

  it('calls onToggleFavorite when favorite button is pressed', () => {
    const onToggleFavorite = jest.fn();
    const { getByText } = renderWithTheme(
      <ObservationCard
        observation={mockObservation}
        onToggleFavorite={onToggleFavorite}
      />
    );

    fireEvent.press(getByText('☆'));
    expect(onToggleFavorite).toHaveBeenCalledTimes(1);
  });

  it('calls onDelete when delete button is pressed', () => {
    const onDelete = jest.fn();
    const { getByText } = renderWithTheme(
      <ObservationCard observation={mockObservation} onDelete={onDelete} />
    );

    fireEvent.press(getByText('🗑'));
    expect(onDelete).toHaveBeenCalledTimes(1);
  });

  it('calls onToggleCompleted when complete button is shown and pressed', () => {
    const onToggleCompleted = jest.fn();
    const { getByText } = renderWithTheme(
      <ObservationCard
        observation={mockObservation}
        onToggleCompleted={onToggleCompleted}
        showCompleteButton
      />
    );

    fireEvent.press(getByText('✓'));
    expect(onToggleCompleted).toHaveBeenCalledTimes(1);
  });

  it('calls onToggleCompleted when reactivate button is shown and pressed', () => {
    const onToggleCompleted = jest.fn();
    const { getByText } = renderWithTheme(
      <ObservationCard
        observation={mockObservation}
        onToggleCompleted={onToggleCompleted}
        showReactivateButton
      />
    );

    fireEvent.press(getByText('↻'));
    expect(onToggleCompleted).toHaveBeenCalledTimes(1);
  });

  it('renders completed date if observation is completed', () => {
    const completedObservation = {
      ...mockObservation,
      isCompleted: true,
      completedAt: new Date().toISOString(),
    };

    const { getByText } = renderWithTheme(
      <ObservationCard observation={completedObservation} />
    );

    expect(getByText(/Concluída:/)).toBeTruthy();
  });
});
