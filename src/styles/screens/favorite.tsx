import { SafeAreaView } from "react-native";
import styled from "styled-components/native";

export const Container = styled(SafeAreaView)`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background};
`;

export const LoadingContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

export const HeaderContainer = styled.View`
  padding: ${({ theme }) => theme.spacing.medium}px;
  background-color: ${({ theme }) => theme.colors.card};
  border-bottom-width: 1px;
  border-bottom-color: #E1E5E9;
`;

export const HeaderText = styled.Text`
  font-size: 16px;
  color: ${({ theme }) => theme.colors.textSecondary};
  text-align: center;
`;
