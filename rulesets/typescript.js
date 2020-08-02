module.exports = [
  {
    // needs to match https://github.com/facebook/create-react-app/blob/master/packages/eslint-config-react-app/index.js#L57
    files: ['**/*.ts?(x)'],
    parserOptions: {
      ecmaVersion: 2020,
      project: './tsconfig.json',
      warnOnUnsupportedTypeScriptVersion: false,
    },
    rules: {
      '@typescript-eslint/adjacent-overload-signatures': 'error',
      '@typescript-eslint/array-type': [
        'warn',
        {
          default: 'array',
        },
      ],
      '@typescript-eslint/ban-ts-comment': [
        'error',
        {
          'ts-expect-error': 'allow-with-description',
          'ts-ignore': true,
          'ts-nocheck': true,
        },
      ],
      '@typescript-eslint/ban-tslint-comment': 'error',
      '@typescript-eslint/default-param-last': 'error',
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
      // taken care of by @typescript-eslint
      'default-param-last': 'off',
      'dot-notation': 'warn',
      // taken care of by @typescript-eslint
      'no-return-await': 'off',
    },
  },
];
