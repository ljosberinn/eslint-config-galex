/* eslint-disable inclusive-language/use-inclusive-words */

const restrictedGlobals = require('confusing-browser-globals');
const { rules: prettierRules } = require('eslint-config-prettier');

/**
 * @param {{
 *  typescript: {
 *    hasTypeScript: boolean;
 *  };
 *  customRules?: Record<string, string | [string, string | object];
 * }} options
 */
const createEslintCoreRules = ({ typescript, customRules = {} }) => ({
  ...getPossibleErrorRules(typescript),
  ...getBestPractices(typescript),
  ...strictModeRules,
  ...getVariableRules(typescript),
  ...getStylisticIssuesRules(typescript),
  ...getES6Rules(typescript),
  ...prettierRules,
  ...safePrettierOverrides,
  ...customRules,
});

/**
 * @see https://eslint.org/docs/rules/#possible-errors
 */
const getPossibleErrorRules = ({ hasTypeScript }) => ({
  /**
   * @see https://eslint.org/docs/rules/for-direction
   */
  'for-direction': 'error',

  /**
   * @see https://eslint.org/docs/rules/getter-return
   */
  'getter-return': 'warn',

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

  /**
   * prevents duplicate function arg names
   *
   * @see https://eslint.org/docs/rules/no-dupe-args
   */
  'no-dupe-args': hasTypeScript ? 'off' : 'error',

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
   * prevens duplicate cases in switches
   *
   * @see https://eslint.org/docs/rules/no-duplicate-case
   */
  'no-duplicate-case': 'warn',

  /**
   * prevents empty statements
   *
   * @see https://eslint.org/docs/rules/no-empty
   */
  'no-empty': 'warn',

  /**
   * disallows empty character classes in regex
   *
   * @see https://eslint.org/docs/rules/no-empty-character-class
   */
  'no-empty-character-class': 'warn',

  /**
   * disallows reassigning something in a catch clause
   *
   * @see https://eslint.org/docs/rules/no-ex-assign
   */
  'no-ex-assign': 'warn',

  /**
   * prevents unecessary boolean casting in conditions
   *
   * @see https://eslint.org/docs/rules/no-extra-boolean-cast
   */
  'no-extra-boolean-cast': 'warn',

  /**
   * off because handled by prettier
   *
   * @see https://eslint.org/docs/rules/no-extra-parens
   */
  'no-extra-parens': 'off',

  /**
   * off because handled by prettier
   *
   * @see https://eslint.org/docs/rules/no-extra-semi
   */
  'no-extra-semi': 'off',

  /**
   * prevents overwriting functions declared via `function` syntax
   *
   * @see https://eslint.org/docs/rules/no-func-assign
   */
  'no-func-assign': 'warn',

  /**
   * disallows trying to overwrite imports
   *
   * @see https://eslint.org/docs/rules/no-import-assign
   */
  'no-import-assign': 'error',

  /**
   * disallows variable or `function` declaration in nested blocks
   *
   * @see https://eslint.org/docs/rules/no-inner-declarations
   */
  'no-inner-declarations': 'warn',

  /**
   * disallows invalid regexp
   *
   * @see https://eslint.org/docs/rules/no-invalid-regexp
   */
  'no-invalid-regexp': 'error',

  /**
   * prevents the use of non-standard whitespace characters
   *
   * @see https://eslint.org/docs/rules/no-irregular-whitespace
   */
  'no-irregular-whitespace': 'warn',

  /**
   * disallows the use of number literals that immediately lose precision at
   * runtime due to 64-bit floating-point rounding
   *
   * @see https://eslint.org/docs/rules/no-loss-of-precision
   * @see @typescript-eslint/no-loss-of-precision
   */
  'no-loss-of-precision': hasTypeScript ? 'off' : 'error',

  /**
   * prevents the use of multiple code point characters in regexp
   *
   * @see https://eslint.org/docs/rules/no-misleading-character-class
   */
  'no-misleading-character-class': 'warn',

  /**
   * prevents calling certain native objects as function or class
   *
   * @see https://eslint.org/docs/rules/no-obj-calls
   */
  'no-obj-calls': hasTypeScript ? 'off' : 'error',

  /**
   * prevents returning from within a promise executor
   *
   * @see https://eslint.org/docs/rules/no-promise-executor-return
   */
  'no-promise-executor-return': 'error',

  /**
   * use Object.prototype.method instead of foo.method
   *
   * @see https://eslint.org/docs/rules/no-prototype-builtins
   */
  'no-prototype-builtins': 'error',

  /**
   * disallows arbitrary number of spaces in regex. use ` {3}` instead
   *
   * @see https://eslint.org/docs/rules/no-regex-spaces
   */
  'no-regex-spaces': 'warn',

  /**
   * disallow return on setters as its nonsensical
   *
   * @see https://eslint.org/docs/rules/no-setter-return
   */
  'no-setter-return': hasTypeScript ? 'off' : 'error',

  /**
   * prevents accidental holes in arrays
   *
   * @see https://eslint.org/docs/rules/no-sparse-arrays
   */
  'no-sparse-arrays': 'warn',

  /**
   * detects strings that probably should be template literals
   *
   * @see https://eslint.org/docs/rules/no-template-curly-in-string
   */
  'no-template-curly-in-string': 'warn',

  /**
   * warns on unexpected multiline statements (mostly semicolon-free related)
   *
   * @see https://eslint.org/docs/rules/no-unexpected-multiline
   */
  'no-unexpected-multiline': 'warn',

  /**
   * prevents unreachable code
   *
   * @see https://eslint.org/docs/rules/no-unreachable
   */
  'no-unreachable': hasTypeScript ? 'off' : 'warn',

  /**
   * off because taken care of by sonarjs/no-one-iteration-loop
   *
   * @see https://eslint.org/docs/rules/no-unreachable-loop
   * @see sonarjs/no-one-iteration-loop
   */
  'no-unreachable-loop': 'off',

  /**
   * prevents usage of unsafe finally in try/catch
   *
   * @see https://eslint.org/docs/rules/no-unsafe-finally
   */
  'no-unsafe-finally': 'error',

  /**
   * prevents cases of unsafe negation
   *
   * @see https://eslint.org/docs/rules/no-unsafe-negation
   */
  'no-unsafe-negation': 'warn',

  /**
   * prevents self-repeating regexp
   *
   * @see https://eslint.org/docs/rules/no-useless-backreference
   */
  'no-useless-backreference': 'warn',

  /**
   * prevents subtle race conditions in async code
   *
   * @see https://eslint.org/docs/rules/require-atomic-updates
   */
  'require-atomic-updates': 'warn',

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

  /**
   * prevents typos when comparing to types
   *
   * @see https://eslint.org/docs/rules/valid-typeof
   */
  'valid-typeof': hasTypeScript ? 'off' : 'warn',
});

