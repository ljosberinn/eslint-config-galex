const customRules = require('./custom-rules');
const noReact = require('./no-react');

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
      hasJest: allDeps.includes('jest'),
      hasReact: ['react', 'preact', 'next'].some(pkg => deps.includes(pkg)),
    };
  } catch {
    return {
      hasJest: false,
      hasReact: false,
    };
  }
})();

const corePlugins = ['sort-keys-fix', 'unicorn'];

const defaultConfig = {
  extends: ['react-app', 'prettier', hasJest && 'kentcdodds/jest'].filter(
    Boolean
  ),
  plugins: corePlugins,
  rules: customRules,
};

const noReactConfig = {
  ...noReact,
  plugins: [...corePlugins, ...noReact.plugins],
  rules: {
    ...noReact.rules,
    ...customRules,
  },
};

module.exports = hasReact ? defaultConfig : noReactConfig;
