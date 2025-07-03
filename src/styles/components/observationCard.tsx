import styled from "styled-components/native";

export const CardContainer = styled.View<{ isCompleted?: boolean }>`
  background-color: ${({ theme, isCompleted }) =>
    isCompleted ? '#F8F9FA' : theme.colors.card};
  border-radius: 12px;
  padding: ${({ theme }) => theme.spacing.medium}px;
  margin: ${({ theme }) => `${theme.spacing.small}px ${theme.spacing.medium}px`};
  opacity: ${({ isCompleted }) => isCompleted ? 0.8 : 1};
  border: 2px solid  ${({ theme }) => theme.colors.primary};
`;

export const Header = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: ${({ theme }) => theme.spacing.small}px;
`;

export const StudentName = styled.Text<{ isCompleted?: boolean }>`
  font-size: 18px;
  font-weight: bold;
  color: ${({ theme, isCompleted }) =>
    isCompleted ? theme.colors.textSecondary : theme.colors.white};
  flex: 1;
  margin-right: ${({ theme }) => theme.spacing.small}px;
  text-decoration-line: ${({ isCompleted }) => isCompleted ? 'line-through' : 'none'};
`;

export const StatusContainer = styled.View`
  flex-direction: row;
  align-items: center;
  margin-top: -12px;
`;

export const IndicatorText = styled.Text<{ color?: string }>`
  font-size: 12px;
  color: ${({ color, theme }) => color || theme.colors.white};
`;

export const ObservationText = styled.Text<{ isCompleted?: boolean }>`
  font-size: 14px;
  color: ${({ theme, isCompleted }) =>
    isCompleted ? theme.colors.textSecondary : theme.colors.textSecondary};
  line-height: 20px;
  margin-bottom: ${({ theme }) => theme.spacing.medium}px;
  text-decoration-line: ${({ isCompleted }) => isCompleted ? 'line-through' : 'none'};
`;

export const Footer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

export const DateContainer = styled.View`
  flex: 1;
`;

export const DateText = styled.Text`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

export const CompletedDateText = styled.Text`
  font-size: 11px;
  color: #4CAF50;
  font-style: italic;
  margin-top: 2px;
`;

export const ActionsContainer = styled.View`
  flex-direction: row;
  align-items: center;
`;

export const ActionButton = styled.TouchableOpacity<{ variant?: 'favorite' | 'delete' | 'complete' | 'reactivate' }>`
  padding: ${({ theme }) => theme.spacing.small}px;
  margin-left: ${({ theme }) => theme.spacing.small}px;
  border-radius: 6px;
  align-items: center;
`;

export const ActionButtonText = styled.Text<{ variant?: 'favorite' | 'delete' | 'complete' | 'reactivate' }>`
  font-size: 20px;
  color: ${({ variant, theme }) => {
    switch (variant) {
      case 'favorite': return theme.colors.primary;
      case 'delete': return '#FF6B6B';
      case 'complete': return '#4CAF50';
      case 'reactivate': return '#2196F3';
      default: return theme.colors.textSecondary;
    }
  }};
`;
