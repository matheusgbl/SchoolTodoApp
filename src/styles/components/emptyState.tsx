import styled from 'styled-components/native';


export const Container = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  padding: 24px;
`;

export const Message = styled.Text`
  color: ${({ theme }) => theme.colors.text};
  font-size: 16px;
  text-align: center;
  margin-top: 20px;
`;