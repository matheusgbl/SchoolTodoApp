/* eslint-disable react-native/no-inline-styles */
import React, { useCallback } from 'react';
import { FlatList, Alert } from 'react-native';
import ObservationCard from '../components/ObservationCard';
import { Container } from '../styles/screens/home';
import { Observation } from '../types/observations';
import { useObservations } from '../hooks/useObservation';
import { EmptyContainer, EmptyIcon, EmptyText, EmptySubText } from '../styles/screens/favorite';

interface Props {
  observations: Observation[];
  onRefresh: () => void;
  refreshing: boolean;
}

const ActiveObservations: React.FC<Props> = ({ 
  observations, 
  onRefresh, 
  refreshing 
}) => {
  const { 
    removeObservation, 
    toggleObservationFavorite,
    toggleObservationCompleted 
  } = useObservations();
  const activeObservations = observations.filter(obs => !obs.isCompleted);

  const handleDeleteObservation = useCallback((observation: Observation) => {
    Alert.alert(
      'Confirmar exclusão',
      `Deseja realmente excluir a observação sobre ${observation.studentName}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Excluir', 
          style: 'destructive',
          onPress: () => removeObservation(observation.id)
        }
      ]
    );
  }, [removeObservation]);

  const handleToggleFavorite = useCallback((observation: Observation) => {
    toggleObservationFavorite(observation);
  }, [toggleObservationFavorite]);

  const handleToggleCompleted = useCallback((observation: Observation) => {
    Alert.alert(
      'Marcar como concluída',
      `Deseja marcar a observação sobre ${observation.studentName} como concluída?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Concluir', 
          onPress: () => toggleObservationCompleted(observation)
        }
      ]
    );
  }, [toggleObservationCompleted]);

  const renderItem = useCallback(({ item }: { item: Observation }) => (
    <ObservationCard 
      observation={item}
      onDelete={() => handleDeleteObservation(item)}
      onToggleFavorite={() => handleToggleFavorite(item)}
      onToggleCompleted={() => handleToggleCompleted(item)}
      showCompleteButton={true}
    />
  ), [handleDeleteObservation, handleToggleFavorite, handleToggleCompleted]);

  const renderEmptyComponent = () => (
    <EmptyContainer>
      <EmptyIcon>📝</EmptyIcon>
      <EmptyText>Nenhuma observação ativa</EmptyText>
      <EmptySubText>
        Todas as suas observações foram concluídas!
        {'\n\n'}
        Adicione novas observações ou verifique a aba "Concluídas" para ver o histórico.
      </EmptySubText>
    </EmptyContainer>
  );

  return (
    <Container>
      <FlatList
        data={activeObservations}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ 
          paddingVertical: 8,
          flexGrow: 1,
        }}
        onRefresh={onRefresh}
        refreshing={refreshing}
        ListEmptyComponent={renderEmptyComponent}
        showsVerticalScrollIndicator={false}
      />
    </Container>
  );
};

export default ActiveObservations;
