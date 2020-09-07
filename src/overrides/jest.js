/* eslint-disable inclusive-language/use-inclusive-words */

const defaultEnv = {
  jest: true,
};

const extendsConfig = ['plugin:jest-formatting/strict'];
const defaultFiles = ['**/*.?(test|spec).?(ts|js)?(x)'];
const defaultParserOptions = {
  ecmaVersion: 2020,
};

const defaultSettings = {
  jest: {
    version: 'detect',
  },
};

/**
 * @param {{
 *  hasJestDom: boolean;
 *  hasJest: boolean;
 *  hasTestingLibrary: boolean;
 *  react: {
 *    hasReact: boolean;
 *  };
 *  typescript: {
 *    hasTypeScript: boolean;
 *  };
 *  rules?: Record<string, string | [string, string | object];
 *  files?: string[];
 *  env?: object;
 *  parseroOptions?: object;
 *  settings?: object;
 *  extends?: string[];
 * }} options
 */
const createJestOverride = ({
  hasJestDom,
  hasJest,
  hasTestingLibrary,
  react,
  typescript,
  rules: customRules = {},
  files: customFiles,
  extends: customExtends = [],
  env: customEnv,
  parserOptions: customParserOptions,
  settings: customSettings,
  plugins: customPlugins = [],
}) => {
  if (!hasJest) {
    return null;
  }

  const plugins = [
    'jest',
    hasJestDom && 'jest-dom',
    hasTestingLibrary && 'testing-library',
    ...customPlugins,
  ].filter(Boolean);

  const rules = {
    ...jestRules,
    ...(hasJestDom ? jestDomRules : null),
    ...(hasTestingLibrary ? getTestingLibraryRules({ react }) : null),
    ...getTestOverrides({ typescript }),
    ...customRules,
  };

  const parserOptions = {
    ...defaultParserOptions,
    ...customParserOptions,
  };

  const settings = {
    ...defaultSettings,
    ...customSettings,
  };

  const env = {
    ...defaultEnv,
    ...customEnv,
  };

  const files = customFiles || defaultFiles;
  const finalExtends = customExtends.length > 0 ? customExtends : extendsConfig;

  return {
    env,
    extends: finalExtends,
    files,
    parserOptions,
    plugins,
    rules,
    settings,
  };
};

/**
 * @see https://github.com/jest-community/eslint-plugin-jest
 */
const jestRules = {
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
   * @see jest/no-conditional-expect
   * @see https://github.com/jest-community/eslint-plugin-jest/blob/master/docs/rules/no-if.md
   */
  'jest/no-if': 'error',

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
   * off because should be either globally defined or not at all
   *
   * @see https://github.com/jest-community/eslint-plugin-jest/blob/master/docs/rules/prefer-expect-assertions.md
   */
  'jest/prefer-expect-assertions': 'off',

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
   * use `toBeNull()` instead of `toBe(null)` and its variants
   *
   * @see https://github.com/jest-community/eslint-plugin-jest/blob/master/docs/rules/prefer-to-be-null.md
   */
  'jest/prefer-to-be-null': 'warn',

  /**
   * use `toBeUndefined()` instead of `toBe(undefined)` and its variants
   *
   * @see https://github.com/jest-community/eslint-plugin-jest/blob/master/docs/rules/prefer-to-be-undefined.md
   */
  'jest/prefer-to-be-undefined': 'warn',

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
   * @see https://github.com/jest-community/eslint-plugin-jest/blob/master/docs/rules/require-top-level-describe.md
   */
  'jest/require-top-level-describe': 'error',

  /**
   * validates callback of `describe('something', () => {})`
   *
   * @see https://github.com/jest-community/eslint-plugin-jest/blob/master/docs/rules/valid-describe.md
   */
  'jest/valid-describe': 'error',

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
  'jest/valid-title': 'warn',
};

/**
 * @see https://github.com/testing-library/eslint-plugin-jest-dom
 */
const jestDomRules = {
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
};

/**
 * @see https://github.com/testing-library/eslint-plugin-testing-library
 */
