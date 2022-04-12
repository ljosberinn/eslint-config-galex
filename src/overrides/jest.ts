import type {
  Dependencies,
  OverrideCreator,
  OverrideESLintConfig,
  OverrideInternalOverride,
  RulesCreator,
  SettingsCreator,
} from '../types';
import { uniqueArrayEntries } from '../utils/array';
import {
  jestConfigOverrideType,
  jestOverrideType,
} from '../utils/overrideType';

export const env: OverrideESLintConfig['env'] = {
  jest: true,
};

export const extendsConfig = ['plugin:jest-formatting/strict'];
export const files = ['**/*.?(test|spec).?(ts|js)?(x)'];
export const parserOptions: OverrideESLintConfig['parserOptions'] = {
  ecmaVersion: 2020,
};

export const settings = {
  jest: {
    version: 'detect',
  },
};

export const createJestOverride: OverrideCreator = ({
  rules: customRules,
  files: customFiles,
  parserOptions: customParserOptions,
  settings: customSettings,
  env: customEnv,
  excludedFiles: customExcludedFiles,
  extends: customExtends,
  globals: customGlobals,
  plugins: customPlugins,
  overrides: customOverrides,
  ...dependencies
}) => {
  if (!dependencies.hasJest) {
    return null;
  }

  const rules: OverrideESLintConfig['rules'] = {
    ...createJestRules(dependencies),
    ...(dependencies.hasJestDom ? createJestDomRules(dependencies) : null),
    ...(dependencies.hasTestingLibrary
      ? createTestingLibraryRules(dependencies)
      : null),
    ...createTestOverrides(dependencies),
    ...customRules,
  };

  const finalParserOptions: OverrideESLintConfig['env'] = {
    ...parserOptions,
    ...customParserOptions,
  };

  const finalEnv = {
    ...env,
    ...customEnv,
  };

  const finalFiles = customFiles ?? files;

  const finalPlugins = createPlugins(dependencies, customPlugins);

  const finalExtends = uniqueArrayEntries([
    ...extendsConfig,
    ...(customExtends ?? []),
  ]);

  const finalSettings = {
    ...settings,
    ...createTestingLibrarySettings(dependencies),
    ...customSettings,
  };

  return {
    env: finalEnv,
    extends: finalExtends,
    files: finalFiles,
    parserOptions: finalParserOptions,
    plugins: finalPlugins,
    settings: finalSettings,
    rules,
    overrideType: jestOverrideType,
    overrides: customOverrides,
    excludedFiles: customExcludedFiles,
    globals: customGlobals,
  };
};

export const createPlugins = (
  dependencies: Dependencies,
  customPlugins?: string[]
): string[] => {
  return uniqueArrayEntries([
    'jest',
    dependencies.hasJestDom && 'jest-dom',
    dependencies.hasTestingLibrary && 'testing-library',
    ...(customPlugins ?? []),
  ]);
};

/**
 * @see https://github.com/jest-community/eslint-plugin-jest
 */