/**
 * @see https://eslint.org/docs/rules/#best-practices
 */
const getBestPractices = ({ hasTypeScript }) => ({
  /**
   * @see https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/default-param-last.md
   * @see @typescript-eslint/default-param-last
   */
  'default-param-last': hasTypeScript ? 'off' : 'error',

  /**
   * @see https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/dot-notation.md
   * @see @typescript-eslint/dot-notation
   */
  'dot-notation': hasTypeScript ? 'off' : 'warn',

  /**
   * @see https://eslint.org/docs/rules/no-empty-function
   * @see @typescript-eslint/no-empty-function
   */
  'no-empty-function': hasTypeScript ? 'off' : 'error',

  /**
   * always off because it expects literally every number to be assigned to
   * a variable before
   *
   * @see https://eslint.org/docs/rules/no-magic-numbers
   * @see @typescript-eslint/no-magic-numbers
   */
  'no-magic-numbers': 'off',

  /**
   * @see https://eslint.org/docs/rules/no-return-await
   * @see @typescript-eslint/no-return-await
   */
  'no-return-await': hasTypeScript ? 'off' : 'error',

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

  /**
   * prevents using `async` without `await`
   *
   * @see https://eslint.org/docs/rules/require-await
   * @see @typescript-eslint/require-await
   */
  'require-await': hasTypeScript ? 'off' : 'error',
});

