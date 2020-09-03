const { createUnicornRules } = require('../../rulesets/unicorn');

describe('createUnicornRules', () => {
  test('matches snapshot without typescript & react', () => {
    const project = {
      react: {
        hasReact: false,
      },
      typescript: {
        hasTypeScript: false,
      },
    };

    expect(createUnicornRules(project)).toMatchSnapshot();
  });

  test('matches snapshot with typescript, without react', () => {
    const project = {
      react: {
        hasReact: false,
      },
      typescript: {
        hasTypeScript: true,
      },
    };

    expect(createUnicornRules(project)).toMatchSnapshot();
  });

  test('matches snapshot with react, without typescript', () => {
    const project = {
      react: {
        hasReact: true,
      },
      typescript: {
        hasTypeScript: false,
      },
    };

    expect(createUnicornRules(project)).toMatchSnapshot();
  });

  test('matches snapshot with typescript & react', () => {
    const project = {
      react: {
        hasReact: true,
      },
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
      react: {
        hasReact: true,
      },
      rules: {
        [rule]: level,
      },
      typescript: {
        hasTypeScript: true,
      },
    };

    const defaultRuleset = createUnicornRules({
      ...project,
      rules: {},
    });

    const result = createUnicornRules(project);

    expect(result[rule]).toBe(level);
    expect(result[rule]).not.toBe(defaultRuleset[rule]);

    expect(result).toMatchSnapshot();
  });
});
