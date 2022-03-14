import { rules as allPrettierRules } from 'eslint-config-prettier';

const {
  prettierTypeScriptRules,
  prettierRules,
  prettierReactRules,
  prettierUnicornRules,
} = Object.entries(allPrettierRules).reduce<{
  prettierTypeScriptRules: typeof allPrettierRules;
  prettierReactRules: typeof allPrettierRules;
  prettierRules: typeof allPrettierRules;
  prettierUnicornRules: typeof allPrettierRules;
}>(
  (acc, rule) => {
    const [key, value] = rule;

    if (!key.includes('/')) {
      acc.prettierRules[key] = value;
      return acc;
    }

    if (key.startsWith('react/')) {
      acc.prettierReactRules[key] = value;
      return acc;
    }

    if (key.startsWith('@typescript-eslint')) {
      acc.prettierTypeScriptRules[key] = value;
      return acc;
    }

    if (key.startsWith('/unicorn')) {
      acc.prettierUnicornRules[key] = value;
    }

    return acc;
  },
  {
    prettierTypeScriptRules: {},
    prettierRules: {},
    prettierReactRules: {},
    prettierUnicornRules: {},
  }
);

export {
  prettierTypeScriptRules,
  prettierRules,
  prettierReactRules,
  prettierUnicornRules,
};
