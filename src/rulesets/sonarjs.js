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
   * prevents unecessary arguments
   *
   * off when using typescript, already taken care of
   *
   * @see https://github.com/SonarSource/eslint-plugin-sonarjs/blob/master/docs/rules/no-extra-arguments.md
   */
  'sonarjs/no-extra-arguments': hasTypeScript ? 'off' : 'error',

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
   * prevents unecessary complexity
   *
   * @see https://github.com/SonarSource/eslint-plugin-sonarjs/blob/master/docs/rules/no-inverted-boolean-check.md
   */
  'sonarjs/no-inverted-boolean-check': 'error',

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
