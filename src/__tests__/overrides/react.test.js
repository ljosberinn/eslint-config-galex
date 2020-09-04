const { createReactOverride } = require('../../overrides/react');

const react17 = '17.0.0.1.rc-1';

describe('createReactOverride', () => {
  test('matches snapshot if react is false', () => {
    const project = {
      react: {
        hasReact: false,
        isNext: false,
        version: '',
      },
      typescript: {
        hasTypeScript: false,
      },
    };

    expect(createReactOverride(project)).toMatchSnapshot();
  });

  test('matches snapshot if react is < 17', () => {
    const project = {
      react: {
        hasReact: true,
        isNext: false,
        version: '16.13.1',
      },
      typescript: {
        hasTypeScript: false,
      },
    };

    expect(createReactOverride(project)).toMatchSnapshot();
  });

  test('matches snapshot if react is < 17 with Next', () => {
    const project = {
      react: {
        hasReact: true,
        isNext: true,
        version: '16.13.1',
      },
      typescript: {
        hasTypeScript: false,
      },
    };

    expect(createReactOverride(project)).toMatchSnapshot();
  });

  test('matches snapshot if react is < 17 with TS', () => {
    const project = {
      react: {
        hasReact: true,
        isNext: false,
        version: '16.13.1',
      },
      typescript: {
        hasTypeScript: true,
      },
    };

    expect(createReactOverride(project)).toMatchSnapshot();
  });

  test('matches snapshot if react is < 17 with Next & TS', () => {
    const project = {
      react: {
        hasReact: true,
        isNext: true,
        version: '16.13.1',
      },
      typescript: {
        hasTypeScript: true,
      },
    };

    expect(createReactOverride(project)).toMatchSnapshot();
  });

  test('matches snapshot if react is >= 17', () => {
    const project = {
      react: {
        hasReact: true,
        isNext: false,
        version: react17,
      },
      typescript: {
        hasTypeScript: false,
      },
    };

    expect(createReactOverride(project)).toMatchSnapshot();
  });

  test('matches snapshot if react is >= 17 with Next', () => {
    const project = {
      react: {
        hasReact: true,
        isNext: true,
        version: react17,
      },
      typescript: {
        hasTypeScript: false,
      },
    };

    expect(createReactOverride(project)).toMatchSnapshot();
  });

  test('matches snapshot if react is >= 17 with TS', () => {
    const project = {
      react: {
        hasReact: true,
        isNext: false,
        version: react17,
      },
      typescript: {
        hasTypeScript: true,
      },
    };

    expect(createReactOverride(project)).toMatchSnapshot();
  });

  test('matches snapshot if react is >= 17 with Next & TS', () => {
    const project = {
      react: {
        hasReact: true,
        isNext: true,
        version: react17,
      },
      typescript: {
        hasTypeScript: true,
      },
    };

    expect(createReactOverride(project)).toMatchSnapshot();
  });

  test('disables jsx-a11y/autocomplete-valid given a CRA project', () => {
    const rule = 'jsx-a11y/autocomplete-valid';

    const project = {
      react: {
        hasReact: true,
        isCreateReactApp: true,
        isNext: false,
        version: '16.13.1',
      },
      typescript: {
        hasTypeScript: false,
      },
    };

    const override = createReactOverride({
      ...project,
      react: { ...project.react, isCreateReactApp: false },
    });
    const result = createReactOverride(project);

    expect(override.rules[rule]).not.toBe(result.rules[rule]);
    expect(result).toMatchSnapshot();
  });

  test('allows passing extra rules', () => {
    const rule = 'react/jsx-uses-react';
    const level = 'off';

    const project = {
      react: {
        hasReact: true,
        isNext: true,
        version: '16.13.1',
      },
      rules: {
        [rule]: level,
      },
      typescript: {
        hasTypeScript: false,
      },
    };

    const override = createReactOverride({ ...project, rules: {} });
    const result = createReactOverride(project);

    expect(result.rules[rule]).toBe(level);
    expect(result.rules[rule]).not.toBe(override.rules[rule]);

    expect(result).toMatchSnapshot();
  });
});
