const fs = require('fs');
const { join } = require('path');
const readPkgUp = require('read-pkg-up');
const ts = require('typescript');

const { createConfig, getDependencies } = require('../createConfig');

describe('getDependencies', () => {
  beforeEach(() => {
    jest.restoreAllMocks();
  });

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

  describe('given typescript', () => {
    beforeEach(() => {});

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

      jest.spyOn(fs, 'readFileSync').mockImplementation(() => '');
      jest.spyOn(ts, 'parseJsonText').mockImplementation(() => '');

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

      jest.spyOn(fs, 'readFileSync').mockImplementation(() => '');
      jest.spyOn(ts, 'parseJsonText').mockImplementation(() => '');

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
  });
});

describe('createConfig', () => {
  beforeEach(() => {
    jest.restoreAllMocks();
  });

  test('matches snapshot', () => {
    expect(createConfig()).toMatchSnapshot();
  });

  test('given typescript, determines env.node based on presence of tsconfig.json', () => {
    const defaultConfig = createConfig();

    jest.spyOn(readPkgUp, 'sync').mockReturnValueOnce({
      packageJson: {
        dependencies: {
          '@types/node': '1.0.0',
          typescript: '1.0.0',
        },
      },
    });

    jest.spyOn(fs, 'readFileSync').mockReturnValueOnce('');
    jest.spyOn(ts, 'parseJsonText').mockReturnValueOnce('');
    jest.spyOn(ts, 'convertToObject').mockReturnValueOnce({});

    const config = createConfig();

    expect(config.env.node).toBeTruthy();
    expect(config.env.node).not.toBe(defaultConfig.env.node);
  });

  test('allows passing extra rules', () => {
    const rule = 'foo';
    const value = 'bar';

    const config = createConfig({ customRules: { [rule]: value } });

    expect(config.rules[rule]).toBe(value);
    expect(config).toMatchSnapshot();
  });

  test('allows passing customEnv', () => {
    const key = 'foo';
    const value = 'bar';

    const config = createConfig({ customEnv: { [key]: value } });

    expect(config.env[key]).toBe(value);
    expect(config).toMatchSnapshot();
  });

  test('allows passing customPlugins', () => {
    const plugin = 'galex';

    const config = createConfig({ customPlugins: [plugin] });

    expect(config.plugins).toContain(plugin);
    expect(config).toMatchSnapshot();
  });

  test('allows passing customOverrides', () => {
    const plugin = 'galex';

    const config = createConfig({ customOverrides: [plugin] });

    expect(config.overrides).toContain(plugin);
    expect(config).toMatchSnapshot();
  });

  test('allows passing parserOptions', () => {
    const key = 'foo';
    const value = 'bar';

    const config = createConfig({ customParserOptions: { [key]: value } });

    expect(config.parserOptions[key]).toBe(value);
    expect(config).toMatchSnapshot();
  });
});
