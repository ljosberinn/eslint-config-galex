module.exports = {
  /**
   * @param {{
   *  customRules?: Record<string, string | [string, string | object];
   * }}
   */
  createInclusiveLanguageRules: ({ customRules = {} }) => ({
    ...inclusiveLanguageRules,
    ...customRules,
  }),
};

const inclusiveLanguageRules = {
  /**
   * @see https://github.com/muenzpraeger/eslint-plugin-inclusive-language/blob/primary/docs/rules/use-inclusive-words.md
   */
  'inclusive-language/use-inclusive-words': 'error',
};
