module.exports = {
  ignorePatterns: ['*.js', '*.test.ts'],
  root: true,
  env: {
    es2021: true,
    browser: true
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2021,
    sourceType: 'module',
    project: './tsconfig.json'
  },
  plugins: ['@typescript-eslint'],
  extends: [
    'airbnb-base',
    'airbnb-typescript/base',
    'plugin:@typescript-eslint/recommended',
    'prettier'
  ],
  rules: {
    'no-bitwise': ['error', { allow: ['|'] }],
    'no-console': 'off',
    'no-param-reassign': 'off',
    'no-plusplus': 'off',
    'no-return-assign': 'off',
    'no-multi-assign': 'off',
    'no-cond-assign': 'off',
    'no-await-in-loop': 'off',
    'no-continue': 'off',
    'no-promise-executor-return': 'off',
    'no-restricted-exports': 'off',
    'no-restricted-syntax': 'off',
    'default-param-last': 'off',
    'default-case': 'off',
    radix: ['error', 'as-needed'],
    'no-restricted-globals': 'off',
    '@typescript-eslint/lines-between-class-members': 'off',
    '@typescript-eslint/no-shadow': 'off',
    '@typescript-eslint/no-use-before-define': ['error', 'nofunc'],
    '@typescript-eslint/no-useless-constructor': 'off',
    'import/extensions': 'off',
    'import/prefer-default-export': 'off'
  }
};
