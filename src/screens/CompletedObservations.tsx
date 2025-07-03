import React, { useCallback } from 'react';
import { FlatList, Alert } from 'react-native';
import { useObservations } from '../hooks/useObservation';
import ObservationCard from '../components/ObservationCard';
import { Observation } from '../types/observations';
import { Container } from '../styles/screens/home';
import EmptyState from '../components/EmptyState';

interface Props {
  observations: Observation[];
  onRefresh: () => void;
  refreshing: boolean;
}

const CompletedObservations: React.FC<Props> = ({
  observations,
  onRefresh,
  refreshing
}) => {
  const {
    removeObservation,
    toggleObservationFavorite,
    toggleObservationCompleted
  } = useObservations();

  const completedObservations = observations.filter(obs => obs.isCompleted);

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

  const handleReactivate = useCallback((observation: Observation) => {
    Alert.alert(
      'Reativar observação',
      `Deseja reativar a observação sobre ${observation.studentName}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Reativar',
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
      onToggleCompleted={() => handleReactivate(item)}
      showCompleteButton={false}
      showReactivateButton={true}
      isCompleted={true}
    />
  ), [handleDeleteObservation, handleToggleFavorite, handleReactivate]);

  const renderEmptyComponent = () => (
    <EmptyState
      icon='✅'
      text='Nenhuma observação concluída'
      subtext='Quando você marcar observações como concluídas, elas aparecerão aqui.'
      secondSubText='Vá para a aba "Ativas" e marque algumas observações como concluídas.'
    />
  );

  return (
    <Container>
      <FlatList
        data={completedObservations}
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

export default CompletedObservations;

