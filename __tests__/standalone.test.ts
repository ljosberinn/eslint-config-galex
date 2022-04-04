import fs from 'fs';
import path from 'path';
import { format } from 'prettier';

import * as createConfig from '../src/createConfig';
import {
  backupExistingEslintrc,
  maybeFindSettings,
  maybeLoadExistingEslintrc,
  generateStandalone,
  loadPrettier,
  standaloneSettingsName,
  defaultEslintRcJsonPath,
  prettierOptions,
} from '../src/utils/standalone';

describe('maybeFindSettings', () => {
  test('returns null if file not found', () => {
    const resolveSpy = jest.spyOn(path, 'resolve');
    const readFileSyncSpy = jest.spyOn(fs, 'readFileSync');

    expect(maybeFindSettings()).toBeNull();

    expect(
      resolveSpy.mock.calls.every(path => {
        return path[0]?.includes(standaloneSettingsName);
      })
    ).toBe(true);

    expect(
      readFileSyncSpy.mock.calls[0]?.[0]
        .toString()
        .includes(standaloneSettingsName)
    ).toBe(true);
  });

  test('returns contents of settings', () => {
    const mockSettings = {
      cwd: 'foo',
    };

    const { readFileSync } = fs;

    jest.spyOn(fs, 'readFileSync').mockImplementation((path, options) => {
      // eslint-disable-next-line jest/no-conditional-in-test
      if (path.toString().includes(standaloneSettingsName)) {
        return JSON.stringify(mockSettings);
      }

      return readFileSync(path, options);
    });

    expect(maybeFindSettings()).toMatchObject(mockSettings);
  });
});

describe('loadPrettier', () => {
  test('prettier found', async () => {
    const maybeFormat = await loadPrettier();

    expect(maybeFormat).toBe(format);
  });
});

describe('maybeLoadExistingEslintRc', () => {
  test('returns null if file not found', () => {
    const readFileSyncSpy = jest.spyOn(fs, 'readFileSync');

    expect(maybeLoadExistingEslintrc(defaultEslintRcJsonPath)).toBeNull();

    expect(
      // order cant be relied on, although its likely the last
      readFileSyncSpy.mock.calls.some(call =>
        call[0].toString().includes(defaultEslintRcJsonPath)
      )
    ).toBe(true);
  });

  test('returns file contents if present', () => {
    const mockEslintRc = {};

    const mockPath = 'foo';

    jest.spyOn(fs, 'readFileSync').mockImplementation((path, options) => {
      // eslint-disable-next-line jest/no-conditional-in-test
      if (path.toString().includes(mockPath)) {
        return JSON.stringify(mockEslintRc);
      }

      return jest.requireActual('fs').readFileSync(path, options);
    });

    expect(maybeLoadExistingEslintrc(mockPath)).toMatchObject(mockEslintRc);
  });
});

test('backupExistingEslintrc creates a scoped & formatted backup', () => {
  const writeFileSyncMock = jest.fn();
  jest.spyOn(fs, 'writeFileSync').mockImplementation(writeFileSyncMock);

  const mockFormat = jest.fn().mockImplementation((source, options) => {
    return format(source, options);
  });
  const mockConfig = { foo: 'bar' };

  backupExistingEslintrc(mockConfig, mockFormat);

  expect(mockFormat).toHaveBeenCalledWith(
    JSON.stringify(mockConfig),
    prettierOptions
  );

  expect(writeFileSyncMock).toHaveBeenCalledTimes(1);

  const [[path, string]] = writeFileSyncMock.mock.calls;

  const parts = path.split('\\').pop().split('-');
  const { length } = parts;

  expect(parts[length - 3]).toContain('.eslintrc');
  expect(Number.parseInt(parts[length - 2])).toBeLessThan(Date.now());
  expect(parts[length - 1]).toContain('bak.json');

  expect(string).toMatchInlineSnapshot(`
    "{
      \\"foo\\": \\"bar\\"
    }
    "
  `);
});

describe('generateStandalone', () => {
  test('forwards settings, if found', async () => {
    const mockConfig = {
      foo: 'bar',
    };

    const createConfigSpy = jest
      .spyOn(createConfig, 'createConfig')
      // @ts-expect-error mock
      .mockImplementation(() => {
        return mockConfig;
      });

    const mockSettings = {
      cwd: 'foo',
    };

    const { readFileSync } = fs;

    jest.spyOn(fs, 'readFileSync').mockImplementation((path, options) => {
      // eslint-disable-next-line jest/no-conditional-in-test
      if (path.toString().includes(standaloneSettingsName)) {
        return JSON.stringify(mockSettings);
      }

      return readFileSync(path, options);
    });

    const writeFileSyncSpy = jest.fn();
    jest.spyOn(fs, 'writeFileSync').mockImplementation(writeFileSyncSpy);

    await generateStandalone();

    expect(createConfigSpy).toHaveBeenCalledWith(mockSettings);

    const [[path, config]] = writeFileSyncSpy.mock.calls;

    expect(path.split('\\').pop()).toContain('.eslintrc.json');
    expect(JSON.parse(config)).toMatchObject(mockConfig);
  });

  test('backs up existing config, if found, and merges', async () => {
    const mockConfig = {
      bar: 'error',
    };

    const createConfigSpy = jest
      .spyOn(createConfig, 'createConfig')
      // @ts-expect-error mock
      .mockImplementation(() => {
        return mockConfig;
      });

    const { readFileSync } = fs;

    const previousMockConfig = {
      foo: 'warn',
    };

    jest.spyOn(fs, 'readFileSync').mockImplementation((path, options) => {
      // eslint-disable-next-line jest/no-conditional-in-test
      if (path.toString().includes('eslintrc.json')) {
        return JSON.stringify(previousMockConfig);
      }

      return readFileSync(path, options);
    });

    const writeFileSyncSpy = jest.fn();
    jest.spyOn(fs, 'writeFileSync').mockImplementation(writeFileSyncSpy);

    await generateStandalone();

    expect(createConfigSpy).toHaveBeenCalledTimes(1);
    expect(writeFileSyncSpy).toHaveBeenCalledTimes(2);

    const [[backupCall, previousConfig], [createConfigCall, nextConfig]] =
      writeFileSyncSpy.mock.calls;

    expect(backupCall).toContain('-bak.json');
    expect(JSON.parse(previousConfig)).toMatchObject(previousMockConfig);

    expect(createConfigCall).toContain('eslintrc.json');
    expect(JSON.parse(nextConfig)).toMatchObject({
      ...mockConfig,
      ...previousMockConfig,
    });
  });
});
