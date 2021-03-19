const createOverrideType = type => `eslint-config-galex/${type}`;

const jestOverrideType = createOverrideType('jest');
const reactOverrideType = createOverrideType('react');
const tsOverrideType = createOverrideType('typescript');
const storybookOverrideType = createOverrideType('storybook');

module.exports = {
  jestOverrideType,
  reactOverrideType,
  tsOverrideType,
  storybookOverrideType,
};
