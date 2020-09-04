/* eslint-disable inclusive-language/use-inclusive-words */

/**
 * @param {{
 *  typescript: {
 *    hasTypeScript: boolean;
 *  };
 *  react: {
 *    isCreateReactApp: boolean;
 *  }
 *  rules?: Record<string, string | [string, string | object];
 * }} options
 */
const createImportRules = ({ typescript, react, rules: customRules = {} }) => ({
  ...getImportRules({ react, typescript }),
  ...customRules,
});

/**
 * @see https://github.com/benmosher/eslint-plugin-import
 *
 */
const getImportRules = ({
  typescript: { hasTypeScript },
  react: { isCreateReactApp },
}) => ({
  'import/default': 'warn',
  /**
   * reports any dynamic imports without a webpackChunkName specificied
   *
   * @see https://github.com/benmosher/eslint-plugin-import/blob/master/docs/rules/dynamic-import-chunkname.md
   */
  'import/dynamic-import-chunkname': 'warn',

  /**
   * warns about colliding exports
   *
   * @see https://github.com/benmosher/eslint-plugin-import/blob/master/docs/rules/export.md
   */
  'import/export': hasTypeScript ? 'off' : 'error',

  /**
   * off because too opinonated
   *
   * @see https://github.com/benmosher/eslint-plugin-import/blob/master/docs/rules/exports-last.md
   */
  'import/exports-last': 'off',

  /**
   * off because workspace sensitive
   *
   * @see https://github.com/benmosher/eslint-plugin-import/blob/master/docs/rules/extensions.md
   */
  'import/extensions': 'off',

  /**
   * reports any imports that come after non-import statements
   *
   * @see https://github.com/benmosher/eslint-plugin-import/blob/master/docs/rules/first.md
   */
  'import/first': 'error',

  /**
   * off because too opinionated
   *
   * @see https://github.com/benmosher/eslint-plugin-import/blob/master/docs/rules/group-exports.md
   */
  'import/group-exports': 'off',

  /**
   * off because arbitrary
   *
   * @see https://github.com/benmosher/eslint-plugin-import/blob/master/docs/rules/max-dependencies.md
   */
  'import/max-dependencies': 'off',

  /**
   * warns about nonexistent imports
   *
   * @see https://github.com/benmosher/eslint-plugin-import/blob/master/docs/rules/named.md
   */
  'import/named': hasTypeScript ? 'off' : 'error',

  /**
   * warns about nonexistent properties on namespaces
   * similar to import/named
   *
   * @see https://github.com/benmosher/eslint-plugin-import/blob/master/docs/rules/namespace.md
   * @see import/named
   */
  'import/namespace': hasTypeScript ? 'off' : 'error',

  /**
   * enforces a new line right after the last import of a file
   *
   * @see https://github.com/benmosher/eslint-plugin-import/blob/master/docs/rules/newline-after-import.md
   */
  'import/newline-after-import': 'warn',

  /**
   * off because arbitrary & workspace sensitive
   *
   * @see https://github.com/benmosher/eslint-plugin-import/blob/master/docs/rules/no-absolute-path.md
   */
  'import/no-absolute-path': 'off',

  /**
   * prevents usage of amd import/exports
   *
   * @see https://github.com/benmosher/eslint-plugin-import/blob/master/docs/rules/no-amd.md
   */
  'import/no-amd': 'error',

  /**
   * prefer named exports. prefer named default exports
   *
   * @see https://github.com/benmosher/eslint-plugin-import/blob/master/docs/rules/no-anonymous-default-export.md
   */
  'import/no-anonymous-default-export': 'error',

  /**
   * off because workspace sensitive
   *
   * @see https://github.com/benmosher/eslint-plugin-import/blob/master/docs/rules/no-commonjs.md
   */
  'import/no-commonjs': 'off',

  /**
   * depects potential cyclical imports
   *
   * __EXPERIMENTAL__
   *
   * @see https://github.com/benmosher/eslint-plugin-import/blob/master/docs/rules/no-cycle.md
   */
  'import/no-cycle': isCreateReactApp
    ? 'warn'
    : [
        'warn',
        {
          ignoreExternal: true,
          maxDepth: 5,
        },
      ],

  /**
   * any module should exclusively contain named exports
   * when unavoidable due to limitations, disable the warning for this line
   *
   * @see https://github.com/benmosher/eslint-plugin-import/blob/master/docs/rules/no-default-export.md
   */
  'import/no-default-export': 'warn',

  /**
   * prevents the use of deprecated methods
   *
   * @see https://github.com/benmosher/eslint-plugin-import/blob/master/docs/rules/no-deprecated.md
   */
  'import/no-deprecated': hasTypeScript ? 'off' : 'warn',

  /**
   * prevents importing the same path multiple times
   *
   * @see https://github.com/benmosher/eslint-plugin-import/blob/master/docs/rules/no-duplicates.md
   * @see no-duplicate-imports
   */
  'import/no-duplicates': 'warn',

  /**
   * pervents use of dynamic `require`s. when necessary, disable the rule.
   *
   * @see https://github.com/benmosher/eslint-plugin-import/blob/master/docs/rules/no-dynamic-require.md
   */
  'import/no-dynamic-require': 'warn',

  /**
   * prevents using dependencies not defined in package.json
   *
   * @see https://github.com/benmosher/eslint-plugin-import/blob/master/docs/rules/no-extraneous-dependencies.md
   */
  'import/no-extraneous-dependencies': 'warn',

  /**
   * off because intended by some packages, e.g. `react-icons`, `next`, `msw`
   *
   * @see https://github.com/benmosher/eslint-plugin-import/blob/master/docs/rules/no-internal-modules.md
   */
  'import/no-internal-modules': 'off',

  /**
   * prevents mutable exports
   *
   * @see https://github.com/benmosher/eslint-plugin-import/blob/master/docs/rules/no-mutable-exports.md
   */
  'import/no-mutable-exports': 'error',

  /**
   * prevents importing named exports by the name of the default export
   *
   * @see https://github.com/benmosher/eslint-plugin-import/blob/master/docs/rules/no-named-as-default.md
   */
  'import/no-named-as-default': 'off',

  /**
   * prevents use of an exported name as a property on the default export
   *
   * @see https://github.com/benmosher/eslint-plugin-import/blob/master/docs/rules/no-named-as-default-member.md
   */
  'import/no-named-as-default-member': 'off',

  /**
   * prefer directly renaming defaults when importing
   *
   * @see https://github.com/benmosher/eslint-plugin-import/blob/master/docs/rules/no-named-default.md
   */
  'import/no-named-default': 'error',

  /**
   * off because named exports should be the standard
   *
   * @see https://github.com/benmosher/eslint-plugin-import/blob/master/docs/rules/no-named-export.md
   */
  'import/no-named-export': 'off',

  /**
   * prevents `import * as foo` syntax, use `import foo` instead
   *
   * off in tests!
   *
   * @see https://github.com/benmosher/eslint-plugin-import/blob/master/docs/rules/no-namespace.md
   */
  'import/no-namespace': 'error',

  /**
   * off because workspace sensitive
   *
   * @see https://github.com/benmosher/eslint-plugin-import/blob/master/docs/rules/no-nodejs-modules.md
   */
  'import/no-nodejs-modules': 'off',

  /**
   * prevents imports from parent folders
   *
   * off because not necessarily a bad pattern
   *
   * @see https://github.com/benmosher/eslint-plugin-import/blob/master/docs/rules/no-relative-parent-imports.md
   */
  'import/no-relative-parent-imports': 'off',

  /**
   * off because workspace sensitive
   *
   * @see https://github.com/benmosher/eslint-plugin-import/blob/master/docs/rules/no-restricted-paths.md
   */
  'import/no-restricted-paths': 'off',

  /**
   * prevent importing from the same file
   *
   * @see https://github.com/benmosher/eslint-plugin-import/blob/master/docs/rules/no-self-import.md
   */
  'import/no-self-import': 'error',

  /**
   * hints unused imoprts. off because both VSCode and TS already hint this
   *
   * @see https://github.com/benmosher/eslint-plugin-import/blob/master/docs/rules/no-unassigned-import.md
   */
  'import/no-unassigned-import': 'off',

  /**
   * ensures an imported module actually exists
   *
   * @see https://github.com/benmosher/eslint-plugin-import/blob/master/docs/rules/no-unresolved.md
   */
  'import/no-unresolved': hasTypeScript ? 'off' : 'warn',

  /**
   * reports modules without exports or `importe`d/`require`d.
   * prevents dead code
   *
   * @see https://github.com/benmosher/eslint-plugin-import/blob/master/docs/rules/no-unused-modules.md
   */
  'import/no-unused-modules': 'warn',

  /**
   *
   *
   * @see https://github.com/benmosher/eslint-plugin-import/blob/master/docs/rules/no-useless-path-segments.md
   */
  'import/no-useless-path-segments': [
    'error',
    {
      noUselessIndex: true,
    },
  ],

  /**
   * prevents using loader syntax in imports. use webpack config instead.
   *
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

  /**
   * off because named exports are preferred
   *
   * @see https://github.com/benmosher/eslint-plugin-import/blob/master/docs/rules/prefer-default-export.md
   * @see https://github.com/benmosher/eslint-plugin-import/blob/master/docs/rules/no-default-export.md
   */
  'import/prefer-default-export': 'off',

  /**
   * warns if a module is probably a script
   *
   * off because I frankly don't understand the description and it warns this
   * entire repo
   *
   * @see https://github.com/benmosher/eslint-plugin-import/blob/master/docs/rules/unambiguous.md
   */
  'import/unambiguous': 'off',
});

module.exports = {
  createImportRules,
  getImportRules,
};
