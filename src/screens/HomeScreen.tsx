import React, { useEffect } from 'react';
import { ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { StackNavigationProp } from '@react-navigation/stack';
import { useObservations } from '../hooks/useObservation';
import { useObservationPagination, TabType } from '../hooks/useObservationPagination';
import ActiveObservationsScreen from './ActiveObservations';
import CompletedObservationsScreen from './CompletedObservations';
import PaginationFooter from '../components/PaginationFooter';
import { RootStackParamList } from '../navigation/AppNavigator';
import { ErrorContainer, ErrorText, RetryButton, RetryButtonText, Container, LoadingContainer } from '../styles/screens/home';
import AddButton from '../components/AddButton';

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'MainTabs'>;

const Tab = createMaterialTopTabNavigator();

const HomeScreen = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const {
    observations,
    status,
    loadObservations,
  } = useObservations();

  const [activeTab, setActiveTab] = React.useState<TabType>('active');

  const {
    activePagination,
    completedPagination,
    paginatedActiveObservations,
    paginatedCompletedObservations,
    goToNextPage,
    goToPreviousPage,
    goToPage,
  } = useObservationPagination({
    observations,
    itemsPerPage: 5
  });

  useEffect(() => {
    if (status === 'idle') {
      loadObservations({ page: 1, limit: 100, filter: 'all' }); // Carregar todas as observações
    }
  }, [status, loadObservations]);

  const handleAddObservation = () => {
    navigation.navigate('AddObservation');
  };

  const handlePreviousPage = () => {
    goToPreviousPage(activeTab);
  };

  const handleNextPage = () => {
    goToNextPage(activeTab);
  };

  const handleGoToPage = (page: number) => {
    goToPage(page, activeTab);
  };

  const renderErrorComponent = () => (
    <ErrorContainer>
      <ErrorText>Erro ao carregar observações</ErrorText>
      <RetryButton onPress={() => loadObservations({ page: 1, limit: 100, filter: 'all' })}>
        <RetryButtonText>Tentar novamente</RetryButtonText>
      </RetryButton>
    </ErrorContainer>
  );

  const currentPagination = activeTab === 'active' ? activePagination : completedPagination;

  const activeCount = observations.filter(obs => !obs.isCompleted).length;
  const completedCount = observations.filter(obs => obs.isCompleted).length;

  if (status === 'loading' && observations.length === 0) {
    return (
      <Container>
        <LoadingContainer>
          <ActivityIndicator size="large" color="#7f42d9" />
        </LoadingContainer>
        <AddButton onAddPress={handleAddObservation} />
      </Container>
    );
  }

  if (status === 'failed' && observations.length === 0) {
    return (
      <Container>
        {renderErrorComponent()}
        <AddButton onAddPress={handleAddObservation} />
      </Container>
    );
  }

  return (
    <Container>
        <Tab.Navigator
          screenOptions={{
            tabBarActiveTintColor: '#7f42d9',
            tabBarInactiveTintColor: '#888888',
            tabBarIndicatorStyle: {
              backgroundColor: '#7f42d9',
              height: 3,
            },
            tabBarLabelStyle: {
              fontSize: 14,
              fontWeight: '600',
              textTransform: 'none',
            },
            tabBarStyle: {
              backgroundColor: '#FFFFFF',
              elevation: 4,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
            },
          }}
          screenListeners={{
            state: (e) => {
              // Detectar mudança de aba
              const state = e.data.state;
              if (state) {
                const routeName = state.routes[state.index].name;
                setActiveTab(routeName === 'Active' ? 'active' : 'completed');
              }
            },
          }}
        >
          <Tab.Screen
            name="Active"
            options={{
              tabBarLabel: `Ativas (${activeCount})`,
            }}
          >
            {() => (
              <ActiveObservationsScreen
                observations={paginatedActiveObservations}
                onRefresh={() => loadObservations({ page: 1, limit: 100, filter: 'all' })}
                refreshing={status === 'loading'}
              />
            )}
          </Tab.Screen>

          <Tab.Screen
            name="Completed"
            options={{
              tabBarLabel: `Concluídas (${completedCount})`,
            }}
          >
            {() => (
              <CompletedObservationsScreen
                observations={paginatedCompletedObservations}
                onRefresh={() => loadObservations({ page: 1, limit: 100, filter: 'all' })}
                refreshing={status === 'loading'}
              />
            )}
          </Tab.Screen>
        </Tab.Navigator>

      {/* Componente de Paginação - só mostra se há mais de uma página */}
      {currentPagination.totalPages > 1 && (
        <PaginationFooter
          pagination={{
            currentPage: currentPagination.currentPage,
            totalPages: currentPagination.totalPages,
            totalItems: currentPagination.totalItems,
            itemsPerPage: currentPagination.itemsPerPage,
            hasNextPage: currentPagination.hasNextPage,
            hasPreviousPage: currentPagination.hasPreviousPage,
          }}
          onPreviousPage={handlePreviousPage}
          onNextPage={handleNextPage}
          onGoToPage={handleGoToPage}
          loading={status === 'loading'}
        />
      )}

      <AddButton onAddPress={handleAddObservation} />
    </Container>
  );
};

export default HomeScreen;
