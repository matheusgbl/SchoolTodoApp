import React, { useCallback } from 'react';
import { FlatList, Alert } from 'react-native';
import styled from 'styled-components/native';
import { useObservations } from '../hooks/useObservation';
import { Observation } from '../store/slices/observationSlice';
import ObservationCard from '../components/ObservationCard';

const Container = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background};
`;

const EmptyContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.large}px;
`;

const EmptyIcon = styled.Text`
  font-size: 64px;
  margin-bottom: ${({ theme }) => theme.spacing.medium}px;
`;

const EmptyText = styled.Text`
  font-size: 18px;
  color: ${({ theme }) => theme.colors.textSecondary};
  text-align: center;
  margin-bottom: ${({ theme }) => theme.spacing.medium}px;
  font-weight: 600;
`;

const EmptySubText = styled.Text`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.textSecondary};
  text-align: center;
  line-height: 20px;
`;

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

  // Filtrar apenas observações concluídas
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
    <EmptyContainer>
      <EmptyIcon>✅</EmptyIcon>
      <EmptyText>Nenhuma observação concluída</EmptyText>
      <EmptySubText>
        Quando você marcar observações como concluídas, elas aparecerão aqui.
        {'\n\n'}
        Vá para a aba "Ativas" e marque algumas observações como concluídas.
      </EmptySubText>
    </EmptyContainer>
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