export const createJestRules: RulesCreator = ({
  react: { isCreateReactApp },
  typescript: { hasTypeScript },
}) => {
  return {
    /**
     * off because `test`/`it` are different things and convey meaning
     * - use `test` for unit tests
     * - use `it` for components
     *
     * @see https://github.com/jest-community/eslint-plugin-jest/blob/master/docs/rules/consistent-test-it.md
     */
    'jest/consistent-test-it': 'off',

    /**
     * off because smoketests are fire-and-forget
     *
     * @see https://github.com/jest-community/eslint-plugin-jest/blob/master/docs/rules/expect-expect.md
     */
    'jest/expect-expect': 'off',

    /**
     * off because seems arbitrary, usually names are indeed lowercase but some tests
     * might very well begin with an uppercase character
     *
     * @see https://github.com/jest-community/eslint-plugin-jest/blob/master/docs/rules/lowercase-name.md
     */
    'jest/lowercase-name': 'off',

    /**
     * off because unlikely to be needed
     *
     * @see https://github.com/jest-community/eslint-plugin-jest/blob/main/docs/rules/max-nested-describe.md
     */
    'jest/max-nested-describe': 'off',

    /**
     * off because if something was to change with those, jest would
     * console.log or eslint would fix it
     *
     * @see https://github.com/jest-community/eslint-plugin-jest/blob/master/docs/rules/no-alias-methods.md
     */
    'jest/no-alias-methods': 'off',

    /**
     * disallows commented out tests
     *
     * @see https://github.com/jest-community/eslint-plugin-jest/blob/master/docs/rules/no-commented-out-tests.md
     */
    'jest/no-commented-out-tests': 'warn',

    /**
     * ensures assertions are non-conditional which leads to less complex
     * tests
     *
     * @see jest/no-if
     * @see https://github.com/jest-community/eslint-plugin-jest/blob/master/docs/rules/no-conditional-expect.md
     */
    'jest/no-conditional-expect': 'error',

    /**
     * @see no-if
     * @see https://github.com/jest-community/eslint-plugin-jest/blob/main/docs/rules/no-conditional-in-test.md
     */
    'jest/no-conditional-in-test': 'warn',

    /**
     * avoids using jest debt
     *
     * @see https://github.com/jest-community/eslint-plugin-jest/blob/master/docs/rules/no-deprecated-functions.md
     */
    'jest/no-deprecated-functions': 'error',

    /**
     * avoids having permanently disabled tests. either remove them, fix
     * them or re-enable them.
     *
     * @see https://github.com/jest-community/eslint-plugin-jest/blob/master/docs/rules/no-disabled-tests.md
     */
    'jest/no-disabled-tests': 'warn',

    /**
     * ensures `done` callback is awaited or in try/catch
     *
     * @see https://github.com/jest-community/eslint-plugin-jest/blob/master/docs/rules/no-done-callback.md
     */
    'jest/no-done-callback': 'error',

    /**
     * ensures each hook is only called once per describe
     *
     * @see https://github.com/jest-community/eslint-plugin-jest/blob/master/docs/rules/no-duplicate-hooks.md
     */
    'jest/no-duplicate-hooks': 'warn',

    /**
     * off because superseded by `jest/no-restricted-matchers`
     *
     * @see https://github.com/jest-community/eslint-plugin-jest/blob/master/docs/rules/no-expect-resolves.md
     */
    'jest/no-expect-resolves': 'off',

    /**
     * tests shouldn't export something
     *
     * @see https://github.com/jest-community/eslint-plugin-jest/blob/master/docs/rules/no-export.md
     */
    'jest/no-export': 'error',

    /**
     * avoids having accidentally skipped tests. either remove the others,
     * fix them or re-enable them.
     *
     * @see https://github.com/jest-community/eslint-plugin-jest/blob/master/docs/rules/no-focused-tests.md
     */
    'jest/no-focused-tests': 'error',

    /**
     * off because hooks are often needed
     *
     * @see https://github.com/jest-community/eslint-plugin-jest/blob/master/docs/rules/no-hooks.md
     */
    'jest/no-hooks': 'off',

    /**
     * ensures unique test titles
     *
     * @see https://github.com/jest-community/eslint-plugin-jest/blob/master/docs/rules/no-identical-title.md
     */
    'jest/no-identical-title': 'error',

    /**
     * ensures less complex tests
     *
     * @deprecated in favor of `no-conditional-in-test`
     *
     * @see jest/no-conditional-expect
     * @see https://github.com/jest-community/eslint-plugin-jest/blob/master/docs/rules/no-if.md
     */
    // 'jest/no-if': 'off',

    /**
     * ensures snapshots can be updated
     *
     * @see https://github.com/jest-community/eslint-plugin-jest/blob/master/docs/rules/no-interpolation-in-snapshots.md
     */
    'jest/no-interpolation-in-snapshots': 'error',

    /**
     * prevents use of jasmine globals
     *
     * @see https://github.com/jest-community/eslint-plugin-jest/blob/master/docs/rules/no-jasmine-globals.md
     */
    'jest/no-jasmine-globals': 'error',

    /**
     * disallows importing jest
     *
     * @see https://github.com/jest-community/eslint-plugin-jest/blob/master/docs/rules/no-jest-import.md
     */
    'jest/no-jest-import': 'error',

    /**
     * ensures snapshots stay reasonable in size
     *
     * @see https://github.com/jest-community/eslint-plugin-jest/blob/master/docs/rules/no-large-snapshots.md
     */
    'jest/no-large-snapshots': ['warn', { maxSize: 300 }],

    /**
     * disallows importing from `__mocks__`
     *
     * @see https://github.com/jest-community/eslint-plugin-jest/blob/master/docs/rules/no-mocks-import.md
     */
    'jest/no-mocks-import': 'error',

    /**
     * off because nothing is restricted
     *
     * @see https://github.com/jest-community/eslint-plugin-jest/blob/master/docs/rules/no-restricted-matchers.md
     */
    'jest/no-restricted-matchers': 'off',

    /**
     * ensures `expect` is used within `it`/`test` blocks
     *
     * @see https://github.com/jest-community/eslint-plugin-jest/blob/master/docs/rules/no-standalone-expect.md
     */
    'jest/no-standalone-expect': 'off',

    /**
     * disallows `f`/`x` prefixes for `it`/`test`
     *
     * @see https://github.com/jest-community/eslint-plugin-jest/blob/maste`f`/`d`ocs/rules/`no`-test-prefixes.md
     */
    'jest/no-test-prefixes': 'error',

    /**
     * ensures `return` isn't used in tests. if promises are involved, use
     * async/await
     *
     * @see https://github.com/jest-community/eslint-plugin-jest/blob/master/docs/rules/no-test-return-statement.md
     */
    'jest/no-test-return-statement': 'error',

    /**
     * off because superseded in favor of `jest/no-restricted-matchers`
     *
     * @see jest/no-restricted-matchers
     * @see https://github.com/jest-community/eslint-plugin-jest/blob/master/docs/rules/no-truthy-falsy.md
     */
    'jest/no-truthy-falsy': 'off',

    /**
     * off because superseded by `jest/no-conditional-expect`
     *
     * @see jest/no-conditional-expect
     * @see https://github.com/jest-community/eslint-plugin-jest/blob/master/docs/rules/no-try-expect.md
     */
    'jest/no-try-expect': 'off',

    /**
     * suggests `toBeCalledWith`/`toHaveBeenCalledWith` over `toBeCalled`
     *
     * @see https://github.com/jest-community/eslint-plugin-jest/blob/master/docs/rules/prefer-called-with.md
     */
    'jest/prefer-called-with': 'error',

    /**
     * suggests using builtin comparison matchers
     *
     * @see https://github.com/jest-community/eslint-plugin-jest/blob/main/docs/rules/prefer-comparison-matcher.md
     */
    'jest/prefer-comparison-matcher': 'warn',

    /**
     * off because should be either globally defined or not at all
     *
     * @see https://github.com/jest-community/eslint-plugin-jest/blob/master/docs/rules/prefer-expect-assertions.md
     */
    'jest/prefer-expect-assertions': 'off',

    /**
     * prefer await expect().resolves over awaiting within expect
     *
     * can be enabled once create-react-app uses eslint-plugin-jest v24.5.0
     *
     * @see https://github.com/jest-community/eslint-plugin-jest/blob/main/docs/rules/prefer-expect-resolves.md
     */
    ...(isCreateReactApp ? null : { 'jest/prefer-expect-resolves': 'warn' }),

    /**
     * ensures hooks are defined before tests
     *
     * @see https://github.com/jest-community/eslint-plugin-jest/blob/master/docs/rules/prefer-hooks-on-top.md
     */
    'jest/prefer-hooks-on-top': 'error',

    /**
     * off because superseded in favor of `jest/no-restricted-matchers`
     *          *
     * @see https://github.com/jest-community/eslint-plugin-jest/blob/master/docs/rules/prefer-inline-snapshots.md
     */
    'jest/prefer-inline-snapshots': 'off',

    /**
     * requires adding snapshot hints for external snapshot matchers
     *
     * off because deemed unnecessary
     *
     * @see https://github.com/jest-community/eslint-plugin-jest/blob/main/docs/rules/prefer-snapshot-hint.md
     */
    'jest/prefer-snapshot-hint': 'off',

    /**
     * prefer spying instead of copying to avoid having to cleanup
     *
     * @see https://github.com/jest-community/eslint-plugin-jest/blob/HEAD/docs/rules/prefer-spy-on.md
     */
    'jest/prefer-spy-on': 'warn',

    /**
     * suggests preferring `toStrictEqual` over `toEqual`
     *
     * @see https://github.com/jest-community/eslint-plugin-jest/blob/master/docs/rules/prefer-strict-equal.md
     */
    'jest/prefer-strict-equal': 'warn',

    /**
     * prefer toBe over toEqual
     *
     * can be enabled once create-react-app uses eslint-plugin-jest v25.0.0
     *
     * @see https://github.com/jest-community/eslint-plugin-jest/blob/main/docs/rules/prefer-to-be.md
     */
    ...(isCreateReactApp ? null : { 'jest/prefer-to-be': 'warn' }),

    /**
     * use `[]).toContain(foo)` instead of `[].includes(foo)).tobe(true)`
     * and its variants
     *
     * @see https://github.com/jest-community/eslint-plugin-jest/blob/master/docs/rules/prefer-to-contain.md
     */
    'jest/prefer-to-contain': 'warn',

    /**
     * use `[]).toHaveLength(x)` instead of `[].lenth)).toBe(x)`
     * and its variants
     *
     * @see https://github.com/jest-community/eslint-plugin-jest/blob/master/docs/rules/prefer-to-have-length.md
     */
    'jest/prefer-to-have-length': 'warn',

    /**
     * marks empty test cases as `test.todo`
     *
     * @see https://github.com/jest-community/eslint-plugin-jest/blob/master/docs/rules/prefer-todo.md
     */
    'jest/prefer-todo': 'warn',

    /**
     * off because often it's cumbersome to inline the error message with
     * the same formatting as jest expects it to be
     *
     * @see https://github.com/jest-community/eslint-plugin-jest/blob/master/docs/rules/require-to-throw-message.md
     */
    'jest/require-to-throw-message': 'off',

    /**
     * requires a top level describe wrapping everything
     *
     * off because opinionated
     *
     * @see https://github.com/jest-community/eslint-plugin-jest/blob/master/docs/rules/require-top-level-describe.md
     */
    'jest/require-top-level-describe': 'off',

    /**
     * validates callback of `describe('something', () => {})`
     *
     * can be enabled once create-react-app uses eslint-plugin-jest v24.5.0
     *
     * @see https://github.com/jest-community/eslint-plugin-jest/blob/master/docs/rules/valid-describe-callback.md
     */
    ...(isCreateReactApp ? null : { 'jest/valid-describe-callback': 'error' }),

    /**
     * validates params of `expect`
     *
     * @see https://github.com/jest-community/eslint-plugin-jest/blob/master/docs/rules/valid-expect.md
     */
    'jest/valid-expect': 'error',

    /**
     * ensures promise return when not using async/await
     *
     * @see https://github.com/jest-community/eslint-plugin-jest/blob/master/docs/rules/valid-expect-in-promise.md
     */
    'jest/valid-expect-in-promise': 'error',

    /**
     * ensures valid title for `describe`/`xit`/`it`/`test`/`xtest`
     *
     * @see https://github.com/jest-community/eslint-plugin-jest/blob/master/docs/rules/valid-title.md
     */
    'jest/valid-title': hasTypeScript ? 'off' : 'warn',
  };
};

