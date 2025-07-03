import React from 'react';
import Icon from '@react-native-vector-icons/fontawesome';
import { Button } from '../styles/components/button';

interface Props {
  onAddPress: () => void;
}

const AddButton: React.FC<Props> = ({ onAddPress }) => {

  return (
    <Button onPress={onAddPress}>
      <Icon name="plus" size={30} color="white" />
    </Button>
  );
};

export default AddButton;
