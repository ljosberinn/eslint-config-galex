const { createStorybookOverride } = require('../../overrides/storybook');

describe('createStorybookOverride', () => {
  test('matches snapshot if storybook is false', () => {
    const project = {
      hasStorybook: false,
    };

    expect(createStorybookOverride(project)).toMatchSnapshot();
  });

  test('matches snapshot if storybook is present', () => {
    const project = {
      hasStorybook: true,
    };

    expect(createStorybookOverride(project)).toMatchSnapshot();
  });
});
