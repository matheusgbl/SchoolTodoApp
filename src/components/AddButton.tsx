import React from 'react';
import Icon from '@react-native-vector-icons/fontawesome';
import { Button } from '../styles/components/button';

interface Props {
  onAddPress: () => void;
}

const AddButton: React.FC<Props> = ({ onAddPress }) => {

  return (
    <Button onPress={onAddPress} testID="add-button">
      <Icon name="plus" size={30} color="white" testID="plus-icon" />
    </Button>
  );
};

export default AddButton;
