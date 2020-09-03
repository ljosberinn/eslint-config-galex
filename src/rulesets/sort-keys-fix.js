/**
 * @param {{
 *  rules?: Record<string, string | [string, string | object];
 * }}
 */
const createSortKeysFixRules = ({ rules: customRules = {} }) => ({
  ...sortKeysFixRules,
  ...customRules,
});

const sortKeysFixRules = {
  /**
   * sorts object keys alphabetically
   *
   * @see https://github.com/leo-buneev/eslint-plugin-sort-keys-fix
   */
  'sort-keys-fix/sort-keys-fix': 'warn',
};

module.exports = {
  createSortKeysFixRules,
  sortKeysFixRules,
};
