import { type RulesetCreator } from '../types';

export const createSimpleImportSortRules: RulesetCreator = ({
  rules: customRules,
}) => {
  return {
    'simple-import-sort/imports': 'warn',
    'simple-import-sort/exports': 'warn',
    ...customRules,
  };
};
