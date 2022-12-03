import type { RulesetCreator } from '../types';

export const createEtcPlugin: RulesetCreator = ({
  rules: customRules,
  ...dependencies
}) => ({
  ...createEtcRules(dependencies),
  ...customRules,
});

/**
 * @see https://github.com/cartant/eslint-plugin-etc
 *
 */
export const createEtcRules: RulesetCreator = ({
  typescript: { hasTypeScript },
}) => ({
  /**
   * forbids the assignment of returned, mutated arrays.
   *
   * @see https://github.com/cartant/eslint-plugin-etc/blob/main/docs/rules/no-assign-mutated-array.md
   */
  'etc/no-assign-mutated-array': 'error',

  /**
   * forbids commented-out code.
   *
   * @see https://github.com/cartant/eslint-plugin-etc/blob/main/docs/rules/no-commented-out-code.md
   */
  'etc/no-commented-out-code': 'warn',

  /**
   * forbids the use of deprecated APIs.
   *
   * @see https://github.com/cartant/eslint-plugin-etc/blob/main/docs/rules/no-deprecated.md
   */
  'etc/no-deprecated': hasTypeScript ? 'off' : 'warn',

  /**
   * forbids the use of internal APIs.
   *
   * @see https://github.com/cartant/eslint-plugin-etc/blob/main/docs/rules/no-internal.md
   */
  'etc/no-internal': 'warn',

  /**
   * Forbids type parameters without inference sites and type parameters that don't add type safety to declarations.
   *
   * @see https://github.com/cartant/eslint-plugin-etc/blob/main/docs/rules/no-misused-generics.md
   */
  'etc/no-misused-generics': 'warn',

  /**
   * forbids the assignment of returned, mutated arrays.
   *
   * @see https://github.com/cartant/eslint-plugin-etc/blob/main/docs/rules/no-assign-mutated-array.md
   */
  'etc/underscore-internal': 'warn',
});
