module.exports = {
  'import/order': [
    'warn',
    {
      alphabetize: {
        order: 'asc',
      },
      groups: [
        ['builtin', 'external', 'internal'],
        ['unknown', 'parent', 'sibling'],
        'index',
      ],
      'newlines-between': 'always',
    },
  ],
  'no-alert': 'error',
  'no-console': 'warn',
  'no-else-return': 'error',
  'require-await': 'error',
  'sort-keys-fix/sort-keys-fix': 'warn',
};
