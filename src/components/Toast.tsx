/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import Toast, { BaseToast, ErrorToast, ToastConfig } from 'react-native-toast-message';

// Configuração personalizada para os toasts
export const toastConfig: ToastConfig = {

  success: (props) => (
    <BaseToast
      {...props}
      style={{
        borderLeftColor: '#4CAF50',
        borderLeftWidth: 7,
        backgroundColor: '#F1F8E9',
        height: 70,
      }}
      contentContainerStyle={{ paddingHorizontal: 15 }}
      text1Style={{
        fontSize: 16,
        fontWeight: '600',
        color: '#2E7D32',
      }}
      text2Style={{
        fontSize: 14,
        color: '#388E3C',
      }}
    />
  ),

  error: (props) => (
    <ErrorToast
      {...props}
      style={{
        borderLeftColor: '#F44336',
        borderLeftWidth: 7,
        backgroundColor: '#FFEBEE',
        height: 70,
      }}
      contentContainerStyle={{ paddingHorizontal: 15 }}
      text1Style={{
        fontSize: 16,
        fontWeight: '600',
        color: '#C62828',
      }}
      text2Style={{
        fontSize: 14,
        color: '#D32F2F',
      }}
    />
  ),

  info: (props) => (
    <BaseToast
      {...props}
      style={{
        borderLeftColor: '#2196F3',
        borderLeftWidth: 7,
        backgroundColor: '#E3F2FD',
        height: 70,
      }}
      contentContainerStyle={{ paddingHorizontal: 15 }}
      text1Style={{
        fontSize: 16,
        fontWeight: '600',
        color: '#1565C0',
      }}
      text2Style={{
        fontSize: 14,
        color: '#1976D2',
      }}
    />
  ),
};

export const showSuccess = (message: string, subtitle?: string) => {
  Toast.show({
    type: 'success',
    text1: message,
    text2: subtitle,
    visibilityTime: 3000,
    autoHide: true,
    topOffset: 60,
    bottomOffset: 40,
  });
};

export const showError = (message: string, subtitle?: string) => {
  Toast.show({
    type: 'error',
    text1: message,
    text2: subtitle,
    visibilityTime: 4000,
    autoHide: true,
    topOffset: 60,
    bottomOffset: 40,
  });
};

export const showInfo = (message: string, subtitle?: string) => {
  Toast.show({
    type: 'info',
    text1: message,
    text2: subtitle,
    visibilityTime: 3000,
    autoHide: true,
    topOffset: 60,
    bottomOffset: 40,
  });
};

export const AppToast = () => <Toast config={toastConfig} />;

