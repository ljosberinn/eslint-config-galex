const { createImportRules } = require('../../rulesets/import');

describe('createImportRules', () => {
  test('matches snapshot without typescript & CRA', () => {
    const project = {
      react: {
        isCreateReactApp: false,
      },
      typescript: {
        hasTypeScript: false,
      },
    };

    expect(createImportRules(project)).toMatchSnapshot();
  });

  test('matches snapshot without typescript & with CRA', () => {
    const project = {
      react: {
        isCreateReactApp: true,
      },
      typescript: {
        hasTypeScript: false,
      },
    };

    expect(createImportRules(project)).toMatchSnapshot();
  });

  test('matches snapshot with typescript', () => {
    const project = {
      react: {
        isCreateReactApp: false,
      },
      typescript: {
        hasTypeScript: true,
      },
    };

    expect(createImportRules(project)).toMatchSnapshot();
  });

  test('matches snapshot with typescript & CRA', () => {
    const project = {
      react: {
        isCreateReactApp: true,
      },
      typescript: {
        hasTypeScript: true,
      },
    };

    expect(createImportRules(project)).toMatchSnapshot();
  });

  test('disables import/no-cycle options given a CRA project', () => {
    const rule = 'import/no-cycle';

    const project = {
      react: {
        isCreateReactApp: true,
      },
      typescript: {
        hasTypeScript: true,
      },
    };

    const defaultRuleset = createImportRules({
      ...project,
      react: { isCreateReactApp: false },
    });
    const result = createImportRules(project);

    expect(result[rule]).not.toBe(defaultRuleset[rule]);

    expect(result).toMatchSnapshot();
  });

  test('allows passing custom rules', () => {
    const rule = 'import/default';
    const level = 'off';

    const project = {
      react: {
        isCreateReactApp: false,
      },
      rules: {
        [rule]: level,
      },
      typescript: {
        hasTypeScript: true,
      },
    };

    const defaultRuleset = createImportRules({
      ...project,
      rules: {},
    });

    const result = createImportRules(project);

    expect(result[rule]).toBe(level);
    expect(result[rule]).not.toBe(defaultRuleset[rule]);

    expect(result).toMatchSnapshot();
  });
});
