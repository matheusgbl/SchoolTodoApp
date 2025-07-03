import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { ThemeProvider } from 'styled-components/native';
import AddButton from '../../components/AddButton';
import { testTheme } from '../../test-utils/theme'; // path may vary

describe('AddButton', () => {
  it('calls onAddPress when pressed', () => {
    const mockPress = jest.fn();
    const { getByTestId } = render(
      <ThemeProvider theme={testTheme}>
        <AddButton onAddPress={mockPress} />
      </ThemeProvider>
    );

    fireEvent.press(getByTestId('add-button'));

    expect(mockPress).toHaveBeenCalledTimes(1);
  });
});
