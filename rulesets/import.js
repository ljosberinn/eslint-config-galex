module.exports = {
  /**
   * enforces a new line right after the last import of a file
   */
  'import/newline-after-import': 'warn',
  /**
   * prefer named exports. disable the rule for cases in which you _need_
   * default exports
   */
  'import/no-anonymous-default-export': 'error',
  /**
   * any module should exclusively contain named exports
   *
   * exceptions:
   * when unavoidable due to limitations, disable the warning for this line
   */
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
};
