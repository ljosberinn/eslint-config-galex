module.exports = {
  /**
   * @param {{
   *  customRules?: Record<string, string | [string, string | object];
   * }}
   */
  createSortKeysFixRules: ({ customRules = {} }) => ({
    ...sortKeysFixRules,
    ...customRules,
  }),
};

const sortKeysFixRules = {
  /**
   * sorts object keys alphabetically
   *
   * @see https://github.com/leo-buneev/eslint-plugin-sort-keys-fix
   */
  'sort-keys-fix/sort-keys-fix': 'warn',
};
