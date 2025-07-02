import { useEffect, useState } from 'react';
import api from '../services/api';
import { Note } from '../redux/slices/notesSlice';

export const useNotes = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchNotes = async () => {
    setLoading(true);
    const response = await api.get<Note[]>('/notes');
    setNotes(response.data);
    setLoading(false);
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  return { notes, loading, refetch: fetchNotes };
};
