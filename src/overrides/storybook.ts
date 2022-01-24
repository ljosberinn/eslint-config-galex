import { OverrideCreator, RulesCreator } from '../types';
import { uniqueArrayEntries } from '../utils/array';
import { storybookOverrideType } from '../utils/overrideType';

const files = ['*.stories.*', '*.story.*'];
const plugins = ['storybook'];

export const createStorybookOverride: OverrideCreator = ({
  rules: customRules = {},
  files: customFiles,
  env: customEnv,
  excludedFiles: customExcludedFiles,
  globals: customGlobals,
  extends: customExtends,
  parserOptions: customParserOptions,
  plugins: customPlugins,
  overrides: customOverrides,
  settings: customSettings,
  ...dependencies
}) => {
  if (!dependencies.storybook.hasStorybook) {
    return null;
  }

  const finalRules = {
    ...createStorybookRules(dependencies),
    ...customRules,
  };

  const finalFiles = customFiles || files;
  const finalPlugins = uniqueArrayEntries([
    ...plugins,
    ...(customPlugins ?? []),
  ]);

  return {
    rules: finalRules,
    files: finalFiles,
    plugins: finalPlugins,
    overrideType: storybookOverrideType,
    env: customEnv,
    globals: customGlobals,
    excludedFiles: customExcludedFiles,
    extends: customExtends,
    overrides: customOverrides,
    parserOptions: customParserOptions,
    settings: customSettings,
  };
};

export const createStorybookRules: RulesCreator = ({
  react: { hasReact },
  typescript: { hasTypeScript },
  storybook: { hasStorybookTestingLibrary },
}) => {
  return {
    /**
     * @see https://github.com/storybookjs/eslint-plugin-storybook/blob/main/docs/rules/await-interactions.md
     *
     * storybook/testing-library
     */
    ...(hasStorybookTestingLibrary
      ? { 'storybook/await-interactions': 'error' }
      : null),

    /**
     * @see https://github.com/storybookjs/eslint-plugin-storybook/blob/main/docs/rules/context-in-play-function.md
     *
     * storybook/testing-library
     */
    ...(hasStorybookTestingLibrary
      ? { 'storybook/context-in-play-function': 'error' }
      : null),

    /**
     * enforces setting `component` property in unnamed default export object of a story
     *
     * @see https://github.com/storybookjs/eslint-plugin-storybook/blob/main/docs/rules/csf-component.md
     */
    'storybook/csf-component': 'error',

    /**
     * enforces having a default export.
     *
     * disabled because youre literally not seeing anything if you don't have one
     *
     * @see https://github.com/storybookjs/eslint-plugin-storybook/blob/main/docs/rules/default-exports.md
     *
     */
    'storybook/default-exports': 'off',

    /**
     * suggests modern/correct hierarchy separator
     *
     * @see https://github.com/storybookjs/eslint-plugin-storybook/blob/main/docs/rules/hierarchy-separator.md
     */
    'storybook/hierarchy-separator': 'warn',

    /**
     * suggests inlining meta properties of stories to the default export
     *
     * @see https://github.com/storybookjs/eslint-plugin-storybook/blob/main/docs/rules/meta-inline-properties.md
     */
    'storybook/meta-inline-properties': 'warn',

    /**
     * prevents redundant duplicate info
     *
     * @see https://github.com/storybookjs/eslint-plugin-storybook/blob/main/docs/rules/no-redundant-story-name.md
     */
    'storybook/no-redundant-story-name': 'warn',

    /**
     * prevents using the deprecated `storiesOf` api
     *
     * @see https://github.com/storybookjs/eslint-plugin-storybook/blob/main/docs/rules/no-stories-of.md
     */
    'storybook/no-stories-of': 'error',

    /**
     * removes redundant title property of unnamed default exports in storybook
     * as its inferred from path
     *
     * @see https://github.com/storybookjs/eslint-plugin-storybook/blob/main/docs/rules/no-title-property-in-meta.md
     */
    'storybook/no-title-property-in-meta': 'warn',

    /**
     * prefer PascalCase for named exports
     *
     * @see https://github.com/storybookjs/eslint-plugin-storybook/blob/main/docs/rules/prefer-pascal-case.md
     */
    'storybook/prefer-pascal-case': 'warn',

    /**
     * require at least one named export
     *
     * @see https://github.com/storybookjs/eslint-plugin-storybook/blob/main/docs/rules/story-exports.md
     */
    'storybook/story-exports': 'warn',

    /**
     * requires importing `expect` from `@storybook/jest`
     *
     * @see https://github.com/storybookjs/eslint-plugin-storybook/blob/main/docs/rules/use-storybook-expect.md
     */
    'storybook/use-storybook-expect': 'error',

    /**
     * use `@storybook/testing-library` wrapper over `@testing-library/react` for
     * interactions
     *
     * active even if the wrapper is not present to raise awareness
     *
     * @see https://github.com/storybookjs/eslint-plugin-storybook/blob/main/docs/rules/use-storybook-testing-library.md
     */
    'storybook/use-storybook-testing-library': 'error',

    /**
     * default exports are mandatory in storybook
     */
    'import/no-default-export': 'off',

    /**
     * allow exporting anonymous config object
     */
    'import/no-anonymous-default-export': 'off',

    /**
     * allow typing template components with Storybook's `Story` type
     */
    ...(hasReact ? { 'react/function-component-definition': 'off' } : null),

    /**
     * disable return type requirement
     */
    ...(hasTypeScript
      ? { '@typescript-eslint/explicit-module-boundary-types': 'off' }
      : null),

    /**
     * allow dummy functions satisfying type requirements
     */
    ...(hasTypeScript
      ? { '@typescript-eslint/no-empty-function': 'off' }
      : null),
  };
};
