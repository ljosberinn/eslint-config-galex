const { createStorybookOverride } = require('../../overrides/storybook');

describe('createStorybookOverride', () => {
  test('matches snapshot if storybook is false', () => {
    const project = {
      storybook: {
        hasStorybook: false,
      },
      react: {
        hasReact: true,
      },
      typescript: {
        hasTypeScript: true,
      },
    };

    expect(createStorybookOverride(project)).toMatchSnapshot();
  });

  test('matches snapshot if storybook is present', () => {
    const project = {
      storybook: {
        hasStorybook: true,
      },
      react: {
        hasReact: true,
      },
      typescript: {
        hasTypeScript: true,
      },
    };

    expect(createStorybookOverride(project)).toMatchSnapshot();
  });

  test('matches snapshot if storybook is present, without react and ts', () => {
    const project = {
      storybook: {
        hasStorybook: true,
      },
      react: {
        hasReact: false,
      },
      typescript: {
        hasTypeScript: false,
      },
    };

    expect(createStorybookOverride(project)).toMatchSnapshot();
  });

  test('matches snapshot if storybook is absent, but storybook/testing-library is present', () => {
    const project = {
      storybook: {
        hasStorybook: false,
        hasStorybookTestingLibrary: true,
      },
      react: {
        hasReact: false,
      },
      typescript: {
        hasTypeScript: false,
      },
    };

    expect(createStorybookOverride(project)).toMatchSnapshot();
  });

  test('matches snapshot if both storybook and but storybook/testing-library are present', () => {
    const project = {
      storybook: {
        hasStorybook: true,
        hasStorybookTestingLibrary: true,
      },
      react: {
        hasReact: false,
      },
      typescript: {
        hasTypeScript: false,
      },
    };

    expect(createStorybookOverride(project)).toMatchSnapshot();
  });
});
