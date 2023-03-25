import { createStorybookOverride } from '../../src/overrides/storybook';
import { type OverrideCreator } from '../../src/types';
import { defaultProject } from '../shared';

const storybookDefaultProject: Parameters<OverrideCreator>[0] = {
  ...defaultProject,
  storybook: {
    ...defaultProject.storybook,
    hasStorybook: true,
  },
};

test('allows passing rules', () => {
  const ruleName = 'foo';
  const ruleValue = 'warn';

  const result = createStorybookOverride({
    ...storybookDefaultProject,
    rules: {
      [ruleName]: ruleValue,
    },
  });

  expect(result?.rules[ruleName]).toBe(ruleValue);
});

test('allows passing custom files', () => {
  const files = ['foo/bar'];

  const result = createStorybookOverride({
    ...storybookDefaultProject,
    files,
  });

  expect(result?.files).toBe(files);
});

test('allows passing parserOptions', () => {
  const parserOptions: Parameters<OverrideCreator>[0]['parserOptions'] = {
    ecmaVersion: 2017,
  };

  const result = createStorybookOverride({
    ...storybookDefaultProject,
    parserOptions,
  });

  expect(result?.parserOptions?.ecmaVersion).toStrictEqual(
    parserOptions.ecmaVersion
  );
});

test('allows passing settings', () => {
  const settings: Parameters<OverrideCreator>[0]['settings'] = {
    foo: 'bar',
  };

  const result = createStorybookOverride({
    ...storybookDefaultProject,
    settings,
  });

  expect(result?.settings).toStrictEqual(settings);
});

test('allows passing env', () => {
  const env: Parameters<OverrideCreator>[0]['env'] = {
    browser: true,
  };

  const result = createStorybookOverride({
    ...storybookDefaultProject,
    env,
  });

  expect(result?.env).toStrictEqual(env);
});

test('allows passing excludedFiles', () => {
  const excludedFiles = ['src/test.foo'];

  const result = createStorybookOverride({
    ...storybookDefaultProject,
    excludedFiles,
  });

  expect(result?.excludedFiles).toStrictEqual(excludedFiles);
});

test('allows passing extends', () => {
  const customExtends = ['some-config'];

  const result = createStorybookOverride({
    ...storybookDefaultProject,
    extends: customExtends,
  });

  expect(customExtends.every(e => result?.extends?.includes(e))).toBe(true);
});

test('allows passing globals', () => {
  const globals = {
    foo: true,
  };

  const result = createStorybookOverride({
    ...storybookDefaultProject,
    globals,
  });

  expect(result?.globals).toStrictEqual(globals);
});

test('allows passing plugins', () => {
  const plugins = ['a', 'b', 'c'];

  const result = createStorybookOverride({
    ...storybookDefaultProject,
    plugins,
  });

  expect(plugins.every(plugin => result?.plugins?.includes(plugin))).toBe(true);
});

test('allows passing overrides', () => {
  const overrides: Parameters<OverrideCreator>[0]['overrides'] = [
    {
      files: ['src/test.foo'],
      rules: {
        foo: 'warn',
      },
    },
  ];

  const result = createStorybookOverride({
    ...storybookDefaultProject,
    overrides,
  });

  expect(result?.overrides).toStrictEqual(overrides);
});

describe('override snapshots', () => {
  test('without storybook', () => {
    expect(createStorybookOverride(defaultProject)).toMatchSnapshot();
  });

  test('with react', () => {
    expect(
      createStorybookOverride({
        ...storybookDefaultProject,
        react: {
          ...storybookDefaultProject.react,
          hasReact: true,
        },
      })
    ).toMatchSnapshot();
  });

  test('with typescript', () => {
    expect(
      createStorybookOverride({
        ...storybookDefaultProject,
        typescript: {
          ...storybookDefaultProject.typescript,
          hasTypeScript: true,
        },
      })
    ).toMatchSnapshot();
  });

  test('with storybook-testing-lib', () => {
    expect(
      createStorybookOverride({
        ...storybookDefaultProject,
        storybook: {
          ...storybookDefaultProject.storybook,
          hasStorybookTestingLibrary: true,
        },
      })
    ).toMatchSnapshot();
  });
});
