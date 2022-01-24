import { rules as allPrettierRules } from 'eslint-config-prettier';

const { prettierTypeScriptRules, prettierRules, prettierReactRules } =
  Object.entries(allPrettierRules).reduce<{
    prettierTypeScriptRules: typeof allPrettierRules;
    prettierReactRules: typeof allPrettierRules;
    prettierRules: typeof allPrettierRules;
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

      return acc;
    },
    {
      prettierTypeScriptRules: {},
      prettierRules: {},
      prettierReactRules: {},
    }
  );

export { prettierTypeScriptRules, prettierRules, prettierReactRules };
