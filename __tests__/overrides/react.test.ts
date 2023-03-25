import {
  createHookRules,
  createReactOverride,
  createReactRules,
  createRemixRoutesOverride,
} from '../../src/overrides/react';
import { type OverrideCreator } from '../../src/types';
import { defaultProject } from '../shared';

const reactDefaultProject: Parameters<OverrideCreator>[0] = {
  ...defaultProject,
  react: {
    ...defaultProject.react,
    hasReact: true,
    version: '16.8.0',
  },
};

test('allows passing rules', () => {
  const ruleName = 'foo';
  const ruleValue = 'warn';

  const result = createReactOverride({
    ...reactDefaultProject,
    rules: {
      [ruleName]: ruleValue,
    },
  });

  expect(result?.rules[ruleName]).toBe(ruleValue);
});

test('allows passing custom files', () => {
  const files = ['foo/bar'];

  const result = createReactOverride({
    ...reactDefaultProject,
    files,
  });

  expect(result?.files).toBe(files);
});

test('allows passing parserOptions', () => {
  const parserOptions: Parameters<OverrideCreator>[0]['parserOptions'] = {
    ecmaFeatures: {
      jsx: false,
    },
  };

  const result = createReactOverride({
    ...reactDefaultProject,
    parserOptions,
  });

  expect(result?.parserOptions?.ecmaFeatures).toStrictEqual(
    parserOptions.ecmaFeatures
  );
});

test('allows passing settings', () => {
  const settings = {
    react: {
      version: '16.8',
    },
  };

  const result = createReactOverride({
    ...reactDefaultProject,
    settings,
  });

  expect(result?.settings).toStrictEqual(settings);
});

test('allows passing env', () => {
  const env = {
    jest: false,
  };

  const result = createReactOverride({
    ...reactDefaultProject,
    env,
  });

  expect(result?.env).toStrictEqual(env);
});

test('allows passing excludedFiles', () => {
  const excludedFiles = ['src/test.foo'];

  const result = createReactOverride({
    ...reactDefaultProject,
    excludedFiles,
  });

  expect(result?.excludedFiles).toStrictEqual(excludedFiles);
});

test('allows passing extends', () => {
  const customExtends = ['some-config'];

  const result = createReactOverride({
    ...reactDefaultProject,
    extends: customExtends,
  });

  expect(customExtends.every(e => result?.extends?.includes(e))).toBe(true);
});

test('allows passing globals', () => {
  const globals = {
    foo: true,
  };

  const result = createReactOverride({
    ...reactDefaultProject,
    globals,
  });

  expect(result?.globals).toStrictEqual(globals);
});

test('allows passing plugins', () => {
  const plugins = ['a', 'b', 'c'];

  const result = createReactOverride({
    ...reactDefaultProject,
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

  const result = createReactOverride({
    ...reactDefaultProject,
    overrides,
  });

  expect(result?.overrides).toStrictEqual(overrides);
});

describe('override snapshots', () => {
  test('without react', () => {
    expect(createReactOverride(defaultProject)).toMatchSnapshot();
  });

  test('default', () => {
    expect(createReactOverride(reactDefaultProject)).toMatchSnapshot();
  });

  test('declares NODE_ENV given criteria', () => {
    const initialEnv = process.env.NODE_ENV;
    delete process.env.NODE_ENV;

    expect(
      createReactOverride({
        ...reactDefaultProject,
        react: {
          ...reactDefaultProject.react,
          isCreateReactApp: true,
        },
      })
    ).toMatchSnapshot();

    expect(process.env.NODE_ENV).toBe('development');

    process.env.NODE_ENV = initialEnv;
  });

  test('with react 17', () => {
    expect(
      createReactOverride({
        ...reactDefaultProject,
        react: {
          ...reactDefaultProject.react,
          version: '17.0.0',
        },
      })
    ).toMatchSnapshot();
  });

  test('with create-react-app', () => {
    expect(
      createReactOverride({
        ...reactDefaultProject,
        react: {
          ...reactDefaultProject.react,
          isCreateReactApp: true,
        },
      })
    ).toMatchSnapshot();
  });

  test('with next', () => {
    expect(
      createReactOverride({
        ...reactDefaultProject,
        react: {
          ...reactDefaultProject.react,
          isNext: true,
        },
      })
    ).toMatchSnapshot();
  });

  test('with remix', () => {
    expect(
      createReactOverride({
        ...reactDefaultProject,
        react: {
          ...reactDefaultProject.react,
          isRemix: true,
        },
      })
    ).toMatchSnapshot();
  });

  test('with create-react-app and typescript', () => {
    expect(
      createReactOverride({
        ...reactDefaultProject,
        react: {
          ...reactDefaultProject.react,
          isCreateReactApp: true,
        },
        typescript: {
          ...reactDefaultProject.typescript,
          hasTypeScript: true,
        },
      })
    ).toMatchSnapshot();
  });

  test('with next and typescript', () => {
    expect(
      createReactOverride({
        ...reactDefaultProject,
        react: {
          ...reactDefaultProject.react,
          isNext: true,
        },
        typescript: {
          ...reactDefaultProject.typescript,
          hasTypeScript: true,
        },
      })
    ).toMatchSnapshot();
  });

  test('with remix and typescript', () => {
    expect(
      createReactOverride({
        ...reactDefaultProject,
        react: {
          ...reactDefaultProject.react,
          isRemix: true,
        },
        typescript: {
          ...reactDefaultProject.typescript,
          hasTypeScript: true,
        },
      })
    ).toMatchSnapshot();
  });
});

describe('createReactRules', () => {
  const withReact17 = {
    ...reactDefaultProject,
    react: {
      ...reactDefaultProject.react,
      version: '17.0.0',
    },
  };

  test('with react 16', () => {
    expect(
      createReactRules({
        ...defaultProject,
        react: {
          ...defaultProject.react,
          version: '16.4.0',
        },
      })
    ).toMatchSnapshot();
  });

  test('without version', () => {
    expect(
      createReactRules({
        ...defaultProject,
        react: {
          ...defaultProject.react,
          version: null,
        },
      })
    ).toMatchSnapshot();
  });

  test('default', () => {
    expect(createReactRules(withReact17)).toMatchSnapshot();
  });

  test('with typescript', () => {
    expect(
      createReactRules({
        ...withReact17,
        typescript: {
          ...withReact17.typescript,
          hasTypeScript: true,
        },
      })
    ).toMatchSnapshot();
  });

  test('with next', () => {
    expect(
      createReactOverride({
        ...withReact17,
        react: {
          ...withReact17.react,
          isNext: true,
        },
      })
    ).toMatchSnapshot();
  });

  test('with typescript and next', () => {
    expect(
      createReactOverride({
        ...withReact17,
        react: {
          ...withReact17.react,
          isNext: true,
        },
        typescript: {
          ...withReact17.typescript,
          hasTypeScript: true,
        },
      })
    ).toMatchSnapshot();
  });
});

describe('createHookRules', () => {
  test('without react', () => {
    expect(createHookRules(defaultProject)).toMatchSnapshot();
  });

  test('without version', () => {
    expect(
      createHookRules({
        ...defaultProject,
        react: {
          ...defaultProject.react,
          version: null,
        },
      })
    ).toMatchSnapshot();
  });

  test('with old version', () => {
    expect(
      createHookRules({
        ...defaultProject,
        react: {
          ...defaultProject.react,
          version: '16.0.0',
        },
      })
    ).toMatchSnapshot();
  });
});

describe('createRemixRoutesOverride', () => {
  test('nulls without remix', () => {
    expect(createRemixRoutesOverride(defaultProject)).toBeNull();
  });
});
