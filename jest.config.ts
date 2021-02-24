export default {
    'roots': [
      '<rootDir>/tests'
    ],
    'testMatch': [
      '**/__tests__/**/*.+(ts|tsx|js)',
      '**/?(*.)+(spec|test).+(ts|tsx|js)'
    ],
    'transform': {
      '^.+\\.(ts|tsx)$': 'ts-jest'
    },
    'moduleDirectories': [
      'node_modules',
      'src'
    ],
    'setupFiles': ['./tests/jest-setup.ts']
  }