const fs = require('fs');
const { join } = require('path');
const readPkgUp = require('read-pkg-up');
const ts = require('typescript');

const { createConfig, getDependencies } = require('../createConfig');
const {
  overrideType: jestOverrideType,
  createJestOverride,
  jestRules,
} = require('../overrides/jest');
const { overrideType: reactOverrideType } = require('../overrides/react');
const { overrideType: tsOverrideType } = require('../overrides/typescript');
const cacheImpl = require('../utils/cache');

describe('getDependencies', () => {
  test('matches snapshot', () => {
    expect(getDependencies()).toMatchSnapshot();
  });

  test('matches snapshot when erroring', () => {
    // eslint-disable-next-line no-console
    const consoleError = console.error;

    const consoleErrorSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    expect(getDependencies({ cwd: '/foo' })).toMatchSnapshot();
    expect(consoleErrorSpy).toHaveBeenCalledTimes(1);

    // eslint-disable-next-line no-console
    console.error = consoleError;
  });

  test('accepts alternative tsDefaultConfig path', () => {
    const cwd = join(process.cwd(), 'src', '__tests__');

    expect(getDependencies({ cwd })).toMatchSnapshot();
  });

  test('given CRA, forces jest to true', () => {
    jest.spyOn(readPkgUp, 'sync').mockReturnValueOnce({
      packageJson: {
        dependencies: {
          'react-scripts': '3.4.1',
        },
      },
    });

    jest.spyOn(fs, 'readFileSync').mockReturnValue('');
    jest.spyOn(ts, 'parseJsonText').mockReturnValue('');

    const deps = getDependencies();

    expect(deps.hasJest).toBeTruthy();
    expect(deps.react.isCreateReactApp).toBeTruthy();

    expect(deps).toMatchSnapshot();
  });

  describe('given typescript', () => {
    test('does not check tsconfig.json if no ts dependency was found', () => {
      jest.spyOn(readPkgUp, 'sync').mockReturnValueOnce({
        packageJson: {
          dependencies: {},
        },
      });

      const readFileSyncSpy = jest.spyOn(fs, 'readFileSync');
      const parseJsonTextSpy = jest.spyOn(ts, 'parseJsonText');

      expect(getDependencies()).toMatchSnapshot();
      expect(readFileSyncSpy).not.toHaveBeenCalled();
      expect(parseJsonTextSpy).not.toHaveBeenCalled();
    });

    test('bails on the first config found with compilerOptions', () => {
      jest.spyOn(readPkgUp, 'sync').mockReturnValueOnce({
        packageJson: {
          dependencies: {
            typescript: '1.0.0',
          },
        },
      });

      jest.spyOn(fs, 'readFileSync').mockReturnValue('');
      jest.spyOn(ts, 'parseJsonText').mockReturnValue('');

      const key = 'foo';
      const value = 'bar';

      jest.spyOn(ts, 'convertToObject').mockReturnValueOnce({
        compilerOptions: { [key]: value },
      });

      const deps = getDependencies();

      expect(deps).toMatchSnapshot();
      expect(deps.typescript.config.compilerOptions[key]).toBe(value);
    });

    test('recursively reads extends property and retrieves next', () => {
      jest.spyOn(readPkgUp, 'sync').mockReturnValueOnce({
        packageJson: {
          dependencies: {
            typescript: '1.0.0',
          },
        },
      });

      jest.spyOn(fs, 'readFileSync').mockReturnValue('');
      jest.spyOn(ts, 'parseJsonText').mockReturnValue('');

      const key = 'foo';
      const value = 'bar';

      let i = 0;

      jest.spyOn(ts, 'convertToObject').mockImplementation(() => {
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

      const deps = getDependencies();

      expect(deps).toMatchSnapshot();
      expect(deps.typescript.config.compilerOptions[key]).toBe(value);
    });

    test('allows passing an alternative tsConfigPath which has priority', () => {
      jest.spyOn(readPkgUp, 'sync').mockReturnValueOnce({
        packageJson: {
          dependencies: {
            typescript: '1.0.0',
          },
        },
      });

      jest.spyOn(fs, 'readFileSync').mockReturnValue('');
      jest.spyOn(ts, 'parseJsonText').mockReturnValue('');

      const key = 'foo';
      const value = 'bar';

      jest.spyOn(ts, 'convertToObject').mockReturnValue({
        compilerOptions: { [key]: value },
      });

      const tsConfigName = 'tsconfig.base.json';
      const mockTsConfigPath = `../${tsConfigName}`;

      const deps = getDependencies({ tsConfigPath: mockTsConfigPath });

      expect(fs.readFileSync).toHaveBeenLastCalledWith(
        expect.stringContaining(tsConfigName),
        expect.any(String)
      );
      expect(ts.parseJsonText).toHaveBeenCalledWith(
        tsConfigName,
        expect.any(String)
      );

      expect(deps).toMatchSnapshot();
    });
  });
});

describe('createConfig', () => {
  test('matches snapshot', () => {
    expect(createConfig()).toMatchSnapshot();
  });

  test('given typescript, determines env.node based on presence of tsconfig.json', () => {
    const settings = { cacheOptions: { enabled: false } };
    const defaultConfig = createConfig(settings);

    jest.spyOn(readPkgUp, 'sync').mockReturnValueOnce({
      packageJson: {
        dependencies: {
          typescript: '1.0.0',
        },
      },
    });

    jest.spyOn(fs, 'readFileSync').mockReturnValueOnce('');
    jest.spyOn(ts, 'parseJsonText').mockReturnValueOnce('');
    jest.spyOn(ts, 'convertToObject').mockReturnValueOnce({});

    const config = createConfig(settings);

    expect(config.env.node).toBeFalsy();
    expect(config.env.node).not.toBe(defaultConfig.env.node);
  });

  test('allows passing extra rules', () => {
    const rule = 'foo';
    const value = 'error';

    const config = createConfig({ rules: { [rule]: value } });

    expect(config.rules[rule]).toBe(2);
    expect(config).toMatchSnapshot();
  });

  test('allows passing env', () => {
    const key = 'foo';
    const value = 'bar';

    const config = createConfig({ env: { [key]: value } });

    expect(config.env[key]).toBe(value);
    expect(config).toMatchSnapshot();
  });

  test('allows passing plugins', () => {
    const plugin = 'galex';

    const config = createConfig({ plugins: [plugin] });

    expect(config.plugins).toContain(plugin);
    expect(config).toMatchSnapshot();
  });

  test('allows passing overrides', () => {
    const plugin = {
      files: 'abc/def',
      rules: {},
    };

    const config = createConfig({ overrides: [plugin] });

    expect(config.overrides[1]).toStrictEqual(plugin);
    expect(config).toMatchSnapshot();
  });

  test('allows passing parserOptions', () => {
    const key = 'foo';
    const value = 'bar';

    const config = createConfig({ parserOptions: { [key]: value } });

    expect(config.parserOptions[key]).toBe(value);
    expect(config).toMatchSnapshot();
  });

  describe('overrides', () => {
    test('sorts default overrides correctly', () => {
      jest.spyOn(readPkgUp, 'sync').mockReturnValueOnce({
        packageJson: {
          dependencies: {
            typescript: '1.0.0',
            jest: '1.0.0',
            react: '1.0.0',
          },
        },
      });

      jest.spyOn(fs, 'readFileSync').mockReturnValue('');
      jest.spyOn(ts, 'parseJsonText').mockReturnValue('');

      const key = 'foo';
      const value = 'bar';

      jest.spyOn(ts, 'convertToObject').mockReturnValueOnce({
        compilerOptions: { [key]: value },
      });

      const { overrides } = createConfig();

      expect(overrides[0].overrideType).toBe(reactOverrideType);
      expect(overrides[1].overrideType).toBe(tsOverrideType);
      expect(overrides[2].overrideType).toBe(jestOverrideType);
    });

    test('sorts overrides correctly given additional, external overrides', () => {
      jest.spyOn(readPkgUp, 'sync').mockReturnValueOnce({
        packageJson: {
          dependencies: {
            typescript: '1.0.0',
            jest: '1.0.0',
            react: '1.0.0',
          },
        },
      });

      jest.spyOn(fs, 'readFileSync').mockReturnValue('');
      jest.spyOn(ts, 'parseJsonText').mockReturnValue('');

      const key = 'foo';
      const value = 'bar';

      jest.spyOn(ts, 'convertToObject').mockReturnValueOnce({
        compilerOptions: { [key]: value },
      });

      const dummyOverride = {
        files: ['src/pages/*.ts?(x)'],
        rules: {
          'import/no-default-export': 'off',
        },
      };

      const { overrides } = createConfig({
        overrides: [dummyOverride],
        stripDisabledRules: false,
        convertToESLintInternals: false,
      });

      expect(overrides[0].overrideType).toBe(reactOverrideType);
      expect(overrides[1].overrideType).toBe(tsOverrideType);
      expect(overrides[2].overrideType).toBe(jestOverrideType);
      expect(overrides[3]).toStrictEqual(dummyOverride);
    });

    test('merges overrides correctly given additional, internal overrides', () => {
      jest.spyOn(readPkgUp, 'sync').mockReturnValue({
        packageJson: {
          dependencies: {
            react: '17.0.1',
            typescript: '4.1.0',
            jest: '26.0.0',
          },
        },
      });

      jest.spyOn(fs, 'readFileSync').mockReturnValue('');
      jest.spyOn(ts, 'parseJsonText').mockReturnValue('');

      jest.spyOn(ts, 'convertToObject').mockReturnValue({
        compilerOptions: {},
      });

      const realJestRuleName = 'jest/consistent-test-it';
      const mockRuleName = 'foo';
      const mockRuleValue = 'bar';

      const dummyOverride = createJestOverride({
        ...getDependencies(),
        files: ['testUtils/*.ts?(x)'],
        rules: {
          [mockRuleName]: mockRuleValue,
          [realJestRuleName]: 'warn',
        },
      });

      const { overrides } = createConfig({
        overrides: [dummyOverride],
        convertToESLintInternals: false,
        stripDisabledRules: false,
      });

      const finalJestOverride = overrides.find(
        override => override.overrideType === jestOverrideType
      );

      // 4 overrides were given, 3 should be present due to merigng
      expect(overrides).toHaveLength(3);

      // order should be correct
      expect(overrides[0].overrideType).toBe(reactOverrideType);
      expect(overrides[1].overrideType).toBe(tsOverrideType);
      expect(overrides[2].overrideType).toBe(jestOverrideType);

      // given fourth should be merged into third
      expect(finalJestOverride.rules[mockRuleName]).toBe(mockRuleValue);
      expect(finalJestOverride.rules[realJestRuleName]).not.toBe(
        jestRules[realJestRuleName]
      );
    });

    test('always puts custom overrides last, maintaining regular order', () => {
      jest.spyOn(readPkgUp, 'sync').mockReturnValue({
        packageJson: {
          dependencies: {
            react: '17.0.1',
            typescript: '4.1.0',
            jest: '26.0.0',
          },
        },
      });

      jest.spyOn(fs, 'readFileSync').mockReturnValue('');
      jest.spyOn(ts, 'parseJsonText').mockReturnValue('');

      jest.spyOn(ts, 'convertToObject').mockReturnValue({
        compilerOptions: {},
      });

      const dummyOverride1 = {
        rules: {
          foo: 'error',
        },
      };

      const dummyOverride2 = {
        rules: {
          bar: 'error',
        },
      };

      const { overrides } = createConfig({
        overrides: [dummyOverride1, dummyOverride2],
        stripDisabledRules: false,
        convertToESLintInternals: false,
      });

      expect(overrides).toHaveLength(5);

      expect(overrides[0].overrideType).toBe(reactOverrideType);
      expect(overrides[1].overrideType).toBe(tsOverrideType);
      expect(overrides[2].overrideType).toBe(jestOverrideType);

      expect(overrides[3]).toStrictEqual(dummyOverride1);
      expect(overrides[4]).toStrictEqual(dummyOverride2);
    });
  });

  describe('caching', () => {
    beforeEach(() => {
      Object.keys(cacheImpl.cache).forEach(key => {
        cacheImpl.cache[key] = null;
      });
    });

    test('caches by default', () => {
      const setSpy = jest.spyOn(cacheImpl, 'set');

      createConfig();
      createConfig();

      expect(setSpy).toHaveBeenCalledTimes(1);
    });

    test('does not cache given opt-out', () => {
      const setSpy = jest.spyOn(cacheImpl, 'set');
      const settings = { cacheOptions: { enabled: false } };

      createConfig(settings);
      createConfig(settings);

      expect(setSpy).not.toHaveBeenCalled();
    });

    test('busts cache given changed dependencies', () => {
      const setSpy = jest.spyOn(cacheImpl, 'set');
      const mustInvalidateSpy = jest.spyOn(cacheImpl, 'mustInvalidate');

      createConfig();
      createConfig({ rules: { foo: 'bar' } });

      expect(mustInvalidateSpy).toHaveBeenCalledTimes(2);
      // initially empty cache
      expect(mustInvalidateSpy.mock.results[0].value).toBe(true);
      // changed dependencies
      expect(mustInvalidateSpy.mock.results[1].value).toBe(true);

      expect(setSpy).toHaveBeenCalledTimes(2);
    });

    test('busts cache automatically after 10 minutes by default', () => {
      const setSpy = jest.spyOn(cacheImpl, 'set');
      jest.spyOn(cacheImpl, 'mustInvalidate');

      jest.useFakeTimers('modern');

      createConfig();

      expect(setSpy).toHaveBeenCalledTimes(1);

      createConfig();

      expect(setSpy).toHaveBeenCalledTimes(1);

      jest.setSystemTime(Date.now() + 5 * 60 * 1000);

      createConfig();

      expect(setSpy).toHaveBeenCalledTimes(1);

      jest.setSystemTime(Date.now() + 10 * 60 * 1000 + 1);

      createConfig();

      expect(setSpy).toBeCalledTimes(2);

      jest.useRealTimers();
    });
  });
});
