import packageJson from '../../package.json';
import {
  createTypeScriptOverride,
  createTypeScriptRules,
  createNestJsRules,
  createRemixTypeScriptOverride,
  createEtcRules,
} from '../../src/overrides/typescript';
import type { OverrideCreator } from '../../src/types';
import tsConfig from '../../tsconfig.json';
import { defaultProject } from '../shared';

const typescriptDefaultProject: Parameters<OverrideCreator>[0] = {
  ...defaultProject,
  typescript: {
    hasTypeScript: true,
    version: packageJson.dependencies.typescript,
    // @ts-expect-error config naturally works
    config: tsConfig,
  },
};

test('allows passing rules', () => {
  const ruleName = 'foo';
  const ruleValue = 'warn';

  const result = createTypeScriptOverride({
    ...typescriptDefaultProject,
    rules: {
      [ruleName]: ruleValue,
    },
  });

  expect(result?.rules[ruleName]).toBe(ruleValue);
});

test('allows passing custom files', () => {
  const files = ['foo/bar'];

  const result = createTypeScriptOverride({
    ...typescriptDefaultProject,
    files,
  });

  expect(result?.files).toBe(files);
});

test('allows passing parserOptions', () => {
  const parserOptions: Parameters<OverrideCreator>[0]['parserOptions'] = {
    ecmaVersion: 2017,
  };

  const result = createTypeScriptOverride({
    ...typescriptDefaultProject,
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

  const result = createTypeScriptOverride({
    ...typescriptDefaultProject,
    settings,
  });

  expect(result?.settings?.foo).toStrictEqual(settings.foo);
});

test('allows passing env', () => {
  const env: Parameters<OverrideCreator>[0]['env'] = {
    browser: true,
  };

  const result = createTypeScriptOverride({
    ...typescriptDefaultProject,
    env,
  });

  expect(result?.env).toStrictEqual(env);
});

test('allows passing excludedFiles', () => {
  const excludedFiles = ['src/test.foo'];

  const result = createTypeScriptOverride({
    ...typescriptDefaultProject,
    excludedFiles,
  });

  expect(result?.excludedFiles).toStrictEqual(excludedFiles);
});

test('allows passing extends', () => {
  const customExtends = ['some-config'];

  const result = createTypeScriptOverride({
    ...typescriptDefaultProject,
    extends: customExtends,
  });

  expect(customExtends.every(e => result?.extends?.includes(e))).toBe(true);
});

test('allows passing globals', () => {
  const globals = {
    foo: true,
  };

  const result = createTypeScriptOverride({
    ...typescriptDefaultProject,
    globals,
  });

  expect(result?.globals).toStrictEqual(globals);
});

test('allows passing plugins', () => {
  const plugins = ['a', 'b', 'c'];

  const result = createTypeScriptOverride({
    ...typescriptDefaultProject,
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

  const result = createTypeScriptOverride({
    ...typescriptDefaultProject,
    overrides,
  });

  expect(result?.overrides).toStrictEqual(overrides);
});

describe('override snapshots', () => {
  test('without typescript', () => {
    expect(createTypeScriptOverride(defaultProject)).toMatchSnapshot();
  });
});

describe('createTypeScriptRules', () => {
  test('without typescript', () => {
    expect(createTypeScriptRules(defaultProject)).toMatchSnapshot();
  });

  test('without version', () => {
    expect(
      createTypeScriptRules({
        ...typescriptDefaultProject,
        typescript: {
          ...typescriptDefaultProject.typescript,
          version: null,
        },
      })
    ).toMatchSnapshot();
  });

  test('with create-react-app', () => {
    expect(
      createTypeScriptRules({
        ...typescriptDefaultProject,
        react: {
          ...typescriptDefaultProject.react,
          hasReact: true,
          isCreateReactApp: true,
        },
      })
    ).toMatchSnapshot();
  });

  test('with version 3', () => {
    expect(
      createTypeScriptRules({
        ...typescriptDefaultProject,
        typescript: {
          ...typescriptDefaultProject.typescript,
          version: '3.0.0',
        },
      })
    ).toMatchSnapshot();
  });

  test('with version 3.4', () => {
    expect(
      createTypeScriptRules({
        ...typescriptDefaultProject,
        typescript: {
          ...typescriptDefaultProject.typescript,
          version: '3.4.0',
        },
      })
    ).toMatchSnapshot();
  });

  test('with version 3.7', () => {
    expect(
      createTypeScriptRules({
        ...typescriptDefaultProject,
        typescript: {
          ...typescriptDefaultProject.typescript,
          version: '3.7.0',
        },
      })
    ).toMatchSnapshot();
  });

  test('with version 3.7 and strict null checks', () => {
    expect(
      createTypeScriptRules({
        ...typescriptDefaultProject,
        typescript: {
          ...typescriptDefaultProject.typescript,
          version: '3.7.0',
          config: {
            ...typescriptDefaultProject.typescript.config,
            compilerOptions: {
              ...typescriptDefaultProject.typescript.config?.compilerOptions,
              strictNullChecks: true,
            },
          },
        },
      })
    ).toMatchSnapshot();
  });

  test('with version 3.8', () => {
    expect(
      createTypeScriptRules({
        ...typescriptDefaultProject,
        typescript: {
          ...typescriptDefaultProject.typescript,
          version: '3.8.0',
        },
      })
    ).toMatchSnapshot();
  });

  test('with version 3.9', () => {
    expect(
      createTypeScriptRules({
        ...typescriptDefaultProject,
        typescript: {
          ...typescriptDefaultProject.typescript,
          version: '3.9.0',
        },
      })
    ).toMatchSnapshot();
  });

  test('with version 4', () => {
    expect(
      createTypeScriptRules({
        ...typescriptDefaultProject,
        typescript: {
          ...typescriptDefaultProject.typescript,
          version: '4.0.0',
        },
      })
    ).toMatchSnapshot();
  });

  test('without strict', () => {
    expect(
      createTypeScriptRules({
        ...typescriptDefaultProject,
        typescript: {
          ...typescriptDefaultProject.typescript,
          config: {
            compilerOptions: {
              strict: false,
            },
          },
        },
      })
    ).toMatchSnapshot();
  });

  test('without strictNullChecks', () => {
    expect(
      createTypeScriptRules({
        ...typescriptDefaultProject,
        typescript: {
          ...typescriptDefaultProject.typescript,
          config: {
            compilerOptions: {
              strictNullChecks: false,
            },
          },
        },
      })
    ).toMatchSnapshot();
  });

  test('with react', () => {
    expect(
      createTypeScriptRules({
        ...typescriptDefaultProject,
        react: {
          ...typescriptDefaultProject.react,
          hasReact: true,
        },
      })
    ).toMatchSnapshot();
  });
});

describe('createNestJsRules', () => {
  test('without nest', () => {
    expect(createNestJsRules(defaultProject)).toMatchSnapshot();
  });

  test('with nest', () => {
    expect(
      createNestJsRules({
        ...typescriptDefaultProject,
        hasNest: true,
      })
    ).toMatchSnapshot();
  });
});

describe('createRemixTypeScriptOverride', () => {
  test('with remix and typescript', () => {
    expect(
      createRemixTypeScriptOverride({
        ...typescriptDefaultProject,
        react: {
          ...typescriptDefaultProject.react,
          isRemix: true,
        },
      })
    ).toMatchSnapshot();
  });
});

describe('createEtcRules', () => {
  test('without TS', () => {
    expect(createEtcRules(defaultProject)).toBeNull();
  });

  test('with TS', () => {
    expect(createEtcRules(typescriptDefaultProject)).not.toBeNull();
  });
});
