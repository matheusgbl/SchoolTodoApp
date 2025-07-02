import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Note {
  id: number;
  title: string;
  content: string;
}

interface NotesState {
  data: Note[];
  favorites: number[];
}

const initialState: NotesState = {
  data: [],
  favorites: [],
};

const notesSlice = createSlice({
  name: 'notes',
  initialState,
  reducers: {
    addNote: (state, action: PayloadAction<Note>) => {
      state.data.push(action.payload);
    },
    updateNote: (state, action: PayloadAction<Note>) => {
      const index = state.data.findIndex(n => n.id === action.payload.id);
      if (index !== -1) state.data[index] = action.payload;
    },
    deleteNote: (state, action: PayloadAction<number>) => {
      state.data = state.data.filter(note => note.id !== action.payload);
    },
    toggleFavorite: (state, action: PayloadAction<number>) => {
      const idx = state.favorites.indexOf(action.payload);
      if (idx >= 0) state.favorites.splice(idx, 1);
      else state.favorites.push(action.payload);
    }
  }
});

export const { addNote, updateNote, deleteNote, toggleFavorite } = notesSlice.actions;
export default notesSlice.reducer;
