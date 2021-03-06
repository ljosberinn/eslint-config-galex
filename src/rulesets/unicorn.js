/* eslint-disable inclusive-language/use-inclusive-words */

const { rules: allPrettierRules } = require('eslint-config-prettier');

const prettierUnicornRules = Object.fromEntries(
  Object.entries(allPrettierRules).filter(([key]) => key.startsWith('unicorn/'))
);

/**
 * @param {{
 *  typescript: {
 *    hasTypeScript: boolean;
 *  };
 *  react: {
 *    hasReact: boolean;
 *  }
 *  rules?: Record<string, string | [string, string | object];
 * }} options
 */
const createUnicornRules = ({
  typescript,
  react,
  rules: customRules = {},
}) => ({
  ...getUnicornRules({ react, typescript }),
  ...prettierUnicornRules,
  ...customRules,
});

/**
 * @see https://github.com/sindresorhus/eslint-plugin-unicorn
 */
const getUnicornRules = ({
  typescript: { hasTypeScript },
  react: { hasReact },
}) => ({
  /**
   * improves regex
   *
   * @see https://github.com/sindresorhus/eslint-plugin-unicorn/blob/master/docs/rules/better-regex.md
   */
  'unicorn/better-regex': 'error',

  /**
   * disallows (entirely) renaming the error in Promise.catch & try/catch
   *
   * @see https://github.com/sindresorhus/eslint-plugin-unicorn/blob/master/docs/rules/catch-error-name.md
   */
  'unicorn/catch-error-name': 'error',

  /**
   * enforces usage of destructured variables over re-accessing them
   *
   * @see https://github.com/sindresorhus/eslint-plugin-unicorn/blob/master/docs/rules/consistent-destructuring.md
   */
  'unicorn/consistent-destructuring': 'error',

  /**
   * enforces placing functions as close to the top level as possible
   *
   * @see https://github.com/sindresorhus/eslint-plugin-unicorn/blob/master/docs/rules/consistent-function-scoping.md
   */
  'unicorn/consistent-function-scoping': 'error',

  /**
   * enforce correct error subclassing when extending native errors
   *
   * @see https://github.com/sindresorhus/eslint-plugin-unicorn/blob/master/docs/rules/custom-error-definition.md
   */
  'unicorn/custom-error-definition': 'warn',

  /**
   * off because prettier territory
   *
   * @see https://github.com/sindresorhus/eslint-plugin-unicorn/blob/master/docs/rules/empty-brace-spaces.md
   */
  'unicorn/empty-brace-spaces': 'off',

  /**
   * enforce passing a message value when throwing an built-in error
   *
   * @see https://github.com/sindresorhus/eslint-plugin-unicorn/blob/master/docs/rules/error-message.md
   */
  'unicorn/error-message': 'error',

  /**
   * require escape sequences to use uppercase values
   *
   * @see https://github.com/sindresorhus/eslint-plugin-unicorn/blob/master/docs/rules/escape-case.md
   */
  'unicorn/escape-case': 'error',

  /**
   * off because currently no use-case
   *
   * @see https://github.com/sindresorhus/eslint-plugin-unicorn/blob/master/docs/rules/expiring-todo-comments.md
   */
  'unicorn/expiring-todo-comments': 'off',

  /**
   * enforces `Array.length === 0` instead of `Array.length`
   *
   * @see https://github.com/sindresorhus/eslint-plugin-unicorn/blob/master/docs/rules/explicit-length-check.md
   */
  'unicorn/explicit-length-check': 'error',

  /**
   * off because too opinionated
   *
   * @see https://github.com/sindresorhus/eslint-plugin-unicorn/blob/master/docs/rules/filename-case.md
   */
  'unicorn/filename-case': 'off',

  /**
   * enforce importing index files with .
   *
   * @see https://github.com/sindresorhus/eslint-plugin-unicorn/blob/master/docs/rules/import-index.md
   */
  'unicorn/import-index': 'error',

  /**
   * off because situational
   *
   * @see https://github.com/sindresorhus/eslint-plugin-unicorn/blob/master/docs/rules/import-style.md
   */
  'unicorn/import-style': 'off',

  /**
   * enforces `new` for builtins
   *
   * @see https://github.com/sindresorhus/eslint-plugin-unicorn/blob/master/docs/rules/new-for-builtins.md
   */
  'unicorn/new-for-builtins': 'error',

  /**
   * disallows disabling eslint entirely
   *
   * @see https://github.com/sindresorhus/eslint-plugin-unicorn/blob/master/docs/rules/no-abusive-eslint-disable.md
   */
  'unicorn/no-abusive-eslint-disable': 'error',

  /**
   * off because TS tells you where this is possible and where not
   *
   * @see https://github.com/sindresorhus/eslint-plugin-unicorn/blob/master/docs/rules/no-array-callback-reference.md
   */
  'unicorn/no-array-callback-reference': 'off',

  /**
   * off because nonsense
   *
   * @see https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/no-array-for-each.md
   */
  'unicorn/no-array-for-each': 'off',

  /**
   * combines multiple array.push calls into one where possible
   *
   * @see https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/no-array-push-push.md
   */
  'unicorn/no-array-push-push': 'warn',

  /**
   * off because bad take
   *
   * @see https://github.com/sindresorhus/eslint-plugin-unicorn/blob/master/docs/rules/no-array-reduce.md
   */
  'unicorn/no-array-reduce': 'off',

  /**
   * disallow leading/trailing space between console.log parameters
   *
   * @see https://github.com/sindresorhus/eslint-plugin-unicorn/blob/master/docs/rules/no-console-spaces.md
   */
  'unicorn/no-console-spaces': 'error',

  /**
   * no `for` loop when you can `for-of` instead
   *
   * @see https://github.com/sindresorhus/eslint-plugin-unicorn/blob/master/docs/rules/no-for-loop.md
   */
  'unicorn/no-for-loop': hasTypeScript ? 'off' : 'warn',

  /**
   * use unicode escapes instead of hexadecimal escales
   *
   * @see https://github.com/sindresorhus/eslint-plugin-unicorn/blob/master/docs/rules/no-hex-escape.md
   */
  'unicorn/no-hex-escape': 'error',

  /**
   * use `Array.isArray` instead of `instanceof Array`
   *
   * @see https://github.com/sindresorhus/eslint-plugin-unicorn/blob/master/docs/rules/no-array-instanceof.md
   */
  'unicorn/no-instanceof-array': 'error',

  /**
   * ensures not using keywords as variable prefix
   *
   * @see https://github.com/sindresorhus/eslint-plugin-unicorn/blob/master/docs/rules/no-keyword-prefix.md
   */
  'unicorn/no-keyword-prefix': hasReact ? 'off' : 'warn',

  /**
   * collapses nested ifs
   *
   * @see https://github.com/sindresorhus/eslint-plugin-unicorn/blob/master/docs/rules/no-lonely-if.md
   * @see https://eslint.org/docs/rules/no-lonely-if
   */
  'unicorn/no-lonely-if': 'warn',

  /**
   * off because prettier takes care of it
   *
   * @see https://github.com/sindresorhus/eslint-plugin-unicorn/blob/master/docs/rules/no-nested-ternary.md
   */
  'unicorn/no-nested-ternary': 'off',

  /**
   * disallows `new Array()`
   *
   * @see https://github.com/sindresorhus/eslint-plugin-unicorn/blob/master/docs/rules/no-new-array.md
   * @see no-array-constructor
   */
  'unicorn/no-new-array': 'error',

  /**
   * use Buffer.from/Buffer.alloc instead of new Buffer (deprecated)
   *
   * @see https://github.com/sindresorhus/eslint-plugin-unicorn/blob/master/docs/rules/no-new-buffer.md
   */
  'unicorn/no-new-buffer': 'error',

  /**
   * off because jesus no, bad take. null conveys meaning! hard to debug
   * unintentional undefined from intentional undefined. null declares
   * active absence.
   *
   * @see https://github.com/sindresorhus/eslint-plugin-unicorn/blob/master/docs/rules/no-null.md
   */
  'unicorn/no-null': 'off',

  /**
   * disallows using objects as default parameter
   *
   * @see https://github.com/sindresorhus/eslint-plugin-unicorn/blob/master/docs/rules/no-object-as-default-parameter.md
   */
  'unicorn/no-object-as-default-parameter': 'warn',

  /**
   * makes core rule `no-process-exit` more strict
   *
   * @see https://github.com/sindresorhus/eslint-plugin-unicorn/blob/master/docs/rules/no-process-exit.md
   */
  'unicorn/no-process-exit': 'error',

  /**
   * disallows reassigning `this` to another variable
   *
   * @see https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/no-this-assignment.md
   */
  'unicorn/no-this-assignment': 'warn',

  /**
   * prevents abusive destructuring
   *
   * @see https://github.com/sindresorhus/eslint-plugin-unicorn/blob/master/docs/rules/no-unreadable-array-destructuring.md
   */
  'unicorn/no-unreadable-array-destructuring': 'warn',

  /**
   * disallows potentially very slow regex
   *
   * @see https://github.com/sindresorhus/eslint-plugin-unicorn/blob/master/docs/rules/no-unsafe-regex.md
   */
  'unicorn/no-unsafe-regex': 'error',

  /**
   * disallows unused properties on object constants
   *
   * @see https://github.com/sindresorhus/eslint-plugin-unicorn/blob/master/docs/rules/no-unused-properties.md
   */
  'unicorn/no-unused-properties': 'warn',

  /**
   * disallows useless undefined
   *
   * @see https://github.com/sindresorhus/eslint-plugin-unicorn/blob/master/docs/rules/no-useless-undefined.md
   */
  'unicorn/no-useless-undefined': 'error',

  /**
   * enforces no usage of 1.0
   *
   * @see https://github.com/sindresorhus/eslint-plugin-unicorn/blob/master/docs/rules/no-zero-fractions.md
   */
  'unicorn/no-zero-fractions': 'error',

  /**
   * off because prettier takes care of it
   *
   * @see https://github.com/sindresorhus/eslint-plugin-unicorn/blob/master/docs/rules/number-literal-case.md
   */
  'unicorn/number-literal-case': 'off',

  /**
   * enforces consistent numeric separators style
   *
   * @see https://github.com/sindresorhus/eslint-plugin-unicorn/blob/master/docs/rules/numeric-separators-style.md
   */
  'unicorn/numeric-separators-style': 'warn',

  /**
   * prefer element.addEventListener instead of element.[event]
   *
   * @see https://github.com/sindresorhus/eslint-plugin-unicorn/blob/master/docs/rules/prefer-add-event-listener.md
   */
  'unicorn/prefer-add-event-listener': 'error',

  /**
   * prefer Array.find over alternatives doing the same with more code
   *
   * @see https://github.com/sindresorhus/eslint-plugin-unicorn/blob/master/docs/rules/prefer-array-find.md
   */
  'unicorn/prefer-array-find': 'error',

  /**
   * prefer Array.flatMap over Array.flat().map() and similar
   *
   * @see https://github.com/sindresorhus/eslint-plugin-unicorn/blob/master/docs/rules/prefer-array-flat-map.md
   */
  'unicorn/prefer-array-flat-map': 'error',

  /**
   * use `.indexOf` where appropriate
   *
   * @see https://github.com/sindresorhus/eslint-plugin-unicorn/blob/master/docs/rules/prefer-array-index-of.md
   */
  'unicorn/prefer-array-index-of': 'warn',

  /**
   * prefer array.some when more appropriate than array.find
   *
   * @see https://github.com/sindresorhus/eslint-plugin-unicorn/blob/master/docs/rules/prefer-array-some.md
   */
  'unicorn/prefer-array-some': 'warn',

  /**
   * prefer using `Date.now()` to get unix ms over other options
   *
   * @see https://github.com/sindresorhus/eslint-plugin-unicorn/blob/master/docs/rules/prefer-date-now.md
   */
  'unicorn/prefer-date-now': 'warn',

  /**
   * prefer using function default parameters in contrast to reassigning
   *
   * @see https://github.com/sindresorhus/eslint-plugin-unicorn/blob/master/docs/rules/prefer-default-parameters.md
   */
  'unicorn/prefer-default-parameters': 'warn',

  /**
   * prefer using modern API
   *
   * @see https://github.com/sindresorhus/eslint-plugin-unicorn/blob/master/docs/rules/prefer-dom-node-append.md
   */
  'unicorn/prefer-dom-node-append': 'error',

  /**
   * prefer element.dataset.foo over element.setAttribute('dataset-foo')
   *
   * @see https://github.com/sindresorhus/eslint-plugin-unicorn/blob/master/docs/rules/prefer-dom-node-dataset.md
   */
  'unicorn/prefer-dom-node-dataset': 'error',

  /**
   * prefer using modern API
   *
   * @see https://github.com/sindresorhus/eslint-plugin-unicorn/blob/master/docs/rules/prefer-dom-node-remove.md
   */
  'unicorn/prefer-dom-node-remove': 'error',

  /**
   * use element.textContent over element.innerText
   *
   * @see https://github.com/sindresorhus/eslint-plugin-unicorn/blob/master/docs/rules/prefer-dom-node-text-content.md
   */
  'unicorn/prefer-dom-node-text-content': 'error',

  /**
   * prefer (Array|String).includes over (Array|String).indexOf
   *
   * @see https://github.com/sindresorhus/eslint-plugin-unicorn/blob/master/docs/rules/prefer-includes.md
   * @see @typescript-eslint/prefer-includes
   */
  'unicorn/prefer-includes': hasTypeScript ? 'off' : 'warn',

  /**
   * prefer event.key over event.keyCode
   *
   * @see https://github.com/sindresorhus/eslint-plugin-unicorn/blob/master/docs/rules/prefer-keyboard-event-key.md
   */
  'unicorn/prefer-keyboard-event-key': 'error',

  /**
   * enforces usage of `Math.trunc()` over bitwise
   *
   * @see https://github.com/sindresorhus/eslint-plugin-unicorn/blob/master/docs/rules/prefer-math-trunc.md
   */
  'unicorn/prefer-math-trunc': 'warn',

  /**
   * prefer using modern APIs
   *
   * @see https://github.com/sindresorhus/eslint-plugin-unicorn/blob/master/docs/rules/prefer-modern-dom-apis.md
   */
  'unicorn/prefer-modern-dom-apis': 'error',

  /**
   * prefer negative index over .length - index
   *
   * @see https://github.com/sindresorhus/eslint-plugin-unicorn/blob/master/docs/rules/prefer-negative-index.md
   */
  'unicorn/prefer-negative-index': 'error',

  /**
   * use Number.* instead of * directly because of implicit differences
   *
   * @see https://github.com/sindresorhus/eslint-plugin-unicorn/blob/master/docs/rules/prefer-number-properties.md
   */
  'unicorn/prefer-number-properties': ['warn', { checkInfinity: false }],

  /**
   * handle error in try/catch or omit it
   *
   * @see https://github.com/sindresorhus/eslint-plugin-unicorn/blob/master/docs/rules/prefer-optional-catch-binding.md
   */
  'unicorn/prefer-optional-catch-binding': 'error',

  /**
   * prefer element.querySelector over element.getElementById etc.
   *
   * @see https://github.com/sindresorhus/eslint-plugin-unicorn/blob/master/docs/rules/prefer-query-selector.md
   */
  'unicorn/prefer-query-selector': 'error',

  /**
   * use Reflect.apply(fn) over Function.prototype.apply.call(fn)
   *
   * @see https://github.com/sindresorhus/eslint-plugin-unicorn/blob/master/docs/rules/prefer-reflect-apply.md
   */
  'unicorn/prefer-reflect-apply': 'error',

  /**
   * prefer the more performant, semantically clear method
   *
   * @see https://github.com/sindresorhus/eslint-plugin-unicorn/blob/master/docs/rules/prefer-regexp-test.md
   */
  'unicorn/prefer-regexp-test': 'error',

  /**
   * prefer Set.has over Array.includes
   *
   * @see https://github.com/sindresorhus/eslint-plugin-unicorn/blob/master/docs/rules/prefer-set-has.md
   */
  'unicorn/prefer-set-has': 'error',

  /**
   * prefer [...arr] over Array.from
   *
   * @see https://github.com/sindresorhus/eslint-plugin-unicorn/blob/master/docs/rules/prefer-spread.md
   */
  'unicorn/prefer-spread': 'error',

  /**
   * prefer String.replaceAll over global regex
   *
   * @see https://github.com/sindresorhus/eslint-plugin-unicorn/blob/master/docs/rules/prefer-string-replace-all.md
   */
  'unicorn/prefer-string-replace-all': 'error',

  /**
   * use String.slice over String.substr/.substring
   *
   * @see https://github.com/sindresorhus/eslint-plugin-unicorn/blob/master/docs/rules/prefer-string-slice.md
   */
  'unicorn/prefer-string-slice': 'error',

  /**
   * use String.startsWith/.endsWith over String.indexOf or regex
   *
   * @see https://github.com/sindresorhus/eslint-plugin-unicorn/blob/master/docs/rules/prefer-string-starts-ends-with.md
   * @see @typescript-eslint/prefer-string-starts-ends-with
   */
  'unicorn/prefer-string-starts-ends-with': hasTypeScript ? 'off' : 'error',

  /**
   * use element.trimStart/element.trimEnd over
   * elelment.trimLeft/elelment.trimRight
   *
   * @see https://github.com/sindresorhus/eslint-plugin-unicorn/blob/master/docs/rules/prefer-string-trim-start-end.md
   */
  'unicorn/prefer-string-trim-start-end': 'error',

  /**
   * off as long as promises & generators are not excludable
   *
   * @see https://github.com/sindresorhus/eslint-plugin-unicorn/blob/master/docs/rules/prefer-ternary.md
   * @see https://github.com/sindresorhus/eslint-plugin-unicorn/issues/867
   */
  'unicorn/prefer-ternary': 'off',

  /**
   * be more explicit about the type of error you throw
   *
   * @see https://github.com/sindresorhus/eslint-plugin-unicorn/blob/master/docs/rules/prefer-type-error.md
   */
  'unicorn/prefer-type-error': 'error',

  /**
   * off because too opinionated
   *
   * @see https://github.com/sindresorhus/eslint-plugin-unicorn/blob/master/docs/rules/prevent-abbreviations.md
   */
  'unicorn/prevent-abbreviations': 'off',

  /**
   * off because no need
   *
   * @see https://github.com/sindresorhus/eslint-plugin-unicorn/blob/master/docs/rules/string-content.md
   */
  'unicorn/string-content': 'off',

  /**
   * be explicit about thrown error
   *
   * @see https://github.com/sindresorhus/eslint-plugin-unicorn/blob/master/docs/rules/throw-new-error.md
   */
  'unicorn/throw-new-error': 'error',
});

module.exports = {
  createUnicornRules,
  getUnicornRules,
  prettierUnicornRules,
};
