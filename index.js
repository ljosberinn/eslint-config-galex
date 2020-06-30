const customRules = require('./rulesets/custom-rules');
const noReact = require('./rulesets/no-react');
const react = require('./rulesets/react');

const mergeObjects = (...objects) =>
  objects.reduce((acc, obj) => ({ ...acc, ...obj }), {});

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
  rules: mergeObjects(customRules, react),
};

const noReactConfig = {
  ...noReact,
  plugins: [...corePlugins, ...noReact.plugins],
  rules: mergeObjects(noReact.rules, customRules),
};

module.exports = hasReact ? defaultConfig : noReactConfig;
