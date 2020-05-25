module.exports = {
  extends: ['react-app', 'prettier', 'kentcdodds/jest'],
  rules: {
    'no-alert': 'error',
    'no-console': 'warn',
    'require-await': 'error',
    'import/order': [
      'warn',
      {
        groups: [
          ['builtin', 'external', 'internal'],
          ['unknown', 'parent', 'sibling'],
          'index',
        ],
        alphabetize: {
          order: 'asc',
        },
        'newlines-between': 'always',
      },
    ],
  },
};
