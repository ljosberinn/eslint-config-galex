const { createPromiseRules } = require('../../rulesets/promise');

describe('createPromiseRules', () => {
  test('matches snapshot without typescript', () => {
    const project = {
      typescript: {
        hasTypeScript: false,
      },
    };

    expect(createPromiseRules(project)).toMatchSnapshot();
  });

  test('matches snapshot with typescript', () => {
    const project = {
      typescript: {
        hasTypeScript: true,
      },
    };

    expect(createPromiseRules(project)).toMatchSnapshot();
  });

  test('allows passing custom rules', () => {
    const rule = 'promise/always-return';
    const level = 'error';

    const project = {
      rules: {
        [rule]: level,
      },
      typescript: {
        hasTypeScript: true,
      },
    };

    const defaultRuleset = createPromiseRules({
      ...project,
      rules: {},
    });

    const result = createPromiseRules(project);

    expect(result[rule]).toBe(level);
    expect(result[rule]).not.toBe(defaultRuleset[rule]);

    expect(result).toMatchSnapshot();
  });
});
