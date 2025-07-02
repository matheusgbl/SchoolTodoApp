import React from 'react';
import Toast from 'react-native-toast-message';

export const showSuccess = (message: string) => {
  Toast.show({
    type: 'success',
    text1: message,
  });
};

export const showError = (message: string) => {
  Toast.show({
    type: 'error',
    text1: message,
  });
};

export const AppToast = () => <Toast />;
