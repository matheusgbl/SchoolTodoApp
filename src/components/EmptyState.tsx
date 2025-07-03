import React from 'react';
import { EmptyContainer, EmptyIcon, EmptySubText, EmptyText } from '../styles/components/emptyState'

interface Props {
  icon: string;
  text: string;
  subtext: string;
  secondSubText: string;
}

const EmptyState: React.FC<Props> = ({ icon, text, subtext, secondSubText }) => {

  return (
    <EmptyContainer>
      <EmptyIcon>{icon}</EmptyIcon>
      <EmptyText>{text}</EmptyText>
        <EmptySubText>
          {subtext}
          {'\n\n'}
          {secondSubText}
        </EmptySubText>
    </EmptyContainer>
  )
}

export default React.memo(EmptyState);
