const { createNextJsRules } = require('../../rulesets/next');

describe('createNextJsRules', () => {
  test('matches snapshot without next', () => {
    const project = {
      react: {
        isNext: false,
      },
    };

    expect(createNextJsRules(project)).toMatchSnapshot();
  });

  test('matches snapshot with next', () => {
    const project = {
      react: {
        isNext: true,
      },
    };

    expect(createNextJsRules(project)).toMatchSnapshot();
  });

  test('allows passing custom rules', () => {
    const rule = '@next/next/no-unwanted-polyfillio';
    const level = 'off';

    const project = {
      react: {
        isNext: true,
      },
      rules: {
        [rule]: level,
      },
    };

    const defaultRuleset = createNextJsRules({
      ...project,
      rules: {},
    });

    const result = createNextJsRules(project);

    expect(result[rule]).toBe(level);
    expect(result[rule]).not.toBe(defaultRuleset[rule]);

    expect(result).toMatchSnapshot();
  });
});
