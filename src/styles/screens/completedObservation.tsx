import styled from "styled-components/native";

export const Container = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background};
`;

export const EmptyContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.large}px;
`;

export const EmptyIcon = styled.Text`
  font-size: 64px;
  margin-bottom: ${({ theme }) => theme.spacing.medium}px;
`;

export const EmptyText = styled.Text`
  font-size: 18px;
  color: ${({ theme }) => theme.colors.textSecondary};
  text-align: center;
  margin-bottom: ${({ theme }) => theme.spacing.medium}px;
  font-weight: 600;
`;

export const EmptySubText = styled.Text`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.textSecondary};
  text-align: center;
  line-height: 20px;
`;
