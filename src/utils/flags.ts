import { Linter } from 'eslint';
import { ESLintConfig, Flags } from '../types';

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

type FlagProcessor = (value: Linter.RuleEntry) => Linter.RuleEntry;

const createFlagFilterArray = ({
  convertToESLintInternals,
  incrementalAdoption,
}: Required<Flags>): FlagProcessor[] => {
  return [
    convertToESLintInternals && convertRuleToEslintInternalValue,
    incrementalAdoption && incrementalAdoptionRuleDowngrade,
  ].filter((fn): fn is FlagProcessor => fn !== false);
};

export const applyFlags = (
  rules: Linter.RulesRecord,
  flags: Flags
): ESLintConfig['rules'] => {
  const convertToESLintInternals = flags.convertToESLintInternals ?? false;
  const incrementalAdoption = flags.incrementalAdoption ?? false;

  const hasFlags = convertToESLintInternals || incrementalAdoption;

  if (!hasFlags) {
    return rules;
  }

  const fnsToApply = createFlagFilterArray({
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
