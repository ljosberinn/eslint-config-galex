import fs from 'fs';
import * as readPkgUp from 'read-pkg-up';
import ts from 'typescript';

import {
  detectJest,
  detectJestDom,
  detectNest,
  detectNodeTypes,
  detectReact,
  detectStorybook,
  detectTestingLibrary,
  detectTypeScript,
  getDependencies,
} from '../src/getDependencies';
import { testingLibFamily } from '../src/utils/defaultsAndDetection';

describe('detectJest', () => {
  test('with react-scripts', () => {
    const map = new Map<string, string>([['react-scripts', '1.0.0']]);

    expect(detectJest(map)).toBe(true);
  });

  test('with jest', () => {
    const map = new Map<string, string>([['jest', '1.0.0']]);

    expect(detectJest(map)).toBe(true);
  });

  test('without any', () => {
    expect(detectJest(new Map())).toBe(false);
  });
});

describe('detectJestDom', () => {
  test('with @testing-library/jest-dom', () => {
    const map = new Map<string, string>([
      ['@testing-library/jest-dom', '1.0.0'],
    ]);

    expect(detectJestDom(map)).toBe(true);
  });

  test('without any', () => {
    expect(detectJestDom(new Map())).toBe(false);
  });
});

describe('detectNodeTypes', () => {
  test('with @types/node', () => {
    const map = new Map<string, string>([['@types/node', '1.0.0']]);

    expect(detectNodeTypes(map)).toBe(true);
  });

  test('without any', () => {
    expect(detectNodeTypes(new Map())).toBe(false);
  });
});

describe('detectNest', () => {
  test('with @nestjs/core', () => {
    const map = new Map<string, string>([['@nestjs/core', '1.0.0']]);

    expect(detectNest(map)).toBe(true);
  });

  test('without any', () => {
    expect(detectNest(new Map())).toBe(false);
  });
});

describe('detectReact', () => {
  const baseReact: [string, string] = ['react', '1.0.0'];

  test('with react', () => {
    const map = new Map<string, string>([baseReact]);

    expect(detectReact(map)).toMatchInlineSnapshot(`
      {
        "hasReact": true,
        "isCreateReactApp": false,
        "isNext": false,
        "isPreact": false,
        "isRemix": false,
        "version": "1.0.0",
      }
    `);
  });

  test('with create-react-app', () => {
    const map = new Map<string, string>([
      baseReact,
      ['react-scripts', '1.0.0'],
    ]);

    expect(detectReact(map)).toMatchInlineSnapshot(`
      {
        "hasReact": true,
        "isCreateReactApp": true,
        "isNext": false,
        "isPreact": false,
        "isRemix": false,
        "version": "1.0.0",
      }
    `);
  });

  test('with next', () => {
    const map = new Map<string, string>([baseReact, ['next', '1.0.0']]);

    expect(detectReact(map)).toMatchInlineSnapshot(`
      {
        "hasReact": true,
        "isCreateReactApp": false,
        "isNext": true,
        "isPreact": false,
        "isRemix": false,
        "version": "1.0.0",
      }
    `);
  });

  test('with remix', () => {
    const map = new Map<string, string>([
      baseReact,
      ['@remix-run/react', '1.0.0'],
    ]);

    expect(detectReact(map)).toMatchInlineSnapshot(`
      {
        "hasReact": true,
        "isCreateReactApp": false,
        "isNext": false,
        "isPreact": false,
        "isRemix": true,
        "version": "1.0.0",
      }
    `);
  });

  test('with preact', () => {
    const map = new Map<string, string>([['preact', '1.0.0']]);

    expect(detectReact(map)).toMatchInlineSnapshot(`
      {
        "hasReact": true,
        "isCreateReactApp": false,
        "isNext": false,
        "isPreact": true,
        "isRemix": false,
        "version": "1.0.0",
      }
    `);
  });
});

describe('detectTestingLibrary', () => {
  test.each([testingLibFamily])('with %s', pkg => {
    const map = new Map([[`@testing-library/${pkg}`, '1.0.0']]);

    expect(detectTestingLibrary(map)).toBe(true);
  });

  test('without', () => {
    expect(detectTestingLibrary(new Map())).toBe(false);
  });
});

