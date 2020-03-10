module.exports = {
  env: {
    browser: true,
    node: true,
    jest: true,
  },
  parser: 'babel-eslint',
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
  plugins: ['react-hooks'],
  extends: ['eslint:recommended', 'plugin:react/recommended', 'prettier'],
  rules: {
    'no-console': 'off',
    'react/prop-types': 'off',
    'no-unused-vars': ['error', {ignoreRestSiblings: true}],
    'react-hooks/rules-of-hooks': 'error',
    'react/display-name': 'off',
  },
};
