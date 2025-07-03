import Toast from 'react-native-toast-message';
import { showSuccess, showError, showInfo } from '../../components/Toast'; // Adjust to your actual file path

jest.mock('react-native-toast-message', () => ({
  show: jest.fn(),
}));

describe('Toast Utils', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('calls Toast.show with correct props for success', () => {
    showSuccess('Success Title', 'Success Message');
    expect(Toast.show).toHaveBeenCalledWith({
      type: 'success',
      text1: 'Success Title',
      text2: 'Success Message',
      visibilityTime: 3000,
      autoHide: true,
      topOffset: 60,
      bottomOffset: 40,
    });
  });

  it('calls Toast.show with correct props for error', () => {
    showError('Error Title', 'Error Message');
    expect(Toast.show).toHaveBeenCalledWith({
      type: 'error',
      text1: 'Error Title',
      text2: 'Error Message',
      visibilityTime: 4000,
      autoHide: true,
      topOffset: 60,
      bottomOffset: 40,
    });
  });

  it('calls Toast.show with correct props for info', () => {
    showInfo('Info Title', 'Info Message');
    expect(Toast.show).toHaveBeenCalledWith({
      type: 'info',
      text1: 'Info Title',
      text2: 'Info Message',
      visibilityTime: 3000,
      autoHide: true,
      topOffset: 60,
      bottomOffset: 40,
    });
  });
});