describe('detectTypeScript', () => {
  test('does not check tsconfig.json if no ts dependency was found', () => {
    const readFileSyncSpy = jest.spyOn(fs, 'readFileSync');
    const parseJsonTextSpy = jest.spyOn(ts, 'parseJsonText');

    expect(detectTypeScript(new Map(), { cwd: process.cwd() }))
      .toMatchInlineSnapshot(`
        {
          "config": null,
          "hasTypeScript": false,
          "version": null,
        }
      `);
    expect(readFileSyncSpy).not.toHaveBeenCalled();
    expect(parseJsonTextSpy).not.toHaveBeenCalled();
  });

  test('bails on the first config found with compilerOptions', () => {
    jest.spyOn(fs, 'readFileSync').mockReturnValue('');
    // @ts-expect-error mocked
    jest.spyOn(ts, 'parseJsonText').mockReturnValue('');

    const key = 'foo';
    const value = 'bar';

    jest.spyOn(ts, 'convertToObject').mockReturnValueOnce({
      compilerOptions: { [key]: value },
    });

    const map = new Map([['typescript', '1.0.0']]);
    const result = detectTypeScript(map, { cwd: process.cwd() });

    expect(result).toMatchInlineSnapshot(`
      {
        "config": {
          "compilerOptions": {
            "foo": "bar",
          },
        },
        "hasTypeScript": true,
        "version": "1.0.0",
      }
    `);
    expect(result.config?.compilerOptions?.[key]).toBe(value);
  });

  test('recursively reads tsConfig.extends property until it finds a tsConfig with compilerOptions', () => {
    jest.spyOn(fs, 'readFileSync').mockReturnValue('');
    // @ts-expect-error mocked
    jest.spyOn(ts, 'parseJsonText').mockReturnValue('');

    const key = 'foo';
    const value = 'bar';

    let i = 0;

    jest.spyOn(ts, 'convertToObject').mockImplementation(() => {
      // eslint-disable-next-line jest/no-conditional-in-test
      if (i === 0) {
        i++;
        return {
          extends: '../tsconfig.json',
        };
      }

      return {
        compilerOptions: { [key]: value },
      };
    });

    const map = new Map([['typescript', '1.0.0']]);
    const result = detectTypeScript(map, { cwd: process.cwd() });

    expect(result.config?.compilerOptions?.[key]).toBe(value);
  });

  test('picks last tsConfig even if no extends or compilerOptions are present', () => {
    jest.spyOn(fs, 'readFileSync').mockReturnValue('');
    // @ts-expect-error mocked
    jest.spyOn(ts, 'parseJsonText').mockReturnValue('');

    let i = 0;

    jest.spyOn(ts, 'convertToObject').mockImplementation(() => {
      // eslint-disable-next-line jest/no-conditional-in-test
      if (i === 0) {
        i++;
        return {
          extends: '../tsconfig.json',
        };
      }

      return {
        exclude: [],
      };
    });

    const map = new Map([['typescript', '1.0.0']]);

    expect(detectTypeScript(map, { cwd: process.cwd() }))
      .toMatchInlineSnapshot(`
      {
        "config": {
          "exclude": [],
        },
        "hasTypeScript": true,
        "version": "1.0.0",
      }
    `);
  });

  test('allows passing an alternative tsConfigPath which is prioritized', () => {
    jest.spyOn(fs, 'readFileSync').mockReturnValue('');
    // @ts-expect-error mocked
    jest.spyOn(ts, 'parseJsonText').mockReturnValue('');

    const key = 'foo';
    const value = 'bar';

    jest.spyOn(ts, 'convertToObject').mockReturnValue({
      compilerOptions: { [key]: value },
    });

    const tsConfigName = 'tsconfig.base.json';
    const mockTsConfigPath = `../${tsConfigName}`;

    const map = new Map([['typescript', '1.0.0']]);
    const result = detectTypeScript(map, {
      cwd: process.cwd(),
      tsConfigPath: mockTsConfigPath,
    });

    expect(fs.readFileSync).toHaveBeenLastCalledWith(
      expect.stringContaining(tsConfigName),
      expect.any(String)
    );
    expect(ts.parseJsonText).toHaveBeenCalledWith(
      tsConfigName,
      expect.any(String)
    );

    expect(result).toMatchInlineSnapshot(`
      {
        "config": {
          "compilerOptions": {
            "foo": "bar",
          },
        },
        "hasTypeScript": true,
        "version": "1.0.0",
      }
    `);
  });

  test('console.infos if typescript is present but tsConfig cannot be found', () => {
    // eslint-disable-next-line no-console
    const consoleInfo = console.info;

    const consoleInfoSpy = jest
      .spyOn(console, 'info')
      .mockImplementation(() => {});

    expect(
      detectTypeScript(new Map([['typescript', '1.0.0']]), {
        cwd: process.cwd(),
        tsConfigPath: '/',
      })
    ).toMatchInlineSnapshot(`
      {
        "config": null,
        "hasTypeScript": false,
        "version": null,
      }
    `);

    expect(consoleInfoSpy).toHaveBeenCalledTimes(1);

    // eslint-disable-next-line no-console
    console.info = consoleInfo;
  });
});

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

