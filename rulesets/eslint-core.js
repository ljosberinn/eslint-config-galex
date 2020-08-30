/* eslint-disable inclusive-language/use-inclusive-words */

const restrictedGlobals = require('confusing-browser-globals');
const { rules: prettierRules } = require('eslint-config-prettier');

module.exports = {
  /**
   * @param {{
   *  typescript: {
   *    hasTypeScript: boolean;
   *  };
   *  customRules?: Record<string, string | [string, string | object];
   * }} options
   */
  createEslintCoreRules: ({ typescript, customRules = {} }) => ({
    ...getESlintCoreRules(typescript),
    ...prettierRules,
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
   * @see @typescript-eslint/default-param-last
   */
  'default-param-last': hasTypeScript ? 'off' : 'error',

  'dot-location': ['warn', 'property'],

  /**
   * @see https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/dot-notation.md
   * @see @typescript-eslint/dot-notation
   */
  'dot-notation': hasTypeScript ? 'off' : 'warn',

  eqeqeq: ['warn', 'smart'],

  /**
   * @see https://eslint.org/docs/rules/for-direction
   */
  'for-direction': 'error',

  /**
   * disallows `fn ()`, prefers `fn()`
   *
   * off because prettier takes care of that
   *
   * @see https://eslint.org/docs/rules/func-call-spacing
   * @see @typescript-eslint/func-call-spacing.md
   */
  'func-call-spacing': 'off',

  /**
   * @see https://eslint.org/docs/rules/getter-return
   */
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
   * @see @typescript-eslint/keyword-spacing
   */
  'keyword-spacing': 'off',

  /**
   * ensures proper spacing between class members
   *
   * @see https://eslint.org/docs/rules/lines-between-class-members
   * @see @typescript-eslint/lines-between-class-members
   */
  'lines-between-class-members': hasTypeScript ? 'off' : 'warn',

  'new-parens': 'warn',

  'no-alert': 'error',
  /**
   * @see https://eslint.org/docs/rules/no-array-constructor
   * @see @typescript-eslint/no-array-constructor
   */
  'no-array-constructor': hasTypeScript ? 'off' : 'error',

  /**
   * prevents usage of async within `new Promise`
   *
   * @see https://eslint.org/docs/rules/no-async-promise-executor
   */
  'no-async-promise-executor': 'error',

  /**
   * prevents using async in for loop; `use Promise.all` instead
   *
   * @see https://eslint.org/docs/rules/no-await-in-loop
   */
  'no-await-in-loop': 'error',

  'no-caller': 'warn',

  /**
   * prevents comparing against negative zero
   *
   * @see https://eslint.org/docs/rules/no-compare-neg-zero
   */
  'no-compare-neg-zero': 'error',

  /**
   * prevents assigning in condition
   *
   * @see https://eslint.org/docs/rules/no-cond-assign
   */
  'no-cond-assign': ['warn', 'except-parens'],

  /**
   * prevents forgotten debug statements. either uncomment the line
   * or remove the statement
   *
   * @see https://eslint.org/docs/rules/no-console
   */
  'no-console': 'warn',

  'no-const-assign': 'warn',
  /**
   * prevents inline constant conditions
   *
   * @see https://eslint.org/docs/rules/no-constant-condition
   */
  'no-constant-condition': 'error',

  /**
   * prevents mistakenly using control characters in regex
   *
   * disable when really required
   *
   * @see https://eslint.org/docs/rules/no-control-regex
   */
  'no-control-regex': 'warn',

  /**
   * prevents forgotten debug statements
   *
   * @see https://eslint.org/docs/rules/no-debugger
   */
  'no-debugger': 'warn',

  'no-delete-var': 'warn',

  /**
   * prevents duplicate function arg names
   *
   * @see https://eslint.org/docs/rules/no-dupe-args
   */
  'no-dupe-args': hasTypeScript ? 'off' : 'error',

  /**
   * @see https://eslint.org/docs/rules/no-dupe-class-members
   * @see @typescript-eslint/no-dupe-class-members
   */
  'no-dupe-class-members': hasTypeScript ? 'off' : 'error',

  /**
   * prevents identical branches
   *
   * @see https://eslint.org/docs/rules/no-dupe-else-if
   */
  'no-dupe-else-if': 'warn',

  /**
   * prevents duplicate keys in object
   *
   * @see https://eslint.org/docs/rules/no-dupe-keys
   */
  'no-dupe-keys': hasTypeScript ? 'off' : 'warn',

  /**
   * @see https://eslint.org/docs/rules/no-duplicate-case
   */
  'no-duplicate-case': 'warn',

  'no-else-return': 'error',

  'no-empty-character-class': 'warn',
  /**
   * @see https://eslint.org/docs/rules/no-empty-function
   * @see @typescript-eslint/no-empty-function
   */
  'no-empty-function': hasTypeScript ? 'off' : 'error',
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
  'no-invalid-this': hasTypeScript ? 'off' : 'error',
  'no-iterator': 'warn',
  'no-label-var': 'warn',
  'no-labels': ['warn', { allowLoop: true, allowSwitch: false }],
  'no-lone-blocks': 'warn',
  'no-loop-func': 'warn',
  /**
   * @see https://eslint.org/docs/rules/no-loss-of-precision
   * @see @typescript-eslint/no-loss-of-precision
   */
  'no-loss-of-precision': hasTypeScript ? 'off' : 'error',
  /**
   * @see https://eslint.org/docs/rules/no-magic-numbers
   * @see @typescript-eslint/no-magic-numbers
   */
  'no-magic-numbers': 'off',
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
   * @see https://eslint.org/docs/rules/no-return-await
   * @see @typescript-eslint/no-return-await
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
  /**
   * @see https://eslint.org/docs/rules/no-unused-expression
   * @see @typescript-eslint/no-unused-expression
   */
  'no-unused-expressions': hasTypeScript
    ? 'off'
    : [
        'error',
        {
          allowShortCircuit: true,
          allowTaggedTemplates: true,
          allowTernary: true,
        },
      ],
  'no-unused-labels': 'warn',
  /**
   * @see https://eslint.org/docs/rules/no-unused-vars
   * @see @typescript-eslint/no-unused-vars
   */
  'no-unused-vars': hasTypeScript
    ? 'off'
    : [
        'warn',
        {
          args: 'none',
          ignoreRestSiblings: true,
        },
      ],
  /**
   * @see https://eslint.org/docs/rules/no-use-before-define
   * @see @typescript-eslint/no-use-before-define
   */
  'no-use-before-define': hasTypeScript
    ? 'off'
    : [
        'warn',
        {
          classes: false,
          functions: false,
          variables: false,
        },
      ],
  'no-useless-computed-key': 'warn',
  'no-useless-concat': 'warn',
  /**
   * @see https://eslint.org/docs/rules/no-useless-constructor
   * @see @typescript-eslint/no-useless-constructor
   */
  'no-useless-constructor': hasTypeScript ? 'off' : 'warn',
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
  /**
   * prevents using `async` without `await`
   *
   * @see https://eslint.org/docs/rules/require-await
   * @see @typescript-eslint/require-await
   */
  'require-await': hasTypeScript ? 'off' : 'error',
  'require-yield': 'warn',
  'rest-spread-spacing': ['warn', 'never'],
  /**
   * off because handled by prettier
   *
   * @see https://eslint.org/docs/rules/semi
   * @see @typescript-eslint/semi
   */
  semi: 'off',
  /**
   * off because handled by prettier
   *
   * @see https://eslint.org/docs/rules/space-before-function-paren
   * @see @typescript-eslint/space-before-function-paren
   */
  'space-before-function-paren': 'off',
  strict: ['warn', 'never'],
  'unicode-bom': ['warn', 'never'],
  'use-isnan': 'warn',
  'valid-typeof': 'warn',
});
