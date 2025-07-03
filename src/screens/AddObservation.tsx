/* eslint-disable react-native/no-inline-styles */
import React, { useState, useEffect } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useObservations } from '../hooks/useObservation';
import { RootStackParamList } from '../navigation/AppNavigator';
import { Button,
  ButtonContainer,
  ButtonText,
  Container,
  ErrorText,
  FormContainer,
  Input,
  Label,
  ScrollContainer,
  TextArea,
  Title
} from '../styles/screens/addObservation';

type AddObservationScreenNavigationProp = StackNavigationProp<RootStackParamList, 'AddObservation'>;

const AddObservationScreen = () => {
  const navigation = useNavigation<AddObservationScreenNavigationProp>();
  const { addObservation, createStatus, error, resetCreateState, clearErrors } = useObservations();
  const isLoading = createStatus === 'loading';

  const [studentName, setStudentName] = useState('');
  const [observation, setObservation] = useState('');
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  useEffect(() => {
    resetCreateState();
    clearErrors();
  }, [resetCreateState, clearErrors]);

  useEffect(() => {
    if (createStatus === 'succeeded') {
        resetCreateState();
        navigation.goBack();
    }
  }, [createStatus, navigation, resetCreateState]);

  const validateForm = (): boolean => {
    const errors: string[] = [];

    if (!studentName.trim()) {
      errors.push('Nome do aluno é obrigatório');
    }

    if (!observation.trim()) {
      errors.push('Observação é obrigatória');
    }

    if (observation.trim().length < 10) {
      errors.push('Observação deve ter pelo menos 10 caracteres');
    }

    setValidationErrors(errors);
    return errors.length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      await addObservation({
        studentName: studentName.trim(),
        observation: observation.trim(),
      });
    } catch (err) {
      console.error('Erro ao criar observação:', err);
    }
  };

  const handleCancel = () => {
    if (studentName.trim() || observation.trim()) {
      Alert.alert(
        'Descartar alterações?',
        'Você tem alterações não salvas. Deseja realmente sair?',
        [
          { text: 'Continuar editando', style: 'cancel' },
          { text: 'Descartar', style: 'destructive', onPress: () => navigation.goBack() }
        ]
      );
    } else {
      navigation.goBack();
    }
  };


  return (
    <Container>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollContainer showsVerticalScrollIndicator={false}>
          <FormContainer>
            <Title>Nova Observação</Title>

            {/* Exibir erros de validação */}
            {validationErrors.map((err, index) => (
              <ErrorText key={index}>{err}</ErrorText>
            ))}

            {/* Exibir erro da API */}
            {error && <ErrorText>{error}</ErrorText>}

            <Label>Nome do Aluno *</Label>
            <Input
              value={studentName}
              onChangeText={setStudentName}
              placeholder="Digite o nome do aluno"
              placeholderTextColor="#999"
              editable={!isLoading}
            />

            <Label>Observação *</Label>
            <TextArea
              value={observation}
              onChangeText={setObservation}
              placeholder="Descreva sua observação sobre o aluno..."
              placeholderTextColor="#999"
              multiline
              numberOfLines={4}
              editable={!isLoading}
            />

            <ButtonContainer>
              <Button variant="secondary" onPress={handleCancel} disabled={isLoading}>
                <ButtonText>Cancelar</ButtonText>
              </Button>

              <Button variant="primary" onPress={handleSubmit} disabled={isLoading}>
                {isLoading ? (
                  <ActivityIndicator color="white" size="small" />
                ) : (
                  <ButtonText>Salvar</ButtonText>
                )}
              </Button>
            </ButtonContainer>
          </FormContainer>
        </ScrollContainer>
      </KeyboardAvoidingView>
    </Container>
  );
};

export default AddObservationScreen;
