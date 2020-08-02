const restrictedGlobals = require('confusing-browser-globals');
const { sync } = require('read-pkg-up');

const { createReactOverride } = require('./rules/react');
const { createTestOverride } = require('./rules/test');
const { createTSOverride } = require('./rules/typescript');

const project = (() => {
  // adapted from https://github.com/kentcdodds/eslint-config-kentcdodds/blob/master/jest.js
  try {
    const {
      packageJson: {
        peerDependencies = {},
        devDependencies = {},
        dependencies = {},
      },
    } = sync({ normalize: true });

    const deps = Object.keys(dependencies);

    const allDeps = new Set([
      ...Object.keys({
        ...peerDependencies,
        ...devDependencies,
      }),
      ...deps,
    ]);

    return {
      hasJest: allDeps.has('jest'),
      hasJestDom: allDeps.has('@testing-library/jest-dom'),
      hasReact: ['react', 'preact', 'next'].some(pkg => allDeps.has(pkg)),
      hasTestingLibrary: allDeps.has('@testing-library/react'),
      hasTypeScript: allDeps.has('typescript'),
    };
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('error parsing package.json!', error);
    return {
      hasJest: false,
      hasJestDom: false,
      hasReact: false,
      hasTestingLibrary: false,
      hasTypeScript: false,
    };
  }
})();

const overrides = [
  createTestOverride(project),
  createReactOverride(project),
  createTSOverride(project),
].filter(Boolean);

// schema reference: https://github.com/eslint/eslint/blob/master/conf/config-schema.js
module.exports = {
  env: {
    browser: true,
    es2020: true,
    jest: project.hasJest,
    node: true,
  },
  extends: ['prettier'],
  overrides,
  parserOptions: {
    // ecmaVersion: 2020,
    sourceType: 'module',
  },
  plugins: ['import', 'sort-keys-fix', 'unicorn', 'promise'],
  rules: {
    // patches default rule; see unicorn/no-useless-undefined
    'array-callback-return': [
      'error',
      {
        allowImplicit: true,
      },
    ],
    // http://eslint.org/docs/rules/
    'default-case': ['warn', { commentPattern: '^no default$' }],
    'dot-location': ['warn', 'property'],
    eqeqeq: ['warn', 'smart'],
    'getter-return': 'warn',
    'import/newline-after-import': 'warn',
    'import/no-anonymous-default-export': 'error',
    /**
     * any module should exclusively contain named exports
     *
     * exceptions:
     * when unavoidable due to limitations, disable the warning for this line
     */
    'import/no-default-export': 'warn',
    /**
     * - groups imports
     * - alphabetically sorts them
     * - enforces new lines between groups
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
    'new-parens': 'warn',
    'no-alert': 'error',
    'no-array-constructor': 'warn',
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
    'no-redeclare': 'warn',
    'no-regex-spaces': 'warn',
    'no-restricted-globals': ['error'].concat(restrictedGlobals),
    'no-restricted-syntax': ['warn', 'WithStatement'],
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
    'no-unused-vars': [
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
    // for promise-rules, see
    // https://github.com/xjamundx/eslint-plugin-promise/tree/master/docs/rules
    /**
     * all promises must either be returned or handled
     *
     * avoids accidental oversights
     */
    'promise/catch-or-return': [
      'error',
      {
        allowFinally: true,
        allowThen: true,
      },
    ],
    /**
     * prefer async/await
     * use Promise.all where possible
     */
    'promise/no-nesting': 'warn',
    /**
     * use Promise.resolve/Promise.reject when possible
     */
    'promise/no-new-statics': 'error',
    'promise/no-promise-in-callback': 'warn',
    /**
     * return value in finally is unhandled
     */
    'promise/no-return-in-finally': 'warn',
    'promise/no-return-wrap': 'error',
    /**
     * given
     * ```js
     * new Promise((resolve, reject) => {})
     * ```
     * disallows renaming `resolve` and `reject`
     */
    'promise/param-names': 'warn',
    'promise/prefer-await-to-then': 'warn',
    /**
     * don't use async without await
     */
    'require-await': 'error',
    'require-yield': 'warn',
    'rest-spread-spacing': ['warn', 'never'],
    // alphabetically sorts object keys
    'sort-keys-fix/sort-keys-fix': 'warn',
    strict: ['warn', 'never'],
    'unicode-bom': ['warn', 'never'],
    // for all below, see
    // https://github.com/sindresorhus/eslint-plugin-unicorn/tree/master/docs/rules
    'unicorn/better-regex': 'error',
    'unicorn/catch-error-name': 'error',
    'unicorn/consistent-function-scoping': 'error',
    'unicorn/custom-error-definition': 'warn',
    'unicorn/error-message': 'error',
    'unicorn/escape-case': 'error',
    'unicorn/explicit-length-check': 'error',
    'unicorn/import-index': 'error',
    'unicorn/new-for-builtins': 'error',
    /**
     * disallows mass disabling or globally disabling rules
     */
    'unicorn/no-abusive-eslint-disable': 'error',
    'unicorn/no-array-instanceof': 'error',
    'unicorn/no-console-spaces': 'error',
    'unicorn/no-for-loop': 'error',
    'unicorn/no-hex-escape': 'error',
    'unicorn/no-keyword-prefix': 'off',
    /**
     * usually avoidable; in rare cases, disable the warning
     */
    'unicorn/no-nested-ternary': 'warn',
    'unicorn/no-new-buffer': 'error',
    'unicorn/no-object-as-default-parameter': 'warn',
    'unicorn/no-process-exit': 'error',
    'unicorn/no-unsafe-regex': 'error',
    'unicorn/no-useless-undefined': 'error',
    'unicorn/no-zero-fractions': 'error',
    /**
     * don't use onclick and similar
     */
    'unicorn/prefer-add-event-listener': 'error',
    /**
     * @category code quality
     */
    'unicorn/prefer-array-find': 'error',
    'unicorn/prefer-dataset': 'error',
    'unicorn/prefer-event-key': 'error',
    /**
     * @category code quality
     */
    'unicorn/prefer-flat-map': 'error',
    /**
     * @category code quality
     */
    'unicorn/prefer-includes': 'error',
    /**
     * @category code quality
     */
    'unicorn/prefer-modern-dom-apis': 'error',
    'unicorn/prefer-negative-index': 'error',
    /**
     * @category code quality
     */
    'unicorn/prefer-node-append': 'error',
    /**
     * @category code quality
     */
    'unicorn/prefer-node-remove': 'error',
    'unicorn/prefer-number-properties': 'error',
    'unicorn/prefer-optional-catch-binding': 'error',
    /**
     * @category code quality
     */
    'unicorn/prefer-query-selector': 'error',
    'unicorn/prefer-reflect-apply': 'error',
    'unicorn/prefer-replace-all': 'error',
    /**
     * @category code quality
     */
    'unicorn/prefer-set-has': 'error',
    'unicorn/prefer-spread': 'error',
    /**
     * @category code quality
     */
    'unicorn/prefer-starts-ends-with': 'error',
    'unicorn/prefer-string-slice': 'error',
    'unicorn/prefer-text-content': 'error',
    'unicorn/prefer-trim-start-end': 'error',
    'unicorn/prefer-type-error': 'error',
    'unicorn/string-content': 'off',
    'unicorn/throw-new-error': 'error',
    'use-isnan': 'warn',
    'valid-typeof': 'warn',
  },
};
