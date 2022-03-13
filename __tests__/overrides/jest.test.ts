import {
  createJestDomRules,
  createJestOverride,
  createJestRules,
  createTestingLibraryRules,
  createTestOverrides,
  createTestingLibrarySettings,
  createJestConfigOverride,
} from '../../src/overrides/jest';
import type { OverrideCreator } from '../../src/types';
import { defaultProject } from '../shared';

const jestDefaultProject: Parameters<OverrideCreator>[0] = {
  ...defaultProject,
  hasJest: true,
};

test('allows passing rules', () => {
  const ruleName = 'foo';
  const ruleValue = 'warn';

  const result = createJestOverride({
    ...jestDefaultProject,
    rules: {
      [ruleName]: ruleValue,
    },
  });

  expect(result?.rules[ruleName]).toBe(ruleValue);
});

test('allows passing custom files', () => {
  const files = ['foo/bar'];

  const result = createJestOverride({
    ...jestDefaultProject,
    files,
  });

  expect(result?.files).toBe(files);
});

test('allows passing parserOptions', () => {
  const parserOptions: Parameters<OverrideCreator>[0]['parserOptions'] = {
    ecmaVersion: 2017,
  };

  const result = createJestOverride({
    ...jestDefaultProject,
    parserOptions,
  });

  expect(result?.parserOptions).toStrictEqual(parserOptions);
});

test('allows passing settings', () => {
  const settings = {
    jest: {
      version: 26,
    },
  };

  const result = createJestOverride({
    ...jestDefaultProject,
    settings,
  });

  expect(result?.settings).toStrictEqual(settings);
});

test('allows passing env', () => {
  const env = {
    jest: false,
  };

  const result = createJestOverride({
    ...jestDefaultProject,
    env,
  });

  expect(result?.env).toStrictEqual(env);
});

test('allows passing excludedFiles', () => {
  const excludedFiles = ['src/test.foo'];

  const result = createJestOverride({
    ...jestDefaultProject,
    excludedFiles,
  });

  expect(result?.excludedFiles).toStrictEqual(excludedFiles);
});

test('allows passing extends', () => {
  const customExtends = ['some-config'];

  const result = createJestOverride({
    ...jestDefaultProject,
    extends: customExtends,
  });

  expect(customExtends.every(e => result?.extends?.includes(e))).toBe(true);
});

test('allows passing globals', () => {
  const globals = {
    foo: true,
  };

  const result = createJestOverride({
    ...jestDefaultProject,
    globals,
  });

  expect(result?.globals).toStrictEqual(globals);
});

test('allows passing plugins', () => {
  const plugins = ['a', 'b', 'c'];

  const result = createJestOverride({
    ...jestDefaultProject,
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

  const result = createJestOverride({
    ...jestDefaultProject,
    overrides,
  });

  expect(result?.overrides).toStrictEqual(overrides);
});

describe('override snapshots', () => {
  test('without jest', () => {
    expect(createJestOverride(defaultProject)).toMatchSnapshot();
  });

  test('default', () => {
    expect(createJestOverride(jestDefaultProject)).toMatchSnapshot();
  });

  test('with jest-dom', () => {
    expect(
      createJestOverride({ ...jestDefaultProject, hasJestDom: true })
    ).toMatchSnapshot();
  });

  test('with testing-lib', () => {
    expect(
      createJestOverride({ ...jestDefaultProject, hasTestingLibrary: true })
    ).toMatchSnapshot();
  });

  test('with jest-dom and testing-lib', () => {
    expect(
      createJestOverride({
        ...jestDefaultProject,
        hasJestDom: true,
        hasTestingLibrary: true,
      })
    ).toMatchSnapshot();
  });
});

describe('createJestRules', () => {
  test('default', () => {
    expect(createJestRules(jestDefaultProject)).toMatchSnapshot();
  });

  test('with create-react-app', () => {
    expect(
      createJestOverride({
        ...jestDefaultProject,
        react: {
          ...jestDefaultProject.react,
          hasReact: true,
          isCreateReactApp: true,
        },
      })
    ).toMatchSnapshot();
  });

  test('with typescript', () => {
    expect(
      createJestOverride({
        ...jestDefaultProject,
        typescript: {
          ...jestDefaultProject.typescript,
          hasTypeScript: true,
        },
      })
    ).toMatchSnapshot();
  });

  test('with create-react-app and typescript', () => {
    expect(
      createJestOverride({
        ...jestDefaultProject,
        react: {
          ...jestDefaultProject.react,
          hasReact: true,
          isCreateReactApp: true,
        },
        typescript: {
          ...jestDefaultProject.typescript,
          hasTypeScript: true,
        },
      })
    ).toMatchSnapshot();
  });
});

describe('createJestDomRules', () => {
  test('default', () => {
    expect(createJestDomRules(jestDefaultProject)).toMatchSnapshot();
  });
});

describe('createTestingLibraryRules', () => {
  test('default', () => {
    expect(createTestingLibraryRules(jestDefaultProject)).toMatchSnapshot();
  });

  test('with react', () => {
    expect(
      createTestingLibraryRules({
        ...jestDefaultProject,
        react: {
          ...jestDefaultProject.react,
          hasReact: true,
        },
      })
    ).toMatchSnapshot();
  });
});

describe('createTestOverrides', () => {
  test('default', () => {
    expect(createTestOverrides(jestDefaultProject)).toMatchSnapshot();
  });

  test('with react', () => {
    expect(
      createTestOverrides({
        ...jestDefaultProject,
        react: {
          ...jestDefaultProject.react,
          hasReact: true,
        },
      })
    ).toMatchSnapshot();
  });

  test('with typescript', () => {
    expect(
      createTestOverrides({
        ...jestDefaultProject,
        typescript: {
          ...jestDefaultProject.typescript,
          hasTypeScript: true,
        },
      })
    ).toMatchSnapshot();
  });

  test('with react and typescript', () => {
    expect(
      createTestOverrides({
        ...jestDefaultProject,
        react: {
          ...jestDefaultProject.react,
          hasReact: true,
        },
        typescript: {
          ...jestDefaultProject.typescript,
          hasTypeScript: true,
        },
      })
    ).toMatchSnapshot();
  });
});

describe('createTestingLibrarySettings', () => {
  test('default', () => {
    expect(createTestingLibrarySettings(defaultProject)).toMatchSnapshot();
  });

  test('with testing-lib and without react', () => {
    expect(
      createTestingLibrarySettings({
        ...defaultProject,
        hasTestingLibrary: true,
      })
    ).toMatchSnapshot();
  });

  test('with react and without testing-lib', () => {
    expect(
      createTestingLibrarySettings({
        ...defaultProject,
        react: {
          ...defaultProject.react,

          hasReact: true,
        },
      })
    ).toMatchSnapshot();
  });

  test('with react and testing-lib', () => {
    expect(
      createTestingLibrarySettings({
        ...defaultProject,
        hasTestingLibrary: true,
        react: {
          ...defaultProject.react,

          hasReact: true,
        },
      })
    ).toMatchSnapshot();
  });

  test('with react, nextjs and testing-lib', () => {
    expect(
      createTestingLibrarySettings({
        ...defaultProject,
        hasTestingLibrary: true,
        react: {
          ...defaultProject.react,
          hasReact: true,
          isNext: true,
        },
      })
    ).toMatchSnapshot();
  });
});

describe('createJestConfigOverride', () => {
  test('without jest', () => {
    expect(createJestConfigOverride(defaultProject)).toMatchSnapshot();
  });

  test('default', () => {
    expect(createJestConfigOverride(jestDefaultProject)).toMatchSnapshot();
  });
});
