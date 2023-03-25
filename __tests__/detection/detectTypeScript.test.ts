import fs from 'fs';
import { parseJsonText, convertToObject } from 'typescript';

import { detectTypeScript } from '../../src/getDependencies';

// @ts-expect-error doesnt matter
jest.mock<typeof import('typescript')>('typescript', () => {
  return {
    parseJsonText: jest.fn(),
    convertToObject: jest.fn(),
    version: '5.0.1',
  };
});

describe('detectTypeScript', () => {
  test('does not check tsconfig.json if no ts dependency was found', () => {
    const readFileSyncSpy = jest.spyOn(fs, 'readFileSync');
    const ts = { parseJsonText };
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
    const ts = { parseJsonText, convertToObject };
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
    const ts = { parseJsonText, convertToObject };
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
    const ts = { parseJsonText, convertToObject };
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
    const ts = { parseJsonText, convertToObject };
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
