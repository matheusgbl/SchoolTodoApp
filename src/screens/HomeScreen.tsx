/* eslint-disable react-native/no-inline-styles */
import React, { useEffect } from 'react';
import { ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { StackNavigationProp } from '@react-navigation/stack';
import { useObservations } from '../hooks/useObservation';
import ActiveObservations from './ActiveObservations';
import CompletedObservations from './CompletedObservations';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AddButton from '../components/AddButon';
import { ErrorContainer, ErrorText, RetryButton, RetryButtonText, Container, LoadingContainer } from '../styles/screens/home';

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'MainTabs'>;

const Tab = createMaterialTopTabNavigator();

const HomeScreen = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const { observations, status, loadObservations } = useObservations();
  const insets = useSafeAreaInsets();

  useEffect(() => {
    if (status === 'idle') {
      loadObservations();
    }
  }, [status, loadObservations]);

  const handleAddObservation = () => {
    navigation.navigate('AddObservation');
  };

  const renderErrorComponent = () => (
    <ErrorContainer>
      <ErrorText>Erro ao carregar observações</ErrorText>
      <RetryButton onPress={loadObservations}>
        <RetryButtonText>Tentar novamente</RetryButtonText>
      </RetryButton>
    </ErrorContainer>
  );

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
    <Container
      style={{
        flex: 1,
        paddingBottom: insets.bottom,
      }}
    >
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
      >
        <Tab.Screen
          name="Active"
          options={{
            tabBarLabel: `Ativas (${activeCount})`,
          }}
        >
          {() => (
            <ActiveObservations
              observations={observations}
              onRefresh={loadObservations}
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
            <CompletedObservations
              observations={observations}
              onRefresh={loadObservations}
              refreshing={status === 'loading'}
            />
          )}
        </Tab.Screen>
      </Tab.Navigator>

      <AddButton onAddPress={handleAddObservation} />
    </Container>
  );
};

export default HomeScreen;

