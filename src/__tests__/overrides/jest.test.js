const { createJestOverride } = require('../../overrides/jest');

describe('createJestOverride', () => {
  test('matches snapshot without jest', () => {
    const project = {
      hasJest: false,
      hasJestDom: false,
      hasTestingLibrary: false,
      react: {
        hasReact: false,
      },
      typescript: {
        hasTypeScript: false,
      },
    };

    expect(createJestOverride(project)).toMatchSnapshot();
  });

  test('matches snapshot with jest', () => {
    const project = {
      hasJest: true,
      hasJestDom: false,
      hasTestingLibrary: false,
      react: {
        hasReact: false,
      },
      typescript: {
        hasTypeScript: false,
      },
    };

    expect(createJestOverride(project)).toMatchSnapshot();
  });

  test('matches snapshot with jest & jest-dom', () => {
    const project = {
      hasJest: true,
      hasJestDom: true,
      hasTestingLibrary: false,
      react: {
        hasReact: false,
      },
      typescript: {
        hasTypeScript: false,
      },
    };

    expect(createJestOverride(project)).toMatchSnapshot();
  });

  test('matches snapshot with jest & testing-lib', () => {
    const project = {
      hasJest: true,
      hasJestDom: false,
      hasTestingLibrary: true,
      react: {
        hasReact: false,
      },
      typescript: {
        hasTypeScript: false,
      },
    };

    expect(createJestOverride(project)).toMatchSnapshot();
  });

  test('matches snapshot with jest & react', () => {
    const project = {
      hasJest: true,
      hasJestDom: false,
      hasTestingLibrary: false,
      react: {
        hasReact: true,
      },
      typescript: {
        hasTypeScript: false,
      },
    };

    expect(createJestOverride(project)).toMatchSnapshot();
  });

  test('matches snapshot with jest & ts', () => {
    const project = {
      hasJest: true,
      hasJestDom: false,
      hasTestingLibrary: false,
      react: {
        hasReact: false,
      },
      typescript: {
        hasTypeScript: true,
      },
    };

    expect(createJestOverride(project)).toMatchSnapshot();
  });

  test('matches snapshot with jest & jest-dom & testing-lib', () => {
    const project = {
      hasJest: true,
      hasJestDom: true,
      hasTestingLibrary: true,
      react: {
        hasReact: false,
      },
      typescript: {
        hasTypeScript: false,
      },
    };

    expect(createJestOverride(project)).toMatchSnapshot();
  });

  test('matches snapshot with jest & jest-dom & react', () => {
    const project = {
      hasJest: true,
      hasJestDom: true,
      hasTestingLibrary: false,
      react: {
        hasReact: true,
      },
      typescript: {
        hasTypeScript: false,
      },
    };

    expect(createJestOverride(project)).toMatchSnapshot();
  });

  test('matches snapshot with jest & jest-dom & ts', () => {
    const project = {
      hasJest: true,
      hasJestDom: true,
      hasTestingLibrary: false,
      react: {
        hasReact: false,
      },
      typescript: {
        hasTypeScript: true,
      },
    };

    expect(createJestOverride(project)).toMatchSnapshot();
  });

  test('matches snapshot with jest & jest-dom & testing-lib & react', () => {
    const project = {
      hasJest: true,
      hasJestDom: true,
      hasTestingLibrary: true,
      react: {
        hasReact: true,
      },
      typescript: {
        hasTypeScript: false,
      },
    };

    expect(createJestOverride(project)).toMatchSnapshot();
  });

  test('matches snapshot with jest & jest-dom & testing-lib & ts', () => {
    const project = {
      hasJest: true,
      hasJestDom: true,
      hasTestingLibrary: true,
      react: {
        hasReact: false,
      },
      typescript: {
        hasTypeScript: true,
      },
    };

    expect(createJestOverride(project)).toMatchSnapshot();
  });

  test('matches snapshot with jest & jest-dom & testing-lib & react & ts', () => {
    const project = {
      hasJest: true,
      hasJestDom: true,
      hasTestingLibrary: true,
      react: {
        hasReact: true,
      },
      typescript: {
        hasTypeScript: true,
      },
    };

    expect(createJestOverride(project)).toMatchSnapshot();
  });

  test('allows passing extra rules', () => {
    const rule = 'testing-library/no-manual-cleanup';
    const level = 'off';

    const project = {
      hasJest: true,
      hasJestDom: false,
      hasTestingLibrary: true,
      react: {
        hasReact: false,
      },
      rules: {
        [rule]: level,
      },
      typescript: {
        hasTypeScript: false,
      },
    };

    const override = createJestOverride({ ...project, rules: {} });

    const result = createJestOverride(project);

    expect(result.rules[rule]).toBe(level);
    expect(result.rules[rule]).not.toBe(override.rules[rule]);

    expect(result).toMatchSnapshot();
  });

  test('allows passing extra extends', () => {
    const customExtends = ['foo'];

    const project = {
      extends: customExtends,
      hasJest: true,
      hasJestDom: false,
      hasTestingLibrary: true,
      react: {
        hasReact: false,
      },
      typescript: {
        hasTypeScript: false,
      },
    };

    const override = createJestOverride({ ...project, extends: [] });
    const result = createJestOverride(project);

    expect(override.extends).not.toBe(customExtends);
    expect(result.extends).toBe(customExtends);

    expect(result).toMatchSnapshot();
  });
});
