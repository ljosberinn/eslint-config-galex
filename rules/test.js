module.exports = {
  createTestOverride: ({ hasJestDom, hasTestingLibrary, hasJest }) => {
    if (!hasJest) {
      return null;
    }

    return {
      env: {
        'jest/globals': true,
      },
      extends: ['plugin:jest-formatting/strict'],
      files: ['**/*.?(test|spec).?(ts|js)?(x)'],
      plugins: [
        'jest',
        hasJestDom && 'jest-dom',
        hasTestingLibrary && 'testing-library',
      ].filter(Boolean),
      rules: {
        // currently mostly copied from https://github.com/kentcdodds/eslint-config-kentcdodds/blob/master/jest.js
        // compare against https://www.npmjs.com/package/eslint-plugin-jest
        'jest/consistent-test-it': 'off',
        'jest/expect-expect': 'off',
        'jest/lowercase-name': 'off',
        'jest/no-alias-methods': 'off',
        'jest/no-commented-out-tests': 'warn',
        'jest/no-conditional-expect': 'error',
        'jest/no-deprecated-functions': 'error',
        'jest/no-disabled-tests': 'warn',
        'jest/no-duplicate-hooks': 'off',
        'jest/no-expect-resolves': 'off',
        'jest/no-export': 'error',
        'jest/no-focused-tests': 'error',
        'jest/no-hooks': 'off',
        'jest/no-identical-title': 'error',
        'jest/no-if': 'error',
        'jest/no-jasmine-globals': 'off',
        'jest/no-jest-import': 'error',
        'jest/no-large-snapshots': ['warn', { maxSize: 300 }],
        'jest/no-mocks-import': 'error',
        'jest/no-restricted-matchers': 'off',
        'jest/no-standalone-expect': 'off',
        'jest/no-test-callback': 'off',
        'jest/no-test-prefixes': 'error',
        'jest/no-test-return-statement': 'off',
        'jest/no-truthy-falsy': 'off',
        'jest/no-try-expect': 'error',
        'jest/prefer-called-with': 'error',
        'jest/prefer-expect-assertions': 'off',
        'jest/prefer-hooks-on-top': 'error',
        'jest/prefer-inline-snapshots': 'off',
        /**
         * prefer spying instead of copying to avoid having to cleanup
         *
         * @see https://github.com/jest-community/eslint-plugin-jest/blob/HEAD/docs/rules/prefer-spy-on.md
         */
        'jest/prefer-spy-on': 'warn',
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

        ...(hasJestDom
          ? {
              /**
               * improves semantics of expect
               *
               * @see https://github.com/testing-library/eslint-plugin-jest-dom/blob/master/docs/rules/prefer-checked.md
               */
              'jest-dom/prefer-checked': 'error',
              /**
               * improves semantics of expect
               *
               * @see https://github.com/testing-library/eslint-plugin-jest-dom/blob/master/docs/rules/prefer-empty.md
               */
              'jest-dom/prefer-empty': 'error',
              /**
               * improves semantics of expect
               *
               * @see https://github.com/testing-library/eslint-plugin-jest-dom/blob/master/docs/rules/prefer-enabled-disabled.md
               */
              'jest-dom/prefer-enabled-disabled': 'error',
              /**
               * improves semantics of expect
               *
               * @see https://github.com/testing-library/eslint-plugin-jest-dom/blob/master/docs/rules/prefer-focus.md
               */
              'jest-dom/prefer-focus': 'error',
              /**
               * improves semantics of expect
               *
               * @see https://github.com/testing-library/eslint-plugin-jest-dom/blob/master/docs/rules/prefer-required.md
               */
              'jest-dom/prefer-required': 'error',
              /**
               * improves semantics of expect
               *
               * @see https://github.com/testing-library/eslint-plugin-jest-dom/blob/master/docs/rules/prefer-to-have-attribute.md
               */
              'jest-dom/prefer-to-have-attribute': 'error',
              /**
               * improves semantics of expect
               *
               * @see https://github.com/testing-library/eslint-plugin-jest-dom/blob/master/docs/rules/prefer-to-have-text-content.md
               */
              'jest-dom/prefer-to-have-text-content': 'error',
            }
          : null),

        ...(hasTestingLibrary
          ? {
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
               * @see https://github.com/testing-library/eslint-plugin-testing-library/blob/master/docs/rules/consistent-data-testid.md
               */
              'testing-library/consistent-data-testid': [
                'error',
                {
                  testIdPattern: '^TestId(__[A-Z]*)?$',
                },
              ],
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
              'testing-library/no-dom-import': ['error', 'react'],
              /**
               * hints on `cleanup` not being necessary
               *
               * @see https://github.com/testing-library/eslint-plugin-testing-library/blob/master/docs/rules/no-manual-cleanup.md
               */
              'testing-library/no-manual-cleanup': 'error',
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
              'testing-library/prefer-find-by': 'error',
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
              'testing-library/prefer-wait-for': 'error',
            }
          : null),
      },
      settings: {
        jest: {
          version: 'detect',
        },
      },
    };
  },
};
