/* eslint-disable import/dynamic-import-chunkname */
import { readFileSync, writeFileSync } from 'fs';
import merge from 'lodash.merge';
import { resolve } from 'path';
import { type format } from 'prettier';

import { createConfig } from '../createConfig';

const log = (message: string) => {
  // eslint-disable-next-line no-console
  console.log(`[eslint-config-galex] ${message}`);
};

export const standaloneSettingsName = 'eslint-galex-settings.json';

export const maybeFindSettings = (): Record<string, unknown> | null => {
  try {
    const path = resolve(`./${standaloneSettingsName}`);
    const result = readFileSync(path, 'utf-8');
    return JSON.parse(result);
  } catch {
    return null;
  }
};

export const loadPrettier = async (): Promise<typeof format> => {
  try {
    const prettier = await import('prettier');
    return prettier.format;
  } catch {
    /* istanbul ignore next cant mock import */
    log(`unable to load prettier, generated json won't be formatted`);

    /* istanbul ignore next cant mock import */
    return (source: string) => {
      return source;
    };
  }
};

export const defaultEslintRcJsonPath = './.eslintrc.json';

export const prettierOptions = {
  parser: 'json-stringify',
};

export const maybeLoadExistingEslintrc = (
  path: string
): Record<string, unknown> | null => {
  try {
    log(`attempting to load existing ".eslintrc.json"`);

    return JSON.parse(readFileSync(path, 'utf-8'));
  } catch {
    return null;
  }
};

export const backupExistingEslintrc = (
  config: Record<string, unknown>,
  format: (str: string, options?: Record<string, unknown>) => string
): void => {
  const name = `./.eslintrc-${Date.now()}-bak.json`;
  const targetPath = resolve(name);

  log(`backing existing ".eslintrc.json" up at "${name}"`);

  writeFileSync(targetPath, format(JSON.stringify(config), prettierOptions));
};

export async function generateStandalone(): Promise<void> {
  try {
    const settings = maybeFindSettings();
    const targetPath = resolve(defaultEslintRcJsonPath);

    const existingConfig = maybeLoadExistingEslintrc(targetPath);
    const format = await loadPrettier();

    if (existingConfig) {
      backupExistingEslintrc(existingConfig, format);
    }

    const config = createConfig(settings ?? undefined);
    const finalConfig = existingConfig ? merge(config, existingConfig) : config;

    writeFileSync(
      targetPath,
      format(JSON.stringify(finalConfig), prettierOptions)
    );

    log(`wrote ".eslintrc.json" to "${targetPath}"`);
  } catch (error) {
    /* istanbul ignore next only throwing errors so... */
    if (error instanceof Error) {
      log(`error -- ${error.message}`);
    }
  }
}
