import { Linter } from '@typescript-eslint/utils/dist/ts-eslint';
import {
  Dependencies,
  OverrideCreator,
  OverrideESLintConfig,
  OverrideInternalOverride,
  RulesCreator,
} from '../types';
import { uniqueArrayEntries } from '../utils/array';
import { reactOverrideType } from '../utils/overrideType';
import { prettierReactRules } from '../utils/prettier';
import { fulfillsVersionRequirement } from '../utils/version';

export const plugins = ['jsx-a11y', 'react-hooks', 'react', '@next/next'];
export const files = ['**/*.?(ts|js)?(x)'];
export const parser = '@babel/eslint-parser';

export const defaultParserOptions: OverrideESLintConfig['parserOptions'] = {
  requireConfigFile: false,
  sourceType: 'module',
  ecmaFeatures: {
    jsx: true,
  },
};
export const defaultSettings: OverrideESLintConfig['settings'] = {
  react: {
    version: 'detect',
  },
};

export const createReactOverride: OverrideCreator = ({
  rules: customRules,
  files: customFiles,
  parserOptions: customParserOptions,
  settings: customSettings,
  env: customEnv,
  excludedFiles: customExcludedFiles,
  extends: customExtends,
  globals: customGlobals,
  plugins: customPlugins,
  overrides: customOverrides,
  ...dependencies
}) => {
  if (!dependencies.react.hasReact) {
    return null;
  }

  // required for `babel-preset-react-app`
  if (dependencies.react.isCreateReactApp && !process.env.NODE_ENV) {
    process.env.NODE_ENV = 'development';
  }

  const rules: OverrideESLintConfig['rules'] = {
    ...createReactRules(dependencies),
    ...createNextJsRules(dependencies),
    ...prettierReactRules,
    ...createJSXA11yRules(dependencies),
    ...hookRules,
    ...customRules,
  };

  const finalFiles = customFiles || files;

  const parserOptions = {
    ...defaultParserOptions,
    ...customParserOptions,
    ecmaFeatures: {
      ...defaultParserOptions.ecmaFeatures,
      ...customParserOptions?.ecmaFeatures,
    },
    babelOptions: {
      presets: uniqueArrayEntries([
        dependencies.react.isNext
          ? 'next/babel'
          : dependencies.react.isCreateReactApp
          ? 'react-app'
          : !dependencies.typescript.hasTypeScript && '@babel/preset-react',
        ...customParserOptions?.babelOptions?.presets,
      ]),
    },
  };

  const settings = {
    ...defaultSettings,
    ...customSettings,
    react: {
      ...defaultSettings.react,
      ...customSettings?.react,
    },
    ...createRemixJsImportResolverSettings(dependencies),
  };

  const finalPlugins = uniqueArrayEntries([
    ...plugins,
    ...(customPlugins ?? []),
  ]);

  return {
    rules,
    files: finalFiles,
    parserOptions: parserOptions,
    plugins: finalPlugins,
    overrideType: reactOverrideType,
    parser,
    settings,
    extends: customExtends,
    globals: customGlobals,
    overrides: customOverrides,
  };
};

/**
 * @see https://github.com/facebook/react/tree/master/packages/eslint-plugin-react-hooks
 */
