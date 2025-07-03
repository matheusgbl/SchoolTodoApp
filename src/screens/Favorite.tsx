/* eslint-disable react-native/no-inline-styles */
import React, { useEffect, useCallback } from 'react';
import { FlatList, ActivityIndicator } from 'react-native';
import { Observation } from '../types/observations';
import { useObservations } from '../hooks/useObservation';
import ObservationCard from '../components/ObservationCard';
import { Container,
  HeaderContainer,
  HeaderText,
  LoadingContainer
} from '../styles/screens/favorite';
import EmptyState from '../components/EmptyState';

const FavoritesScreen = () => {
  const {
    observations,
    status,
    loadObservations,
    removeObservation,
    toggleObservationFavorite
  } = useObservations();

  useEffect(() => {
    if (status === 'idle') {
      loadObservations();
    }
  }, [status, loadObservations]);

  // Filtrar apenas observações favoritas
  const favoriteObservations = observations.filter(obs => obs.isFavorite);

  const handleDeleteObservation = useCallback((observation: Observation) => {
    removeObservation(observation.id);
  }, [removeObservation]);

  const handleToggleFavorite = useCallback((observation: Observation) => {
    toggleObservationFavorite(observation);
  }, [toggleObservationFavorite]);

  const renderItem = useCallback(({ item }: { item: Observation }) => (
    <ObservationCard
      observation={item}
      onDelete={() => handleDeleteObservation(item)}
      onToggleFavorite={() => handleToggleFavorite(item)}
    />
  ), [handleDeleteObservation, handleToggleFavorite]);

  const renderEmptyComponent = () => (
    <EmptyState
      icon='⭐'
      text='Nenhuma observação favorita'
      subtext='Marque suas observações mais importantes como favoritas para encontrá-las facilmente aqui.'
      secondSubText='Toque no ícone de estrela em qualquer observação para adicioná-la aos favoritos.'
    />
  );

  const renderHeader = () => (
    <HeaderContainer>
      <HeaderText>
        {favoriteObservations.length === 0
          ? 'Nenhuma observação favorita'
          : `${favoriteObservations.length} observaç${favoriteObservations.length !== 1 ? 'ões' : 'ão'} favorita${favoriteObservations.length !== 1 ? 's' : ''}`
        }
      </HeaderText>
    </HeaderContainer>
  );

  if (status === 'loading' && observations.length === 0) {
    return (
      <Container>
        <LoadingContainer>
          <ActivityIndicator size="large" color="#7f42d9" testID='ActivityIndicator' />
        </LoadingContainer>
      </Container>
    );
  }

  return (
    <Container>
      <FlatList
        data={favoriteObservations}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{
          paddingVertical: 8,
          flexGrow: 1,
        }}
        onRefresh={loadObservations}
        refreshing={status === 'loading'}
        ListEmptyComponent={renderEmptyComponent}
        ListHeaderComponent={favoriteObservations.length > 0 ? renderHeader : null}
        showsVerticalScrollIndicator={false}
      />
    </Container>
  );
};

export default FavoritesScreen;

