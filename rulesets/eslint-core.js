/* eslint-disable inclusive-language/use-inclusive-words */

const restrictedGlobals = require('confusing-browser-globals');

module.exports = {
  /**
   * @param {{
   *  hasTypeScript: boolean;
   *  customRules?: Record<string, string | [string, string | object];
   * }} options
   */
  createEslintCoreRules: ({ hasTypeScript, customRules = {} }) => ({
    ...getESlintCoreRules({ hasTypeScript }),
    ...customRules,
  }),
};

const getESlintCoreRules = ({ hasTypeScript }) => ({
  'array-callback-return': [
    'error',
    {
      allowImplicit: true,
    },
  ],
  // http://eslint.org/docs/rules/
  'default-case': ['warn', { commentPattern: '^no default$' }],
  /**
   * @see https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/default-param-last.md
   */
  'default-param-last': hasTypeScript ? 'off' : 'error',
  'dot-location': ['warn', 'property'],
  /**
   * @see https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/dot-notation.md
   */
  'dot-notation': hasTypeScript ? 'off' : 'warn',
  eqeqeq: ['warn', 'smart'],
  /**
   * disallows `fn ()`, prefers `fn()`
   *
   * @see https://eslint.org/docs/rules/func-call-spacing
   */
  'func-call-spacing': hasTypeScript ? 'off' : 'warn',
  'getter-return': 'warn',
  /**
   * off because required to escape scope
   *
   * @see https://eslint.org/docs/rules/init-declarations
   */
  'init-declarations': 'off',

  /**
   * off because prettier takes care of that
   *
   * @see https://eslint.org/docs/rules/keyword-spacing
   */
  'keyword-spacing': 'off',

  /**
   * ensures proper spacing between class members
   *
   * @see https://eslint.org/docs/rules/lines-between-class-members
   */
  'lines-between-class-members': hasTypeScript ? 'off' : 'warn',
  'new-parens': 'warn',
  'no-alert': 'error',
  /**
   * @see https://eslint.org/docs/rules/no-array-constructor
   */
  'no-array-constructor': hasTypeScript ? 'off' : 'error',
  'no-caller': 'warn',
  'no-cond-assign': ['warn', 'except-parens'],
  'no-console': 'warn',
  'no-const-assign': 'warn',
  'no-control-regex': 'warn',
  'no-delete-var': 'warn',
  'no-dupe-args': 'warn',
  'no-dupe-class-members': 'warn',
  'no-dupe-keys': 'warn',
  'no-duplicate-case': 'warn',
  'no-else-return': 'error',
  'no-empty-character-class': 'warn',
  'no-empty-pattern': 'warn',
  'no-eval': 'warn',
  'no-ex-assign': 'warn',
  'no-extend-native': 'warn',
  'no-extra-bind': 'warn',
  'no-extra-label': 'warn',
  'no-fallthrough': 'warn',
  'no-func-assign': 'warn',
  'no-implied-eval': 'warn',
  'no-invalid-regexp': 'warn',
  'no-iterator': 'warn',
  'no-label-var': 'warn',
  'no-labels': ['warn', { allowLoop: true, allowSwitch: false }],
  'no-lone-blocks': 'warn',
  'no-loop-func': 'warn',
  'no-mixed-operators': [
    'warn',
    {
      allowSamePrecedence: false,
      groups: [
        ['+', '-', '*', '/', '%', '**'],
        ['&', '|', '^', '~', '<<', '>>', '>>>'],
        ['==', '!=', '===', '!==', '>', '>=', '<', '<='],
        ['&&', '||'],
        ['in', 'instanceof'],
      ],
    },
  ],
  'no-multi-str': 'warn',
  'no-native-reassign': 'warn',
  'no-negated-in-lhs': 'warn',
  // disables core eslint rule, see unicorn/no-nested-ternary
  'no-nested-ternary': 'off',
  'no-new-func': 'warn',
  'no-new-object': 'warn',
  'no-new-symbol': 'warn',
  'no-new-wrappers': 'warn',
  'no-obj-calls': 'warn',
  'no-octal': 'warn',
  'no-octal-escape': 'warn',
  'no-redeclare': 'error',
  'no-regex-spaces': 'warn',
  'no-restricted-globals': ['error'].concat(restrictedGlobals),
  'no-restricted-syntax': ['warn', 'WithStatement'],
  /**
   * @see https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/return-await.md
   */
  'no-return-await': hasTypeScript ? 'off' : 'error',
  'no-script-url': 'warn',
  'no-self-assign': 'warn',
  'no-self-compare': 'warn',
  'no-sequences': 'warn',
  'no-shadow-restricted-names': 'warn',
  'no-sparse-arrays': 'warn',
  'no-template-curly-in-string': 'warn',
  'no-this-before-super': 'warn',
  'no-throw-literal': 'warn',
  'no-undef': 'error',
  'no-unreachable': 'warn',
  'no-unused-expressions': [
    'error',
    {
      allowShortCircuit: true,
      allowTaggedTemplates: true,
      allowTernary: true,
    },
  ],
  'no-unused-labels': 'warn',
  'no-unused-vars': hasTypeScript
    ? 'off'
    : [
        'warn',
        {
          args: 'none',
          ignoreRestSiblings: true,
        },
      ],
  'no-use-before-define': [
    'warn',
    {
      classes: false,
      functions: false,
      variables: false,
    },
  ],
  'no-useless-computed-key': 'warn',
  'no-useless-concat': 'warn',
  'no-useless-constructor': 'warn',
  'no-useless-escape': 'warn',
  'no-useless-rename': [
    'warn',
    {
      ignoreDestructuring: false,
      ignoreExport: false,
      ignoreImport: false,
    },
  ],
  'no-whitespace-before-property': 'warn',
  'no-with': 'warn',
  'prefer-exponentiation-operator': 'warn',
  'require-await': 'error',
  'require-yield': 'warn',
  'rest-spread-spacing': ['warn', 'never'],
  strict: ['warn', 'never'],
  'unicode-bom': ['warn', 'never'],
  'use-isnan': 'warn',
  'valid-typeof': 'warn',
});
