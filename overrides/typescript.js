/* eslint-disable inclusive-language/use-inclusive-words */
module.exports = {
  /**
   * @param {{
   *  hasTypeScript: boolean;
   *  react: {
   *    hasReact: boolean;
   *  };
   *  customRules?: Record<string, string | [string, string | object];
   * }} options
   */
  createTSOverride: ({
    hasTypeScript,
    react: { hasReact },
    customRules = {},
  }) => {
    if (!hasTypeScript) {
      return null;
    }

    return {
      extends: [],
      files: ['**/*.ts?(x)'],
      parser: '@typescript-eslint/parser',
      parserOptions: {
        ecmaFeatures: {
          jsx: hasReact,
        },
        project: './tsconfig.json',
        // using false here because I'm almost always on nightly TS
        warnOnUnsupportedTypeScriptVersion: false,
      },
      plugins: ['@typescript-eslint'],
      rules: {
        /**
         * prevents loose overloads
         *
         * @see https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/adjacent-overload-signatures.md
         */
        '@typescript-eslint/adjacent-overload-signatures': 'error',

        /**
         * prefer using `T[]` over `Array<T>`
         *
         * @see https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/array-type.md
         */
        '@typescript-eslint/array-type': [
          'warn',
          {
            default: 'array',
          },
        ],

        /**
         * disallows awaiting a value that is not thenable
         *
         * @see https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/await-thenable.md
         */
        '@typescript-eslint/await-thenable': 'error',

        /**
         * disallows // @ts-<directive> comments except for -expect-error with
         * description
         *
         * @see https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/ban-ts-comment.md
         */
        '@typescript-eslint/ban-ts-comment': [
          'error',
          {
            'ts-expect-error': 'allow-with-description',
            'ts-ignore': true,
            'ts-nocheck': true,
          },
        ],

        /**
         * TSLint is dead
         *
         * @see https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/ban-tslint-comment.md
         */
        '@typescript-eslint/ban-tslint-comment': 'error',

        /**
         * off because not needed
         *
         * @see https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/ban-types.md
         */
        '@typescript-eslint/ban-types': 'off',

        /**
         * off because prettier
         *
         * @see https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/brace-style.md
         */
        '@typescript-eslint/brace-style': 'off',

        /**
         * off because deprecated
         *
         * @see https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/camelcase.md
         */
        '@typescript-eslint/camelcase': 'off',

        /**
         * off because too opinionated
         *
         * @see https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/class-literal-property-style.md
         */
        '@typescript-eslint/class-literal-property-style': 'off',

        /**
         * off because prettier takes care of that
         *
         * @see https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/comma-spacing.md
         */
        '@typescript-eslint/comma-spacing': 'off',

        /**
         * streamlines assertions to use `as` over `<type>`
         * expects objects to be defined by `const foo: Type` over `as Type`
         *
         * @see https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/consistent-type-assertions.md
         */
        '@typescript-eslint/consistent-type-assertions': [
          'error',
          {
            assertionStyle: 'as',
            objectLiteralTypeAssertions: 'never',
          },
        ],

        /**
         * off because both type and interface have advantages over the other
         *
         * @see https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/consistent-type-definitions.md
         */
        '@typescript-eslint/consistent-type-definitions': 'off',

        /**
         * prevents having optional params before default
         *
         * @see https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/default-param-last.md
         * @see default-params-last
         */
        '@typescript-eslint/default-param-last': 'error',

        /**
         * prefer using the object.dot notation over key access
         *
         * @see https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/dot-notation.md
         */
        '@typescript-eslint/dot-notation': 'error',

        /**
         * off because it is preferred to let inference work where possible
         *
         * @see https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/explicit-function-return-type.md
         */
        '@typescript-eslint/explicit-function-return-type': 'off',

        /**
         * ensures explicitness about member accessibility
         *
         * __EXPERIMENTAL__
         *
         * @see https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/explicit-member-accessibility.md
         */
        '@typescript-eslint/explicit-member-accessibility': 'error',

        /**
         * ensures exported functions are strongly typed
         *
         * @see https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/explicit-module-boundary-types.md
         */
        '@typescript-eslint/explicit-module-boundary-types': 'error',

        /**
         * @see https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/func-call-spacing.md
         * @see func-call-spacing
         */
        '@typescript-eslint/func-call-spacing': ['warn', 'never'],

        /**
         * off because prettier takes care of that
         *
         * @see https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/indent.md
         */
        '@typescript-eslint/indent': 'off',

        /**
         * off because required to escape scope
         *
         * @see https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/init-declarations.md
         * @see init-declarations
         */
        '@typescript-eslint/init-declarations': 'off',

        /**
         * off because prettier takes care of that
         *
         * @see https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/keyword-spacing.md
         * @see keyword-spacing
         */
        '@typescript-eslint/keyword-spacing': 'off',

        /**
         * @see https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/lines-between-class-members.md
         * @see lines-between-class-members
         */
        '@typescript-eslint/lines-between-class-members': 'warn',

        /**
         * enforces consistent member delimiter style in interfaces & types
         *
         * @see https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/member-delimiter-style.md
         */
        '@typescript-eslint/member-delimiter-style': [
          'warn',
          {
            multiline: {
              delimiter: 'semi',
              requireLast: true,
            },
            singleline: {
              delimiter: 'semi',
              requireLast: false,
            },
          },
        ],

        /**
         * ensures consistend ordering of class internals
         *
         * __EXPERIMENTAL__
         *
         * @see https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/member-ordering.md
         */
        '@typescript-eslint/member-ordering': 'warn',

        /**
         * ensures consistent method signature declaration on interfaces
         *
         * @see https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/method-signature-style.md
         */
        '@typescript-eslint/method-signature-style': ['warn', 'property'],

        /**
         * off because too opinionated
         *
         * @see https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/naming-convention.md
         */
        '@typescript-eslint/naming-convention': 'off',

        /**
         * disallows `new Array()`
         *
         * @see https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/no-array-constructor.md
         * @see no-array-constructor
         */
        '@typescript-eslint/no-array-constructor': 'error',

        /**
         * avoids calling `.toString()` on variables that don't contain
         * meainingful info
         *
         * @see https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/no-base-to-string.md
         */
        '@typescript-eslint/no-base-to-string': 'error',

        /**
         * disallows confusing use of `!`
         *
         * @see https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/no-confusing-non-null-assertion.md
         */
        '@typescript-eslint/no-confusing-non-null-assertion': 'error',
        '@typescript-eslint/no-empty-interface': 'warn',
        '@typescript-eslint/no-explicit-any': 'warn',
        '@typescript-eslint/no-inferrable-types': 'warn',
        '@typescript-eslint/no-loss-of-precision': 'warn',
        '@typescript-eslint/no-misused-promises': [
          'warn',
          {
            checksConditionals: true,
            checksVoidReturn: true,
          },
        ],
        '@typescript-eslint/no-unnecessary-boolean-literal-compare': [
          'warn',
          { allowComparingNullableBooleansToTrue: false },
        ],
        '@typescript-eslint/no-unnecessary-condition': 'warn',
        '@typescript-eslint/no-unnecessary-type-assertion': 'warn',
        /**
         * off because typescript itself already does this
         */
        '@typescript-eslint/no-unused-vars': 'off',
        '@typescript-eslint/prefer-literal-enum-member': 'warn',
        '@typescript-eslint/prefer-nullish-coalescing': 'error',
        '@typescript-eslint/prefer-optional-chain': 'error',
        '@typescript-eslint/prefer-reduce-type-parameter': 'error',
        '@typescript-eslint/prefer-regexp-exec': 'error',
        '@typescript-eslint/prefer-ts-expect-error': 'error',
        '@typescript-eslint/restrict-plus-operands': 'warn',
        '@typescript-eslint/restrict-template-expressions': [
          'warn',
          {
            allowBoolean: true,
          },
        ],
        // __EXPERIMENTAL__; if removed, remove also `no-return-await`
        '@typescript-eslint/return-await': 'error',
        '@typescript-eslint/switch-exhaustiveness-check': 'warn',
        '@typescript-eslint/unified-signatures': 'warn',
        ...customRules,
      },
      settings: {
        react: {
          version: 'detect',
        },
      },
    };
  },
};