const strictModeRules = {
  /**
   * enables/disables strict mode
   *
   * without effect since index declares parserOptions.sourceType to module
   *
   * @see https://eslint.org/docs/rules/strict
   */
  strict: 'off',
};

/**
 * @see https://eslint.org/docs/rules/#variables
 */
const getVariableRules = ({ hasTypeScript }) => ({
  /**
   * off because required to escape scope
   *
   * @see https://eslint.org/docs/rules/init-declarations
   */
  'init-declarations': 'off',

  /**
   * off because opinionated
   *
   * @see https://eslint.org/docs/rules/no-delete-var
   */
  'no-delete-var': 'off',

  /**
   * disallows labels that are variable names
   *
   * @see https://eslint.org/docs/rules/no-label-var
   */
  'no-label-var': 'error',

  /**
   * disallows usage of specific globals
   *
   * @see https://eslint.org/docs/rules/no-restricted-globals
   */
  'no-restricted-globals': ['error'].concat(restrictedGlobals),

  /**
   * off because opinionated
   *
   * @see https://eslint.org/docs/rules/no-shadow
   */
  'no-shadow': 'off',

  /**
   * disallows shadowing restricted names
   *
   * @see https://eslint.org/docs/rules/no-shadow-restricted-names
   */
  'no-shadow-restricted-names': 'error',

  /**
   * disallow using undefined variables
   *
   * @see https://eslint.org/docs/rules/no-undef
   */
  'no-undef': hasTypeScript ? 'off' : 'error',

  /**
   * disallows declaring new variables with `undefined` as explicit value
   *
   * @see https://eslint.org/docs/rules/no-undef-init
   */
  'no-undef-init': 'warn',

  /**
   * off because already taken care of by no-shadow-restricted-names
   *
   * @see https://eslint.org/docs/rules/no-undefined
   * @see no-shadow-restricted-names
   */
  'no-undefined': 'off',

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
});

/**
 * @see https://eslint.org/docs/rules/#stylistic-issues
 */
