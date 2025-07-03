import { SafeAreaView, ScrollView } from 'react-native';
import styled from 'styled-components/native';


export const Container = styled(SafeAreaView)`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background};
  padding-top: 45%;
`;

export const ScrollContainer = styled(ScrollView)`
  flex: 1;
  padding: ${({ theme }) => theme.spacing.medium}px;
`;

export const FormContainer = styled.View`
  background-color: ${({ theme }) => theme.colors.card};
  border-radius: 12px;
  padding: ${({ theme }) => theme.spacing.large}px;
  margin-bottom: ${({ theme }) => theme.spacing.medium}px;
  border: 2px solid ${({ theme }) => theme.colors.primary};
`;

export const Title = styled.Text`
  font-size: 24px;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.white};
  margin-bottom: ${({ theme }) => theme.spacing.large}px;
  text-align: center;
`;

export const Label = styled.Text`
  font-size: 16px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.white};
  margin-bottom: ${({ theme }) => theme.spacing.small}px;
`;

export const Input = styled.TextInput`
  border: 2px solid #E1E5E9;
  border-radius: 8px;
  padding: ${({ theme }) => theme.spacing.medium}px;
  font-size: 16px;
  color: ${({ theme }) => theme.colors.text};
  background-color: ${({ theme }) => theme.colors.white};
  margin-bottom: ${({ theme }) => theme.spacing.medium}px;
`;

export const TextArea = styled(Input)`
  height: 120px;
  text-align-vertical: top;
`;

export const ButtonContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-top: ${({ theme }) => theme.spacing.medium}px;
`;

export const Button = styled.TouchableOpacity<{ variant?: 'primary' | 'secondary' }>`
  flex: 1;
  padding: ${({ theme }) => theme.spacing.medium}px;
  border-radius: 8px;
  align-items: center;
  justify-content: center;
  margin: 0 ${({ theme }) => theme.spacing.small / 2}px;
  background-color: ${({ variant, theme }) =>
    variant === 'primary' ? theme.colors.primary : '#6C757D'};
  min-height: 48px;
`;

export const ButtonText = styled.Text`
  color: ${({ theme }) => theme.colors.white};
  font-size: 16px;
  font-weight: 600;
`;

export const ErrorText = styled.Text`
  color: #DC3545;
  font-size: 14px;
  margin-bottom: ${({ theme }) => theme.spacing.small}px;
  text-align: center;
`;
