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

const ListContainer = styled.View`
  flex: 1;
  padding-bottom: 20px;
`;

interface Props {
  observations: Observation[];
  onRefresh: () => void;
  refreshing: boolean;
}

const ActiveObservationsScreen: React.FC<Props> = ({
  observations,
  onRefresh,
  refreshing
}) => {
  const {
    removeObservation,
    toggleObservationFavorite,
    toggleObservationCompleted
  } = useObservations();

  // Filtrar apenas observações ativas (não concluídas)
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
          onPress: () => removeObservation(observation.id, 'all')
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
      <EmptyText>Nenhuma observação ativa nesta página</EmptyText>
      <EmptySubText>
        {observations.length === 0
          ? 'Todas as suas observações foram concluídas!\n\nAdicione novas observações ou verifique a aba "Concluídas" para ver o histórico.'
          : 'Todas as observações desta página estão concluídas.\n\nVerifique outras páginas ou a aba "Concluídas".'
        }
      </EmptySubText>
    </EmptyContainer>
  );

  return (
    <Container>
      <ListContainer>
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
          // Otimizações para performance
          removeClippedSubviews={true}
          maxToRenderPerBatch={5}
          updateCellsBatchingPeriod={50}
          initialNumToRender={5}
          windowSize={10}
        />
      </ListContainer>
    </Container>
  );
};

export default ActiveObservationsScreen;

