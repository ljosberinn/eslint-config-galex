const { createEslintCoreRules } = require('../../rulesets/eslint-core');

describe('createEslintCoreRules', () => {
  test('matches snapshot without typescript', () => {
    const project = {
      typescript: {
        hasTypeScript: false,
      },
    };

    expect(createEslintCoreRules(project)).toMatchSnapshot();
  });

  test('matches snapshot with typescript', () => {
    const project = {
      typescript: {
        hasTypeScript: true,
      },
    };

    expect(createEslintCoreRules(project)).toMatchSnapshot();
  });

  test('disables certain rules based on tsConfig', () => {
    const defaultProject = {
      typescript: {
        hasTypeScript: false,
      },
    };

    const defaultEslintCoreRules = createEslintCoreRules(defaultProject);

    const tsConfigWithDecorators = {
      compilerOptions: {
        experimentalDecorators: true,
      },
    };

    const customProject = {
      typescript: {
        hasTypeScript: true,
        tsConfig: tsConfigWithDecorators,
      },
    };

    const customEslintCoreRules = createEslintCoreRules(customProject);

    const divergingRules = ['new-cap'];

    divergingRules.forEach(rule => {
      expect(defaultEslintCoreRules[rule]).not.toBe(
        customEslintCoreRules[rule]
      );
    });
  });

  test('allows passing custom rules', () => {
    const rule = 'for-direction';
    const level = 'off';

    const project = {
      rules: {
        [rule]: level,
      },
      typescript: {
        hasTypeScript: false,
      },
    };

    const defaultRuleset = createEslintCoreRules({
      ...project,
      rules: {},
    });
    const result = createEslintCoreRules(project);

    expect(result[rule]).toBe(level);
    expect(result[rule]).not.toBe(defaultRuleset[rule]);

    expect(result).toMatchSnapshot();
  });
});
