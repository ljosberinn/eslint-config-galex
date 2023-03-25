import * as readPkgUp from 'read-pkg-up';
import { version } from 'typescript';

import { getDependencies } from '../src/getDependencies';

describe('getDependencies', () => {
  test('matches snapshot', () => {
    expect(getDependencies()).toMatchObject({
      hasJest: true,
      hasJestDom: false,
      hasNest: false,
      hasNodeTypes: true,
      hasTestingLibrary: false,
      react: {
        hasReact: false,
        isCreateReactApp: false,
        isNext: false,
        isPreact: false,
        isRemix: false,
        version: null,
      },
      storybook: {
        hasStorybook: false,
        hasStorybookTestingLibrary: false,
      },
      typescript: {
        config: {
          $schema: 'https://json.schemastore.org/tsconfig',
          compilerOptions: {
            allowSyntheticDefaultImports: true,
            allowUnreachableCode: false,
            allowUnusedLabels: false,
            alwaysStrict: true,
            declaration: true,
            declarationMap: false,
            esModuleInterop: true,
            exactOptionalPropertyTypes: false,
            forceConsistentCasingInFileNames: true,
            incremental: false,
            isolatedModules: true,
            lib: ['es2021'],
            module: 'commonjs',
            moduleResolution: 'node',
            noFallthroughCasesInSwitch: true,
            noImplicitOverride: true,
            noImplicitReturns: true,
            noPropertyAccessFromIndexSignature: false,
            noUncheckedIndexedAccess: true,
            noUnusedLocals: true,
            noUnusedParameters: true,
            outDir: './dist',
            pretty: true,
            resolveJsonModule: true,
            rootDir: '.',
            skipLibCheck: true,
            strict: true,
            target: 'es2021',
          },
          display: 'Node 16',
          exclude: ['node_modules'],
          include: ['src', '__tests__/**/*.ts'],
        },
        hasTypeScript: true,
        version,
      },
    });
  });

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
});
