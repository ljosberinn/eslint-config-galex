import type { RulesCreator, RulesetCreator } from '../types';

export const createPromisePlugin: RulesetCreator = ({
  rules: customRules,
  ...dependencies
}) => ({
  ...createPromiseRules(dependencies),
  ...customRules,
});

/**
 * @see https://github.com/eslint-community/eslint-plugin-promise
 */
export const createPromiseRules: RulesCreator = ({
  typescript: { hasTypeScript },
}) => ({
  /**
   * off because superseded by `promise/catch-or-return`
   *
   * @see https://github.com/eslint-community/eslint-plugin-promise/blob/main/docs/rules/always-return.md
   * @see promise/catch-or-return
   */
  'promise/always-return': 'off',

  /**
   * off because too opinionated; not gonna pull in a dependency just for that
   *
   * @see https://github.com/eslint-community/eslint-plugin-promise/blob/main/docs/rules/avoid-new.md
   */
  'promise/avoid-new': 'off',

  /**
   * enforces that all promises either be returned or handled
   *
   * @see https://github.com/eslint-community/eslint-plugin-promise/blob/main/docs/rules/catch-or-return.md
   */
  'promise/catch-or-return': hasTypeScript
    ? 'off'
    : [
        'error',
        {
          allowFinally: true,
          allowThen: true,
        },
      ],

  /**
   * off because too opinionated; not gonna pull in a dependency just for that
   *
   * @see https://github.com/eslint-community/eslint-plugin-promise/blob/main/docs/rules/no-callback-in-promise.md
   */
  'promise/no-callback-in-promise': 'off',

  /**
   * disallows creating new promises with multiple resolve paths
   *
   * @see https://github.com/eslint-community/eslint-plugin-promise/blob/main/docs/rules/no-multiple-resolved.md
   */
  'promise/no-multiple-resolved': 'warn',

  /**
   * off because only appliesto ES5
   *
   * @see https://github.com/eslint-community/eslint-plugin-promise/blob/main/docs/rules/no-native.md
   */

  'promise/no-native': 'off',
  /**
   * prefer async/await; use Promise.all where possible
   *
   * @see https://github.com/eslint-community/eslint-plugin-promise/blob/main/docs/rules/no-nesting.md
   */
  'promise/no-nesting': 'warn',

  /**
   * use Promise.resolve/Promise.reject when possible
   *
   * @see https://github.com/eslint-community/eslint-plugin-promise/blob/main/docs/rules/no-new-statics.md
   */
  'promise/no-new-statics': 'error',

  /**
   * enforces not using promises in callbacks
   *
   * @see https://github.com/eslint-community/eslint-plugin-promise/blob/main/docs/rules/no-promise-in-callback.md
   */
  'promise/no-promise-in-callback': 'warn',

  /**
   * disallows returning in finally as its unhandled
   *
   * @see https://github.com/eslint-community/eslint-plugin-promise/blob/main/docs/rules/no-return-in-finally.md
   */
  'promise/no-return-in-finally': 'warn',

  /**
   * avoid wrapping values in Promises when not needed
   *
   * @see https://github.com/eslint-community/eslint-plugin-promise/blob/main/docs/rules/no-return-wrap.md
   */
  'promise/no-return-wrap': 'error',

  /**
   * disallows renaming callbacks within `new Promise`
   *
   * @see https://github.com/eslint-community/eslint-plugin-promise/blob/main/docs/rules/param-names.md
   */
  'promise/param-names': 'warn',

  /**
   * try to promisify functions instead of passing callbacks around
   *
   * @see https://github.com/eslint-community/eslint-plugin-promise/blob/main/docs/rules/prefer-await-to-callbacks.md
   */
  'promise/prefer-await-to-callbacks': 'warn',

  /**
   * prefer using async/await
   *
   * @see https://github.com/eslint-community/eslint-plugin-promise/blob/main/docs/rules/prefer-await-to-then.md
   */
  'promise/prefer-await-to-then': 'warn',

  /**
   * ensures correct amount of required params passed to promises
   *
   * @see https://github.com/eslint-community/eslint-plugin-promise/blob/main/docs/rules/valid-params.md
   */
  'promise/valid-params': hasTypeScript ? 'off' : 'error',
});