/**
 * @see https://github.com/testing-library/eslint-plugin-jest-dom
 */
export const createJestDomRules: RulesCreator = () => ({
  /**
   * prefer toBeChecked over checking attributes
   *
   * @see https://github.com/testing-library/eslint-plugin-jest-dom/blob/master/docs/rules/prefer-checked.md
   */
  'jest-dom/prefer-checked': 'warn',

  /**
   * prefer toBeEmpty over checking innerHTML
   *
   * @see https://github.com/testing-library/eslint-plugin-jest-dom/blob/master/docs/rules/prefer-empty.md
   */
  'jest-dom/prefer-empty': 'warn',

  /**
   * prefer toBeDisabled or toBeEnabled over checking attributes
   *
   * @see https://github.com/testing-library/eslint-plugin-jest-dom/blob/master/docs/rules/prefer-enabled-disabled.md
   */
  'jest-dom/prefer-enabled-disabled': 'warn',

  /**
   * prefer toHaveFocus over checking document.activeElement
   *
   * @see https://github.com/testing-library/eslint-plugin-jest-dom/blob/master/docs/rules/prefer-focus.md
   */
  'jest-dom/prefer-focus': 'warn',

  /**
   * prefer .toBeInTheDocument in favor of .toHaveLength(1)
   *
   * @see https://github.com/testing-library/eslint-plugin-jest-dom/blob/master/docs/rules/prefer-in-document.md
   */
  'jest-dom/prefer-in-document': 'warn',

  /**
   * prefer toBeRequired over checking properties
   *
   * @see https://github.com/testing-library/eslint-plugin-jest-dom/blob/master/docs/rules/prefer-required.md
   */
  'jest-dom/prefer-required': 'warn',

  /**
   * prefer toHaveAttribute over checking getAttribute/hasAttribute
   *
   * @see https://github.com/testing-library/eslint-plugin-jest-dom/blob/master/docs/rules/prefer-to-have-attribute.md
   */
  'jest-dom/prefer-to-have-attribute': 'warn',

  /**
   * prefer toHaveClass over checking attributes
   *
   * @see https://github.com/testing-library/eslint-plugin-jest-dom/blob/master/docs/rules/prefer-to-have-class.md
   */
  'jest-dom/prefer-to-have-class': 'warn',

  /**
   * prefer toHaveStyle over checking element style
   *
   * @see https://github.com/testing-library/eslint-plugin-jest-dom/blob/master/docs/rules/prefer-to-have-attribute.md
   */
  'jest-dom/prefer-to-have-style': 'warn',

  /**
   * prefer toHaveTextContent over checking element.textContent
   *
   * @see https://github.com/testing-library/eslint-plugin-jest-dom/blob/master/docs/rules/prefer-to-have-text-content.md
   */
  'jest-dom/prefer-to-have-text-content': 'warn',

  /**
   * prefer toHaveAttribute('value') over checking attributes
   *
   * @see https://github.com/testing-library/eslint-plugin-jest-dom/blob/master/docs/rules/prefer-to-have-value.md
   */
  'jest-dom/prefer-to-have-value': 'warn',
});

