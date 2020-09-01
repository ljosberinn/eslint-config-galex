const fs = require('fs');
const { join } = require('path');
const readPkgUp = require('read-pkg-up');

const { createConfig, getDependencies } = require('../createConfig');

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

  test('accepts alternative tsdefaultConfig path', () => {
    const cwd = join(process.cwd(), 'src', '__tests__');

    expect(getDependencies({ cwd })).toMatchSnapshot();
  });
});

describe('createConfig', () => {
  test('matches snapshot', () => {
    expect(createConfig()).toMatchSnapshot();
  });

  test('given typescript, determines env.node based on @types/node', () => {
    const defaultConfig = createConfig();

    jest.spyOn(readPkgUp, 'sync').mockReturnValueOnce({
      packageJson: {
        dependencies: {
          typescript: '1.0.0',
        },
      },
    });

    jest.spyOn(fs, 'accessSync').mockReturnValueOnce(true);

    const config = createConfig();

    expect(config.env.node).toBeFalsy();
    expect(config.env.node).not.toBe(defaultConfig.env.node);
  });

  test('allows passing extra rules', () => {
    const config = createConfig({ customRules: { foo: 'bar' } });

    expect(config.rules.foo).toBe('bar');
    expect(config).toMatchSnapshot();
  });
});
