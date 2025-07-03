import React from 'react';
import { render, act } from '@testing-library/react-native';
import { useObservations } from '../../hooks/useObservation';
import { useDispatch, useSelector } from 'react-redux';
import { showSuccess, showError } from '../../components/Toast';

jest.mock('react-redux', () => ({
  useDispatch: jest.fn(),
  useSelector: jest.fn(),
}));

jest.mock('../../components/Toast', () => ({
  showSuccess: jest.fn(),
  showError: jest.fn(),
}));

jest.mock('../../store/slices/observationSlice', () => {
  type MockThunk = jest.Mock & {
    fulfilled: { match: jest.Mock };
  };

  const createObservation = jest.fn().mockImplementation(() => {
    return () => Promise.resolve({ type: 'createObservation/fulfilled' });
  }) as MockThunk;
  createObservation.fulfilled = { match: jest.fn(() => true) };

  const toggleFavorite = jest.fn().mockImplementation(() => {
    return () => Promise.resolve({ type: 'toggleFavorite/fulfilled' });
  }) as MockThunk;
  toggleFavorite.fulfilled = { match: jest.fn(() => true) };

  const toggleCompleted = jest.fn().mockImplementation(() => {
    return () => Promise.resolve({ type: 'toggleCompleted/fulfilled' });
  }) as MockThunk;
  toggleCompleted.fulfilled = { match: jest.fn(() => true) };

  const deleteObservation = jest.fn().mockImplementation(() => {
    return () => Promise.resolve({ type: 'deleteObservation/fulfilled' });
  }) as MockThunk;
  deleteObservation.fulfilled = { match: jest.fn(() => true) };

  return {
    __esModule: true,
    createObservation,
    toggleFavorite,
    toggleCompleted,
    deleteObservation,
    resetCreateStatus: jest.fn(() => ({ type: 'resetCreateStatus' })),
    clearError: jest.fn(() => ({ type: 'clearError' })),
    fetchObservations: jest.fn(() => ({ type: 'fetchObservations' })),
  };
});

const mockDispatch = jest.fn().mockImplementation((action) => {
  if (typeof action === 'function') {
    return action(mockDispatch);
  }
  return Promise.resolve(action);
});

const mockState = {
  observations: {
    items: [],
    status: 'idle',
    createStatus: 'idle',
    error: null,
  },
};

function TestComponent({ callback }: { callback: (hook: ReturnType<typeof useObservations>) => void }) {
  callback(useObservations());
  return null;
}

describe('useObservations', () => {
  beforeEach(() => {
    (useDispatch as unknown as jest.Mock).mockReturnValue(mockDispatch);
    (useSelector as unknown as jest.Mock).mockImplementation((selector) => selector(mockState));

    jest.clearAllMocks();

    const {
      createObservation,
      toggleFavorite,
      toggleCompleted,
      deleteObservation,
    } = require('../../store/slices/observationSlice');

    createObservation.fulfilled.match.mockReturnValue(true);
    toggleFavorite.fulfilled.match.mockReturnValue(true);
    toggleCompleted.fulfilled.match.mockReturnValue(true);
    deleteObservation.fulfilled.match.mockReturnValue(true);
  });

  it('dispatches fetchObservations em loadObservations', () => {
    let hook!: ReturnType<typeof useObservations>;
    render(<TestComponent callback={(h) => { hook = h; }} />);

    act(() => {
      hook.loadObservations();
    });

    expect(mockDispatch).toHaveBeenCalledWith(expect.objectContaining({ type: 'fetchObservations' }));
  });

  it('chama showSuccess quando addObservation é fulfilled', async () => {
    const mockData = { studentName: 'João', observation: 'Teste' };

    let hook!: ReturnType<typeof useObservations>;
    render(<TestComponent callback={(h) => { hook = h; }} />);

    await act(async () => {
      await hook.addObservation(mockData as any);
    });

    expect(mockDispatch).toHaveBeenCalled();
    expect(showSuccess).toHaveBeenCalledWith('Observação adicionada com sucesso!');
  });

  it('chama showError quando addObservation falha', async () => {
    mockDispatch.mockImplementationOnce(() => {
      throw new Error('Erro ao criar');
    });

    let hook!: ReturnType<typeof useObservations>;
    render(<TestComponent callback={(h) => { hook = h; }} />);

    await act(async () => {
      await expect(hook.addObservation({} as any)).rejects.toThrow('Erro ao criar');
    });

    expect(showError).toHaveBeenCalledWith('Erro ao adicionar observação');
  });

  it('chama toggleFavorite e mostra toast', async () => {
    const obs = { id: '1', isFavorite: false };

    let hook!: ReturnType<typeof useObservations>;
    render(<TestComponent callback={(h) => { hook = h; }} />);

    await act(async () => {
      await hook.toggleObservationFavorite(obs);
    });

    expect(mockDispatch).toHaveBeenCalled();
    expect(showSuccess).toHaveBeenCalledWith('Adicionado aos favoritos');
  });

  it('chama toggleCompleted e mostra toast', async () => {
    const obs = { id: '1', isCompleted: false };

    let hook!: ReturnType<typeof useObservations>;
    render(<TestComponent callback={(h) => { hook = h; }} />);

    await act(async () => {
      await hook.toggleObservationCompleted(obs);
    });

    expect(mockDispatch).toHaveBeenCalled();
    expect(showSuccess).toHaveBeenCalledWith('Observação marcada como concluída');
  });

  it('chama deleteObservation e mostra toast', async () => {
    let hook!: ReturnType<typeof useObservations>;
    render(<TestComponent callback={(h) => { hook = h; }} />);

    await act(async () => {
      await hook.removeObservation('1');
    });

    expect(mockDispatch).toHaveBeenCalled();
    expect(showSuccess).toHaveBeenCalledWith('Observação removida com sucesso!');
  });

  it('chama resetCreateState', () => {
    let hook!: ReturnType<typeof useObservations>;
    render(<TestComponent callback={(h) => { hook = h; }} />);

    act(() => {
      hook.resetCreateState();
    });

    expect(mockDispatch).toHaveBeenCalledWith(expect.objectContaining({ type: 'resetCreateStatus' }));
  });

  it('chama clearErrors', () => {
    let hook!: ReturnType<typeof useObservations>;
    render(<TestComponent callback={(h) => { hook = h; }} />);

    act(() => {
      hook.clearErrors();
    });

    expect(mockDispatch).toHaveBeenCalledWith(expect.objectContaining({ type: 'clearError' }));
  });
});