/**
 * @see https://github.com/testing-library/eslint-plugin-testing-library
 */
export const createTestingLibraryRules: RulesCreator = ({
  react: { hasReact, isCreateReactApp },
}) => ({
  /**
   * enforces awaiting async queries (find*)
   *
   * @see https://github.com/testing-library/eslint-plugin-testing-library/blob/main/docs/rules/await-async-query.md
   */
  'testing-library/await-async-query': 'error',

  /**
   * enforces awaiting async utils (waitFor)
   *
   * @see https://github.com/testing-library/eslint-plugin-testing-library/blob/main/docs/rules/await-async-utils.md
   */
  'testing-library/await-async-utils': 'error',

  /**
   * enforces awaiting events
   *
   * off because not supported by @testing-library/react
   *
   * @see https://github.com/testing-library/eslint-plugin-testing-library/blob/main/docs/rules/await-fire-event.md
   */
  'testing-library/await-fire-event': 'off',

  /**
   * enforces consistent naming based on regex pattern
   *
   * off because opinionated
   *
   * @see https://github.com/testing-library/eslint-plugin-testing-library/blob/main/docs/rules/consistent-data-testid.md
   */
  'testing-library/consistent-data-testid': 'off',

  /**
   * ensures sync events are not awaited unnecessarily
   *
   * @see https://github.com/testing-library/eslint-plugin-testing-library/blob/main/docs/rules/no-await-sync-events.md
   */
  'testing-library/no-await-sync-events': 'error',

  /**
   * no unecessary `await` for non-async queries
   *
   * @see https://github.com/testing-library/eslint-plugin-testing-library/blob/main/docs/rules/no-await-sync-query.md
   */
  'testing-library/no-await-sync-query': 'error',

  /**
   * disallows use of `container`
   *
   * @see https://github.com/testing-library/eslint-plugin-testing-library/blob/main/docs/rules/no-container.md
   */
  'testing-library/no-container': 'warn',

  /**
   * hints the use of `screen.debug()`
   *
   * @see https://github.com/testing-library/eslint-plugin-testing-library/blob/main/docs/rules/no-debugging-utils.md
   */
  'testing-library/no-debugging-utils': 'error',

  /**
   * disallows direct imports from `@testing-library/dom` in react
   *
   * @see https://github.com/testing-library/eslint-plugin-testing-library/blob/main/docs/rules/no-dom-import.md
   */
  'testing-library/no-dom-import': hasReact ? ['warn', 'react'] : 'off',

  /**
   * disallows /g regex flags in queries as they may lead to false positives
   *
   * @see https://github.com/testing-library/eslint-plugin-testing-library/blob/main/docs/rules/no-global-regexp-flag-in-query.md
   */
  ...(isCreateReactApp
    ? null
    : {
        'testing-library/no-global-regex-flag-in-query': 'warn',
      }),

  /**
   * prefer usage of `@testing-library/$framework` tools to access nodes
   *
   * @see https://github.com/testing-library/eslint-plugin-testing-library/blob/main/docs/rules/no-node-access.md
   */
  'testing-library/no-node-access': 'warn',

  /**
   * hints on `cleanup` not being necessary
   *
   * @see https://github.com/testing-library/eslint-plugin-testing-library/blob/main/docs/rules/no-manual-cleanup.md
   */
  'testing-library/no-manual-cleanup': 'error',

  /**
   * disalllows the use of promises passed to a `fireEvent` method
   *
   * @see https://github.com/testing-library/eslint-plugin-testing-library/blob/main/docs/rules/no-promise-in-fire-event.md
   */
  'testing-library/no-promise-in-fire-event': 'error',

  /**
   * off because too opinionated
   *
   * @see https://github.com/testing-library/eslint-plugin-testing-library/blob/main/docs/rules/no-render-in-setup.md
   */
  'testing-library/no-render-in-setup': 'off',

  /**
   * disallows unnecessary act() calls
   *
   * @see https://github.com/testing-library/eslint-plugin-testing-library/blob/main/docs/rules/no-unnecessary-act.md
   */
  'testing-library/no-unnecessary-act': [
    'error',
    {
      isStrict: true,
    },
  ],

  /**
   * no empty `waitFor` or `waitForElementToBeRemoved`
   *
   * @see https://github.com/testing-library/eslint-plugin-testing-library/blob/main/docs/rules/no-wait-for-empty-callback.md
   */
  'testing-library/no-wait-for-empty-callback': 'error',

  /**
   * disallows use of multiple expect inside of `waitFor`
   *
   * @see https://github.com/testing-library/eslint-plugin-testing-library/blob/main/docs/rules/no-wait-for-multiple-assertions.md
   */
  'testing-library/no-wait-for-multiple-assertions': 'error',

  /**
   * disallows the use of sideeffects inside of `waitFor`
   *
   * @see https://github.com/testing-library/eslint-plugin-testing-library/blob/main/docs/rules/no-wait-for-side-effects.md
   */
  'testing-library/no-wait-for-side-effects': 'error',

  /**
   * disallows snapshot generation within waitFor
   *
   * @see https://github.com/testing-library/eslint-plugin-testing-library/blob/main/docs/rules/no-wait-for-snapshot.md
   */
  'testing-library/no-wait-for-snapshot': 'error',

  /**
   * use `expect(getByText('foo').tobeInTheDocument()` instead of
   * `getByText('foo')` expecting it not to throw
   *
   * @see https://github.com/testing-library/eslint-plugin-testing-library/blob/main/docs/rules/prefer-explicit-assert.md
   */
  'testing-library/prefer-explicit-assert': 'warn',

  /**
   * use `findBy*` instead of `waitFor` + `getBy*`
   *
   * @see https://github.com/testing-library/eslint-plugin-testing-library/blob/main/docs/rules/prefer-find-by.md
   */
  'testing-library/prefer-find-by': 'warn',

  /**
   * ensure more specific queries to check element presence
   *
   * @see https://github.com/testing-library/eslint-plugin-testing-library/blob/main/docs/rules/prefer-presence-queries.md
   */
  'testing-library/prefer-presence-queries': 'error',

  /**
   * prefer using queryBy* queries when waiting for disappearance
   *
   * @see https://github.com/testing-library/eslint-plugin-testing-library/blob/main/docs/rules/prefer-query-by-disappearance.md
   */
  'testing-library/prefer-query-by-disappearance': 'error',

  /**
   * suggest using `screen` over destructured methods
   *
   * @see https://github.com/testing-library/eslint-plugin-testing-library/blob/main/docs/rules/prefer-screen-queries.md
   */
  'testing-library/prefer-screen-queries': 'error',

  /**
   * suggest using `@testing-library/user-event` over `fireEvent` from `@testing-library/$framework`
   *
   * has some false positives, hence warn
   *
   * @see https://github.com/testing-library/eslint-plugin-testing-library/blob/main/docs/rules/prefer-user-event.md
   */
  'testing-library/prefer-user-event': 'warn',

  /**
   * prefer `waitFor` instead of deprecated `wait` and similar
   *
   * @see https://github.com/testing-library/eslint-plugin-testing-library/blob/main/docs/rules/prefer-wait-for.md
   */
  'testing-library/prefer-wait-for': 'warn',

  /**
   * enforces a valid naming for return value from render
   *
   * off because opinionated
   *
   * @see https://github.com/testing-library/eslint-plugin-testing-library/blob/main/docs/rules/render-result-naming-convention.md
   */
  'testing-library/render-result-naming-convention': 'off',
});

