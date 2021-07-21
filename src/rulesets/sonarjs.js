/* eslint-disable inclusive-language/use-inclusive-words */

/**
 * @param {{
 *  typescript: {
 *    hasTypeScript: boolean;
 *  };
 *  rules?: Record<string, string | [string, string | object];
 * }} options
 */
const createSonarjsRules = ({ typescript, rules: customRules = {} }) => ({
  ...getSonarJsRules({ typescript }),
  ...customRules,
});

/**
 * @see https://github.com/SonarSource/eslint-plugin-sonarjs
 */
const getSonarJsRules = ({ typescript: { hasTypeScript } }) => ({
  /**
   * prevents creeping complexity. consider alternative approach.
   *
   * @default 15
   *
   * @see https://github.com/SonarSource/eslint-plugin-sonarjs/blob/master/docs/rules/cognitive-complexity.md
   */
  'sonarjs/cognitive-complexity': 'warn',

  /**
   * requires exhaustive elseif-else
   *
   * @see https://github.com/SonarSource/eslint-plugin-sonarjs/blob/master/docs/rules/elseif-without-else.md
   */
  'sonarjs/elseif-without-else': 'warn',

  /**
   * prevents endless switches. consider alternative approach. limit upped to 15.
   *
   * @default 15
   * @default 10
   *
   * @see https://github.com/SonarSource/eslint-plugin-sonarjs/blob/master/docs/rules/max-switch-cases.md
   */
  'sonarjs/max-switch-cases': ['error', 15],

  /**
   * prevents duplicate branches in control statements
   *
   * @see https://github.com/SonarSource/eslint-plugin-sonarjs/blob/master/docs/rules/no-all-duplicated-branches.md
   */
  'sonarjs/no-all-duplicated-branches': 'error',

  /**
   * merges nested ifs that have nothing in between
   *
   * @see https://github.com/SonarSource/eslint-plugin-sonarjs/blob/master/docs/rules/no-collapsible-if.md
   */
  'sonarjs/no-collapsible-if': 'error',

  /**
   * prevents impossible or implausible array length checks
   *
   * @see https://github.com/SonarSource/eslint-plugin-sonarjs/blob/master/docs/rules/no-collection-size-mischeck.md
   */
  'sonarjs/no-collection-size-mischeck': 'warn',

  /**
   * prevents use of strings that should be extracted as constants
   *
   * @see https://github.com/SonarSource/eslint-plugin-sonarjs/blob/master/docs/rules/no-duplicate-string.md
   */
  'sonarjs/no-duplicate-string': 'error',

  /**
   * prevents code duplication in control statements
   *
   * @see https://github.com/SonarSource/eslint-plugin-sonarjs/blob/master/docs/rules/no-duplicated-branches.md
   */
  'sonarjs/no-duplicated-branches': 'error',

  /**
   * prevents accidental unconditional overrides of a previously hardcoded value
   *
   * @see https://github.com/SonarSource/eslint-plugin-sonarjs/blob/master/docs/rules/no-element-overwrite.md
   */
  'sonarjs/no-element-overwrite': 'error',

  /**
   * prevents accessing empty collections
   *
   * off with TS as it handles this itself
   *
   * @see https://github.com/SonarSource/eslint-plugin-sonarjs/blob/master/docs/rules/no-empty-collection.md
   */
  'sonarjs/no-empty-collection': hasTypeScript ? 'off' : 'warn',

  /**
   * prevents unecessary arguments
   *
   * off when using typescript, already taken care of
   *
   * @see https://github.com/SonarSource/eslint-plugin-sonarjs/blob/master/docs/rules/no-extra-arguments.md
   */
  'sonarjs/no-extra-arguments': hasTypeScript ? 'off' : 'error',

  /**
   * Boolean expressions should not be gratuitous
   *
   * off because taken care of by `unicorn/no-lonely-if`
   *
   * @see https://github.com/SonarSource/eslint-plugin-sonarjs/blob/master/docs/rules/no-gratuitous-expressions.md
   */
  'sonarjs/no-gratuitous-expressions': 'off',

  /**
   * prevents duplicate branches
   *
   * @see https://github.com/SonarSource/eslint-plugin-sonarjs/blob/master/docs/rules/no-identical-conditions.md
   */
  'sonarjs/no-identical-conditions': 'error',

  /**
   * prevents unecessary & potentially unecessarily complex code
   *
   * @see https://github.com/SonarSource/eslint-plugin-sonarjs/blob/master/docs/rules/no-identical-expressions.md
   */
  'sonarjs/no-identical-expressions': 'error',

  /**
   * prevents duplicating function bodies
   *
   * @see https://github.com/SonarSource/eslint-plugin-sonarjs/blob/master/docs/rules/no-identical-functions.md
   */
  'sonarjs/no-identical-functions': 'error',

  /**
   * Return values from functions without side effects should not be ignored
   *
   * @see https://github.com/SonarSource/eslint-plugin-sonarjs/blob/master/docs/rules/no-ignored-return.md
   */
  'sonarjs/no-ignored-return': 'warn',

  /**
   * prevents unecessary complexity
   *
   * @see https://github.com/SonarSource/eslint-plugin-sonarjs/blob/master/docs/rules/no-inverted-boolean-check.md
   */
  'sonarjs/no-inverted-boolean-check': 'error',

  /**
   * prefer not nesting switch
   *
   * @see https://github.com/SonarSource/eslint-plugin-sonarjs/blob/master/docs/rules/no-nested-switch.md
   */
  'sonarjs/no-nested-switch': 'warn',

  /**
   * prevents nesting templ literals
   *
   * off because opinitonated. not exactly a nice thing to do but... not terribly bad either
   *
   * @see https://github.com/SonarSource/eslint-plugin-sonarjs/blob/master/docs/rules/no-nested-template-literals.md
   */
  'sonarjs/no-nested-template-literals': 'off',

  /**
   * prevents unecessary loops
   *
   * @see https://github.com/SonarSource/eslint-plugin-sonarjs/blob/master/docs/rules/no-one-iteration-loop.md
   */
  'sonarjs/no-one-iteration-loop': 'error',

  /**
   * prevents use of `if(result === true)` in favor of `if(result)`
   *
   * @see https://github.com/SonarSource/eslint-plugin-sonarjs/blob/master/docs/rules/no-redundant-boolean.md
   */
  'sonarjs/no-redundant-boolean': 'error',

  /**
   * prevents unecessary `return`/`break`/`continue` statements
   *
   * @see https://github.com/SonarSource/eslint-plugin-sonarjs/blob/master/docs/rules/no-redundant-jump.md
   */
  'sonarjs/no-redundant-jump': 'error',

  /**
   * off because taken care of by prettier
   *
   * @see https://github.com/SonarSource/eslint-plugin-sonarjs/blob/master/docs/rules/no-same-line-conditional.md
   */
  'sonarjs/no-same-line-conditional': 'off',

  /**
   * prevents unecessary complexity
   *
   * @see https://github.com/SonarSource/eslint-plugin-sonarjs/blob/master/docs/rules/no-small-switch.md
   */
  'sonarjs/no-small-switch': 'warn',

  /**
   * prevents unecessary complexity
   *
   * @see https://github.com/SonarSource/eslint-plugin-sonarjs/blob/master/docs/rules/no-unused-collection.md
   */
  'sonarjs/no-unused-collection': 'error',

  /**
   * prevents bugs by expecting a return type
   *
   * @see https://github.com/SonarSource/eslint-plugin-sonarjs/blob/master/docs/rules/no-use-of-empty-return-value.md
   */
  'sonarjs/no-use-of-empty-return-value': 'error',

  /**
   * prevents unecessary complexity
   *
   * @see https://github.com/SonarSource/eslint-plugin-sonarjs/blob/master/docs/rules/no-useless-catch.md
   */
  'sonarjs/no-useless-catch': 'error',

  /**
   * prevents usage of possibly unintended "operators"
   *
   * @see https://github.com/SonarSource/eslint-plugin-sonarjs/blob/master/docs/rules/non-existent-operator.md
   */
  'sonarjs/non-existent-operator': 'warn',

  /**
   * prevents unecessary code
   *
   * warning because autofixable
   *
   * @see https://github.com/SonarSource/eslint-plugin-sonarjs/blob/master/docs/rules/prefer-immediate-return.md
   */
  'sonarjs/prefer-immediate-return': 'warn',

  /**
   * prevents bad practice
   *
   * @see https://github.com/SonarSource/eslint-plugin-sonarjs/blob/master/docs/rules/prefer-object-literal.md
   */
  'sonarjs/prefer-object-literal': 'error',

  /**
   * prevents unecessary complexity
   *
   * @see https://github.com/SonarSource/eslint-plugin-sonarjs/blob/master/docs/rules/prefer-single-boolean-return.md
   */
  'sonarjs/prefer-single-boolean-return': 'error',

  /**
   * prefers `while` over `for` for "infinite" loops
   *
   * @see https://github.com/SonarSource/eslint-plugin-sonarjs/blob/master/docs/rules/prefer-while.md
   */
  'sonarjs/prefer-while': 'error',
});

module.exports = {
  createSonarjsRules,
  getSonarJsRules,
};
