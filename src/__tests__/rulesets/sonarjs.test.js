const { createSonarjsRules } = require('../../rulesets/sonarjs');

describe('createSonarjsRules', () => {
  test('matches snapshot without typescript', () => {
    const project = {
      typescript: {
        hasTypeScript: false,
      },
    };

    expect(createSonarjsRules(project)).toMatchSnapshot();
  });

  test('matches snapshot with typescript', () => {
    const project = {
      typescript: {
        hasTypeScript: true,
      },
    };

    expect(createSonarjsRules(project)).toMatchSnapshot();
  });

  test('allows passing custom rules', () => {
    const rule = 'sonarjs/cognitive-complexity';
    const level = 'off';

    const project = {
      rules: {
        [rule]: level,
      },
      typescript: {
        hasTypeScript: true,
      },
    };

    const defaultRuleset = createSonarjsRules({
      ...project,
      rules: {},
    });

    const result = createSonarjsRules(project);

    expect(result[rule]).toBe(level);
    expect(result[rule]).not.toBe(defaultRuleset[rule]);

    expect(result).toMatchSnapshot();
  });
});
