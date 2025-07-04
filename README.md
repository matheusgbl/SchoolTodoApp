# 📚 SchoolTodoApp

> Uma aplicação React Native para gerenciamento de tarefas escolares, permitindo que estudantes organizem suas atividades acadêmicas de forma eficiente e prática.

## 🚀 Sobre o Projeto

O SchoolTodoApp é uma solução mobile desenvolvida em React Native que auxilia estudantes no gerenciamento de suas tarefas escolares. Com uma interface intuitiva e funcionalidades pensadas especificamente para o ambiente acadêmico, a aplicação permite organizar, acompanhar e completar atividades de forma produtiva.

## ✨ Funcionalidades

- ✅ **Gerenciamento de Tarefas**: Adicione, edite e remova tarefas escolares
- 📅 **Organização por Data**: Visualize tarefas por data de vencimento
- 📝 **Categorização**: Organize tarefas por matéria ou disciplina
- 🎯 **Status de Conclusão**: Marque tarefas como concluídas
- 📱 **Interface Responsiva**: Design otimizado para dispositivos móveis
- 🔄 **Sincronização Local**: Dados persistidos localmente no dispositivo

## 🛠️ Tecnologias Utilizadas

- **React Native**: Framework principal para desenvolvimento mobile
- **TypeScript**: Linguagem de programação com tipagem estática
- **React Navigation**: Navegação entre telas
- **React Native Vector Icons**: Ícones customizados
- **Styled Components**: Estilização de componentes

## 📋 Pré-requisitos

Antes de executar a aplicação, certifique-se de ter as seguintes ferramentas instaladas:

### Ambiente de Desenvolvimento
- **Node.js** (versão 16 ou superior)
- **npm** ou **yarn**
- **React Native CLI**
- **Android Studio** (para desenvolvimento Android)
- **Xcode** (para desenvolvimento iOS - apenas macOS)

### Configuração do Ambiente

1. **Siga o guia oficial do React Native**: [Environment Setup](https://reactnative.dev/docs/environment-setup)
2. **Para Android**: Configure o Android Studio e SDK
3. **Para iOS**: Configure o Xcode e CocoaPods (apenas macOS)

## 🚀 Como Executar

### 1. Clone o Repositório
```bash
git clone https://github.com/matheusgbl/SchoolTodoApp.git
cd SchoolTodoApp
```

### 2. Instale as Dependências
```bash
# Usando npm
npm install

# OU usando yarn
yarn install
```

### 3. Configure as Dependências Nativas (iOS)
```bash
# Instale o CocoaPods (primeira vez)
bundle install

# Instale as dependências do iOS
cd ios && bundle exec pod install && cd ..
```

### 4. Inicie o Metro Bundler
```bash
# Usando npm
npm start

# OU usando yarn
yarn start
```

### 5. Execute a Aplicação

#### Android
```bash
# Usando npm
npm run android

# OU usando yarn
yarn android
```

#### iOS
```bash
# Usando npm
npm run ios

# OU usando yarn
yarn ios
```

## 📱 Testando a Aplicação

### Emuladores
- **Android**: Certifique-se de ter um emulador Android rodando
- **iOS**: Use o simulador iOS (apenas macOS)

### Dispositivos Físicos
- **Android**: Ative o modo desenvolvedor e depuração USB
- **iOS**: Configure o dispositivo para desenvolvimento

## 🎯 Estrutura do Projeto

```
SchoolTodoApp/
├── android/                 # Configurações Android
├── ios/                     # Configurações iOS
├── src/                     # Código fonte principal
│   ├── components/          # Componentes reutilizáveis
│   ├── screens/             # Telas da aplicação
│   ├── services/            # Serviços e APIs
│   ├── utils/               # Utilitários e helpers
│   └── types/               # Definições de tipos TypeScript
├── App.tsx                  # Componente principal
├── package.json             # Dependências do projeto
└── README.md               # Este arquivo
```

## 🔧 Scripts Disponíveis

- `npm start`: Inicia o Metro bundler
- `npm run android`: Executa no Android
- `npm run ios`: Executa no iOS
- `npm run lint`: Executa o linter
- `npm run test`: Executa os testes
- `npm run build`: Gera build de produção

## 🐛 Resolução de Problemas

### Problemas Comuns

#### Metro bundler não inicia
```bash
# Limpe o cache do Metro
npx react-native start --reset-cache
```

#### Erro de build no Android
```bash
# Limpe o projeto Android
cd android && ./gradlew clean && cd ..
```

#### Erro de build no iOS
```bash
# Limpe o projeto iOS
cd ios && xcodebuild clean && cd ..
```

#### Dependências nativas não funcionam
```bash
# Reinstale as dependências
rm -rf node_modules
npm install
# Para iOS
cd ios && bundle exec pod install && cd ..
```

## 🔄 Atualizações e Manutenção

### Atualizando Dependências
```bash
# Verifique dependências desatualizadas
npm outdated

# Atualize dependências
npm update
```

### Limpeza de Cache
```bash
# Limpe todos os caches
npx react-native start --reset-cache
npm start -- --reset-cache
```

## 📖 Recursos Adicionais

### Documentação
- [React Native Documentation](https://reactnative.dev/docs/getting-started)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [React Navigation](https://reactnavigation.org/docs/getting-started)

### Ferramentas de Debug
- **Flipper**: Ferramenta de debug avançada
- **React Native Debugger**: Debug específico para React Native
- **Chrome DevTools**: Debug via navegador
