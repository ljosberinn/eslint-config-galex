/* eslint-disable inclusive-language/use-inclusive-words */
const files = ['src/pages/*.?(js|ts)?(x)', 'pages/*.?(js|ts)?(x)'];

const createNextJsOverride = ({
  react,
  rules: customRules = {},
  files: customFiles = [],
}) => {
  if (!react.isNext) {
    return null;
  }

  const rules = {
    ...defaultNextJsRules,
    ...customRules,
  };

  const finalFiles = [...new Set([...files, ...customFiles])];

  return {
    files: finalFiles,
    rules,
  };
};

const defaultNextJsRules = {
  /**
   * off because Next.js page routing requires default exports
   */
  'import/no-default-export': 'off',

  /**
   * ensures core `a` attributes are valid
   *
   * exclude `noHref` validation for Nextjs because
   *
   * @example
   * ```js
   * <Link passHref href="/foo">
   *  <a>hi</a
   * </Link>
   * ```
   * is valid
   *
   * @see https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/blob/master/docs/rules/anchor-is-valid.md
   */
  'jsx-a11y/anchor-is-valid': [
    'error',
    {
      aspects: ['invalidHref'],
      components: ['Link'],
    },
  ],

  'react/react-in-jsx-scope': 'off',

  /**
   * ensures stylesheets are preloaded
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
  createNextJsOverride,
  defaultNextJsRules,
};
