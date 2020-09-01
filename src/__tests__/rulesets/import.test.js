const { createImportRules } = require('../../rulesets/import');

describe('createImportRules', () => {
  test('matches snapshot without typescript', () => {
    const project = {
      typescript: {
        hasTypeScript: false,
      },
    };

    expect(createImportRules(project)).toMatchSnapshot();
  });

  test('matches snapshot with typescript', () => {
    const project = {
      typescript: {
        hasTypeScript: true,
      },
    };

    expect(createImportRules(project)).toMatchSnapshot();
  });

  test('allows passing custom rules', () => {
    const rule = 'import/default';
    const level = 'off';

    const project = {
      customRules: {
        [rule]: level,
      },
      typescript: {
        hasTypeScript: true,
      },
    };

    const defaultRuleset = createImportRules({
      ...project,
      customRules: {},
    });

    const result = createImportRules(project);

    expect(result[rule]).toBe(level);
    expect(result[rule]).not.toBe(defaultRuleset[rule]);

    expect(result).toMatchSnapshot();
  });
});
