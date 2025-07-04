import React, { useEffect, useCallback, useState } from 'react';
import { FlatList, ActivityIndicator, SafeAreaView } from 'react-native';
import styled from 'styled-components/native';
import { useObservations } from '../hooks/useObservation';
import { Observation } from '../store/slices/observationSlice';
import ObservationCard from '../components/ObservationCard';
import PaginationFooter from '../components/PaginationFooter';

const Container = styled(SafeAreaView)`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background};
`;

const LoadingContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
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

const HeaderContainer = styled.View`
  padding: ${({ theme }) => theme.spacing.medium}px;
  background-color: ${({ theme }) => theme.colors.card};
  border-bottom-width: 1px;
  border-bottom-color: #E1E5E9;
`;

const HeaderText = styled.Text`
  font-size: 16px;
  color: ${({ theme }) => theme.colors.textSecondary};
  text-align: center;
`;

const ListContainer = styled.View`
  flex: 1;
`;

const FavoritesScreen = () => {
  const {
    observations,
    status,
    pagination,
    loadObservations,
    removeObservation,
    toggleObservationFavorite,
    goToNextPage,
    goToPreviousPage,
    goToPage,
  } = useObservations();

  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (!isInitialized) {
      // Carregar favoritos na primeira vez
      loadObservations({ page: 1, limit: 5, filter: 'favorites' });
      setIsInitialized(true);
    }
  }, [isInitialized, loadObservations]);

  // Filtrar apenas observações favoritas (filtro local adicional)
  const favoriteObservations = observations.filter(obs => obs.isFavorite);

  const handleDeleteObservation = useCallback((observation: Observation) => {
    removeObservation(observation.id, 'favorites');
  }, [removeObservation]);

  const handleToggleFavorite = useCallback((observation: Observation) => {
    toggleObservationFavorite(observation);
  }, [toggleObservationFavorite]);

  const handlePreviousPage = () => {
    goToPreviousPage('favorites');
  };

  const handleNextPage = () => {
    goToNextPage('favorites');
  };

  const handleGoToPage = (page: number) => {
    goToPage(page, 'favorites');
  };

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
    <EmptyContainer>
      <EmptyIcon>⭐</EmptyIcon>
      <EmptyText>Nenhuma observação favorita</EmptyText>
      <EmptySubText>
        Marque suas observações mais importantes como favoritas para encontrá-las facilmente aqui.
        {'\n\n'}
        Toque no ícone de estrela em qualquer observação para adicioná-la aos favoritos.
      </EmptySubText>
    </EmptyContainer>
  );

  const renderHeader = () => {
    if (favoriteObservations.length === 0) return null;

    return (
      <HeaderContainer>
        <HeaderText>
          {favoriteObservations.length === 0
            ? 'Nenhuma observação favorita nesta página'
            : `${favoriteObservations.length} observação${favoriteObservations.length !== 1 ? 'ões' : ''} favorita${favoriteObservations.length !== 1 ? 's' : ''} nesta página`
          }
        </HeaderText>
      </HeaderContainer>
    );
  };

  if (status === 'loading' && observations.length === 0 && !isInitialized) {
    return (
      <Container>
        <LoadingContainer>
          <ActivityIndicator size="large" color="#4A90E2" />
        </LoadingContainer>
      </Container>
    );
  }

  return (
    <Container>
      <ListContainer>
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
      </ListContainer>

      {/* Mostrar paginação apenas se há favoritos */}
      {pagination.totalPages > 1 && (
        <PaginationFooter
          pagination={pagination}
          onPreviousPage={handlePreviousPage}
          onNextPage={handleNextPage}
          onGoToPage={handleGoToPage}
          loading={status === 'loading'}
        />
      )}
    </Container>
  );
};

export default FavoritesScreen;

