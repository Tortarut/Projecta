module.exports = {
  roots: ['<rootDir>/src'],

  transform: {
    '^.+\\.(ts|tsx)$': 'babel-jest',
    '^.+\\.(js|jsx)$': 'babel-jest',
  },

  transformIgnorePatterns: [
    '/node_modules/(?!(date-fns|date-fns-tz)/)',
  ],

  testMatch: [
    '<rootDir>/src/**/__tests__/**/*.{js,jsx,ts,tsx}',
    '<rootDir>/src/**/*.{spec,test}.{js,jsx,ts,tsx}',
  ],

  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],

  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],

  moduleNameMapper: {
    '^date-fns/locale$': '<rootDir>/__mocks__/date-fns/locale.js',
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      '<rootDir>/__mocks__/fileMock.js',
      '^@mui/x-date-pickers/AdapterDateFns$': '<rootDir>/__mocks__/@mui/x-date-pickers/AdapterDateFns.ts',
  },

  testEnvironment: 'jsdom',

  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
    '!src/index.tsx',
    '!src/reportWebVitals.ts',
  ],

  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70,
    },
  },
};