export const createTestOverrides: RulesCreator = ({
  typescript: { hasTypeScript },
  react: { hasReact },
}) => ({
  /**
   * off to allow non-null casting e.g. querySelector or .find() results
   *
   * @see https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/no-non-null-assertion.md
   */
  ...(hasTypeScript
    ? { '@typescript-eslint/no-non-null-assertion': 'off' }
    : null),

  /**
   * enforces unbound methods are called with their expected scope
   *
   * @see jest/unbound-method below
   * @see https://github.com/typescript-eslint/typescript-eslint/blob/main/packages/eslint-plugin/docs/rules/unbound-method.md
   */
  ...(hasTypeScript ? { '@typescript-eslint/unbound-method': 'warn' } : null),

  /**
   * off to allow silent mocks, e.g. for console
   *
   * @see https://eslint.org/docs/rules/no-empty-function
   * @see @typescript-eslint/no-empty-function
   */
  ...(hasTypeScript ? { '@typescript-eslint/no-empty-function': 'off' } : null),

  /**
   * enforces unbound methods are called with their expected scope
   *
   * @see https://github.com/jest-community/eslint-plugin-jest/blob/main/docs/rules/unbound-method.md
   */
  ...(hasTypeScript ? null : { 'jest/unbound-method': 'warn' }),

  /**
   * off because its regularily done in tests
   *
   * @see https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/unified-signatures.md
   */
  ...(hasTypeScript ? { '@typescript-eslint/unbound-method': 'off' } : null),

  /**
   * off because irrelevant in tests
   *
   * @see https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/explicit-member-accessibility.md
   */
  ...(hasTypeScript
    ? { '@typescript-eslint/explicit-member-accessibility': 'off' }
    : null),

  /**
   * off because irrelevant in tests and leads to false positives
   *
   * @see https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/no-unsafe-argument.md
   */
  ...(hasTypeScript
    ? { '@typescript-eslint/no-unsafe-argument': 'off' }
    : null),

  /**
   * off to allow spying on methods
   *
   * @see https://github.com/benmosher/eslint-plugin-import/blob/master/docs/rules/no-namespace.md
   */
  'import/no-namespace': 'off',

  /**
   * off to allow silent mocks, e.g. for console
   *
   * @see https://eslint.org/docs/rules/no-empty-function
   * @see @typescript-eslint/no-empty-function
   */
  'no-empty-function': 'off',

  /**
   * off because test names may be duplicated across different describe blocks
   * @see sonarjs/no-duplicate-string
   */
  'sonarjs/no-duplicate-string': 'off',

  /**
   * off because the same test implementation may reoccur across different describe blocks
   * @see sonarjs/no-identical-function
   */
  'sonarjs/no-identical-functions': 'off',

  /**
   * off because not too relevant in tests
   *
   * @see require-unicode-regexp
   */
  'require-unicode-regexp': 'off',

  /**
   * off because may be situationally required in tests
   */
  'no-param-reassign': 'off',

  /**
   * off because irrelevant in tests
   *
   * @see https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/button-has-type.md
   */
  ...(hasReact ? { 'react/button-has-type': 'off' } : null),

  /**
   * off because irrelevant in tests
   *
   * @see https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/blob/master/docs/rules/control-has-associated-label.md
   */
  ...(hasReact ? { 'jsx-a11y/control-has-associated-label': 'off' } : null),
});

/**
 * @see https://github.com/testing-library/eslint-plugin-testing-library#testing-librarycustom-renders
 */
export const createTestingLibrarySettings: SettingsCreator = ({
  hasTestingLibrary,
  react: { isNext, hasReact },
}) => {
  if (!hasTestingLibrary || !hasReact) {
    return null;
  }

  return {
    'testing-library/custom-renders': [
      // allows usage of ReactDOM.renderToStaticMarkup in test files
      'renderToStaticMarkup',
      // allows usage of Document.renderDocument in test files
      isNext && 'renderDocument',
    ].filter((maybeStr): maybeStr is string => maybeStr !== false),
  };
};

const jestConfigPattern = ['jest.config.?(js|ts)'];

export const createJestConfigOverride: OverrideInternalOverride = ({
  hasJest,
}) => {
  if (!hasJest) {
    return null;
  }

  return {
    files: jestConfigPattern,
    rules: {
      'import/no-default-export': 'off',
    },
    overrideType: jestConfigOverrideType,
  };
};
