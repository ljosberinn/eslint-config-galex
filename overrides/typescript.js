/* eslint-disable inclusive-language/use-inclusive-words */
module.exports = {
  /**
   *
   * @param {{
   *  hasTypeScript: boolean;
   *  hasReact: boolean;
   * }} options
   */
  createTSOverride: ({ hasTypeScript, hasReact }) => {
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
         * @see https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/adjacent-overload-signatures.md
         */
        '@typescript-eslint/adjacent-overload-signatures': 'error',
        /**
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
        '@typescript-eslint/default-param-last': 'error',
        /**
         * @see https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/dot-notation.md
         */
        '@typescript-eslint/dot-notation': 'error',
        '@typescript-eslint/method-signature-style': ['warn', 'property'],
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
        // experimental; if removed, remove also `no-return-await`
        '@typescript-eslint/return-await': 'error',
        '@typescript-eslint/switch-exhaustiveness-check': 'warn',
        '@typescript-eslint/unified-signatures': 'warn',
      },
      settings: {
        react: {
          version: 'detect',
        },
      },
    };
  },
};
