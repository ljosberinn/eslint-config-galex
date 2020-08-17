/* eslint-disable inclusive-language/use-inclusive-words */

// WIP

module.exports = {
  /**
   *
   * @param {{
   *  hasReact: boolean;
   *  isNext: boolean;
   *  version: string
   * }} options
   */
  createReactOverride: ({ react: { exists: hasReact, isNext, version } }) => {
    if (!hasReact) {
      return null;
    }

    return {
      extends: [],
      files: ['**/*.?(ts|js)?(x)'],
      parser: 'babel-eslint',
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
      plugins: ['jsx-a11y', 'react-hooks'],
      rules: {
        ...createReactRules({ isNext, version }),
        ...jsxA11yRules,
        ...hookRules,
      },
      settings: {
        react: {
          version: 'detect',
        },
      },
    };
  },
};

// https://github.com/facebook/react/tree/master/packages/eslint-plugin-react-hooks
const hookRules = {
  /**
   * elevated to error because you either want all deps or you have to explicitly
   * disable the rule anyways
   *
   * @see https://reactjs.org/docs/hooks-rules.html
   */
  'react-hooks/exhaustive-deps': 'error',
  // https://reactjs.org/docs/hooks-rules.html
  'react-hooks/rules-of-hooks': 'error',
};

// https://github.com/yannickcr/eslint-plugin-react/tree/master/docs/rules
const createReactRules = ({ isNext, version }) => ({
  'react/button-has-type': 'error',
  'react/forbid-foreign-prop-types': ['warn', { allowInPropTypes: true }],
  'react/jsx-boolean-value': 'warn',
  'react/jsx-curly-brace-presence': [
    'warn',
    {
      children: 'never',
      props: 'never',
    },
  ],
  'react/jsx-fragments': ['warn', 'syntax'],
  'react/jsx-handler-names': [
    'warn',
    {
      checkLocalVariables: false,
      eventHandlerPrefix: 'handle',
      eventHandlerPropPrefix: 'on',
    },
  ],
  'react/jsx-key': ['warn', { checkFragmentShorthand: true }],
  'react/jsx-no-comment-textnodes': 'warn',
  'react/jsx-no-duplicate-props': 'warn',
  'react/jsx-no-target-blank': 'warn',
  'react/jsx-no-undef': 'error',
  'react/jsx-no-useless-fragment': 'warn',
  'react/jsx-pascal-case': [
    'warn',
    {
      allowAllCaps: true,
      ignore: [],
    },
  ],
  'react/jsx-uses-react': 'warn',
  'react/jsx-uses-vars': 'warn',
  'react/no-children-prop': 'warn',
  'react/no-danger-with-children': 'warn',
  'react/no-deprecated': 'warn',
  'react/no-direct-mutation-state': 'warn',
  'react/no-is-mounted': 'warn',
  'react/no-typos': 'error',
  'react/no-unknown-property': 'warn',
  'react/no-unused-prop-types': 'warn',
  /**
   * Neiter Next.js nor React >= 17 need React to be in scope
   */
  'react/react-in-jsx-scope':
    isNext || version.startsWith('17') ? 'off' : 'error',
  'react/require-render-return': 'error',
  'react/self-closing-comp': 'warn',
  'react/style-prop-object': 'warn',
  'react/void-dom-elements-no-children': 'error',
});

// https://github.com/evcohen/eslint-plugin-jsx-a11y/tree/master/docs/rules
const jsxA11yRules = {
  'jsx-a11y/alt-text': 'warn',
  'jsx-a11y/anchor-has-content': 'warn',
  'jsx-a11y/anchor-is-valid': [
    'warn',
    {
      aspects: ['noHref', 'invalidHref'],
    },
  ],
  'jsx-a11y/aria-activedescendant-has-tabindex': 'warn',
  'jsx-a11y/aria-props': 'warn',
  'jsx-a11y/aria-proptypes': 'warn',
  'jsx-a11y/aria-role': ['warn', { ignoreNonDOM: true }],
  'jsx-a11y/aria-unsupported-elements': 'warn',
  'jsx-a11y/autocomplete-valid': 'error',
  'jsx-a11y/control-has-associated-label': 'warn',
  'jsx-a11y/heading-has-content': 'warn',
  'jsx-a11y/iframe-has-title': 'warn',
  'jsx-a11y/img-redundant-alt': 'warn',
  'jsx-a11y/media-has-caption': 'warn',
  'jsx-a11y/no-access-key': 'warn',
  'jsx-a11y/no-autofocus': 'error',
  'jsx-a11y/no-distracting-elements': 'warn',
  'jsx-a11y/no-redundant-roles': 'warn',
  'jsx-a11y/role-has-required-aria-props': 'warn',
  'jsx-a11y/role-supports-aria-props': 'warn',
  'jsx-a11y/scope': 'warn',
};
