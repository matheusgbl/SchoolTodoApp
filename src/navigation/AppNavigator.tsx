/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { useTheme } from 'styled-components/native';
import HomeScreen from '../screens/HomeScreen';
import Favorites from '../screens/Favorite';
import AddObservations from '../screens/AddObservation';
import Icon from '@react-native-vector-icons/fontawesome';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Tipos para as rotas do Stack Navigator
export type RootStackParamList = {
  MainTabs: undefined;
  AddObservation: undefined;
};

// Tipos para as rotas do Bottom Tab Navigator
export type BottomTabParamList = {
  Home: undefined;
  Favorites: undefined;
};

const Tab = createBottomTabNavigator<BottomTabParamList>();
const Stack = createStackNavigator<RootStackParamList>();

const HomeTabIcon = ({ color, size }: { color: string; size: number }) => (
  <Icon name="home" size={size} color={color} />
);

const FavoritesTabIcon = ({ color, size }: { color: string; size: number }) => (
  <Icon name="star" size={size} color={color} />
);

// Componente que renderiza as abas inferiores
const BottomTabNavigator = () => {
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: '#888888',
        tabBarStyle: {
          backgroundColor: theme.colors.white,
          borderTopWidth: 2,
          borderTopColor: '#7f42d9',
          paddingTop: 5,
          height: 60 + insets.bottom
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
        headerStyle: {
          backgroundColor: theme.colors.primary,
          elevation: 4,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
        },
        headerTintColor: theme.colors.white,
        headerTitleStyle: {
          fontWeight: 'bold',
          fontSize: 18,
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: 'Observações',
          tabBarLabel: 'Início',
          tabBarIcon: HomeTabIcon
        }}
      />
      <Tab.Screen
        name="Favorites"
        component={Favorites}
        options={{
          title: 'Favoritos',
          tabBarLabel: 'Favoritos',
          tabBarIcon: FavoritesTabIcon
        }}
      />
    </Tab.Navigator>
  );
};

// Navegador principal que inclui as abas e a tela de adicionar
const AppNavigator = () => {
  const theme = useTheme();

  return (
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerStyle: { backgroundColor: theme.colors.primary },
            headerTintColor: theme.colors.white,
            headerTitleStyle: { fontWeight: 'bold' },
          }}
          >
          <Stack.Screen
            name="MainTabs"
            component={BottomTabNavigator}
            options={{ headerShown: false }}
            />
          <Stack.Screen
            name="AddObservation"
            component={AddObservations}
            options={{
              presentation: 'transparentModal',
              animation: 'fade',
              headerShown: false,
            }}
            />
        </Stack.Navigator>
      </NavigationContainer>
  );
};

export default AppNavigator;

