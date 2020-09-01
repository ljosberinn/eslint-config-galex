const { createUnicornRules } = require('../../rulesets/unicorn');

describe('createUnicornRules', () => {
  test('matches snapshot without typescript', () => {
    const project = {
      typescript: {
        hasTypeScript: false,
      },
    };

    expect(createUnicornRules(project)).toMatchSnapshot();
  });

  test('matches snapshot with typescript', () => {
    const project = {
      typescript: {
        hasTypeScript: true,
      },
    };

    expect(createUnicornRules(project)).toMatchSnapshot();
  });

  test('allows passing custom rules', () => {
    const rule = 'unicorn/better-regex';
    const level = 'off';

    const project = {
      customRules: {
        [rule]: level,
      },
      typescript: {
        hasTypeScript: true,
      },
    };

    const defaultRuleset = createUnicornRules({
      ...project,
      customRules: {},
    });

    const result = createUnicornRules(project);

    expect(result[rule]).toBe(level);
    expect(result[rule]).not.toBe(defaultRuleset[rule]);

    expect(result).toMatchSnapshot();
  });
});
