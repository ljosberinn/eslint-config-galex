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
      plugins: ['jsx-a11y', 'react-hooks', 'react'],
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
  /**
   * prevents invalid hook calls (after early return e.g.)
   *
   * @see https://reactjs.org/docs/hooks-rules.html
   */
  'react-hooks/rules-of-hooks': 'error',
};

// https://github.com/yannickcr/eslint-plugin-react/tree/master/docs/rules
const createReactRules = ({ isNext, version, hasTypeScript }) => ({
  /**
   * off because it doesnt seem to work anyways
   *
   * @see https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/boolean-prop-naming.md
   */
  'react/boolean-prop-naming': 'off',
  /**
   * be explicit
   *
   * @see https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/button-has-type.md
   */
  'react/button-has-type': 'error',
  /**
   * off because use function default arguments or TS instead
   *
   * @see https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/default-props-match-prop-types.md
   */
  'react/default-props-match-prop-types': 'off',
  /**
   * prefer destructuring
   *
   * @see https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/destructuring-assignment.md
   */
  'react/destructuring-assignment': ['error', 'always'],
  /**
   * off because anonymous default exports are forbidden
   *
   * @see https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/display-name.md
   */
  'react/display-name': 'off',
  /**
   * off because most props are perfectly valid
   *
   * @see https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/forbid-dom-props.md
   */
  'react/forbid-dom-props': 'off',
  /**
   * off because nothing is forbidden to use
   *
   * @see https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/forbid-elements.md
   */
  'react/forbid-elements': 'off',
  /**
   * avoids using potentially problematic props
   *
   * @see https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/forbid-component-props.md
   */
  'react/forbid-foreign-prop-types': ['warn', { allowInPropTypes: true }],
  /**
   * off because legacy
   *
   * @see https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/forbid-prop-types.md
   */
  'react/forbid-prop-types': 'off',
  /**
   * prefer function-declaration; if necessary e.g. React.memo(), use arrow-fn
   *
   * @see https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/function-component-definition.md
   */
  'react/function-component-definition': [
    'error',
    {
      namedComponents: 'function-declaration',
      unnamedComponents: 'arrow-function',
    },
  ],
  /**
   * prevents unecessary code
   *
   * @see https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/jsx-boolean-value.md
   */
  'react/jsx-boolean-value': 'error',
  /**
   * off because prettier takes care of it
   *
   * @see https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/jsx-child-element-spacing.md
   */
  'react/jsx-child-element-spacing': 'off',
  /**
   * off because prettier takes care of it
   *
   * @see https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/jsx-closing-bracket-location.md
   */
  'react/jsx-closing-bracket-location': 'off',
  /**
   * off because prettier takes care of it
   *
   * @see https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/jsx-closing-tag-location.md
   */
  'react/jsx-closing-tag-location': 'off',
  /**
   * enforces consistency
   *
   * @see https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/jsx-curly-brace-presence.md
   */
  'react/jsx-curly-brace-presence': [
    'warn',
    {
      children: 'never',
      props: 'never',
    },
  ],
  /**
   * off because prettier takes care of it
   *
   * @see https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/jsx-curly-newline.md
   */
  'react/jsx-curly-newline': 'off',
  /**
   * off because prettier takes care of it
   *
   * @see https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/jsx-curly-spacing.md
   */
  'react/jsx-curly-spacing': 'off',
  /**
   * off because prettier takes care of it
   *
   * @see https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/jsx-equals-spacing.md
   */
  'react/jsx-equals-spacing': 'off',
  /**
   * off because subjective
   *
   * @see https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/jsx-filename-extension.md
   */
  'react/jsx-filename-extension': 'off',
  /**
   * off because why? also prettier takes care of it
   *
   * @see https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/jsx-first-prop-new-line.md
   */
  'react/jsx-first-prop-new-line': 'off',
  /**
   * prefer shorthand function of React.Fragment
   *
   * @see https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/jsx-fragments.md
   */
  'react/jsx-fragments': ['warn', 'syntax'],
  /**
   * prefer naming event handlers `on` or `handle`
   *
   * @see https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/jsx-handler-names.md
   */
  'react/jsx-handler-names': [
    'warn',
    {
      checkLocalVariables: false,
      eventHandlerPrefix: 'handle',
      eventHandlerPropPrefix: 'on',
    },
  ],
  /**
   * off because prettier takes care of it
   *
   * @see https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/jsx-indent.md
   */
  'react/jsx-indent': 'off',
  /**
   * off because prettier takes care of it
   *
   * @see https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/jsx-indent-props.md
   */
  'react/jsx-indent-props': 'off',
  /**
   * prevents mistakes
   *
   * @see https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/jsx-key.md
   */
  'react/jsx-key': ['warn', { checkFragmentShorthand: true }],
  /**
   * off because arbitrary
   *
   * @see https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/jsx-max-depth.md
   */
  'react/jsx-max-depth': 'off',
  /**
   * off because prettier takes care of it
   *
   * @see https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/jsx-max-props-per-line.md
   */
  'react/jsx-max-props-per-line': 'off',
  /**
   * prefer passing declared functions for readability over inline arrow functions
   *
   * @see https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/jsx-no-bind.md
   */
  'react/jsx-no-bind': 'error',
  /**
   * prevents comments from being inserted as text nodes
   *
   * @see https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/jsx-no-comment-textnodes.md
   */
  'react/jsx-no-comment-textnodes': 'warn',
  /**
   * prevents duplicate props
   *
   * @see https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/jsx-no-duplicate-props.md
   */
  'react/jsx-no-duplicate-props': 'error',
  /**
   * off because why
   *
   * @see https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/jsx-no-literals.md
   */
  'react/jsx-no-literals': 'off',
  /**
   * react warns anyways; once react throws an error, this can probably be
   * turned off
   *
   * @see https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/jsx-no-script-url.md
   */
  'react/jsx-no-script-url': 'warn',
  /**
   * prevents usage of `target="_blank"` without `rel="noreferrer"`
   *
   * @see https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/jsx-no-target-blank.md
   */
  'react/jsx-no-target-blank': 'warn',
  /**
   * off simply because I don't get the docs
   *
   * @see https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/jsx-no-undef.md
   */
  'react/jsx-no-undef': 'off',
  /**
   * prevents unecessary code
   *
   * @see https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/jsx-no-useless-fragment.md
   */
  'react/jsx-no-useless-fragment': 'warn',
  /**
   * off because prettier takes care of it
   *
   * @see https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/jsx-one-expression-per-line.md
   */
  'react/jsx-one-expression-per-line': 'off',
  /**
   * enforce PascalCase for components
   *
   * @see https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/jsx-pascal-case.md
   */
  'react/jsx-pascal-case': [
    'warn',
    {
      allowAllCaps: true,
      ignore: [],
    },
  ],
  /**
   * off because prettier takes care of it
   *
   * @see https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/jsx-props-no-multi-spaces.md
   */
  'react/jsx-props-no-multi-spaces': 'off',
  /**
   * spreading is love, spreading is life
   *
   * @see https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/jsx-props-no-spreading.md
   */
  'react/jsx-props-no-spreading': 'off',
  /**
   * off because `sort-keys-fix` already takes care of it
   *
   * @see https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/jsx-sort-default-props.md
   */
  'react/jsx-sort-default-props': 'off',
  /**
   * enforce alphabetical sorting of props
   * off because although its nice in theory, its really impractical sadly
   *
   * @see https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/jsx-sort-props.md
   */
  'react/jsx-sort-props': 'off',
  /**
   * off because prettier takes care of it
   *
   * @see https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/jsx-space-before-closing.md
   */
  'react/jsx-space-before-closing': 'off',
  /**
   * off because prettier takes care of it
   *
   * @see https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/jsx-tag-spacing.md
   */
  'react/jsx-tag-spacing': 'off',
  /**
   * warns about unused react import
   *
   * @see https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/jsx-uses-react.md
   */
  'react/jsx-uses-react': 'warn',
  /**
   * off because TypeScript itself takes care of it
   *
   * @see https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/jsx-uses-vars.md
   */
  'react/jsx-uses-vars': hasTypeScript ? 'off' : 'warn',
  /**
   * off because prettier takes care of it
   *
   * @see https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/jsx-wrap-multilines.md
   */
  'react/jsx-wrap-multilines': 'off',
  /**
   * off because not every state update depends on the previous
   *
   * @see https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/no-access-state-in-setstate.md
   */
  'react/no-access-state-in-setstate': 'off',
  /**
   * off because design is not eslint territory
   *
   * @see https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/no-adjacent-inline-elements.md
   */
  'react/no-adjacent-inline-elements': 'off',
  /**
   * warns when using array keys as keys - it _might_ lead to issues, situational
   *
   * @see https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/no-array-index-key.md
   */
  'react/no-array-index-key': 'warn',
  /**
   * use children as intended
   *
   * @see https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/no-children-prop.md
   */
  'react/no-children-prop': 'error',
  /**
   * prevents unintended use of dangerouslySetInnerHTML
   *
   * @see https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/no-danger.md
   */
  'react/no-danger': 'warn',
  /**
   * prevents using dangerouslySetInnerHTML together with children
   *
   * @see https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/no-danger-with-children.md
   */
  'react/no-danger-with-children': 'error',
  /**
   * new code should not contain deprecated. for anything else, disable the rule
   * if necessary
   *
   * @see https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/no-deprecated.md
   */
  'react/no-deprecated': 'error',
  /**
   * off because nonsensical, default behaviour of setting state after e.g. fetch
   *
   * @see https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/no-did-mount-set-state.md
   */
  'react/no-did-mount-set-state': 'off',
  /**
   * warn because it _probably_ can be solved in other ways
   *
   * @see https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/no-did-update-set-state.md
   */
  'react/no-did-update-set-state': 'warn',
  /**
   * prevents direct state mutation
   *
   * @see https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/no-direct-mutation-state.md
   */
  'react/no-direct-mutation-state': 'error',
  /**
   * prevents deprecated use of `findDOMNode`
   *
   * @see https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/no-find-dom-node.md
   */
  'react/no-find-dom-node': 'error',
  /**
   * prevents deprecated use if `isMounted()`
   *
   * @see https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/no-is-mounted.md
   */
  'react/no-is-mounted': 'error',
  /**
   * off because nonsensical
   *
   * @see https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/no-multi-comp.md
   */
  'react/no-multi-com': 'off',
  /**
   * prevents use of `shouldComponentUpdate` in `PureComponent`
   *
   * @see https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/no-redundant-should-component-update.md
   */
  'react/no-redundant-should-component-update': 'error',
  /**
   * prevents use of legacy return value of `ReactDOM.render`
   *
   * @see https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/no-render-return-value.md
   */
  'react/no-render-return-value': 'off',
  /**
   * off because pointless
   *
   * @see https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/no-set-state.md
   */
  'react/no-set-state': 'off',
  /**
   * prevents use of legacy string refs
   *
   * @see https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/no-string-refs.md
   */
  'react/no-string-refs': 'error',
  /**
   * prevents use of `this` in stateless functional components
   *
   * @see https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/no-this-in-sfc.md
   */
  'react/no-this-in-sfc': 'error',
  /**
   * prevents common typos using class lifecycle methods
   *
   * @see https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/no-typos.md
   */
  'react/no-typos': 'error',
  /**
   * off because not needed
   *
   * @see https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/no-unescaped-entities.md
   */
  'react/no-unescaped-entities': 'off',
  /**
   * prevents usage of invalid/unknown DOM properties
   *
   * @see https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/no-unknown-property.md
   */
  'react/no-unknown-property': 'warn',
  /**
   * prevents use of `UNSAFE_` methods
   *
   * @see https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/no-unsafe.md
   */
  'react/no-unsafe': 'error',
  /**
   * hints unused prop types
   *
   * @see https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/no-unused-prop-types.md
   */
  'react/no-unused-prop-types': 'warn',
  /**
   * prevents dead code
   *
   * @see https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/no-unused-state.md
   */
  'react/no-unused-state': 'warn',
  /**
   * prevents usage of `setState` in `componentWillUpdate`
   *
   * @see https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/no-will-update-set-state.md
   */
  'react/no-will-update-set-state': 'warn',
  /**
   * enforce es6/es6 classes for components
   *
   * @see https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/prefer-es6-class.md
   */
  'react/prefer-es6-class': 'error',
  /**
   * off because only works for classes and Flow
   *
   * @see https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/prefer-read-only-props.md
   */
  'react/prefer-read-only-props': 'off',
  /**
   * off because SFC is basically dead
   *
   * @see https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/prefer-stateless-function.md
   */
  'react/prefer-stateless-function': 'off',
  /**
   * off because TypeScript solves this
   *
   * @see https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/prop-types.md
   */
  'react/prop-types': 'off',
  /**
   * neither Next.js nor React >= 17 need React to be in scope
   *
   * @see https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/react-in-jsx-scope.md
   */
  'react/react-in-jsx-scope':
    isNext || version.startsWith('17') ? 'off' : 'error',
  /**
   * off because use function default arguments
   *
   * @see https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/require-default-props.md
   */
  'react/require-default-props': 'off',
  /**
   * off because premature optimization
   *
   * @see https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/require-optimization.md
   */
  'react/require-optimization': 'off',
  /**
   * hints `return` requirement in `render` of class components
   *
   * @see https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/require-render-return.md
   */
  'react/require-render-return': 'error',
  /**
   * prevents extra closing tags for components without children
   *
   * @see https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/self-closing-comp.md
   */
  'react/self-closing-comp': 'warn',
  /**
   * off because not autofixable
   *
   * @see https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/sort-comp.md
   */
  'react/sort-comp': 'off',
  /**
   * off because `sort-keys-fix` takes care of it
   *
   * @see https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/sort-prop-types.md
   */
  'react/sort-prop-types': 'off',
  /**
   * off because state should be properties
   *
   * @see https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/state-in-constructor.md
   */
  'react/state-in-constructor': 'off',
  /**
   * enforces static properties to be within the class
   *
   * @see https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/static-property-placement.md
   */
  'react/static-property-placement': ['error', 'static public field'],
  /**
   * enforce style prop to be an object
   *
   * @see https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/style-prop-object.md
   */
  'react/style-prop-object': 'warn',
  /**
   * prevents passing children to void elements
   *
   * @see https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/void-dom-elements-no-children.md
   */
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
