import type { Linter } from 'eslint';

import type { ESLintConfig, Flags } from '../types';

const severityLevels: Record<
  Exclude<Linter.RuleLevel, Linter.Severity>,
  Linter.Severity
> = {
  off: 0,
  warn: 1,
  error: 2,
};

const convertRuleToEslintInternalValue: FlagProcessor = options => {
  if (Array.isArray(options)) {
    const [ruleLevel, ...rest] = options;

    if (typeof ruleLevel === 'number') {
      return options;
    }

    return [severityLevels[ruleLevel], ...rest];
  }

  return typeof options === 'number' ? options : severityLevels[options];
};

const incrementalAdoptionRuleDowngrade: FlagProcessor = value => {
  const valueToForward =
    typeof value === 'number' || typeof value === 'string' ? value : value[0];

  if (typeof valueToForward === 'string') {
    if (valueToForward === 'error') {
      return 'warn';
    }

    return 'off';
  }

  return valueToForward === 2 ? 1 : 0;
};

const blankSlateDowngrade: FlagProcessor = () => {
  return 'off';
};

type FlagProcessor = (value: Linter.RuleEntry) => Linter.RuleEntry;

const createFlagFilterArray = ({
  convertToESLintInternals,
  incrementalAdoption,
  blankSlate,
}: Required<Flags>): FlagProcessor[] => {
  return [
    convertToESLintInternals && convertRuleToEslintInternalValue,
    incrementalAdoption && incrementalAdoptionRuleDowngrade,
    blankSlate && blankSlateDowngrade,
  ].filter((fn): fn is FlagProcessor => fn !== false);
};

export const applyFlags = (
  rules: Linter.RulesRecord,
  flags: Flags
): ESLintConfig['rules'] => {
  const convertToESLintInternals = flags.convertToESLintInternals ?? false;
  const incrementalAdoption = flags.incrementalAdoption ?? false;
  const blankSlate = flags.blankSlate ?? false;

  const hasFlags =
    convertToESLintInternals || incrementalAdoption || blankSlate;

  if (!hasFlags) {
    return rules;
  }

  const fnsToApply = createFlagFilterArray({
    blankSlate,
    convertToESLintInternals,
    incrementalAdoption,
  });

  return Object.fromEntries(
    Object.entries(rules).map(([ruleName, options]) => [
      ruleName,
      fnsToApply.reduce((acc, fn) => fn(acc), options),
    ])
  );
};
