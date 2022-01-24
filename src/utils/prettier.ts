import { rules as allPrettierRules } from 'eslint-config-prettier';

export const prettierTypeScriptRules = Object.fromEntries(
  Object.entries(allPrettierRules).filter(([key]) =>
    key.startsWith('@typescript-eslint')
  )
);

export const prettierRules = Object.fromEntries(
  Object.entries(allPrettierRules).filter(([key]) => !key.includes('/'))
);

export const prettierReactRules = Object.fromEntries(
  Object.entries(allPrettierRules).filter(([key]) => key.startsWith('react/'))
);
