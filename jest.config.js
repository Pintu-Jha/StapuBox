module.exports = {
  preset: '@react-native/jest-preset',
  moduleNameMapper: {
    '^@env$': '<rootDir>/__mocks__/@env.js',
    '^react-native-reanimated$': '<rootDir>/node_modules/react-native-reanimated/mock.js',
  },
  testPathIgnorePatterns: [
    '/node_modules/',
    '/android/',
    '/ios/',
    // The boilerplate App.test.tsx imports react-navigation which uses ESM —
    // excluded from unit test suite (integration-level test, run on device).
    '__tests__/App.test.tsx',
  ],
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/index.ts',
  ],
};
