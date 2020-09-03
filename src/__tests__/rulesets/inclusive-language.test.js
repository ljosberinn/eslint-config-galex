const {
  createInclusiveLanguageRules,
} = require('../../rulesets/inclusive-language');

describe('createInclusiveLanguageRules', () => {
  test('matches snapshot', () => {
    const project = {};

    expect(createInclusiveLanguageRules(project)).toMatchSnapshot();
  });

  test('allows passing custom rules', () => {
    const rule = 'inclusive-language/use-inclusive-words';
    const level = 'off';

    const project = {
      rules: {
        [rule]: level,
      },
    };

    const defaultRuleset = createInclusiveLanguageRules({
      ...project,
      rules: {},
    });

    const result = createInclusiveLanguageRules(project);

    expect(result[rule]).toBe(level);
    expect(result[rule]).not.toBe(defaultRuleset[rule]);

    expect(result).toMatchSnapshot();
  });
});
