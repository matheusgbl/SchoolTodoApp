import { SafeAreaView } from 'react-native';
import styled from 'styled-components/native';

export const Container = styled(SafeAreaView)`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background};
`;

export const LoadingContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

export const ErrorContainer = styled.View`
  padding: ${({ theme }) => theme.spacing.medium}px;
  margin: ${({ theme }) => theme.spacing.medium}px;
  background-color: #FFF5F5;
  border: 1px solid #FEB2B2;
  border-radius: 8px;
`;

export const ErrorText = styled.Text`
  color: #C53030;
  text-align: center;
  font-size: 16px;
`;

export const RetryButton = styled.TouchableOpacity`
  margin-top: ${({ theme }) => theme.spacing.medium}px;
  padding: ${({ theme }) => theme.spacing.small}px ${({ theme }) => theme.spacing.medium}px;
  background-color: ${({ theme }) => theme.colors.primary};
  border-radius: 6px;
  align-self: center;
`;

export const RetryButtonText = styled.Text`
  color: ${({ theme }) => theme.colors.white};
  font-weight: 600;
`;