const getStylisticIssuesRules = ({ hasTypeScript }) => ({
  /**
   * off because handled by prettier
   *
   * @see https://eslint.org/docs/rules/array-bracket-newline
   */
  'array-bracket-newline': 'off',

  /**
   * off because handled by prettier
   *
   * @see https://eslint.org/docs/rules/array-bracket-spacing
   */
  'array-bracket-spacing': 'off',

  /**
   * off because handled by prettier
   *
   * @see https://eslint.org/docs/rules/array-element-newline
   */
  'array-element-newline': 'off',

  /**
   * off because handled by prettier
   *
   * @see https://eslint.org/docs/rules/block-spacing
   */
  'block-spacing': 'off',

  /**
   * off because handled by prettier
   *
   * @see https://eslint.org/docs/rules/brace-style
   */
  'brace-style': 'off',

  /**
   * off because opinionated
   *
   * @see https://eslint.org/docs/rules/camelcase
   */
  camelcase: 'off',

  /**
   * off because opinionated
   *
   * @see https://eslint.org/docs/rules/capitalized-comments
   */
  'capitalized-comments': 'off',

  /**
   * off because handled by prettier
   *
   * @see https://eslint.org/docs/rules/comma-dangle
   */
  'comma-dangle': 'off',

  /**
   * off because handled by prettier
   *
   * @see https://eslint.org/docs/rules/comma-spacing
   */
  'comma-spacing': 'off',

  /**
   * off because handled by prettier
   *
   * @see https://eslint.org/docs/rules/comma-style
   */
  'comma-style': 'off',

  /**
   * off because handled by prettier
   *
   * @see https://eslint.org/docs/rules/computed-property-spacing
   */
  'computed-property-spacing': 'off',

  /**
   * off because opinionated, partially outdated and individual
   *
   * @see https://eslint.org/docs/rules/consistent-this
   */
  'consistent-this': 'off',

  /**
   * off because handled by prettier
   *
   * @see https://eslint.org/docs/rules/eol-last
   */
  'eol-last': 'off',

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
   * off because arbitrary
   *
   * @see https://eslint.org/docs/rules/func-name-matching
   */
  'func-name-matching': 'off',

  /**
   * off because opinionated
   *
   * @see https://eslint.org/docs/rules/func-names
   */
  'func-names': ['warn', 'as-needed'],

  /**
   * off because opinionated
   *
   * @see https://eslint.org/docs/rules/func-style
   */
  'func-style': 'off',

  /**
   * off because handled by prettier
   *
   * @see https://eslint.org/docs/rules/function-call-argument-newline
   */
  'function-call-argument-newline': 'off',

  /**
   * off because handled by prettier
   *
   * @see https://eslint.org/docs/rules/function-paren-newline
   */
  'function-paren-newline': 'off',

  /**
   * off because opinonated
   *
   * @see https://eslint.org/docs/rules/id-denylist
   */
  'id-denylist': 'off',

  /**
   * off because too specific
   *
   * @see https://eslint.org/docs/rules/id-length
   */
  'id-length': 'off',

  /**
   * off because too specific
   *
   * @see https://eslint.org/docs/rules/id-match
   */
  'id-match': 'off',

  /**
   * off because handled by prettier
   *
   * @see https://eslint.org/docs/rules/implicit-arrow-linebreak
   */
  'implicit-arrow-linebreak': 'off',

  /**
   * off because handled by prettier
   *
   * @see https://eslint.org/docs/rules/indent
   */
  indent: 'off',

  /**
   * off because handled by prettier
   *
   * @see https://eslint.org/docs/rules/jsx-quotes
   */
  'jsx-quotes': 'off',

  /**
   * off because handled by prettier
   *
   * @see https://eslint.org/docs/rules/key-spacing
   */
  'key-spacing': 'off',

  /**
   * off because prettier takes care of that
   *
   * @see https://eslint.org/docs/rules/keyword-spacing
   * @see @typescript-eslint/keyword-spacing
   */
  'keyword-spacing': 'off',

  /**
   * off because opinionated
   *
   * @see https://eslint.org/docs/rules/line-comment-position
   */
  'line-comment-position': 'off',

  /**
   * off because handled by prettier
   *
   * @see https://eslint.org/docs/rules/linebreak-style
   */
  'linebreak-style': 'off',

  /**
   * off because opinionated
   *
   * @see https://eslint.org/docs/rules/lines-around-comment
   */
  'lines-around-comment': 'off',

  /**
   * ensures proper spacing between class members
   *
   * @see https://eslint.org/docs/rules/lines-between-class-members
   * @see @typescript-eslint/lines-between-class-members
   */
  'lines-between-class-members': hasTypeScript ? 'off' : 'warn',

  /**
   * off because opinionated
   *
   * @see https://eslint.org/docs/rules/max-depth
   */
  'max-depth': 'off',

  /**
   * off because taken care of by prettier
   *
   * @see https://eslint.org/docs/rules/max-len
   */
  'max-len': 'off',

  /**
   * off because opinionated
   *
   * @see https://eslint.org/docs/rules/max-lines
   */
  'max-lines': 'off',

  /**
   * off because opinionated
   *
   * @see https://eslint.org/docs/rules/max-lines-per-function
   */
  'max-lines-per-function': 'off',

  /**
   * off because opinionated
   *
   * @see https://eslint.org/docs/rules/max-nested-callbacks
   */
  'max-nested-callbacks': 'off',

  /**
   * off because technically nice, although individual
   *
   * @see https://eslint.org/docs/rules/max-params
   */
  'max-params': 'off',

  /**
   * off because opinionated
   *
   * @see https://eslint.org/docs/rules/max-statements
   */
  'max-statements': 'off',

  /**
   * off because handled by prettier to some degree
   *
   * @see https://eslint.org/docs/rules/max-statements-per-line
   */
  'max-statements-per-line': 'off',

  /**
   * off because opinionated
   *
   * @see https://eslint.org/docs/rules/multiline-comment-style
   */
  'multiline-comment-style': 'off',

  /**
   * off because handled by prettier
   *
   * @see https://eslint.org/docs/rules/multiline-ternary
   */
  'multiline-ternary': 'off',

  /**
   * expects instance creations to begin with a capital letter
   *
   * @see https://eslint.org/docs/rules/new-cap
   */
  'new-cap': 'warn',

  /**
   * off because handled by prettier
   *
   * @see https://eslint.org/docs/rules/new-parens
   */
  'new-parens': 'off',

  /**
   * off because handled by prettier
   *
   * @see https://eslint.org/docs/rules/newline-per-chained-call
   */
  'newline-per-chained-call': 'off',

  /**
   * @see https://eslint.org/docs/rules/no-array-constructor
   * @see @typescript-eslint/no-array-constructor
   */
  'no-array-constructor': hasTypeScript ? 'off' : 'error',

  /**
   * prevents accidental uses of bitwise operators
   *
   * @see https://eslint.org/docs/rules/no-bitwise
   */
  'no-bitwise': 'warn',

  /**
   * off because opinionated although rarely used anyways
   *
   * @see https://eslint.org/docs/rules/no-continue
   */
  'no-continue': 'off',

  /**
   * off because opinionated
   *
   * @see https://eslint.org/docs/rules/no-inline-comments
   */
  'no-inline-comments': 'off',

  /**
   * prefer `else if` over `else { if (condition )}`
   *
   * @see https://eslint.org/docs/rules/no-lonely-if
   */
  'no-lonely-if': 'warn',

  /**
   * @see https://eslint.org/docs/rules/no-mixed-operators
   */
  'no-mixed-operators': [
    'warn',
    {
      allowSamePrecedence: false,
      groups: [
        ['&', '|', '^', '~', '<<', '>>', '>>>'],
        ['==', '!=', '===', '!==', '>', '>=', '<', '<='],
        ['&&', '||'],
        ['in', 'instanceof'],
      ],
    },
  ],

  /**
   * off because handled by prettier
   *
   * @see https://eslint.org/docs/rules/no-mixed-spaces-and-tabs
   */
  'no-mixed-spaces-and-tabs': 'off',

  /**
   * prefer declaring one variable at a time, also bug prone
   *
   * @see https://eslint.org/docs/rules/no-multi-assign
   */
  'no-multi-assign': 'error',

  /**
   * off because handled by prettier
   *
   * @see https://eslint.org/docs/rules/no-multiple-empty-lines
   */
  'no-multiple-empty-lines': 'off',

  /**
   * prefer `if(true) {} else` flows
   *
   * @see https://eslint.org/docs/rules/no-negated-condition
   */
  'no-negated-condition': 'error',

  /**
   * off because opinionated
   *
   * @see https://eslint.org/docs/rules/no-nested-ternary
   */
  'no-nested-ternary': 'off',

  /**
   * prevents calling `new Object()`
   *
   * @see https://eslint.org/docs/rules/no-new-object
   */
  'no-new-object': 'error',

  /**
   * off because opinionated
   *
   * @see https://eslint.org/docs/rules/no-plusplus
   */
  'no-plusplus': 'off',

  /**
   * off because opinionated
   *
   * @see https://eslint.org/docs/rules/no-restricted-syntax
   */
  'no-restricted-syntax': 'off',

  /**
   * off because opinionated
   *
   * @see https://eslint.org/docs/rules/no-tabs
   */
  'no-tabs': 'off',

  /**
   * off because pointless
   *
   * @see https://eslint.org/docs/rules/no-ternary
   */
  'no-ternary': 'off',

  /**
   * off because handled by prettier
   *
   * @see https://eslint.org/docs/rules/no-trailing-spaces
   */
  'no-trailing-spaces': 'off',

  /**
   * off because opinionated and sometimes still needed for copies
   *
   * @see https://eslint.org/docs/rules/no-underscore-dangle
   */
  'no-underscore-dangle': 'off',

  /**
   * prefer foo === bar over foo === bar ? true : false
   *
   * @see https://eslint.org/docs/rules/no-unneeded-ternary
   */
  'no-unneeded-ternary': 'warn',

  /**
   * off because handled by prettier
   *
   * @see https://eslint.org/docs/rules/no-whitespace-before-property
   */
  'no-whitespace-before-property': 'off',

  /**
   * off because handled by prettier
   *
   * @see https://eslint.org/docs/rules/nonblock-statement-body-position
   */
  'nonblock-statement-body-position': 'off',

  /**
   * off because handled by prettier
   *
   * @see https://eslint.org/docs/rules/object-curly-newline
   */
  'object-curly-newline': 'off',

  /**
   * off because handled by prettier
   *
   * @see https://eslint.org/docs/rules/object-curly-spacing
   */
  'object-curly-spacing': 'off',

  /**
   * off because handled by prettier
   *
   * @see https://eslint.org/docs/rules/object-property-newline
   */
  'object-property-newline': 'off',

  /**
   * always declare variables separately
   *
   * @see https://eslint.org/docs/rules/one-var
   */
  'one-var': ['warn', 'never'],

  /**
   * off because handled by prettier
   *
   * @see https://eslint.org/docs/rules/one-var-declaration-per-line
   */
  'one-var-declaration-per-line': 'off',

  /**
   * prefer `x += y` over `x = x + y`
   *
   * @see https://eslint.org/docs/rules/operator-assignment
   */
  'operator-assignment': ['warn', 'always'],

  /**
   * off because handled by prettier
   *
   * @see https://eslint.org/docs/rules/operator-linebreak
   */
  'operator-linebreak': 'off',

  /**
   * off because handled by prettier
   *
   * @see https://eslint.org/docs/rules/padded-blocks
   */
  'padded-blocks': 'off',

  /**
   * off because too opinionated
   *
   * @see https://eslint.org/docs/rules/padding-line-between-statements
   */
  'padding-line-between-statements': 'off',

  /**
   * prefer ** over Math.pow
   *
   * @see https://eslint.org/docs/rules/prefer-exponentiation-operator
   */
  'prefer-exponentiation-operator': 'warn',

  /**
   * prefer spreading over Object.assign
   *
   * @see https://eslint.org/docs/rules/prefer-object-spread
   */
  'prefer-object-spread': 'warn',

  /**
   * off because handled by prettier
   *
   * @see https://eslint.org/docs/rules/quote-props
   */
  'quote-props': 'off',

  /**
   * off because handled by prettier
   *
   * @see https://eslint.org/docs/rules/quotes
   */
  quotes: 'off',

  /**
   * off because handled by prettier
   *
   * @see https://eslint.org/docs/rules/semi
   */
  semi: 'off',

  /**
   * off because handled by prettier
   *
   * @see https://eslint.org/docs/rules/semi-spacing
   */
  'semi-spacing': 'off',

  /**
   * off because handled by prettier
   *
   * @see https://eslint.org/docs/rules/semi-style
   */
  'semi-style': 'off',

  /**
   * off because taken care of by sort-keys-fix
   *
   * @see https://eslint.org/docs/rules/sort-keys
   * @see sort-keys-fix/sort-keys-fix
   */
  'sort-keys': 'off',

  /**
   * off because opinionated and you usually don't assign multiple variables
   * anymore nowadays anyways
   *
   * @see https://eslint.org/docs/rules/sort-vars
   */
  'sort-vars': 'off',

  /**
   * off because handled by prettier
   *
   * @see https://eslint.org/docs/rules/space-before-blocks
   */
  'space-before-blocks': 'off',

  /**
   * off because handled by prettier
   *
   * @see https://eslint.org/docs/rules/space-before-function-paren
   */
  'space-before-function-paren': 'off',

  /**
   * off because handled by prettier
   *
   * @see https://eslint.org/docs/rules/space-in-parens
   */
  'space-in-parens': 'off',

  /**
   * off because handled by prettier
   *
   * @see https://eslint.org/docs/rules/space-infix-ops
   */
  'space-infix-ops': 'off',

  /**
   * off because handled by prettier
   *
   * @see https://eslint.org/docs/rules/space-unary-ops
   */
  'space-unary-ops': 'off',

  /**
   * @see https://eslint.org/docs/rules/spaced-comment
   */
  'spaced-comment': ['warn', 'always'],

  /**
   * off because handled by prettier
   *
   * @see https://eslint.org/docs/rules/switch-colon-spacing
   */
  'switch-colon-spacing': 'off',

  /**
   * off because handled by prettier
   *
   * @see https://eslint.org/docs/rules/template-tag-spacing
   */
  'template-tag-spacing': 'off',

  /**
   * off because handled by prettier
   *
   * @see https://eslint.org/docs/rules/unicode-bom
   */
  'unicode-bom': 'off',
  /**
   * prefer using isNaN over == NaN
   *
   * off because taken care of by unicorn/prefer-number-properties
   *
   * @see https://eslint.org/docs/rules/use-isnan
   * @see unicorn/prefer-number-properties
   */
  'use-isnan': 'off',

  /**
   * off because handled by prettier
   *
   * @see https://eslint.org/docs/rules/wrap-regex
   */
  'wrap-regex': 'off',
});

