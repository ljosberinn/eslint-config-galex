import { ModuleKind } from 'typescript';

import type { Dependencies, RulesCreator, RulesetCreator } from '../types';
import { prettierUnicornRules } from '../utils/prettier';

export const createUnicornPlugin: RulesetCreator = ({
  rules: customRules = {},
  ...dependencies
}) => ({
  ...createUnicornRules(dependencies),
  ...prettierUnicornRules,
  ...customRules,
});

/**
 * @see https://github.com/sindresorhus/eslint-plugin-unicorn
 */
export const createUnicornRules: RulesCreator = ({
  typescript: { hasTypeScript, config },
  react: { hasReact },
  hasNodeTypes,
}) => ({
  /**
   * improves regex
   *
   * @see https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/better-regex.md
   */
  'unicorn/better-regex': 'error',

  /**
   * disallows (entirely) renaming the error in Promise.catch & try/catch
   *
   * @see https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/catch-error-name.md
   */
  'unicorn/catch-error-name': 'error',

  /**
   * enforces usage of destructured variables over re-accessing them
   *
   * @see https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/consistent-destructuring.md
   */
  'unicorn/consistent-destructuring': 'error',

  /**
   * enforces placing functions as close to the top level as possible
   *
   * @see https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/consistent-function-scoping.md
   */
  'unicorn/consistent-function-scoping': 'error',

  /**
   * enforce correct error subclassing when extending native errors
   *
   * @see https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/custom-error-definition.md
   */
  'unicorn/custom-error-definition': 'warn',

  /**
   * off because prettier territory
   *
   * @see https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/empty-brace-spaces.md
   */
  'unicorn/empty-brace-spaces': 'off',

  /**
   * enforce passing a message value when throwing an built-in error
   *
   * @see https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/error-message.md
   */
  'unicorn/error-message': 'error',

  /**
   * require escape sequences to use uppercase values
   *
   * @see https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/escape-case.md
   */
  'unicorn/escape-case': 'error',

  /**
   * off because currently no use-case
   *
   * @see https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/expiring-todo-comments.md
   */
  'unicorn/expiring-todo-comments': 'off',

  /**
   * enforces `Array.length === 0` instead of `Array.length`
   *
   * @see https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/explicit-length-check.md
   */
  'unicorn/explicit-length-check': 'error',

  /**
   * off because too opinionated
   *
   * @see https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/filename-case.md
   */
  'unicorn/filename-case': 'off',

  /**
   * off because situational
   *
   * @see https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/import-style.md
   */
  'unicorn/import-style': 'off',

  /**
   * enforces `new` for builtins
   *
   * @see https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/new-for-builtins.md
   */
  'unicorn/new-for-builtins': 'error',

  /**
   * disallows disabling eslint entirely
   *
   * @see https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/no-abusive-eslint-disable.md
   */
  'unicorn/no-abusive-eslint-disable': 'error',

  /**
   * off because TS tells you where this is possible and where not
   *
   * @see https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/no-array-callback-reference.md
   */
  'unicorn/no-array-callback-reference': 'off',

  /**
   * off because nonsense
   *
   * @see https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/no-array-for-each.md
   */
  'unicorn/no-array-for-each': 'off',

  /**
   * Disallow using the this argument in array methods
   *
   * @see https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/no-array-method-this-argument.md
   */
  'unicorn/no-array-method-this-argument': 'warn',

  /**
   * combines multiple array.push calls into one where possible
   *
   * @see https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/no-array-push-push.md
   */
  'unicorn/no-array-push-push': 'warn',

  /**
   * off because bad take
   *
   * @see https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/no-array-reduce.md
   */
  'unicorn/no-array-reduce': 'off',

  /**
   * disallows directly accessing awaited promises
   *
   * @see https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/no-await-expression-member.md
   */
  'unicorn/no-await-expression-member': 'error',

  /**
   * disallow leading/trailing space between console.log parameters
   *
   * @see https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/no-console-spaces.md
   */
  'unicorn/no-console-spaces': 'error',

  /**
   * disallow direct manipulation of document.cookie
   *
   * @see https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/no-document-cookie.md
   */
  'unicorn/no-document-cookie': 'warn',

  /**
   * disallows empty files. off because fairly redundant.
   *
   * @see https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/no-empty-file.md
   */
  'unicorn/no-empty-file': 'off',

  /**
   * no `for` loop when you can `for-of` instead
   *
   * @see https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/no-for-loop.md
   */
  'unicorn/no-for-loop': hasTypeScript ? 'off' : 'warn',

  /**
   * use unicode escapes instead of hexadecimal escales
   *
   * @see https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/no-hex-escape.md
   */
  'unicorn/no-hex-escape': 'error',

  /**
   * use `Array.isArray` instead of `instanceof Array`
   *
   * @see https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/no-array-instanceof.md
   */
  'unicorn/no-instanceof-array': 'error',

  /**
   * prevents calling `removeEventListener` with the result of an expression
   *
   * @see https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/no-invalid-remove-event-listener.md
   */
  'unicorn/no-invalid-remove-event-listener': 'error',

  /**
   * ensures not using keywords as variable prefix
   *
   * @see https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/no-keyword-prefix.md
   */
  'unicorn/no-keyword-prefix': hasReact ? 'off' : 'warn',

  /**
   * collapses nested ifs
   *
   * @see https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/no-lonely-if.md
   * @see https://eslint.org/docs/rules/no-lonely-if
   */
  'unicorn/no-lonely-if': 'warn',

  /**
   * disallows negated conditions
   * @see https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/no-negated-condition.md
   * @see https://eslint.org/docs/rules/no-negated-condition
   */
  'unicorn/no-negated-condition': 'warn',

  /**
   * off because prettier takes care of it
   *
   * @see https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/no-nested-ternary.md
   */
  'unicorn/no-nested-ternary': 'off',

  /**
   * disallows `new Array()`
   *
   * @see https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/no-new-array.md
   * @see no-array-constructor
   */
  'unicorn/no-new-array': 'error',

  /**
   * use Buffer.from/Buffer.alloc instead of new Buffer (deprecated)
   *
   * @see https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/no-new-buffer.md
   */
  'unicorn/no-new-buffer': 'error',

  /**
   * off because jesus no, bad take. null conveys meaning! hard to debug
   * unintentional undefined from intentional undefined. null declares
   * active absence.
   *
   * @see https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/no-null.md
   */
  'unicorn/no-null': 'off',

  /**
   * disallows using objects as default parameter
   *
   * @see https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/no-object-as-default-parameter.md
   */
  'unicorn/no-object-as-default-parameter': 'warn',

  /**
   * makes core rule `no-process-exit` more strict
   *
   * @see https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/no-process-exit.md
   */
  'unicorn/no-process-exit': 'error',

  /**
   * forbid static-only classes, should be an object instead
   *
   * @see https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/no-static-only-class.md
   */
  'unicorn/no-static-only-class': 'error',

  /**
   * disallows custom objects with .then property
   *
   * @see https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/no-thenable.md
   */
  'unicorn/no-thenable': 'warn',

  /**
   * disallows reassigning `this` to another variable
   *
   * @see https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/no-this-assignment.md
   */
  'unicorn/no-this-assignment': 'warn',

  /**
   * disallows comparing undefined using typeof
   *
   * @see https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/no-typeof-undefined.md
   */
  'unicorn/no-typeof-undefined': 'warn',

  /**
   * disallows awaiting non-awaitables
   *
   * @see https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/no-unnecessary-await.md
   */
  'unicorn/no-unnecessary-await': hasTypeScript ? 'off' : 'warn',

  /**
   * prevents abusive destructuring
   *
   * @see https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/no-unreadable-array-destructuring.md
   */
  'unicorn/no-unreadable-array-destructuring': 'warn',

  /**
   * disallows iifes with implicit returns due to readability
   *
   * @see https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/no-unreadable-iife.md
   */
  'unicorn/no-unreadable-iife': 'warn',

  /**
   * disallows potentially very slow regex
   *
   * @see https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/no-unsafe-regex.md
   */
  'unicorn/no-unsafe-regex': 'error',

  /**
   * does exactly what the name says
   *
   * @see https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/no-useless-length-check.md
   */
  'unicorn/no-useless-length-check': 'error',

  /**
   * disallows unused properties on object constants
   *
   * @see https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/no-unused-properties.md
   */
  'unicorn/no-unused-properties': 'warn',

  /**
   * prevents unnecessary spreading
   *
   * @see https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/no-useless-fallback-in-spread.md
   */
  'unicorn/no-useless-fallback-in-spread': 'warn',

  /**
   * disallow returning/yielding Promise.resolve/reject() in async functions or promise callbacks
   *
   * @see https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/no-useless-spread.md
   */
  'unicorn/no-useless-promise-resolve-reject': 'warn',

  /**
   * disallows useless spreads
   *
   * @see https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/no-useless-spread.md
   */
  'unicorn/no-useless-spread': 'error',

  /**
   * disallows redundant switch
   *
   * @see https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/no-useless-switch-case.md
   */
  'unicorn/no-useless-switch-case': 'warn',

  /**
   * disallows useless undefined
   *
   * @see https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/no-useless-undefined.md
   */
  'unicorn/no-useless-undefined': 'error',

  /**
   * enforces no usage of 1.0
   *
   * @see https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/no-zero-fractions.md
   */
  'unicorn/no-zero-fractions': 'error',

  /**
   * off because prettier takes care of it
   *
   * @see https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/number-literal-case.md
   */
  'unicorn/number-literal-case': 'off',

  /**
   * enforces consistent numeric separators style
   *
   * @see https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/numeric-separators-style.md
   */
  'unicorn/numeric-separators-style': 'warn',

  /**
   * prefer element.addEventListener instead of element.[event]
   *
   * @see https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/prefer-add-event-listener.md
   */
  'unicorn/prefer-add-event-listener': 'error',

  /**
   * prefer Array.find over alternatives doing the same with more code
   *
   * @see https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/prefer-array-find.md
   */
  'unicorn/prefer-array-find': 'error',

  /**
   * prefer using Array.flat over older alternatives
   *
   * @see https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/prefer-array-flat.md
   */
  'unicorn/prefer-array-flat': 'warn',

  /**
   * prefer Array.flatMap over Array.flat().map() and similar
   *
   * @see https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/prefer-array-flat-map.md
   */
  'unicorn/prefer-array-flat-map': 'error',

  /**
   * use `.indexOf` where appropriate
   *
   * @see https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/prefer-array-index-of.md
   */
  'unicorn/prefer-array-index-of': 'warn',

  /**
   * prefer array.some when more appropriate than array.find
   *
   * @see https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/prefer-array-some.md
   */
  'unicorn/prefer-array-some': 'warn',

  /**
   * Prefer .at() method for index access and String#charAt()
   *
   * off because currently barely supported
   *
   * @see https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/prefer-at.md
   */
  'unicorn/prefer-at': 'off',

  /**
   * prefer using unicode-save string method
   *
   * @see https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/prefer-code-point.md
   */
  'unicorn/prefer-code-point': 'warn',

  /**
   * prefer using `Date.now()` to get unix ms over other options
   *
   * @see https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/prefer-date-now.md
   */
  'unicorn/prefer-date-now': 'warn',

  /**
   * prefer using function default parameters in contrast to reassigning
   *
   * @see https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/prefer-default-parameters.md
   */
  'unicorn/prefer-default-parameters': 'warn',

  /**
   * prefer using modern API
   *
   * @see https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/prefer-dom-node-append.md
   */
  'unicorn/prefer-dom-node-append': 'error',

  /**
   * prefer element.dataset.foo over element.setAttribute('dataset-foo')
   *
   * @see https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/prefer-dom-node-dataset.md
   */
  'unicorn/prefer-dom-node-dataset': 'error',

  /**
   * prefer using modern API
   *
   * @see https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/prefer-dom-node-remove.md
   */
  'unicorn/prefer-dom-node-remove': 'error',

  /**
   * use element.textContent over element.innerText
   *
   * @see https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/prefer-dom-node-text-content.md
   */
  'unicorn/prefer-dom-node-text-content': 'error',

  /**
   * prefer (Array|String).includes over (Array|String).indexOf
   *
   * @see https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/prefer-includes.md
   * @see @typescript-eslint/prefer-includes
   */
  'unicorn/prefer-includes': hasTypeScript ? 'off' : 'warn',

  /**
   * prefer reading a JSON file as a buffer
   *
   * @see https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/prefer-json-parse-buffer.md
   */
  'unicorn/prefer-json-parse-buffer': 'warn',

  ...(hasNodeTypes
    ? {
        /**
         * prefer EventTarget over EventEmitter
         *
         * @see https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/prefer-event-target.md
         */
        'unicorn/prefer-event-target': 'warn',
      }
    : null),

  /**
   * prefer export...from when re-exporting instead of separately importing,
   * then exporting
   *
   * @see https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/prefer-export-from.md#prefer-exportfrom-when-re-exporting
   */
  'unicorn/prefer-export-from': 'warn',

  /**
   * prefer event.key over event.keyCode
   *
   * @see https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/prefer-keyboard-event-key.md
   */
  'unicorn/prefer-keyboard-event-key': 'error',

  /**
   * prohibit ternary if simpler version exists
   *
   * @see https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/prefer-logical-operator-over-ternary.md
   */
  'unicorn/prefer-logical-operator-over-ternary': 'warn',

  /**
   * enforces usage of `Math.trunc()` over bitwise
   *
   * @see https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/prefer-math-trunc.md
   */
  'unicorn/prefer-math-trunc': 'warn',

  /**
   * prefer using modern APIs
   *
   * @see https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/prefer-modern-dom-apis.md
   */
  'unicorn/prefer-modern-dom-apis': 'error',

  /**
   * prefer modern Math.* APIs over manual calculation
   *
   * @see https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/prefer-modern-math-apis.md
   */
  'unicorn/prefer-modern-math-apis': 'warn',

  /**
   * off because we cannot reliably detect being in a pure Node.js context
   * with TS it would be off anyways
   *
   * @see https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/prefer-module.md
   * @see import/no-commonjs
   */
  'unicorn/prefer-module': 'off',

  /**
   * disallows recreating String, Number, Boolean, etc.
   *
   * @see https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/prefer-native-coercion-functions.md
   */
  'unicorn/prefer-native-coercion-functions': 'error',

  /**
   * prefer negative index over .length - index
   *
   * @see https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/prefer-negative-index.md
   */
  'unicorn/prefer-negative-index': 'error',

  /**
   * off because we cannot reliably detect being in a pure Node.js context
   * which also supports Node 16+
   *
   * @todo check specifically in Next.js context; in 04/2021 it's not supported
   *
   * @see https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/prefer-node-protocol.md
   */
  'unicorn/prefer-node-protocol': 'off',

  /**
   * use Number.* instead of * directly because of implicit differences
   *
   * @see https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/prefer-number-properties.md
   */
  'unicorn/prefer-number-properties': ['warn', { checkInfinity: false }],

  /**
   * suggests using Object.fromEntries where detected
   *
   * @see https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/prefer-object-from-entries.md
   */
  'unicorn/prefer-object-from-entries': 'error',

  /**
   * handle error in try/catch or omit it
   *
   * @see https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/prefer-optional-catch-binding.md
   */
  'unicorn/prefer-optional-catch-binding': 'error',

  /**
   * prefer element.querySelector over element.getElementById etc.
   *
   * @see https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/prefer-query-selector.md
   */
  'unicorn/prefer-query-selector': 'error',

  /**
   * prefer borrowing methods from prototype instead of an instance
   *
   * @see https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/prefer-prototype-methods.md
   */
  'unicorn/prefer-prototype-methods': 'warn',

  /**
   * use Reflect.apply(fn) over Function.prototype.apply.call(fn)
   *
   * @see https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/prefer-reflect-apply.md
   */
  'unicorn/prefer-reflect-apply': 'error',

  /**
   * prefer the more performant, semantically clear method
   *
   * @see https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/prefer-regexp-test.md
   */
  'unicorn/prefer-regexp-test': 'error',

  /**
   * prefer Set.has over Array.includes
   *
   * @see https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/prefer-set-has.md
   */
  'unicorn/prefer-set-has': 'error',

  /**
   * avoids unnecessarily spreading a set into array to check length when .size can be used instead
   *
   * @see https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/prefer-set-size.md
   */
  'unicorn/prefer-set-size': 'warn',

  /**
   * prefer [...arr] over Array.from
   *
   * @see https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/prefer-spread.md
   */
  'unicorn/prefer-spread': 'error',

  /**
   * prefer String.replaceAll over global regex
   *
   * @see https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/prefer-string-replace-all.md
   */
  'unicorn/prefer-string-replace-all':
    // browsers support .replaceAll
    hasReact ||
    // in TS projects, availability can be inferred based on tsConfig.lib containing anything ESNext related
    (config?.compilerOptions?.lib &&
      Array.isArray(config.compilerOptions.lib) &&
      config.compilerOptions.lib.some(lib =>
        lib.toLowerCase().startsWith('esnext')
      ))
      ? 'error'
      : // Node only supports it v15+
        'off',

  /**
   * use String.slice over String.substr/.substring
   *
   * @see https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/prefer-string-slice.md
   */
  'unicorn/prefer-string-slice': 'error',

  /**
   * use String.startsWith/.endsWith over String.indexOf or regex
   *
   * @see https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/prefer-string-starts-ends-with.md
   * @see @typescript-eslint/prefer-string-starts-ends-with
   */
  'unicorn/prefer-string-starts-ends-with': hasTypeScript ? 'off' : 'error',

  /**
   * use element.trimStart/element.trimEnd over
   * elelment.trimLeft/elelment.trimRight
   *
   * @see https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/prefer-string-trim-start-end.md
   */
  'unicorn/prefer-string-trim-start-end': 'error',

  /**
   * prefer switch over multiple if-elseif
   *
   * @see https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/prefer-switch.md
   */
  'unicorn/prefer-switch': [
    'error',
    { emptyDefaultCase: 'no-default-comment' },
  ],

  /**
   * off as long as promises & generators are not excludable
   *
   * @see https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/prefer-ternary.md
   * @see https://github.com/sindresorhus/eslint-plugin-unicorn/issues/867
   */
  'unicorn/prefer-ternary': 'off',

  /**
   * Prefer top-level await over top-level promises and async function calls
   *
   * disabled unless it can be safely detected
   *
   * @see https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/prefer-top-level-await.md
   */
  'unicorn/prefer-top-level-await': detectPreferTopLevelAwait({
    hasTypeScript,
    config,
  }),

  /**
   * be more explicit about the type of error you throw
   *
   * @see https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/prefer-type-error.md
   */
  'unicorn/prefer-type-error': 'error',

  /**
   * off because too opinionated
   *
   * @see https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/prevent-abbreviations.md
   */
  'unicorn/prevent-abbreviations': 'off',

  /**
   * disallows use of relative paths passed to `new URL()`
   *
   * @see https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/relative-url-style.md
   */
  'unicorn/relative-url-style': 'warn',

  /**
   * enforces using a separator argument when using Array.join()
   *
   * @see https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/require-array-join-separator.md
   */
  'unicorn/require-array-join-separator': 'warn',

  /**
   * enforces using an argument when using Number.toFixed()
   *
   * @see https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/require-number-to-fixed-digits-argument.md
   */
  'unicorn/require-number-to-fixed-digits-argument': 'warn',

  /**
   * Enforce using the targetOrigin argument with `window.postMessage()`
   *
   * @see https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/require-post-message-target-origin.md
   */
  'unicorn/require-post-message-target-origin': 'error',

  /**
   * off because no need
   *
   * @see https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/string-content.md
   */
  'unicorn/string-content': 'off',

  /**
   * @see https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/switch-case-braces.md
   */
  'unicorn/switch-case-braces': 'warn',

  /**
   * enforces braces in switch cases
   *
   * @see https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/template-indent.md
   */
  'unicorn/template-indent': 'warn',

  /**
   * enforces consistent case for text encoding identifiers
   *
   * @see https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/text-encoding-identifier-case.md
   */
  'unicorn/text-encoding-identifier-case': hasTypeScript ? 'off' : 'warn',

  /**
   * be explicit about thrown error
   *
   * @see https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/throw-new-error.md
   */
  'unicorn/throw-new-error': 'error',
});

const detectPreferTopLevelAwait = ({
  hasTypeScript,
  config,
}: Omit<Dependencies['typescript'], 'version'>) => {
  if (
    !hasTypeScript ||
    !config ||
    !config.compilerOptions ||
    !config.compilerOptions.module ||
    !config.compilerOptions.target
  ) {
    return 'off';
  }

  if (
    !(typeof config.compilerOptions.module === 'string'
      ? ['esnext', 'system'].includes(
          // @ts-expect-error it can be both since its either raw json or parsed
          config.compilerOptions.module.toLowerCase()
        )
      : [ModuleKind.System, ModuleKind.ESNext].includes(
          config.compilerOptions.module
        ))
  ) {
    return 'off';
  }

  if (
    (typeof config.compilerOptions.target === 'string' &&
      // @ts-expect-error it can be both since its either raw json or parsed
      Number.parseInt(config.compilerOptions.target.slice(2)) < 2017) ||
    config.compilerOptions.target < 4
  ) {
    return 'off';
  }

  return 'error';
};
