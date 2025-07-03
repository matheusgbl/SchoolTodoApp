import { TouchableOpacity } from 'react-native';
import styled from 'styled-components/native';

export const Button = styled(TouchableOpacity)`
  position: absolute;
  bottom: 20px;
  right: 20px;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background-color: ${({ theme }) => theme.colors.primary};
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;