/* eslint-disable react-native/no-inline-styles */
import React, { useEffect, useCallback, useState } from 'react';
import { FlatList, ActivityIndicator } from 'react-native';
import { useObservations } from '../hooks/useObservation';
import { Observation } from '../store/slices/observationSlice';
import ObservationCard from '../components/ObservationCard';
import EmptyState from '../components/EmptyState';
import { Container } from '../styles/screens/activeObservation';
import { HeaderContainer, HeaderText } from '../styles/screens/favorite';
import { LoadingContainer } from '../styles/screens/home';


const FavoritesScreen = () => {
  const {
    observations,
    status,
    pagination,
    loadObservations,
    removeObservation,
    toggleObservationFavorite,
  } = useObservations();

  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (!isInitialized) {
      loadObservations({ page: 1, limit: 5, filter: 'favorites' });
      setIsInitialized(true);
    }
  }, [isInitialized, loadObservations]);

  const favoriteObservations = observations.filter(obs => obs.isFavorite);

  const handleDeleteObservation = useCallback((observation: Observation) => {
    removeObservation(observation.id, 'favorites');
  }, [removeObservation]);

  const handleToggleFavorite = useCallback((observation: Observation) => {
    toggleObservationFavorite(observation);
  }, [toggleObservationFavorite]);

  const handleRefresh = () => {
    loadObservations({ page: pagination.currentPage, limit: 5, filter: 'favorites' });
  };

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

  const renderHeader = () => {
    if (favoriteObservations.length === 0) return null;

    return (
      <HeaderContainer>
        <HeaderText>
          {favoriteObservations.length === 0
            ? 'Nenhuma observação favorita nesta página'
            : `${favoriteObservations.length} observaç${favoriteObservations.length !== 1 ? 'ões' : 'ão'} favorita${favoriteObservations.length !== 1 ? 's' : ''} nesta página`
          }
        </HeaderText>
      </HeaderContainer>
    );
  };

  if (status === 'loading' && observations.length === 0 && !isInitialized) {
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
          onRefresh={handleRefresh}
          refreshing={status === 'loading'}
          ListEmptyComponent={renderEmptyComponent}
          ListHeaderComponent={renderHeader}
          showsVerticalScrollIndicator={false}
          // Otimizações para performance
          removeClippedSubviews={true}
          maxToRenderPerBatch={5}
          updateCellsBatchingPeriod={50}
          initialNumToRender={5}
          windowSize={10}
        />
    </Container>
  );
};

export default FavoritesScreen;

