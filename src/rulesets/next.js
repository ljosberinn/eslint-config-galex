/**
 * @param {{
 *  react: {
 *    isNext: boolean;
 *  };
 *  rules?: Record<string, string | [string, string | object];
 * }} options
 */
const createNextJsRules = ({ react: { isNext }, rules: customRules = {} }) => {
  if (!isNext) {
    return null;
  }

  return {
    ...nextJsRules,
    ...customRules,
  };
};

const nextJsRules = {
  /**
   * can impact first paint
   *
   * @see https://github.com/vercel/next.js/blob/canary/packages/eslint-plugin-next/lib/rules/missing-preload.js
   */
  '@next/next/missing-preload': 'warn',

  /**
   * should be imported directly
   *
   * @see https://github.com/vercel/next.js/blob/canary/packages/eslint-plugin-next/lib/rules/no-css-tags.js
   */
  '@next/next/no-css-tags': 'warn',

  /**
   * disallows regular <a> links
   *
   * @see https://github.com/vercel/next.js/blob/canary/packages/eslint-plugin-next/lib/rules/no-html-link-for-pages.js
   */
  '@next/next/no-html-link-for-pages': 'warn',

  /**
   * sync scripts can impact performance
   *
   * @see https://github.com/vercel/next.js/blob/canary/packages/eslint-plugin-next/lib/rules/no-sync-scripts.js
   */
  '@next/next/no-sync-scripts': 'warn',

  /**
   * disallow of polyfill.io in some cases
   *
   * @see https://github.com/vercel/next.js/blob/canary/packages/eslint-plugin-next/lib/rules/no-unwanted-polyfillio.js
   */
  '@next/next/no-unwanted-polyfillio': 'warn',
};

module.exports = {
  createNextJsRules,
  nextJsRules,
};