describe('getDependencies', () => {
  test('errors if package.json is unreadable', () => {
    // @ts-expect-error intentionally incomplete mock
    jest.spyOn(readPkgUp, 'sync').mockImplementation(() => {});

    // eslint-disable-next-line no-console
    const consoleError = console.error;

    const consoleErrorSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    expect(getDependencies({ cwd: '/foo' })).toMatchInlineSnapshot(`
      {
        "hasJest": false,
        "hasJestDom": false,
        "hasNest": false,
        "hasNodeTypes": false,
        "hasTestingLibrary": false,
        "react": {
          "hasReact": false,
          "isCreateReactApp": false,
          "isNext": false,
          "isPreact": false,
          "isRemix": false,
          "version": null,
        },
        "storybook": {
          "hasStorybook": false,
          "hasStorybookTestingLibrary": false,
        },
        "typescript": {
          "config": null,
          "hasTypeScript": false,
          "version": null,
        },
      }
    `);

    expect(consoleErrorSpy).toHaveBeenCalledTimes(1);

    // eslint-disable-next-line no-console
    console.error = consoleError;
  });

  test('matches snapshot', () => {
    expect(getDependencies()).toMatchInlineSnapshot(`
      {
        "hasJest": true,
        "hasJestDom": false,
        "hasNest": false,
        "hasNodeTypes": true,
        "hasTestingLibrary": false,
        "react": {
          "hasReact": false,
          "isCreateReactApp": false,
          "isNext": false,
          "isPreact": false,
          "isRemix": false,
          "version": null,
        },
        "storybook": {
          "hasStorybook": false,
          "hasStorybookTestingLibrary": false,
        },
        "typescript": {
          "config": {
            "$schema": "https://json.schemastore.org/tsconfig",
            "compilerOptions": {
              "allowSyntheticDefaultImports": true,
              "allowUnreachableCode": false,
              "allowUnusedLabels": false,
              "alwaysStrict": true,
              "checkJs": true,
              "declaration": false,
              "declarationMap": false,
              "esModuleInterop": true,
              "exactOptionalPropertyTypes": false,
              "forceConsistentCasingInFileNames": true,
              "importsNotUsedAsValues": "error",
              "incremental": false,
              "isolatedModules": true,
              "lib": [
                "es2021",
              ],
              "module": "commonjs",
              "moduleResolution": "node",
              "noFallthroughCasesInSwitch": true,
              "noImplicitOverride": true,
              "noImplicitReturns": true,
              "noPropertyAccessFromIndexSignature": false,
              "noUncheckedIndexedAccess": true,
              "noUnusedLocals": true,
              "noUnusedParameters": true,
              "outDir": "./dist",
              "pretty": true,
              "resolveJsonModule": true,
              "rootDir": ".",
              "skipLibCheck": true,
              "strict": true,
              "target": "es2021",
            },
            "display": "Node 16",
            "exclude": [
              "node_modules",
            ],
            "include": [
              "src",
              "__tests__/**/*.ts",
            ],
          },
          "hasTypeScript": true,
          "version": "4.6.3",
        },
      }
    `);
  });
});
