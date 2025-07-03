import React from 'react';
import { CardContainer,
  Header,
  StudentName,
  StatusContainer,
  ObservationText,
  Footer,
  DateContainer,
  DateText,
  CompletedDateText,
  ActionsContainer,
  ActionButton,
  ActionButtonText
} from '../styles/components/observationCard';
import { formatDate } from '../utils/formatDate';
import { Observation } from '../types/observations';

interface Props {
  observation: Observation;
  onToggleFavorite?: () => void;
  onDelete?: () => void;
  onToggleCompleted?: () => void;
  showCompleteButton?: boolean;
  showReactivateButton?: boolean;
  isCompleted?: boolean;
}

const ObservationCard: React.FC<Props> = ({
  observation,
  onToggleFavorite,
  onDelete,
  onToggleCompleted,
  showCompleteButton = false,
  showReactivateButton = false,
  isCompleted = false,
}) => {
  return (
    <CardContainer isCompleted={isCompleted}>
      <Header>
        <StudentName isCompleted={isCompleted}>
          {observation.studentName}
        </StudentName>
        <StatusContainer>
            {onToggleFavorite && (
            <ActionButton variant="favorite" onPress={onToggleFavorite}>
              <ActionButtonText variant="favorite">
                {observation.isFavorite ? '★' : '☆'}
              </ActionButtonText>
            </ActionButton>
          )}
        </StatusContainer>
      </Header>

      <ObservationText isCompleted={isCompleted}>
        {observation.observation}
      </ObservationText>

      <Footer>
        <DateContainer>
          <DateText>Criada: {formatDate(observation.createdAt)}</DateText>
          {observation.isCompleted && observation.completedAt && (
            <CompletedDateText>
              Concluída: {formatDate(observation.completedAt)}
            </CompletedDateText>
          )}
        </DateContainer>

        <ActionsContainer>
          {showCompleteButton && onToggleCompleted && (
            <ActionButton variant="complete" onPress={onToggleCompleted}>
              <ActionButtonText variant="complete">✓</ActionButtonText>
            </ActionButton>
          )}

          {showReactivateButton && onToggleCompleted && (
            <ActionButton variant="reactivate" onPress={onToggleCompleted}>
              <ActionButtonText variant="reactivate">↻</ActionButtonText>
            </ActionButton>
          )}

          {onDelete && (
            <ActionButton variant="delete" onPress={onDelete}>
              <ActionButtonText variant="delete">🗑</ActionButtonText>
            </ActionButton>
          )}
        </ActionsContainer>
      </Footer>
    </CardContainer>
  );
};

// Otimização para evitar re-renders desnecessários
export default React.memo(ObservationCard);

