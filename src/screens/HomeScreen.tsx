import React, { useEffect } from 'react';
import { SafeAreaView, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { StackNavigationProp } from '@react-navigation/stack';
import styled from 'styled-components/native';
import { useObservations } from '../hooks/useObservation';
import ActiveObservationsScreen from './ActiveObservations';
import CompletedObservationsScreen from './CompletedObservations';
import PaginationFooter from '../components/PaginationFooter';
import { RootStackParamList } from '../navigation/AppNavigator';

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'MainTabs'>;

const Tab = createMaterialTopTabNavigator();

const Container = styled(SafeAreaView)`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background};
`;

const LoadingContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const FloatingButton = styled.TouchableOpacity`
  position: absolute;
  bottom: 80px; /* Ajustado para ficar acima da paginação */
  right: 20px;
  width: 56px;
  height: 56px;
  border-radius: 28px;
  background-color: ${({ theme }) => theme.colors.primary};
  justify-content: center;
  align-items: center;
  shadow-color: #000;
  shadow-offset: 0px 4px;
  shadow-opacity: 0.3;
  shadow-radius: 6px;
  elevation: 8;
  z-index: 1000;
`;

const FloatingButtonText = styled.Text`
  color: ${({ theme }) => theme.colors.white};
  font-size: 24px;
  font-weight: bold;
`;

const ErrorContainer = styled.View`
  padding: ${({ theme }) => theme.spacing.medium}px;
  margin: ${({ theme }) => theme.spacing.medium}px;
  background-color: #FFF5F5;
  border: 1px solid #FEB2B2;
  border-radius: 8px;
`;

const ErrorText = styled.Text`
  color: #C53030;
  text-align: center;
  font-size: 16px;
`;

const RetryButton = styled.TouchableOpacity`
  margin-top: ${({ theme }) => theme.spacing.medium}px;
  padding: ${({ theme }) => theme.spacing.small}px ${({ theme }) => theme.spacing.medium}px;
  background-color: ${({ theme }) => theme.colors.primary};
  border-radius: 6px;
  align-self: center;
`;

const RetryButtonText = styled.Text`
  color: ${({ theme }) => theme.colors.white};
  font-weight: 600;
`;

const TabContainer = styled.View`
  flex: 1;
`;

const HomeScreen = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const {
    observations,
    status,
    pagination,
    loadObservations,
    goToNextPage,
    goToPreviousPage,
    goToPage,
  } = useObservations();

  // Estado para controlar qual aba está ativa
  const [, setActiveTab] = React.useState<'active' | 'completed'>('active');

  useEffect(() => {
    if (status === 'idle') {
      loadObservations({ page: 1, limit: 5, filter: 'all' });
    }
  }, [status, loadObservations]);

  const handleAddObservation = () => {
    navigation.navigate('AddObservation');
  };

  const handlePreviousPage = () => {
    goToPreviousPage('all');
  };

  const handleNextPage = () => {
    goToNextPage('all');
  };

  const handleGoToPage = (page: number) => {
    goToPage(page, 'all');
  };

  const renderErrorComponent = () => (
    <ErrorContainer>
      <ErrorText>Erro ao carregar observações</ErrorText>
      <RetryButton onPress={() => loadObservations({ page: 1, limit: 5, filter: 'all' })}>
        <RetryButtonText>Tentar novamente</RetryButtonText>
      </RetryButton>
    </ErrorContainer>
  );

  // Contar observações ativas e concluídas
  const activeCount = observations.filter(obs => !obs.isCompleted).length;
  const completedCount = observations.filter(obs => obs.isCompleted).length;

  if (status === 'loading' && observations.length === 0) {
    return (
      <Container>
        <LoadingContainer>
          <ActivityIndicator size="large" color="#4A90E2" />
        </LoadingContainer>
        <FloatingButton onPress={handleAddObservation}>
          <FloatingButtonText>+</FloatingButtonText>
        </FloatingButton>
      </Container>
    );
  }

  if (status === 'failed' && observations.length === 0) {
    return (
      <Container>
        {renderErrorComponent()}
        <FloatingButton onPress={handleAddObservation}>
          <FloatingButtonText>+</FloatingButtonText>
        </FloatingButton>
      </Container>
    );
  }

  return (
    <Container>
      <TabContainer>
        <Tab.Navigator
          screenOptions={{
            tabBarActiveTintColor: '#4A90E2',
            tabBarInactiveTintColor: '#888888',
            tabBarIndicatorStyle: {
              backgroundColor: '#4A90E2',
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
                observations={observations}
                onRefresh={() => loadObservations({ page: pagination.currentPage, limit: 5, filter: 'all' })}
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
                observations={observations}
                onRefresh={() => loadObservations({ page: pagination.currentPage, limit: 5, filter: 'all' })}
                refreshing={status === 'loading'}
              />
            )}
          </Tab.Screen>
        </Tab.Navigator>
      </TabContainer>

      {/* Componente de Paginação */}
      <PaginationFooter
        pagination={pagination}
        onPreviousPage={handlePreviousPage}
        onNextPage={handleNextPage}
        onGoToPage={handleGoToPage}
        loading={status === 'loading'}
      />

      <FloatingButton onPress={handleAddObservation}>
        <FloatingButtonText>+</FloatingButtonText>
      </FloatingButton>
    </Container>
  );
};

export default HomeScreen;

