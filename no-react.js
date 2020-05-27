// basically eslint-config-react-app, just without react
const reactApp = require('eslint-config-react-app');

const filterJSXAndReactRules = rules =>
  Object.entries(rules)
    .filter(
      ([key]) =>
        !(
          key.includes('jsx') ||
          key.includes('react') ||
          key.includes('flowtype')
        )
    )
    .reduce((carry, [key, value]) => {
      carry[key] = value;
      return carry;
    }, {});

module.exports = {
  ...reactApp,
  plugins: ['import', 'prettier'],
  parserOptions: {
    ...reactApp.parserOptions,
    ecmaFeatures: undefined,
  },
  settings: undefined,
  overrides: [
    {
      ...reactApp.overrides[0],
      parserOptions: {
        ...reactApp.overrides[0].parserOptions,
        ecmaFeatures: undefined,
      },
      rules: filterJSXAndReactRules(reactApp.overrides[0].rules),
    },
  ],
  rules: filterJSXAndReactRules(reactApp.rules),
};
