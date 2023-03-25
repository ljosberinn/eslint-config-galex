import { detectStorybook } from '../../src/getDependencies';

describe('detectStorybook', () => {
  test('with storybook', () => {
    const map = new Map([['@storybook/react', '1.0.0']]);

    expect(detectStorybook(map)).toMatchInlineSnapshot(`
      {
        "hasStorybook": true,
        "hasStorybookTestingLibrary": false,
      }
    `);
  });

  test('with storybook and testing-lib', () => {
    const map = new Map([
      ['@storybook/react', '1.0.0'],
      ['@storybook/testing-library', '1.0.0'],
    ]);

    expect(detectStorybook(map)).toMatchInlineSnapshot(`
      {
        "hasStorybook": true,
        "hasStorybookTestingLibrary": true,
      }
    `);
  });

  test('without', () => {
    expect(detectStorybook(new Map())).toMatchInlineSnapshot(`
      {
        "hasStorybook": false,
        "hasStorybookTestingLibrary": false,
      }
    `);
  });
});