/**
 * @see https://eslint.org/docs/rules/#ecmascript-6
 */
const getES6Rules = ({ hasTypeScript }) => ({
  /**
   * off because handled by prettier
   *
   * @see https://eslint.org/docs/rules/arrow-body-style
   */
  'arrow-body-style': 'off',

  /**
   * off because handled by prettier
   *
   * @see https://eslint.org/docs/rules/arrow-parens
   */
  'arrow-parens': 'off',

  /**
   * off because handled by prettier
   *
   * @see https://eslint.org/docs/rules/arrow-spacing
   */
  'arrow-spacing': 'off',

  /**
   * @see https://eslint.org/docs/rules/constructor-super
   */
  'constructor-super': hasTypeScript ? 'off' : 'error',

  /**
   * off because handled by prettier
   *
   * @see https://eslint.org/docs/rules/generator-star-spacing
   */
  'generator-star-spacing': 'off',

  /**
   * disallows reassigning a class
   *
   * @see https://eslint.org/docs/rules/no-class-assign
   */
  'no-class-assign': 'error',

  /**
   * off because handled by prettier
   *
   * @see https://eslint.org/docs/rules/no-confusing-arrow
   */
  'no-confusing-arrow': 'off',

  /**
   * disallows trying to overwrite a constant
   *
   * @see https://eslint.org/docs/rules/no-const-assign
   */
  'no-const-assign': hasTypeScript ? 'off' : 'error',

  /**
   * @see https://eslint.org/docs/rules/no-dupe-class-members
   * @see @typescript-eslint/no-dupe-class-members
   */
  'no-dupe-class-members': hasTypeScript ? 'off' : 'error',

  /**
   * off because handled by import/no-duplicates
   *
   * @see https://eslint.org/docs/rules/no-duplicate-imports
   * @see import/no-duplicates
   */
  'no-duplicate-imports': 'off',

  /**
   * disallow calling `new Symbol()`
   *
   * off because handled by unicorn/new-for-builtins
   *
   * @see https://eslint.org/docs/rules/no-new-symbol
   * @see unicorn/new-for-builtins
   */
  'no-new-symbol': 'off',

  /**
   * off because codebase specific
   *
   * @see https://eslint.org/docs/rules/no-restricted-exports
   */
  'no-restricted-exports': 'off',

  /**
   * off because codebase specific
   *
   * @see https://eslint.org/docs/rules/no-restricted-imports
   */
  'no-restricted-imports': 'off',

  /**
   * prevents using `this` before calling `super`
   *
   * @see https://eslint.org/docs/rules/no-this-before-super
   */
  'no-this-before-super': hasTypeScript ? 'off' : 'error',

  /**
   * disallows unnecessary usage of computed property keys
   *
   * @see https://eslint.org/docs/rules/no-useless-computed-key
   */
  'no-useless-computed-key': 'warn',

  /**
   * prevents empty/useless constructors
   *
   * @see https://eslint.org/docs/rules/no-useless-constructor
   * @see @typescript-eslint/no-useless-constructor
   */
  'no-useless-constructor': hasTypeScript ? 'off' : 'warn',

  /**
   * prevents useless renames in imports/exports/destructuring assignments
   *
   * @see https://eslint.org/docs/rules/no-useless-rename
   */
  'no-useless-rename': 'warn',

  /**
   * prevents usage of `var`
   *
   * @see https://eslint.org/docs/rules/no-var
   */
  'no-var': 'error',

  /**
   * prefer object shorthand
   *
   * @see https://eslint.org/docs/rules/object-shorthand
   */
  'object-shorthand': 'warn',

  // prefer-arrow-callback is in `safePrettierOverrides`

  /**
   * does this really need a comment?
   *
   * @see https://eslint.org/docs/rules/prefer-const
   */
  'prefer-const': 'warn',

  /**
   * prefer destructuring :shrug:
   *
   * @see https://eslint.org/docs/rules/prefer-destructuring
   */
  'prefer-destructuring': 'warn',

  /**
   * disallow parseInting certain values
   *
   * @see https://eslint.org/docs/rules/prefer-numeric-literals
   */
  'prefer-numeric-literals': 'warn',

  /**
   * prefer ...rest for variadic functions
   *
   * @see https://eslint.org/docs/rules/prefer-rest-params
   */
  'prefer-rest-params': 'error',

  /**
   * prefer spreading where possible
   *
   * @see https://eslint.org/docs/rules/prefer-spread
   */
  'prefer-spread': 'error',

  /**
   * prefer template literals over string concat
   *
   * @see https://eslint.org/docs/rules/prefer-template
   */
  'prefer-template': 'warn',

  /**
   * generators must have yield keyword
   *
   * @see https://eslint.org/docs/rules/require-yield
   */
  'require-yield': 'error',

  /**
   * off because handled by prettier
   *
   * @see https://eslint.org/docs/rules/rest-spread-spacing
   */
  'rest-spread-spacing': 'off',

  /**
   * off because handled by import/order
   *
   * @see https://eslint.org/docs/rules/sort-imports
   * @see import/order
   */
  'sort-imports': 'off',

  /**
   * requires description on Symbol creation
   *
   * @see https://eslint.org/docs/rules/symbol-description
   */
  'symbol-description': 'error',

  /**
   * off because handled by prettier
   *
   * @see https://eslint.org/docs/rules/template-curly-spacing
   */
  'template-curly-spacing': 'off',

  /**
   * off because handled by prettier
   *
   * @see https://eslint.org/docs/rules/yield-star-spacing
   */
  'yield-star-spacing': 'off',
});

const safePrettierOverrides = {
  /**
   * off because handled by prettier
   *
   * @see https://eslint.org/docs/rules/prefer-arrow-callback
   */
  'prefer-arrow-callback': 'warn',
};

module.exports = {
  createEslintCoreRules,
  getBestPractices,
  getES6Rules,
  getPossibleErrorRules,
  getStylisticIssuesRules,
  getVariableRules,
  prettierRules,
  restrictedGlobals,
  safePrettierOverrides,
  strictModeRules,
};
