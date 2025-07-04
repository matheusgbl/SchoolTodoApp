import styled from "styled-components/native";

export const FooterContainer = styled.View`
  background-color: ${({ theme }) => theme.colors.background};
  border-top-width: 1px;
  border-top-color: ${({ theme }) => theme.colors.primary};
  padding: ${({ theme }) => theme.spacing.medium}px;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  min-height: 60px;
`;

export const PaginationContainer = styled.View`
  flex-direction: row;
  align-items: center;
  flex: 1;
  justify-content: center;
`;

export const PageButton = styled.TouchableOpacity<{ disabled?: boolean; variant?: 'primary' | 'secondary' }>`
  padding: ${({ theme }) => theme.spacing.small}px ${({ theme }) => theme.spacing.small}px;
  border-radius: 6px;
  margin: 0 ${({ theme }) => theme.spacing.small / 2}px;
  background-color: ${({ disabled, variant, theme }) => {
    if (disabled) return '#F5F5F5';
    if (variant === 'primary') return theme.colors.primary;
    return 'transparent';
  }};
  border: 1px solid ${({ disabled, variant, theme }) => {
    if (disabled) return theme.colors.primary;
    if (variant === 'primary') return theme.colors.primary;
    return theme.colors.primary;
  }};
  min-width: 40px;
  align-items: center;
  opacity: ${({ disabled }) => disabled ? 0.5 : 1};
`;

export const PageButtonText = styled.Text<{ disabled?: boolean; variant?: 'primary' | 'secondary' }>`
  color: ${({ disabled, variant, theme }) => {
    if (disabled) return '#999';
    if (variant === 'primary') return theme.colors.white;
    return theme.colors.white;
  }};
  font-weight: ${({ variant }) => variant === 'primary' ? '600' : '500'};
  font-size: 14px;
`;
