import { type Linter } from 'eslint';
import { rules as allPrettierRules } from 'eslint-config-prettier';

export const disabledValueToString = (value: 0 | 'off'): 'off' =>
  value === 0 ? 'off' : value;

const {
  prettierTypeScriptRules,
  prettierRules,
  prettierReactRules,
  prettierUnicornRules,
} = Object.entries(allPrettierRules).reduce<{
  prettierTypeScriptRules: Record<string, Linter.RuleEntry>;
  prettierReactRules: Record<string, Linter.RuleEntry>;
  prettierRules: Record<string, Linter.RuleEntry>;
  prettierUnicornRules: Record<string, Linter.RuleEntry>;
}>(
  (acc, rule) => {
    const [key, value] = rule;

    if (!key.includes('/')) {
      acc.prettierRules[key] = disabledValueToString(value);
      return acc;
    }

    if (key.startsWith('react/')) {
      acc.prettierReactRules[key] = disabledValueToString(value);
      return acc;
    }

    if (key.startsWith('@typescript-eslint')) {
      acc.prettierTypeScriptRules[key] = disabledValueToString(value);
      return acc;
    }

    if (key.startsWith('unicorn/')) {
      acc.prettierUnicornRules[key] = disabledValueToString(value);
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
  prettierReactRules,
  prettierRules,
  prettierTypeScriptRules,
  prettierUnicornRules,
};
