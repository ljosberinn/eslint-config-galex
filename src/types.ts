import type { Linter } from 'eslint';
import type ts from 'typescript';

export type TSConfig = {
  compilerOptions?: ts.CompilerOptions & {
    lib?: string[];
  };
  files?: string[];
  include?: string[];
  exclude?: string[];
  extends?: string;
  references?: string[];
};

export type Dependencies = {
  hasJest: boolean;
  hasJestDom: boolean;
  hasNodeTypes: boolean;
  hasTestingLibrary: boolean;
  hasNest: boolean;
  storybook: {
    hasStorybook: boolean;
    hasStorybookTestingLibrary: boolean;
  };
  react: {
    hasReact: boolean;
    isCreateReactApp: boolean;
    isNext: boolean;
    isRemix: boolean;
    isPreact: boolean;
    version: null | string;
  };
  typescript: {
    config: null | TSConfig;
    hasTypeScript: boolean;
    version: null | string;
  };
};

export type ESLintConfig = Omit<
  Linter.BaseConfig,
  '$schema' | 'parser' | 'noInlineConfig' | 'processor' | 'rules'
> & {
  root?: boolean;
  rules: Linter.RulesRecord;
};

export type TopLevelESLintConfig = ESLintConfig & {
  ignorePatterns?: string | string[];
};

export type OverrideESLintConfig = Omit<
  ESLintConfig,
  'root' | 'reportUnusedDisableDirectives'
> & {
  excludedFiles?: string | string[];
  files: string | string[];
};

/**
 * a _non-override_ function creating rules, e.g. everything within the plugins
 * folder
 *
 * e.g. createUnicornRules
 */
export type RulesetCreator = (
  args: Dependencies & {
    rules?: Linter.RulesRecord;
  }
) => Linter.RulesRecord;

/**
 * internal type including the custom `overrideType` property
 */
export type WithOverrideType<Override extends OverrideESLintConfig> =
  Override & {
    overrideType?: string;
  };

/**
 * type of primary functions within the overrides folder
 *
 * e.g. createReactOverride, createTypeScriptOverride, etc.
 */
export type OverrideCreator = (
  args: Dependencies & Partial<OverrideESLintConfig>
) => WithOverrideType<OverrideESLintConfig> | null;

/**
 * type of functions overriding overrides within the overrides folder
 *
 * e.g. nextjs, remix, etc.
 */
export type OverrideInternalOverride = (
  args: Dependencies
) => OverrideESLintConfig | null;

/**
 * type of function conditionally creating rules
 *
 * e.g. createJSXA11yRules
 */
export type RulesCreator = (
  dependencies: Dependencies
) => Linter.RulesRecord | null;

export type SettingsCreator = (
  Dependencies: Dependencies
) => OverrideESLintConfig['settings'] | null;

export type Flags = {
  convertToESLintInternals?: boolean;
  incrementalAdoption?: boolean;
  blankSlate?: boolean;
};
