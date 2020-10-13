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
  beforeEach(() => {
    jest.restoreAllMocks();
  });

  test('matches snapshot', () => {
    expect(createConfig()).toMatchSnapshot();
  });

  test('allows passing extra rules', () => {
    const rule = 'foo';
    const value = 'bar';

    const config = createConfig({ rules: { [rule]: value } });

    expect(config.rules[rule]).toBe(value);
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
    const plugin = 'galex';

    const config = createConfig({ overrides: [plugin] });

    expect(config.overrides).toContain(plugin);
    expect(config).toMatchSnapshot();
  });

  test('allows passing parserOptions', () => {
    const key = 'foo';
    const value = 'bar';

    const config = createConfig({ parserOptions: { [key]: value } });

    expect(config.parserOptions[key]).toBe(value);
    expect(config).toMatchSnapshot();
  });
});
