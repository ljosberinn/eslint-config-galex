const { hasJest, hasReact } = (() => {
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

    const deps = Object.keys(dependencies);

    const allDeps = [
      ...Object.keys({
        ...peerDependencies,
        ...devDependencies,
      }),
      ...deps,
    ];

    return {
      jest: allDeps.includes('jest'),
      react: deps.includes('react'),
    };
  } catch (error) {
    return {
      jest: false,
      react: false,
    };
  }
})();

const defaultConfig = {
  extends: ['react-app', 'prettier', hasJest && 'kentcdodds/jest'].filter(
    Boolean
  ),
  plugins: ['sort-keys-fix'],
  rules: require('./custom-rules'),
};

module.exports = hasReact ? defaultConfig : require('./no-react');
