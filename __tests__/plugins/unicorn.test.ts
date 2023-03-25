import { ModuleKind, ScriptTarget } from 'typescript';

import packageJson from '../../package.json';
import { createUnicornPlugin } from '../../src/plugins/unicorn';
import tsConfig from '../../tsconfig.json';
import { defaultProject } from '../shared';

test('allows passing rules', () => {
  const ruleName = 'foo';
  const ruleValue = 'off';

  const result = createUnicornPlugin({
    ...defaultProject,
    rules: {
      [ruleName]: ruleValue,
    },
  });

  expect(result?.[ruleName]).toBe(ruleValue);
});

test('with typescript', () => {
  expect(
    createUnicornPlugin({
      ...defaultProject,
      typescript: {
        hasTypeScript: true,
        version: packageJson.dependencies.typescript,
        // @ts-expect-error false positive
        config: tsConfig,
      },
    })
  ).toMatchSnapshot();
});

test('with @types/node', () => {
  expect(
    createUnicornPlugin({
      ...defaultProject,
      hasNodeTypes: true,
    })
  ).toMatchSnapshot();
});

describe('String.prototype.replaceAll detection', () => {
  test('with both criteria', () => {
    expect(
      createUnicornPlugin({
        ...defaultProject,
        react: {
          ...defaultProject.react,
          hasReact: true,
        },
        typescript: {
          hasTypeScript: true,
          version: packageJson.dependencies.typescript,
          config: {
            compilerOptions: {
              lib: ['esnext'],
            },
          },
        },
      })
    ).toMatchSnapshot();
  });

  test('with lib esnext', () => {
    expect(
      createUnicornPlugin({
        ...defaultProject,
        typescript: {
          hasTypeScript: true,
          version: packageJson.dependencies.typescript,
          config: {
            compilerOptions: {
              lib: ['esnext'],
            },
          },
        },
      })
    ).toMatchSnapshot();
  });

  test('with react', () => {
    expect(
      createUnicornPlugin({
        ...defaultProject,
        react: {
          ...defaultProject.react,
          hasReact: true,
        },
      })
    ).toMatchSnapshot();
  });
});

describe('topLevelAwait detection', () => {
  test('with both criteria', () => {
    expect(
      createUnicornPlugin({
        ...defaultProject,
        typescript: {
          hasTypeScript: true,
          version: packageJson.dependencies.typescript,
          config: {
            compilerOptions: {
              target: 2017,
              module: ModuleKind.ESNext,
            },
          },
        },
      })
    ).toMatchSnapshot();
  });

  test('with invalid module', () => {
    expect(
      createUnicornPlugin({
        ...defaultProject,
        typescript: {
          hasTypeScript: true,
          version: packageJson.dependencies.typescript,
          config: {
            compilerOptions: {
              target: 2017,
            },
          },
        },
      })
    ).toMatchSnapshot();
  });

  test('with invalid target', () => {
    expect(
      createUnicornPlugin({
        ...defaultProject,
        typescript: {
          hasTypeScript: true,
          version: packageJson.dependencies.typescript,
          config: {
            compilerOptions: {
              module: ModuleKind.ESNext,
            },
          },
        },
      })
    ).toMatchSnapshot();
  });

  test('with invalid ScriptTarget', () => {
    expect(
      createUnicornPlugin({
        ...defaultProject,
        typescript: {
          hasTypeScript: true,
          version: packageJson.dependencies.typescript,
          config: {
            compilerOptions: {
              target: ScriptTarget.ES2015,
              module: ModuleKind.ESNext,
            },
          },
        },
      })
    ).toMatchSnapshot();
  });

  test('with invalid string target', () => {
    expect(
      createUnicornPlugin({
        ...defaultProject,
        typescript: {
          hasTypeScript: true,
          version: packageJson.dependencies.typescript,
          config: {
            compilerOptions: {
              // @ts-expect-error false positive
              target: 'es2015',
              module: ModuleKind.ESNext,
            },
          },
        },
      })
    ).toMatchSnapshot();
  });

  test('with entirely invalid target', () => {
    expect(
      createUnicornPlugin({
        ...defaultProject,
        typescript: {
          hasTypeScript: true,
          version: packageJson.dependencies.typescript,
          config: {
            compilerOptions: {
              // @ts-expect-error false positive
              target: '',
              module: ModuleKind.ESNext,
            },
          },
        },
      })
    ).toMatchSnapshot();
  });
});

test('with react', () => {
  expect(
    createUnicornPlugin({
      ...defaultProject,
      react: {
        ...defaultProject.react,
        hasReact: true,
      },
    })
  ).toMatchSnapshot();
});
