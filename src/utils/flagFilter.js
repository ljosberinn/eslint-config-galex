const severityLevels = {
  off: 0,
  warn: 1,
  error: 2,
};

const convertRuleToEslintInternalValue = value => {
  if (severityLevels[value] !== undefined) {
    return severityLevels[value];
  }

  if (Array.isArray(value) && severityLevels[value[0]] !== undefined) {
    const options = [...value];
    options[0] = severityLevels[options[0]];

    return options;
  }

  return value;
};

module.exports = {
  applyFlagFilters: (rules, { convertToESLintInternals = true }) =>
    Object.fromEntries(
      Object.entries(rules).map(([key, value]) => [
        key,
        convertToESLintInternals
          ? convertRuleToEslintInternalValue(value)
          : value,
      ])
    ),
};