export const hookRules: Linter.RulesRecord = {
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

/**
 * @see https://github.com/yannickcr/eslint-plugin-react/tree/master/docs/rules
 */
export const createReactRules: RulesCreator = ({
  react: { isNext, version, isCreateReactApp },
  typescript: { hasTypeScript },
}) => {
  if (!version) {
    return null;
  }

  return {
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
     * prefer destructuring when possible. does lead to type limitations with TS,
     * hence its disabled there.
     *
     * @see https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/destructuring-assignment.md
     */
    'react/destructuring-assignment': hasTypeScript
      ? 'off'
      : ['error', 'always'],

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
      'warn',
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
    'react/jsx-key': [
      'warn',
      {
        checkFragmentShorthand: true,
        /**
         * only active with new React JSX transform
         *
         * @see https://github.com/facebook/react/issues/20031#issuecomment-710346866
         * @see https://togithub.com/yannickcr/eslint-plugin-react/pull/2835
         */
        checkKeyMustBeforeSpread: fulfillsVersionRequirement({
          given: version,
          expected: '17.0.0',
        }),
      },
    ],

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
     * enforces new line after jsx elements and expressions
     *
     * off because opinionated
     *
     * @see https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/jsx-newline.md
     */
    'react/jsx-newline': 'off',

    /**
     * off because its nonsensical to enforce memoizing every function
     *
     * @see https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/jsx-no-bind.md
     */
    'react/jsx-no-bind': 'off',

    /**
     * prevents comments from being inserted as text nodes
     *
     * @see https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/jsx-no-comment-textnodes.md
     */
    'react/jsx-no-comment-textnodes': 'warn',

    /**
     * prevents potential performance issues using React.createContext Provider
     *
     * @see https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/jsx-no-constructed-context-values.md
     */
    'react/jsx-no-constructed-context-values': 'warn',

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
     * off because function components are preferred anyways and theres little
     * reason to prevent this anyways
     *
     * @see https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/no-arrow-function-lifecycle.md
     */
    'react/no-arrow-function-lifecycle': 'off',

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
     * disallows improper use of html attributes
     *
     * @see https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/no-invalid-html-attribute.md
     */
    'react/no-invalid-html-attribute': hasTypeScript ? 'off' : 'warn',

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
    'react/no-multi-comp': 'off',

    /**
     * forbids usage of namespaces
     *
     * can be enabled once CRA uses eslint-plugin-react v7.26.0
     *
     * @see https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/no-namespace.md
     */
    ...(isCreateReactApp ? null : { 'react/no-namespace': 'error' }),

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
      isNext ||
      fulfillsVersionRequirement({ given: version, expected: '17.0.0' })
        ? 'off'
        : 'error',

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
  };
};

/**
 * @see https://github.com/evcohen/eslint-plugin-jsx-a11y/tree/master/docs/rules
 */
export const createJSXA11yRules: RulesCreator = ({
  react: { isNext, isCreateReactApp },
}) => {
  return {
    /**
     * off because deprecated
     *
     * @see https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/blob/master/docs/rules/accessible-emoji.md
     */
    'jsx-a11y/accessible-emoji': 'off',

    /**
     * enforces <img alt /> attribute
     *
     * @see https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/blob/master/docs/rules/alt-text.md
     */
    'jsx-a11y/alt-text': 'error',

    /**
     * enforces `children` in `a`
     *
     * @see https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/blob/master/docs/rules/anchor-has-content.md
     */
    'jsx-a11y/anchor-has-content': 'error',

    /**
     * ensures core `a` attributes are valid
     *
     * exclude `noHref` validation for Nextjs because
     *
     * @example
     * ```js
     * <Link passHref href="/foo">
     *  <a>hi</a
     * </Link>
     * ```
     * is valid
     *
     * @see https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/blob/master/docs/rules/anchor-is-valid.md
     */
    'jsx-a11y/anchor-is-valid': [
      'error',
      {
        aspects: [
          'invalidHref',
          isNext ? null : 'noHref',
          'preferButton',
        ].filter(Boolean),
        components: isNext ? ['Link'] : [],
      },
    ],

    /**
     * ensures using `aria-activedescendant` also has a valid `tabIndex`
     *
     * @see https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/blob/master/docs/rules/aria-activedescendant-has-tabindex.md
     */
    'jsx-a11y/aria-activedescendant-has-tabindex': 'warn',

    /**
     * disallows invalid `aria-*` attributes
     *
     * @see https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/blob/master/docs/rules/aria-props.md
     */
    'jsx-a11y/aria-props': 'error',

    /**
     * enforces correct values for `aria-*` values
     *
     * @see https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/blob/master/docs/rules/aria-proptypes.md
     */
    'jsx-a11y/aria-proptypes': 'error',

    /**
     * enforces use of real `aria-role` values
     *
     * @see https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/blob/master/docs/rules/aria-role.md
     */
    'jsx-a11y/aria-role': ['warn', { ignoreNonDOM: true }],

    /**
     * enforces using `aria-*` attributes only on elements that support it
     *
     * @see https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/blob/master/docs/rules/aria-unsupported-elements.md
     */
    'jsx-a11y/aria-unsupported-elements': 'error',

    /**
     * enforces proper use of the `autocomplete` property
     *
     * @see https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/blob/master/docs/rules/autocomplete-valid.md
     */
    ...(isCreateReactApp ? null : { 'jsx-a11y/autocomplete-valid': 'error' }),

    /**
     * enforces `onClick`s are accompanied by at least one of `onKey*`
     *
     * __EXPERIMENTAL__
     *
     * @see https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/blob/master/docs/rules/click-events-have-key-events.md
     */
    'jsx-a11y/click-events-have-key-events': 'warn',

    /**
     * enforces use of `aria-label` where needed
     *
     * @see https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/blob/master/docs/rules/control-has-associated-label.md
     */
    'jsx-a11y/control-has-associated-label': 'warn',

    /**
     * enforces `h1` etc. have content
     *
     * @see https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/blob/master/docs/rules/heading-has-content.md
     */
    'jsx-a11y/heading-has-content': 'warn',

    /**
     * ensures `html` tag has a `lang` attribute
     *
     * @see https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/blob/master/docs/rules/html-has-lang.md
     */
    'jsx-a11y/html-has-lang': 'warn',

    /**
     * ensures `iframe` tag has a `title` attribute
     *
     * @see https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/blob/master/docs/rules/iframe-has-title.md
     */
    'jsx-a11y/iframe-has-title': 'warn',

    /**
     * ensures validity of `img` `alt` attribute
     *
     * @see https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/blob/master/docs/rules/img-redundant-alt.md
     */
    'jsx-a11y/img-redundant-alt': 'warn',

    /**
     * @see https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/blob/master/docs/rules/interactive-supports-focus.md
     */
    'jsx-a11y/interactive-supports-focus': 'error',

    /**
     * enforce that a `label` tag has a text label and an associated control
     *
     * @see https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/blob/master/docs/rules/label-has-associated-control.md
     */
    'jsx-a11y/label-has-associated-control': 'error',

    /**
     * off because deprecated in favor of `jsx-a11y/label-has-associated-control'
     *
     * @see https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/blob/master/docs/rules/label-has-for.md
     * @see https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/blob/master/docs/rules/label-has-associated-control.md
     */
    'jsx-a11y/label-has-for': 'off',

    /**
     * ensures `html` tag has a valid `lang` attribute
     *
     * @see https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/blob/master/docs/rules/lang.md
     */
    'jsx-a11y/lang': 'error',

    /**
     * ensures media elements have captions
     *
     * @see https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/blob/master/docs/rules/media-has-caption.md
     */
    'jsx-a11y/media-has-caption': 'warn',

    /**
     * enforce `onMouse*` are accompanied by `onFocus`/`onBlur`
     *
     * @see https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/blob/master/docs/rules/mouse-events-have-key-events.md
     */
    'jsx-a11y/mouse-events-have-key-events': 'error',

    /**
     * enforce no `accessKey` prop on element
     *
     * @see https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/blob/master/docs/rules/no-access-key.md
     */
    'jsx-a11y/no-access-key': 'warn',

    /**
     * enforce that `autoFocus` prop is not used on elements
     *
     * @see https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/blob/master/docs/rules/no-autofocus.md
     */
    'jsx-a11y/no-autofocus': 'error',

    /**
     * enforces that no distracting elements are used
     *
     * @see https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/blob/master/docs/rules/no-distracting-elements.md
     */
    'jsx-a11y/no-distracting-elements': 'warn',

    /**
     * use appropriate tags
     *
     * @see https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/blob/master/docs/rules/no-interactive-element-to-noninteractive-role.md
     */
    'jsx-a11y/no-interactive-element-to-noninteractive-role': 'error',

    /**
     * prevents assigning interactions to non-interactive elements
     *
     * @see https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/blob/master/docs/rules/no-noninteractive-element-interactions.md
     */
    'jsx-a11y/no-noninteractive-element-interactions': 'error',

    /**
     * prevents assigning interactive roles to non-interactive elements
     *
     * @see https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/blob/master/docs/rules/no-noninteractive-element-to-interactive-role.md
     */
    'jsx-a11y/no-noninteractive-element-to-interactive-role': [
      'error',
      {
        li: ['menuitem', 'option', 'row', 'tab', 'treeitem'],
        ol: [
          'listbox',
          'menu',
          'menubar',
          'radiogroup',
          'tablist',
          'tree',
          'treegrid',
        ],
        table: ['grid'],
        td: ['gridcell'],
        ul: [
          'listbox',
          'menu',
          'menubar',
          'radiogroup',
          'tablist',
          'tree',
          'treegrid',
        ],
      },
    ],

    /**
     * limits tab key navigation to elements that can be interacted with
     *
     * @see https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/blob/master/docs/rules/no-noninteractive-tabindex.md
     */
    'jsx-a11y/no-noninteractive-tabindex': 'error',

    /**
     * prefer `onBlur` over `onChange`
     *
     * off because deprecated
     *
     * @see https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/blob/master/docs/rules/no-onchange.md
     */
    'jsx-a11y/no-onchange': 'off',

    /**
     * prevents roles on elements that already have the role implicitly
     *
     * @see https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/blob/master/docs/rules/no-redundant-roles.md
     */
    'jsx-a11y/no-redundant-roles': 'warn',

    /**
     * prevents assigning interactions to static elements
     *
     * use a role
     *
     * @see https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/blob/master/docs/rules/no-static-element-interactions.md
     */
    'jsx-a11y/no-static-element-interactions': 'error',

    /**
     * elements with roles must have all required attributes for that role
     *
     * @see https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/blob/master/docs/rules/role-has-required-aria-props.md
     */
    'jsx-a11y/role-has-required-aria-props': 'error',

    /**
     * enforce that elements with roles defined contain only `aria-*` properties
     * supported by that role
     *
     * @see https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/blob/master/docs/rules/role-supports-aria-props.md
     */
    'jsx-a11y/role-supports-aria-props': 'error',

    /**
     * prevents using `scope` prop on anything other than `th`
     *
     * @see https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/blob/master/docs/rules/scope.md
     */
    'jsx-a11y/scope': 'error',

    /**
     * prevents positive `tabIndex` props to not mess with page flow
     *
     * @see https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/blob/master/docs/rules/tabindex-no-positive.md
     */
    'jsx-a11y/tabindex-no-positive': 'error',
  };
};

export const createNextJsRules: RulesCreator = ({ react: { isNext } }) => {
  if (!isNext) {
    return null;
  }

  return {
    /**
     * ensure correct font-display property is assigned for Google Fonts
     *
     * @see https://github.com/vercel/next.js/blob/canary/packages/eslint-plugin-next/lib/rules/google-font-display.js
     */
    '@next/next/google-font-display': 'warn',

    /**
     * ensures preconnect is used with Google Fonts
     *
     * @see https://github.com/vercel/next.js/blob/canary/packages/eslint-plugin-next/lib/rules/google-font-preconnect.js
     */
    '@next/next/google-font-preconnect': 'error',

    /**
     * next/script components with inline content must specify an `id` attribute
     *
     * @see https://github.com/vercel/next.js/blob/canary/packages/eslint-plugin-next/lib/rules/inline-script-id.js
     */
    '@next/next/inline-script-id': 'error',

    /**
     * ensure `passHref` is assigned if child of `Link` component is a custom component
     *
     * @see https://github.com/vercel/next.js/blob/canary/packages/eslint-plugin-next/lib/rules/link-passhref.js
     */
    '@next/next/link-passhref': 'error',

    /**
     * use next/script component for loading third party scripts
     *
     * @see https://github.com/vercel/next.js/blob/canary/packages/eslint-plugin-next/lib/rules/next-script-for-ga.js
     */
    '@next/next/next-script-for-ga': 'warn',

    /**
     * should be imported directly
     *
     * @see https://github.com/vercel/next.js/blob/canary/packages/eslint-plugin-next/lib/rules/no-css-tags.js
     */
    '@next/next/no-css-tags': 'warn',

    /**
     * disallow importing `next/document` outside of pages/document.js
     *
     * off until https://github.com/vercel/next.js/issues/28169 is resolved
     *
     * @see https://github.com/vercel/next.js/blob/canary/packages/eslint-plugin-next/lib/rules/no-document-import-in-page.js
     */
    '@next/next/no-document-import-in-page': 'off',

    /**
     * enforces singular usage of <Head> in _document
     *
     * @see https://github.com/vercel/next.js/blob/canary/packages/eslint-plugin-next/lib/rules/no-duplicate-head.js
     */
    '@next/next/no-duplicate-head': 'error',

    /**
     * prohibits usage of HTML <head> element
     *
     * @see https://github.com/vercel/next.js/blob/canary/packages/eslint-plugin-next/lib/rules/no-head-element.js
     */
    '@next/next/no-head-element': 'error',

    /**
     * disallow importing `next/head` in pages/document.js
     *
     * @see https://github.com/vercel/next.js/blob/canary/packages/eslint-plugin-next/lib/rules/no-head-import-in-document.js
     */
    '@next/next/no-head-import-in-document': 'error',

    /**
     * disallows regular <a> links
     *
     * @see https://github.com/vercel/next.js/blob/canary/packages/eslint-plugin-next/lib/rules/no-html-link-for-pages.js
     */
    '@next/next/no-html-link-for-pages': 'warn',

    /**
     * prohibit usage of HTML <img> element
     *
     * off because project dependant; incompatible with next export etc.
     *
     * @see https://github.com/vercel/next.js/blob/canary/packages/eslint-plugin-next/lib/rules/no-img-element.js
     */
    '@next/next/no-img-element': 'off',

    /**
     * recommend adding custom font in a custom document and not in a specific page
     *
     * @see https://github.com/vercel/next.js/blob/canary/packages/eslint-plugin-next/lib/rules/no-page-custom-font.js
     */
    '@next/next/no-page-custom-font': 'warn',

    /**
     * disallow importing `next/script` inside `pages/_document`
     *
     * @see https://github.com/vercel/next.js/blob/canary/packages/eslint-plugin-next/lib/rules/no-script-in-document.js
     */
    '@next/next/no-script-in-document': 'error',

    /**
     * disallows importing next/server outside of _middleware
     *
     * off as its not currently registered. see https://github.com/vercel/next.js/blob/canary/packages/eslint-plugin-next/lib/index.js
     *
     * @see https://github.com/vercel/next.js/blob/canary/packages/eslint-plugin-next/lib/rules/no-server-import-in-page.js
     */
    // '@next/next/no-server-import-in-page': 'error',

    /**
     * sync scripts can impact performance
     *
     * @see https://github.com/vercel/next.js/blob/canary/packages/eslint-plugin-next/lib/rules/no-sync-scripts.js
     */
    '@next/next/no-sync-scripts': 'warn',

    /**
     * disallow using <title> with `Head` from `next/document`
     *
     * @see https://github.com/vercel/next.js/blob/canary/packages/eslint-plugin-next/lib/rules/no-title-in-document-head.js
     */
    '@next/next/no-title-in-document-head': 'warn',

    /**
     * tries to correct typos for page-related exports
     *
     * @see https://github.com/vercel/next.js/blob/canary/packages/eslint-plugin-next/lib/rules/no-typos.js
     */
    '@next/next/no-typos': 'warn',

    /**
     * disallow of polyfill.io in some cases
     *
     * @see https://github.com/vercel/next.js/blob/canary/packages/eslint-plugin-next/lib/rules/no-unwanted-polyfillio.js
     */
    '@next/next/no-unwanted-polyfillio': 'warn',
  };
};

// files within `pages/` and `/src/pages` require a default export
const nextJsPagesOverrideFiles: OverrideESLintConfig['files'] = [
  'src/pages/**/*.?(t|j)s?(x)',
  'pages/**/*.?(t|j)s?(x)',
];

const nextJsPagesRules: OverrideESLintConfig['rules'] = {
  'import/no-default-export': 'off',
};

export const createNextJsPagesOverride: OverrideInternalOverride =
  dependencies => {
    if (!dependencies.react.isNext) {
      return null;
    }

    return {
      files: nextJsPagesOverrideFiles,
      rules: nextJsPagesRules,
    };
  };

const remixRunOverrideFiles: OverrideESLintConfig['files'] = [
  'app/**/*.?(t|j)s?(x)',
];

const remixRules: OverrideESLintConfig['rules'] = {
  'import/no-default-export': 'off',
};

export const createRemixRunOverride: OverrideInternalOverride =
  dependencies => {
    if (!dependencies.react.isRemix) {
      return null;
    }

    return {
      files: remixRunOverrideFiles,
      rules: remixRules,
    };
  };

export const createRemixJsImportResolverSettings = (
  dependencies: Dependencies
): OverrideESLintConfig['settings'] | null => {
  if (dependencies.typescript.hasTypeScript || !dependencies.react.isRemix) {
    return null;
  }

  return {
    'import/resolver': {
      jsconfig: {
        config: 'jsconfig.json',
      },
    },
  };
};
