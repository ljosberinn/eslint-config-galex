const { createStorybookOverride } = require('../../overrides/storybook');

describe('createStorybookOverride', () => {
  test('matches snapshot if storybook is false', () => {
    const project = {
      hasStorybook: false,
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
      hasStorybook: true,
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
      hasStorybook: true,
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
