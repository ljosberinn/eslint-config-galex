/* eslint-disable import/dynamic-import-chunkname */
import { writeFileSync, readFileSync, existsSync } from 'fs';
import merge from 'lodash.merge';
import { resolve } from 'path';

import { createConfig } from './createConfig';

const log = (message: string) => {
  // eslint-disable-next-line no-console
  console.log(`[eslint-config-galex] ${message}`);
};

const maybeFindSettings = () => {
  try {
    const path = resolve('./eslint-galex-settings.json');
    const result = readFileSync(path, 'utf-8');
    return JSON.parse(result);
    // eslint-disable-next-line no-empty
  } catch {}
};

const loadPrettier = async () => {
  try {
    const prettier = await import('prettier');
    return prettier.format;
  } catch {
    log(`unable to load prettier, generated json won't be formatted`);

    return (source: string) => {
      return source;
    };
  }
};

const defaultEslintRcJsonPath = './.eslintrc.json';

const prettierOptions = {
  parser: 'json-stringify',
};

const maybeLoadExistingEslintrc = (path: string) => {
  try {
    if (!existsSync(path)) {
      return null;
    }

    log(`loading existing ".eslintrc.json"`);

    return JSON.parse(readFileSync(path, 'utf-8'));
  } catch {
    return null;
  }
};

const backupExistingEslintrc = (
  config: Record<string, unknown>,
  format: (str: string, options?: Record<string, unknown>) => string
) => {
  const name = `./.eslintrc-${Date.now()}-bak.json`;
  const targetPath = resolve(name);

  log(`backing existing ".eslintrc.json" up at "${name}"`);

  writeFileSync(targetPath, format(JSON.stringify(config), prettierOptions));
};

void (async () => {
  try {
    const settings = maybeFindSettings();
    const targetPath = resolve(defaultEslintRcJsonPath);

    const existingConfig = maybeLoadExistingEslintrc(targetPath);
    const format = await loadPrettier();

    if (existingConfig) {
      backupExistingEslintrc(existingConfig, format);
    }

    const config = createConfig(settings);
    const finalConfig = existingConfig ? merge(config, existingConfig) : config;

    writeFileSync(
      targetPath,
      format(JSON.stringify(finalConfig), prettierOptions)
    );

    log(`wrote ".eslintrc.json" to "${targetPath}"`);
  } catch (error) {
    if (error instanceof Error) {
      log(`error -- ${error.message}`);
    }
  }
})();
