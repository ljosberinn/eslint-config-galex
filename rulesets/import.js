/* eslint-disable inclusive-language/use-inclusive-words */

// WIP
module.exports = {
  /**
   * @see https://github.com/benmosher/eslint-plugin-import/blob/master/docs/rules/first.md
   */
  'import/first': 'error',
  /**
   * enforces a new line right after the last import of a file
   *
   * @see https://github.com/benmosher/eslint-plugin-import/blob/master/docs/rules/newline-after-import.md
   * /
  'import/newline-after-import': 'warn',
  /**
   * @see https://github.com/benmosher/eslint-plugin-import/blob/master/docs/rules/no-amd.md
   */
  'import/no-amd': 'error',
  /**
   * prefer named exports. disable the rule for cases in which you _need_
   * default exports
   *
   * @see https://github.com/benmosher/eslint-plugin-import/blob/master/docs/rules/no-anonymous-default-export.md
   */
  'import/no-anonymous-default-export': 'error',
  /**
   * any module should exclusively contain named exports
   *
   * exceptions:
   * when unavoidable due to limitations, disable the warning for this line
   *
   * @see https://github.com/benmosher/eslint-plugin-import/blob/master/docs/rules/no-default-export.md
   */
  'import/no-default-export': 'warn',
  /**
   * @see https://github.com/benmosher/eslint-plugin-import/blob/master/docs/rules/no-webpack-loader-syntax.md
   */
  'import/no-webpack-loader-syntax': 'error',
  /**
   * - groups imports
   * - alphabetically sorts them
   * - enforces new lines between groups
   *
   * @see https://github.com/benmosher/eslint-plugin-import/blob/master/docs/rules/order.md
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
};
