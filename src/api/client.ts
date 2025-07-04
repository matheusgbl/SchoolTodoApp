import axios from 'axios';

// Para Android, use o IP da sua máquina na rede local ou o IP especial 10.0.2.2
// Para iOS, localhost funciona se o app estiver no simulador.
const baseURL = 'http://localhost:3001'; // IP especial do emulador Android para o localhost da máquina

const apiClient = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
} );

export default apiClient;
