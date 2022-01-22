import { resolve } from 'path';
import { readFileSync } from 'fs';
import { convertToObject, parseJsonText } from 'typescript';
import type { TSConfig } from './types';

const defaultTsConfigName = 'tsconfig.json';

export type GetTopLevelTsConfigArgs = {
  cwd: string;
  tsConfigPath?: string;
};

export const getTopLevelTsConfig = ({
  cwd,
  tsConfigPath,
}: GetTopLevelTsConfigArgs): TSConfig => {
  const resolveArgs = tsConfigPath
    ? [tsConfigPath]
    : [cwd, cwd.includes('.json') ? '' : defaultTsConfigName];
  const path = resolve(...resolveArgs);

  const tsConfigName = tsConfigPath
    ? tsConfigPath.split('/').pop()
    : defaultTsConfigName;

  if (!tsConfigName) {
    throw new Error(`missing tsConfigName`);
  }

  const tsConfigRaw = readFileSync(path, 'utf-8');
  const tsConfig: TSConfig = convertToObject(
    parseJsonText(tsConfigName, tsConfigRaw),
    []
  );

  // really only thing we need from the config
  if (tsConfig.compilerOptions) {
    return tsConfig;
  }

  // no compilerOptions, check for parent configs
  if (tsConfig.extends) {
    return getTopLevelTsConfig({
      // on current path, replace tsConfigName with nothing to prevent having
      // an path with 2x file names
      cwd: resolve(path.replace(tsConfigName, ''), tsConfig.extends),
    });
  }

  return tsConfig;
};
