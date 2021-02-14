const { createNextJsOverride } = require('../../overrides/next');

describe('createNextJsOverride', () => {
  test('matches snapshot without next', () => {
    const project = {
      react: {
        hasReact: true,
        isNext: false,
      },
      typescript: {
        hasTypeScript: false,
      },
    };

    expect(createNextJsOverride(project)).toMatchSnapshot();
  });

  test('matches snapshot with next', () => {
    const project = {
      react: {
        hasReact: true,
        isNext: true,
      },
      typescript: {
        hasTypeScript: false,
      },
    };

    expect(createNextJsOverride(project)).toMatchSnapshot();
  });

  test('allows passing extra rules', () => {
    const rule = 'testing-library/no-manual-cleanup';
    const level = 'off';

    const project = {
      react: {
        hasReact: true,
        isNext: true,
      },
      rules: {
        [rule]: level,
      },
      typescript: {
        hasTypeScript: false,
      },
    };

    const override = createNextJsOverride({ ...project, rules: {} });

    const result = createNextJsOverride(project);

    expect(result.rules[rule]).toBe(level);
    expect(result.rules[rule]).not.toBe(override.rules[rule]);

    expect(result).toMatchSnapshot();
  });

  test('allows passing extra files', () => {
    const files = ['*.*.js'];

    const project = {
      react: {
        hasReact: true,
        isNext: true,
      },
      files,
      typescript: {
        hasTypeScript: false,
      },
    };

    const override = createNextJsOverride({ ...project, files: [] });

    const result = createNextJsOverride(project);

    expect(result.files).toContain(files[0]);
    expect(result.files).not.toBe(override.files);

    expect(result).toMatchSnapshot();
  });
});
