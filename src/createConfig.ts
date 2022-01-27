import { Linter } from 'eslint';

import { getDependencies, GetDepsArgs } from './getDependencies';
import { createJestConfigOverride, createJestOverride } from './overrides/jest';
import { createReactOverride } from './overrides/react';
import { createStorybookOverride } from './overrides/storybook';
import { createTypeScriptOverride } from './overrides/typescript';
import { createEslintCoreRules } from './plugins/eslint-core';
import { createImportRules } from './plugins/import';
import { createPromiseRules } from './plugins/promise';
import { createSonarjsRules } from './plugins/sonarjs';
import { createUnicornRules } from './plugins/unicorn';
import {
  Dependencies,
  ESLintConfig,
  Flags,
  OverrideESLintConfig,
  TopLevelESLintConfig,
  WithOverrideType,
} from './types';
import { uniqueArrayEntries } from './utils/array';
import {
  plugins as defaultPlugins,
  parserOptions as defaultParserOptions,
} from './utils/defaultsAndDetection';
import { applyFlags } from './utils/flags';
import { dropOverrideType } from './utils/overrideType';

type CreateConfigArgs = GetDepsArgs &
  Flags & {
    ignorePatterns?: string[];

    rules?: Linter.RulesRecord;
    root?: boolean;
    cacheOptions?: {
      enabled: boolean;
      expiresAfterMs: number;
    };
  } & Pick<
    ESLintConfig,
    'env' | 'overrides' | 'parserOptions' | 'plugins' | 'settings'
  >;

// const mergeCacheOptions = (
//   options?: CreateConfigArgs['cacheOptions']
// ): Required<CreateConfigArgs['cacheOptions']> => {
//   return {
//     enabled: options?.enabled ?? true,
//     expiresAfterMs: options?.expiresAfterMs ?? 10 * 60 * 1000,
//   };
// };

export const createConfig = ({
  cwd,
  tsConfigPath,
  //   cacheOptions,
  convertToESLintInternals,
  root,
  incrementalAdoption,
  ignorePatterns,
  env,
  overrides,
  parserOptions,
  rules,
  plugins,
  settings,
}: CreateConfigArgs = {}): TopLevelESLintConfig => {
  //   const finalCacheOptions = mergeCacheOptions(cacheOptions);

  //   const now = Date.now();

  //   const cacheDependencies = {
  //     cwd,
  //     tsConfigPath,
  //     finalCacheOptions,
  //     convertToESLintInternals,
  //     incrementalAdoption,
  //   };

  const dependencies = getDependencies({ cwd, tsConfigPath });

  const finalOverrides = [
    createReactOverride(dependencies),
    createTypeScriptOverride(dependencies),
    createJestOverride(dependencies),
    createStorybookOverride(dependencies),
    createJestConfigOverride(dependencies),
    ...(overrides ?? []),
  ]
    .filter(
      (override): override is WithOverrideType<OverrideESLintConfig> =>
        override !== null
    )
    .map(dropOverrideType);

  const finalRules = applyFlags(
    {
      ...createEslintCoreRules(dependencies),
      ...createUnicornRules(dependencies),
      ...createPromiseRules(dependencies),
      ...createImportRules(dependencies),
      ...createSonarjsRules(dependencies),
      ...rules,
    },
    {
      convertToESLintInternals,
      incrementalAdoption,
    }
  );

  const finalPlugins = uniqueArrayEntries([
    ...defaultPlugins,
    ...(plugins ?? []),
  ]);

  const finalEnv = detectEnv(dependencies, env);
  const finalParserOptions = detectParserOptions(parserOptions);

  const config: TopLevelESLintConfig = {
    reportUnusedDisableDirectives: true,
    rules: finalRules,
    env: finalEnv,
    plugins: finalPlugins,
    overrides: finalOverrides,
    parserOptions: finalParserOptions,
    // omission defaults to true, otherwise forward
    root: typeof root === 'undefined' ? true : root,
    settings,
    ignorePatterns,
  };

  return config;
};

const detectEnv = (
  dependencies: Dependencies,
  customEnv?: CreateConfigArgs['env']
): Required<TopLevelESLintConfig['env']> => {
  const browser = dependencies.react.hasReact;
  const node = dependencies.typescript.hasTypeScript
    ? dependencies.hasNest || dependencies.hasNodeTypes
    : true;

  return {
    browser,
    node,
    ...customEnv,
  };
};

const detectParserOptions = (
  parserOptions: CreateConfigArgs['parserOptions']
): Required<TopLevelESLintConfig['parserOptions']> => {
  const ecmaVersion =
    parserOptions?.ecmaVersion ?? defaultParserOptions.ecmaVersion;
  const sourceType =
    parserOptions?.sourceType ?? defaultParserOptions.sourceType;

  const ecmaFeatures = {
    ...parserOptions?.ecmaFeatures,
    ...defaultParserOptions.ecmaFeatures,
  };

  return {
    ecmaVersion,
    sourceType,
    ecmaFeatures,
  };
};