const getTestingLibraryRules = ({ react: { hasReact } }) => ({
  /**
   * enforces awaiting async queries (find*)
   *
   * @see https://github.com/testing-library/eslint-plugin-testing-library/blob/master/docs/rules/await-async-query.md
   */
  'testing-library/await-async-query': 'error',

  /**
   * enforces awaiting async utils (waitFor)
   *
   * @see https://github.com/testing-library/eslint-plugin-testing-library/blob/master/docs/rules/await-async-utils.md
   */
  'testing-library/await-async-utils': 'error',

  /**
   * enforces awaiting events
   *
   * @see https://github.com/testing-library/eslint-plugin-testing-library/blob/master/docs/rules/await-fire-event.md
   */
  'testing-library/await-fire-event': 'error',

  /**
   * enforces consistent naming based on regex pattern
   *
   * off because opinionated
   *
   * @see https://github.com/testing-library/eslint-plugin-testing-library/blob/master/docs/rules/consistent-data-testid.md
   */
  'testing-library/consistent-data-testid': 'off',

  /**
   * no unecessary `await` for non-async queries
   *
   * @see https://github.com/testing-library/eslint-plugin-testing-library/blob/master/docs/rules/no-await-sync-query.md
   */
  'testing-library/no-await-sync-query': 'error',

  /**
   * hints the use of `screen.debug()`
   *
   * @see https://github.com/testing-library/eslint-plugin-testing-library/blob/master/docs/rules/no-debug.md
   */
  'testing-library/no-debug': 'error',

  /**
   * disallows direct imports from `@testing-library/dom` in react
   *
   * @see https://github.com/testing-library/eslint-plugin-testing-library/blob/master/docs/rules/no-dom-import.md
   */
  'testing-library/no-dom-import': hasReact ? ['warn', 'react'] : 'off',

  /**
   * hints on `cleanup` not being necessary
   *
   * @see https://github.com/testing-library/eslint-plugin-testing-library/blob/master/docs/rules/no-manual-cleanup.md
   */
  'testing-library/no-manual-cleanup': 'error',

  /**
   * off because too opinionated
   *
   * @see https://github.com/testing-library/eslint-plugin-testing-library/blob/master/docs/rules/no-render-in-setup.md
   */
  'testing-library/no-render-in-setup': 'off',

  /**
   * no empty `waitFor` or `waitForElementToBeRemoved`
   *
   * @see https://github.com/testing-library/eslint-plugin-testing-library/blob/master/docs/rules/no-wait-for-empty-callback.md
   */
  'testing-library/no-wait-for-empty-callback': 'error',

  /**
   * use `expect(getByText('foo').tobeInTheDocument()` instead of
   * `getByText('foo')` expecting it not to throw
   *
   * @see https://github.com/testing-library/eslint-plugin-testing-library/blob/master/docs/rules/prefer-explicit-assert.md
   */
  'testing-library/prefer-explicit-assert': 'warn',

  /**
   * use `findBy*` instead of `waitFor` + `getBy*`
   *
   * @see https://github.com/testing-library/eslint-plugin-testing-library/blob/master/docs/rules/prefer-find-by.md
   */
  'testing-library/prefer-find-by': 'warn',

  /**
   * ensure more specific queries to check element presence
   *
   * @see https://github.com/testing-library/eslint-plugin-testing-library/blob/master/docs/rules/prefer-presence-queries.md
   */
  'testing-library/prefer-presence-queries': 'error',

  /**
   * suggest using `screen` over destructured methods
   *
   * @see https://github.com/testing-library/eslint-plugin-testing-library/blob/master/docs/rules/prefer-screen-queries.md
   */
  'testing-library/prefer-screen-queries': 'error',

  /**
   * prefer `waitFor` instead of deprecated `wait` and similar
   *
   * @see https://github.com/testing-library/eslint-plugin-testing-library/blob/master/docs/rules/prefer-wait-for.md
   */
  'testing-library/prefer-wait-for': 'warn',
});

const getTestOverrides = ({ typescript: { hasTypeScript } }) => ({
  /**
   * off to allow non-null casting e.g. querySelector or .find() results
   *
   * @see https://github.com/typescript-eslint/typescript-eslint/blob/v3.9.0/packages/eslint-plugin/docs/rules/no-non-null-assertion.md
   */
  ...(hasTypeScript
    ? { '@typescript-eslint/no-non-null-assertion': 'off' }
    : null),

  /**
   * off because its regularily done in tests
   *
   * @see https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/unified-signatures.md
   */
  ...(hasTypeScript ? { '@typescript-eslint/unbound-method': 'off' } : null),

  /**
   * off to allow silent mocks, e.g. for console
   *
   * @see https://eslint.org/docs/rules/no-empty-function
   * @see @typescript-eslint/no-empty-function
   */
  ...(hasTypeScript ? { '@typescript-eslint/no-empty-function': 'off' } : null),

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
});

module.exports = {
  createJestOverride,
  env: defaultEnv,
  extendsConfig,
  files: defaultFiles,
  getTestOverrides,
  getTestingLibraryRules,
  jestDomRules,
  jestRules,
  parserOptions: defaultParserOptions,
  settings: defaultSettings,
};
