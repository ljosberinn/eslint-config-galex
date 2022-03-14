import type { Linter } from 'eslint';

import type { GetDepsArgs } from './getDependencies';
import { getDependencies } from './getDependencies';
import { createJestConfigOverride, createJestOverride } from './overrides/jest';
import { createReactOverride } from './overrides/react';
import { createStorybookOverride } from './overrides/storybook';
import { createTypeScriptOverride } from './overrides/typescript';
import { createEslintCoreRules } from './plugins/eslint-core';
import { createImportRules } from './plugins/import';
import { createPromiseRules } from './plugins/promise';
import { createSonarjsRules } from './plugins/sonarjs';
import { createUnicornRules } from './plugins/unicorn';
import type {
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
  } & Pick<
    ESLintConfig,
    'env' | 'overrides' | 'parserOptions' | 'plugins' | 'settings'
  >;

export const createConfig = ({
  cwd,
  tsConfigPath,
  convertToESLintInternals = false,
  incrementalAdoption = false,
  blankSlate = false,
  root,
  ignorePatterns,
  env,
  overrides,
  parserOptions,
  rules,
  plugins,
  settings,
}: CreateConfigArgs = {}): TopLevelESLintConfig => {
  const dependencies = getDependencies({ cwd, tsConfigPath });

  const flags: Flags = {
    convertToESLintInternals,
    incrementalAdoption,
    blankSlate,
  };

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
    .map(overrideWithType => {
      const override = dropOverrideType(overrideWithType);

      return {
        ...override,
        rules: applyFlags(override.rules, flags),
      };
    });

  const finalRules = applyFlags(
    {
      ...createEslintCoreRules(dependencies),
      ...createUnicornRules(dependencies),
      ...createPromiseRules(dependencies),
      ...createImportRules(dependencies),
      ...createSonarjsRules(dependencies),
      ...rules,
    },
    flags
  );

  const finalPlugins = uniqueArrayEntries([
    ...defaultPlugins,
    ...(plugins ?? []),
  ]);

  const finalEnv = detectEnv(dependencies, env);
  const finalParserOptions = detectParserOptions(parserOptions);

  return {
    env: finalEnv,
    overrides: finalOverrides,
    parserOptions: finalParserOptions,
    plugins: finalPlugins,
    rules: finalRules,
    ignorePatterns,
    reportUnusedDisableDirectives: true,
    settings,
    // omission defaults to true, otherwise forward
    root: typeof root === 'undefined' ? true : root,
  };
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
