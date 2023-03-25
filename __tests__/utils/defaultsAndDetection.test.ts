import {
  detectEnv,
  detectParserOptions,
  detectPlugins,
} from '../../src/utils/defaultsAndDetection';

const mockDependencies = {
  hasJest: false,
  hasJestDom: false,
  hasNodeTypes: false,
  hasTestingLibrary: false,
  hasNest: false,
  hasTailwind: false,
  storybook: {
    hasStorybook: false,
    hasStorybookTestingLibrary: false,
  },
  react: {
    hasReact: false,
    isCreateReactApp: false,
    isNext: false,
    isRemix: false,
    isPreact: false,
    version: null,
  },
  typescript: {
    config: null,
    hasTypeScript: false,
    version: null,
  },
};

describe('detectEnv', () => {
  test('default disables browser', () => {
    expect(detectEnv(mockDependencies)?.browser).toBe(false);
  });

  test('enables browser if react is found', () => {
    expect(
      detectEnv({
        ...mockDependencies,
        react: {
          ...mockDependencies.react,
          hasReact: true,
        },
      })?.browser
    ).toBe(true);
  });

  test('default enables node', () => {
    expect(detectEnv(mockDependencies)?.node).toBe(true);
  });

  test('given typescript, enables node if nest is present', () => {
    expect(
      detectEnv({
        ...mockDependencies,
        typescript: { ...mockDependencies.typescript, hasTypeScript: true },
        hasNest: true,
      })?.node
    ).toBe(true);
  });

  test('given typescript, enables node if @types/node is present', () => {
    expect(
      detectEnv({
        ...mockDependencies,
        typescript: { ...mockDependencies.typescript, hasTypeScript: true },
        hasNodeTypes: true,
      })?.node
    ).toBe(true);
  });
});

describe('detectParserOptions', () => {
  test('defaults ecmaVersion to latest', () => {
    expect(detectParserOptions()?.ecmaVersion).toBe('latest');
  });

  test('defaults sourceType to module', () => {
    expect(detectParserOptions()?.sourceType).toBe('module');
  });

  test('defaults to ecmaFeatures being empty', () => {
    expect(detectParserOptions()?.ecmaFeatures).toMatchObject({});
  });

  test('allows overriding ecmaVersion', () => {
    expect(detectParserOptions({ ecmaVersion: 2015 })?.ecmaVersion).toBe(2015);
  });

  test('allows overriding sourceType', () => {
    expect(detectParserOptions({ sourceType: 'script' })?.sourceType).toBe(
      'script'
    );
  });

  test('allows passing ecmaFeatures', () => {
    expect(
      detectParserOptions({ ecmaFeatures: { jsx: true } })?.ecmaFeatures
    ).toMatchObject({ jsx: true });
  });
});

describe('detectPlugins', () => {
  test('without tailwind', () => {
    expect(detectPlugins(mockDependencies)).toMatchSnapshot();
  });

  test('with tailwind', () => {
    expect(
      detectPlugins({ ...mockDependencies, hasTailwind: true })
    ).toMatchSnapshot();
  });

  test('with custom plugins', () => {
    expect(detectPlugins(mockDependencies, ['foo'])).toMatchSnapshot();
  });
});
