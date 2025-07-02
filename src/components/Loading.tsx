import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import styled from 'styled-components/native';

const Container = styled(View)`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

export default function Loading() {
  return (
    <Container>
      <ActivityIndicator size="large" color="#007bff" />
    </Container>
  );
}
