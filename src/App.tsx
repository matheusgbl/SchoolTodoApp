/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { Provider } from 'react-redux';
import { ThemeProvider } from 'styled-components/native';
import { store } from './store';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import AppNavigator from './navigation/AppNavigator';
import theme from './styles/theme';
import { StatusBar } from 'react-native';
import Toast from 'react-native-toast-message';
import { SafeAreaProvider } from 'react-native-safe-area-context';


const App = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <StatusBar barStyle="light-content" backgroundColor={theme.colors.primary} />
          <SafeAreaProvider>
            <AppNavigator />
            <Toast />
          </SafeAreaProvider>
        </ThemeProvider>
      </Provider>
    </GestureHandlerRootView>
  );
};

export default App;
