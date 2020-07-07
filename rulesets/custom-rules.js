module.exports = {
  // patches default rule; see unicorn/no-useless-undefined
  'array-callback-return': [
    'error',
    {
      allowImplicit: true,
    },
  ],
  'import/newline-after-import': 'warn',
  'import/no-anonymous-default-export': 'error',
  'import/no-default-export': 'warn',
  /**
   * - groups imports
   * - alphabetically sorts them
   * - enforces new lines between groups
   */
  'import/order': [
    'warn',
    {
      alphabetize: {
        order: 'asc',
      },
      groups: [
        ['builtin', 'external', 'internal'],
        ['unknown', 'parent', 'sibling'],
        'index',
      ],
      'newlines-between': 'always',
    },
  ],
  'no-alert': 'error',
  'no-console': 'warn',
  'no-else-return': 'error',
  // disables core eslint rule, see unicorn/no-nested-ternary
  'no-nested-ternary': 'off',
  'prefer-exponentiation-operator': 'warn',
  // for promise-rules, see
  // https://github.com/xjamundx/eslint-plugin-promise/tree/master/docs/rules
  'promise/catch-or-return': [
    'error',
    {
      allowFinally: true,
      allowThen: true,
    },
  ],
  'promise/no-nesting': 'warn',
  'promise/no-new-statics': 'error',
  'promise/no-promise-in-callback': 'warn',
  'promise/no-return-in-finally': 'warn',
  'promise/no-return-wrap': 'error',
  'promise/param-names': 'warn',
  'promise/prefer-await-to-callbacks': 'warn',
  'promise/prefer-await-to-then': 'warn',
  'require-await': 'error',
  // alphabetically sorts object keys
  'sort-keys-fix/sort-keys-fix': 'warn',
  // for all below, see
  // https://github.com/sindresorhus/eslint-plugin-unicorn/tree/master/docs/rules
  'unicorn/better-regex': 'error',
  'unicorn/catch-error-name': 'error',
  'unicorn/consistent-function-scoping': 'error',
  'unicorn/custom-error-definition': 'warn',
  'unicorn/error-message': 'error',
  'unicorn/escape-case': 'error',
  'unicorn/explicit-length-check': 'error',
  'unicorn/import-index': 'error',
  'unicorn/new-for-builtins': 'error',
  'unicorn/no-abusive-eslint-disable': 'error',
  'unicorn/no-array-instanceof': 'error',
  'unicorn/no-console-spaces': 'error',
  'unicorn/no-for-loop': 'error',
  'unicorn/no-hex-escape': 'error',

  'unicorn/no-keyword-prefix': 'off',
  // at least warn
  'unicorn/no-nested-ternary': 'warn',
  'unicorn/no-new-buffer': 'error',
  'unicorn/no-process-exit': 'error',
  'unicorn/no-unsafe-regex': 'error',
  'unicorn/no-useless-undefined': 'error',
  'unicorn/no-zero-fractions': 'error',
  'unicorn/prefer-add-event-listener': 'error',
  // not yet released
  // 'unicorn/prefer-array-find': 'error',
  'unicorn/prefer-dataset': 'error',
  'unicorn/prefer-event-key': 'error',
  'unicorn/prefer-flat-map': 'error',
  'unicorn/prefer-includes': 'error',
  'unicorn/prefer-modern-dom-apis': 'error',
  'unicorn/prefer-negative-index': 'error',
  'unicorn/prefer-node-append': 'error',
  'unicorn/prefer-node-remove': 'error',
  'unicorn/prefer-number-properties': 'error',
  'unicorn/prefer-optional-catch-binding': 'error',
  'unicorn/prefer-query-selector': 'error',
  'unicorn/prefer-reflect-apply': 'error',
  'unicorn/prefer-replace-all': 'error',
  'unicorn/prefer-set-has': 'error',
  'unicorn/prefer-spread': 'error',
  'unicorn/prefer-starts-ends-with': 'error',
  'unicorn/prefer-string-slice': 'error',
  'unicorn/prefer-text-content': 'error',
  'unicorn/prefer-trim-start-end': 'error',
  'unicorn/prefer-type-error': 'error',
  'unicorn/string-content': 'off',
  'unicorn/throw-new-error': 'error',
};
