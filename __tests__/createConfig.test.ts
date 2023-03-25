import { type CreateConfigArgs } from '../src/createConfig';
import { createConfig } from '../src/createConfig';
import * as getDeps from '../src/getDependencies';
import * as react from '../src/overrides/react';
import { createTypeScriptOverride } from '../src/overrides/typescript';
import * as flags from '../src/utils/flags';

test('defaults to root being true', () => {
  expect(createConfig().root).toBe(true);
});

test('allows disabling root', () => {
  expect(createConfig({ root: false }).root).toBe(false);
});

test('sets reportUnusedDisableDirectives to true', () => {
  expect(createConfig().reportUnusedDisableDirectives).toBe(true);
});

test('forwards default flags to applyFlags', () => {
  const applyFlagsSpy = jest.spyOn(flags, 'applyFlags');

  createConfig();

  expect(applyFlagsSpy.mock.calls[0]?.[1]).toMatchInlineSnapshot(`
    {
      "blankSlate": false,
      "convertToESLintInternals": false,
      "incrementalAdoption": false,
    }
  `);
});

test('removes duplicates in plugins if passed', () => {
  expect(
    createConfig({
      plugins: ['foo', 'foo'],
    }).plugins
  ).toMatchInlineSnapshot(`
    [
      "import",
      "unicorn",
      "promise",
      "sonarjs",
      "simple-import-sort",
      "foo",
    ]
  `);
});

test('drops overrideType', () => {
  const reactOverrideSpy = jest.spyOn(react, 'createReactOverride');

  const mockDependencies = {
    hasJest: false,
    hasJestDom: false,
    hasNest: false,
    react: {
      hasReact: true,
      isCreateReactApp: false,
      isNext: false,
      isPreact: false,
      isRemix: false,
      version: '17.0.0',
    },
    hasNodeTypes: false,
    hasTestingLibrary: false,
    storybook: {
      hasStorybook: false,
      hasStorybookTestingLibrary: false,
    },
    typescript: {
      config: null,
      hasTypeScript: false,
      version: null,
    },
    hasTailwind: false,
  };

  jest.spyOn(getDeps, 'getDependencies').mockImplementation(() => {
    return mockDependencies;
  });

  const cfg = createConfig();

  expect(reactOverrideSpy).toHaveBeenCalledWith(mockDependencies);
  expect(cfg.overrides).toHaveLength(1);
  // eslint-disable-next-line jest/no-conditional-in-test
  expect(cfg.overrides?.[0] ? 'overrideType' in cfg.overrides[0] : true).toBe(
    false
  );
});

test('allows passing custom overrides', () => {
  const mockOverride: Exclude<
    CreateConfigArgs['overrides'],
    undefined
  >[number] = {
    files: ['a'],
    rules: {
      foo: 'warn',
    },
  };

  const cfg = createConfig({
    overrides: [mockOverride],
  });

  expect(cfg.overrides).toContainEqual(mockOverride);
});

test('removes duplicates if eslint-config-galex internal overrides are passed and merges', () => {
  const mockDependencies = {
    hasJest: false,
    hasJestDom: false,
    hasNest: false,
    react: {
      hasReact: true,
      isCreateReactApp: false,
      isNext: false,
      isPreact: false,
      isRemix: false,
      version: '17.0.0',
    },
    hasNodeTypes: false,
    hasTestingLibrary: false,
    storybook: {
      hasStorybook: false,
      hasStorybookTestingLibrary: false,
    },
    typescript: {
      config: null,
      hasTypeScript: true,
      version: '4.0.0',
    },
    hasTailwind: false,
  };

  jest.spyOn(getDeps, 'getDependencies').mockImplementation(() => {
    return mockDependencies;
  });

  const customReactOverride = react.createReactOverride({
    ...mockDependencies,
    rules: {
      'react/react-in-jsx-scope': 'error',
    },
  });

  const customTypescriptOverride = createTypeScriptOverride({
    ...mockDependencies,
  });

  const cfg = createConfig({
    overrides:
      // eslint-disable-next-line jest/no-conditional-in-test
      customReactOverride && customTypescriptOverride
        ? [customReactOverride, customTypescriptOverride]
        : [],
  });

  expect(cfg.overrides?.[0]?.rules?.['react/react-in-jsx-scope']).toBe('error');
});

test('does not remove internal override if files are different', () => {
  const mockDependencies = {
    hasJest: false,
    hasJestDom: false,
    hasNest: false,
    react: {
      hasReact: true,
      isCreateReactApp: false,
      isNext: false,
      isPreact: false,
      isRemix: false,
      version: '17.0.0',
    },
    hasNodeTypes: false,
    hasTestingLibrary: false,
    storybook: {
      hasStorybook: false,
      hasStorybookTestingLibrary: false,
    },
    typescript: {
      config: null,
      hasTypeScript: false,
      version: null,
    },
    hasTailwind: false,
  };

  jest.spyOn(getDeps, 'getDependencies').mockImplementation(() => {
    return mockDependencies;
  });

  const customReactOverride = react.createReactOverride({
    ...mockDependencies,
    rules: {
      'react/react-in-jsx-scope': 'error',
    },
    files: 'foo',
  });

  const randomThirdOverride: Exclude<
    CreateConfigArgs['overrides'],
    undefined
  >[number] = {
    files: 'bar',
    rules: { test: 'warn' },
  };

  const cfg = createConfig({
    // eslint-disable-next-line jest/no-conditional-in-test
    overrides: customReactOverride
      ? [customReactOverride, randomThirdOverride]
      : [randomThirdOverride],
  });

  expect(cfg.overrides).toHaveLength(3);

  // eslint-disable-next-line jest/no-conditional-in-test
  expect((cfg.overrides ?? []).some(override => override.files === 'foo')).toBe(
    true
  );
});
