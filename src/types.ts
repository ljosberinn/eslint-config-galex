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
    version: undefined | string;
  };
  typescript: {
    config: undefined | TSConfig;
    hasTypeScript: boolean;
    version: undefined | string;
  };
};

export type ESLintConfig = Omit<
  Linter.BaseConfig,
  '$schema' | 'parser' | 'noInlineConfig' | 'processor'
> & {
  root?: boolean;
};

export type TopLevelESLintConfig = ESLintConfig & {
  ignorePatterns?: string | string[];
};

export type OverrideESlintConfig = ESLintConfig & {
  excludedFiles?: string | string[];
  files: string | string[];
};

export type RulesetCreator = (
  args: Dependencies & {
    rules?: Linter.RulesRecord;
  }
) => Linter.RulesRecord;

export type RulesCreator = (dependencies: Dependencies) => Linter.RulesRecord;

export type Flags = {
  convertToESLintInternals?: boolean;
  incrementalAdoption?: boolean;
};
