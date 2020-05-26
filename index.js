const hasJest = (() => {
  // adapted from https://github.com/kentcdodds/eslint-config-kentcdodds/blob/master/jest.js
  const { sync } = require('read-pkg-up');

  try {
    const {
      packageJson: {
        peerDependencies = {},
        devDependencies = {},
        dependencies = {},
      },
    } = sync({ normalize: true });

    const allDeps = Object.keys({
      ...peerDependencies,
      ...devDependencies,
      ...dependencies,
    });

    return allDeps.includes('jest');
  } catch (error) {
    return false;
  }
})();

module.exports = {
  extends: ['react-app', 'prettier', hasJest && 'kentcdodds/jest'].filter(
    Boolean
  ),
  plugins: ['sort-keys-fix'],
  rules: {
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
  },
};
