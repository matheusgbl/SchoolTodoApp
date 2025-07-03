module.exports = {
  preset: 'react-native',
  transformIgnorePatterns: [
    "node_modules/(?!(react-native|@react-navigation|@react-native|react-native-vector-icons|react-native-safe-area-context)/)"
  ],
  moduleNameMapper: {
    '^@react-native-vector-icons/fontawesome$': '<rootDir>/__mocks__/@react-native-vector-icons/fontawesome.js',
  },
};
