const { createSortKeysFixRules } = require('../../rulesets/sort-keys-fix');

describe('createSortKeysFixRules', () => {
  test('matches snapshot', () => {
    const project = {};

    expect(createSortKeysFixRules(project)).toMatchSnapshot();
  });

  test('allows passing custom rules', () => {
    const rule = 'sort-keys-fix/sort-keys-fix';
    const level = 'off';

    const project = {
      rules: {
        [rule]: level,
      },
      typescript: {
        hasTypeScript: true,
      },
    };

    const defaultRuleset = createSortKeysFixRules({
      ...project,
      rules: {},
    });

    const result = createSortKeysFixRules(project);

    expect(result[rule]).toBe(level);
    expect(result[rule]).not.toBe(defaultRuleset[rule]);

    expect(result).toMatchSnapshot();
  });
});
