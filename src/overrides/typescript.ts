import { rules as allPrettierRules } from 'eslint-config-prettier';

import type {
  OverrideCreator,
  OverrideESLintConfig,
  RulesCreator,
} from '../types';
import { tsOverrideType } from '../utils/overrideType';
import { fulfillsVersionRequirement } from '../utils/version';

const prettierTypeScriptRules = Object.fromEntries(
  Object.entries(allPrettierRules).filter(([key]) =>
    key.startsWith('@typescript-eslint')
  )
);

const files = ['**/*.ts?(x)'];
const parser = '@typescript-eslint/parser';
const defaultParserOptions = {
  ecmaFeatures: {
    jsx: false,
  },
  project: './tsconfig.json',
  warnOnUnsupportedTypeScriptVersion: true,
};

const plugins = ['@typescript-eslint'];
const defaultSettings = {
  react: {
    version: 'detect',
  },
};

export const createTypeScriptOverride: OverrideCreator = ({
  rules: customRules,
  files: customFiles,
  ...dependencies
}) => {
  if (!dependencies.typescript.hasTypeScript) {
    return null;
  }

  const rules = {
    ...getTypeScriptRules(dependencies),
    ...getNestJsRules(dependencies),
    ...prettierTypeScriptRules,
    ...customRules,
  };

  const finalFiles = customFiles ?? files;

  const parserOptions: OverrideESLintConfig['parserOptions'] = {
    ...defaultParserOptions,
    ecmaFeatures: {
      ...defaultParserOptions.ecmaFeatures,
      ...(dependencies.react ? { jsx: dependencies.react.hasReact } : null),
    },
  };

  const settings: OverrideESLintConfig['settings'] = {
    ...defaultSettings,
    react: {
      ...defaultSettings.react,
    },
  };

  return {
    files: finalFiles,
    parser,
    parserOptions,
    plugins,
    settings,
    rules,
    overrideType: tsOverrideType,
  };
};

/**
 * @see https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/README.md
 *
 */
export const getTypeScriptRules: RulesCreator = ({
  typescript: { version, config, hasTypeScript },
  react: { isCreateReactApp = false, hasReact = false } = {},
}) => {
  if (!hasTypeScript || !version) {
    return null;
  }

  return {
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
        'ts-expect-error': isCreateReactApp ? true : 'allow-with-description',
        'ts-ignore': true,
        'ts-nocheck': true,
      },
    ],

    /**
     * TSLint is dead
     *
     * @see https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/ban-tslint-comment.md
     */
    ...(isCreateReactApp
      ? null
      : { '@typescript-eslint/ban-tslint-comment': 'error' }),

    /**
     * warn about ambiguous types that might not work as you'd think
     *
     * @see https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/ban-types.md
     */
    '@typescript-eslint/ban-types': 'warn',

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
     * @see https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/comma-dangle.md
     */
    '@typescript-eslint/comma-dangle': 'off',

    /**
     * off because prettier takes care of that
     *
     * @see https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/comma-spacing.md
     */
    '@typescript-eslint/comma-spacing': 'off',

    /**
     * disallow function creation in loops
     *
     * @see https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/no-loop-func.md
     * @see https://eslint.org/docs/rules/no-loop-func
     */
    ...(isCreateReactApp
      ? null
      : { '@typescript-eslint/no-loop-func': 'error' }),

    /**
     * streamlines assertions to use `as` over `<type>`
     * expects objects to be defined by `const foo: Type` over `as Type`
     *
     * @see https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/consistent-type-assertions.md
     */
    ...(fulfillsVersionRequirement({
      given: version,
      expected: '3.4.0',
    })
      ? {
          '@typescript-eslint/consistent-type-assertions': [
            'error',
            {
              assertionStyle: 'as',
              objectLiteralTypeAssertions: 'never',
            },
          ],
        }
      : null),

    /**
     * prefer using types since interfaces:
     * - implicitly merged given multiple declarations of the same name
     * - aren't entirely as flexible as types
     * - may have confusing syntax for functions
     *
     * also consistency
     *
     * @see https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/consistent-type-definitions.md
     */
    '@typescript-eslint/consistent-type-definitions': ['error', 'type'],

    /**
     *  enforces type-only imports when possible
     *
     * @see https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/consistent-type-imports.md
     */
    ...(fulfillsVersionRequirement({ given: version, expected: '3.8.0' })
      ? {
          '@typescript-eslint/consistent-type-imports': [
            'warn',
            {
              disallowTypeAnnotations: true,
              prefer: 'type-imports',
            },
          ],
        }
      : null),

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
     * off because prettier takes care of that
     *
     * @see https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/func-call-spacing.md
     * @see func-call-spacing
     */
    '@typescript-eslint/func-call-spacing': 'off',

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
     * off because prettier takes care of that
     *
     * @see https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/member-delimiter-style.md
     */
    '@typescript-eslint/member-delimiter-style': 'off',

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
     * off since interfaces are forbidden anyways
     *
     * @see https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/method-signature-style.md
     */
    '@typescript-eslint/method-signature-style': 'off',

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
    ...(isCreateReactApp
      ? null
      : { '@typescript-eslint/no-confusing-non-null-assertion': 'error' }),

    /**
     * off because opinionated
     *
     * @see https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/consistent-indexed-object-style.md
     */
    '@typescript-eslint/consistent-indexed-object-style': 'off',

    /**
     * disallows duplicate names in class members
     *
     * @see https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/no-dupe-class-members.md
     * @see no-dupe-class-members
     */
    '@typescript-eslint/no-dupe-class-members': 'error',

    /**
     * prevents duplicate type imports too, on top of the default rule
     *
     * @see https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/no-duplicate-imports.md
     * @see no-duplicate-imports
     * @see import/no-duplicates
     */
    '@typescript-eslint/no-duplicate-imports': 'warn',

    /**
     * warns when trying to dynamically delete a property
     *
     * @see https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/no-dynamic-delete.md
     */
    '@typescript-eslint/no-dynamic-delete': 'warn',

    /**
     * @see https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/no-empty-function.md
     * @see no-empty-function
     */
    '@typescript-eslint/no-empty-function': 'error',

    /**
     * disallows empty interfaces
     *
     * off because interfaces are forbidden anyways
     *
     * @see https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/no-empty-interface.md
     */
    '@typescript-eslint/no-empty-interface': 'off',

    /**
     * disallows explicit any. escalated to error because `warn` would be
     * silenced already, and you usually don't want to have `any`s long time
     *
     * @see https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/no-explicit-any.md
     */
    '@typescript-eslint/no-explicit-any': 'error',

    /**
     * prevents e.g. `!!!`
     *
     * @see https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/no-extra-non-null-assertion.md
     */
    '@typescript-eslint/no-extra-non-null-assertion': 'error',

    /**
     * off because prettier takes care of that
     *
     * @see https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/no-extra-parens.md
     */
    '@typescript-eslint/no-extra-parens': 'off',

    /**
     * off because prettier takes care of that
     *
     * @see https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/no-extra-semi.md
     */
    '@typescript-eslint/no-extra-semi': 'off',

    /**
     * prevents use of class as namespace. use an object instead
     *
     * @see https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/no-extraneous-class.md
     */
    '@typescript-eslint/no-extraneous-class': 'error',

    /**
     * prevents unhandled promises
     *
     * can be enabled in CRA once they support ESLint v8
     *
     * @see https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/no-floating-promises.md
     * @see promise/catch-or-return
     */
    ...(isCreateReactApp
      ? null
      : { '@typescript-eslint/no-floating-promises': 'error' }),

    /**
     * prevents potentially unintended loops
     *
     * @see https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/no-for-in-array.md
     */
    '@typescript-eslint/no-for-in-array': 'warn',

    /**
     * warns implicit-any catches
     *
     * @see https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/no-implicit-any-catch.md
     */
    ...(fulfillsVersionRequirement({ given: version, expected: '4.0.0' })
      ? { '@typescript-eslint/no-implicit-any-catch': 'off' }
      : null),

    /**
     * prevents odd cases of implied eval. probably intentional, given those
     * examples, but fine to disable it there then.
     *
     * @see https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/no-implied-eval.md
     */
    '@typescript-eslint/no-implied-eval': 'error',

    /**
     * prevents unecessary types
     *
     * @see https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/no-inferrable-types.md
     */
    '@typescript-eslint/no-inferrable-types': 'warn',

    /**
     * @see https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/no-invalid-this.md
     * @see no-invalid-this
     */
    '@typescript-eslint/no-invalid-this': 'error',

    /**
     * disallows illogical void type annotations, e.g. in unions
     *
     * __EXPERIMENTAL__
     *
     * @see https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/no-invalid-void-type.md
     */
    '@typescript-eslint/no-invalid-void-type': 'error',

    /**
     * @see https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/no-loss-of-precision.md
     * @see no-loss-of-precision
     */
    ...(isCreateReactApp
      ? null
      : { '@typescript-eslint/no-loss-of-precision': 'error' }),

    /**
     * off because it expects literally every number to be declared as variable
     *
     * @see https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/no-magic-numbers.md
     * @see no-magic-numbers
     */
    '@typescript-eslint/no-magic-numbers': 'off',

    /**
     * disallows defining constructors in interfaces, use `new` instead
     *
     * off because interfaces are forbidden anyways
     *
     * @see https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/no-misused-new.md
     */
    '@typescript-eslint/no-misused-new': 'off',

    /**
     * prevents most likely improperly handled promises
     *
     * @see https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/no-misused-promises.md
     */
    '@typescript-eslint/no-misused-promises': [
      'warn',
      {
        checksConditionals: true,
        checksVoidReturn: true,
      },
    ],

    /**
     * warns when using module/namespace syntax - use import/export instead
     *
     * @see https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/no-namespace.md
     */
    '@typescript-eslint/no-namespace': 'warn',

    /**
     * prevents non-null casting during optional chaining
     *
     * @see https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/no-non-null-asserted-optional-chain.md
     */
    ...(fulfillsVersionRequirement({ given: version, expected: '3.7.0' })
      ? { '@typescript-eslint/no-non-null-asserted-optional-chain': 'error' }
      : null),

    /**
     * prevents casting something as non-null that probably is null
     *
     * @see https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/no-non-null-assertion.md
     */
    '@typescript-eslint/no-non-null-assertion': 'error',

    /**
     * off because opinionated
     *
     * @see https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/no-parameter-properties.md
     */
    '@typescript-eslint/no-parameter-properties': 'off',

    /**
     * prevents partially subtle var redeclaring issues
     *
     * @see https://github.com/typescript-eslint/typescript-eslint/blob/main/packages/eslint-plugin/docs/rules/no-redeclare.md
     */
    '@typescript-eslint/no-redeclare': 'warn',

    /**
     * prevents redundant code
     *
     * @see https://github.com/typescript-eslint/typescript-eslint/blob/main/packages/eslint-plugin/docs/rules/no-redundant-type-constituents.md
     */
    '@typescript-eslint/no-redundant-type-constituents': 'warn',

    /**
     * use import instead of require
     *
     * @see https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/no-require-imports.md
     */
    '@typescript-eslint/no-require-imports': 'error',

    /**
     * disallows assigning `this` to a variable.
     *
     * destructuring from a class is still allowed.
     *
     * @see https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/no-this-alias.md
     */
    '@typescript-eslint/no-this-alias': [
      'error',
      {
        allowDestructuring: true,
      },
    ],

    /**
     * disallows throwing anything else than an error
     *
     * @see https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/no-throw-literal.md
     */
    '@typescript-eslint/no-throw-literal': 'error',

    /**
     * off because aliasing is fine and this rule does not allow to exclusively
     * forbid aliasing e.g. `type MyString = string`
     *
     * @see https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/no-type-alias.md
     */
    '@typescript-eslint/no-type-alias': 'off',

    /**
     * prevents unecessary comparison
     *
     * @see https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/no-unnecessary-boolean-literal-compare.md
     */
    '@typescript-eslint/no-unnecessary-boolean-literal-compare':
      isCreateReactApp
        ? 'warn'
        : [
            'warn',
            {
              allowComparingNullableBooleansToFalse: false,
              allowComparingNullableBooleansToTrue: false,
            },
          ],

    /**
     * prevents unecessary checks
     *
     * @see https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/no-unnecessary-condition.md
     */
    '@typescript-eslint/no-unnecessary-condition': config?.compilerOptions
      ?.strictNullChecks
      ? 'warn'
      : 'off',

    /**
     * prevents using unmecessary qualifier
     *
     * @see https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/no-unnecessary-qualifier.md
     */
    '@typescript-eslint/no-unnecessary-qualifier': 'error',

    /**
     * prevents unnecessary type arguments
     *
     * @see https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/no-unnecessary-type-arguments.md
     */
    '@typescript-eslint/no-unnecessary-type-arguments': 'error',

    /**
     * prevents unnecessary type assertions
     *
     * @see https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/no-unnecessary-type-assertion.md
     */
    '@typescript-eslint/no-unnecessary-type-assertion': 'warn',

    /**
     * @see https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/no-unnecessary-type-constraint.md
     */
    '@typescript-eslint/no-unnecessary-type-constraint': 'warn',

    /**
     * prevents accidental any leaking into your code
     *
     * off because lots of false positives
     *
     * @see https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/no-unsafe-argument.md
     */
    '@typescript-eslint/no-unsafe-argument': 'off',

    /**
     * off because already handled
     *
     * @see https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/no-unsafe-assignment.md
     * @see @typescript-eslint/no-explicit-any
     */
    '@typescript-eslint/no-unsafe-assignment': 'off',

    /**
     * off because already handled
     *
     * @see https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/no-unsafe-call.md
     * @see @typescript-eslint/no-explicit-any
     */
    '@typescript-eslint/no-unsafe-call': 'off',

    /**
     * off because already handled
     *
     * @see https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/no-unsafe-member-access.md
     * @see @typescript-eslint/no-explicit-any
     */
    '@typescript-eslint/no-unsafe-member-access': 'off',

    /**
     * off because already handled
     *
     * @see https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/no-unsafe-return.md
     * @see @typescript-eslint/no-explicit-any
     */
    '@typescript-eslint/no-unsafe-return': 'off',

    /**
     * @see https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/no-unused-expressions.md
     * @see no-unused-expressions
     */
    '@typescript-eslint/no-unused-expressions': 'error',

    /**
     * adds support for TS features, e.g. types
     *
     * @see https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/no-unused-vars.md
     */
    '@typescript-eslint/no-unused-vars': 'warn',

    /**
     * blocked because false positives
     *
     * @see https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/no-use-before-define.md
     * @see https://github.com/typescript-eslint/typescript-eslint/issues/2453
     * @see https://github.com/typescript-eslint/typescript-eslint/issues/2452
     * @see https://github.com/typescript-eslint/typescript-eslint/issues/2451
     * @see https://github.com/typescript-eslint/typescript-eslint/issues/2449
     */
    '@typescript-eslint/no-use-before-define': 'off',

    /**
     * @see https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/no-useless-constructor.md
     * @see no-useless-constructor
     */
    '@typescript-eslint/no-useless-constructor': 'error',

    /**
     * prevents redundant code
     *
     * @see https://github.com/typescript-eslint/typescript-eslint/blob/main/packages/eslint-plugin/docs/rules/no-useless-empty-export.md
     */
    '@typescript-eslint/no-useless-empty-export': 'error',

    /**
     * off because already handled
     *
     * @see https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/no-var-requires.md
     * @see @typescript-eslint/no-namespace
     */
    '@typescript-eslint/no-var-requires': 'off',

    /**
     * detects when `as` casts can be simplified to `!`
     *
     * off because it conflicts in some cases with `@typescript-eslint/no-non-null-assertion` which has priority
     * @see https://github.com/ljosberinn/eslint-config-galex/issues/235
     *
     * @see https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/non-nullable-type-assertion-style.md
     */
    '@typescript-eslint/non-nullable-type-assertion-style': 'off',

    /**
     * off because handled by prettier
     *
     * @see https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/object-curly-spacing.md
     * @see object-curly-spacing
     */
    '@typescript-elint/object-curly-spacing': 'off',

    /**
     * sorts members of type union/intersection are sorted alphabetically
     *
     * off because opinionated
     *
     * @see https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/sort-type-union-intersection-members.md
     */
    '@typescript-eslint/sort-type-union-intersection-members': 'off',

    /**
     * prefer using `as const` syntax over casting
     *
     * @see https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/prefer-as-const.md
     */
    ...(fulfillsVersionRequirement({ given: version, expected: '3.4.0' })
      ? { '@typescript-eslint/prefer-as-const': 'error' }
      : null),

    /**
     * be explicit about enum members
     *
     * @see https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/prefer-enum-initializers.md
     */
    ...(isCreateReactApp
      ? null
      : { '@typescript-eslint/prefer-enum-initializers': 'error' }),

    /**
     * prefer using `for...of` when only iterating the index
     *
     * @see https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/prefer-for-of.md
     */
    '@typescript-eslint/prefer-for-of': 'warn',

    /**
     * off because opinonated
     *
     * @see https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/prefer-function-type.md
     */
    '@typescript-eslint/prefer-function-type': 'off',

    /**
     * prefer using array.includes over older alternatives
     *
     * @see https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/prefer-includes.md
     */
    '@typescript-eslint/prefer-includes': 'warn',

    /**
     * enforces enum members to be literal values
     *
     * @see https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/prefer-literal-enum-member.md
     */
    ...(isCreateReactApp
      ? null
      : { '@typescript-eslint/prefer-literal-enum-member': 'error' }),

    /**
     * use `namespace` over `module`
     *
     * @see https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/prefer-namespace-keyword.md
     */
    '@typescript-eslint/prefer-namespace-keyword': 'error',

    /**
     * prefer ?? over || where needed
     *
     * @see https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/prefer-nullish-coalescing.md
     */
    ...(fulfillsVersionRequirement({ given: version, expected: '3.7.0' })
      ? { '@typescript-eslint/prefer-nullish-coalescing': 'error' }
      : null),

    /**
     * prefer `foo?.bar?.baz` over `foo && foo.bar && foo.bar.baz`
     *
     * @see https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/prefer-optional-chain.md
     */
    ...(fulfillsVersionRequirement({ given: version, expected: '3.7.0' })
      ? { '@typescript-eslint/prefer-optional-chain': 'error' }
      : null),

    /**
     * prefer having all function parameters to be readonly
     *
     * @see https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/prefer-readonly.md
     */
    '@typescript-eslint/prefer-readonly': 'error',

    /**
     * prefer all function parameters to be readonly
     *
     * off because of false positives that never go away :cry:
     *
     * @see https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/prefer-readonly-parameter-types.md
     */
    '@typescript-eslint/prefer-readonly-parameter-types': 'off',

    /**
     * use `[].reduce<Type>` over `[].reduce(...) as Type`
     *
     * @see https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/prefer-reduce-type-parameter.md
     */
    '@typescript-eslint/prefer-reduce-type-parameter': 'error',

    /**
     * use RegExp#exec over String#match because performance
     *
     * warn because autofixeable since 4.22.0
     *
     * @see https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/prefer-regexp-exec.md
     */
    '@typescript-eslint/prefer-regexp-exec': 'warn',

    /**
     * use String.startsWith/.endsWith over String.indexOf or regex
     *
     * @see https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/prefer-string-starts-ends-with.md
     */
    '@typescript-eslint/prefer-string-starts-ends-with': 'error',

    /**
     * prefer using `// @ts-expect-error` as its better than `// @ts-ignore`
     *
     * @see https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/prefer-ts-expect-error.md
     */
    ...(fulfillsVersionRequirement({ given: version, expected: '3.9.0' })
      ? { '@typescript-eslint/prefer-ts-expect-error': 'error' }
      : null),

    /**
     * returning void may lead to confusing code
     *
     * @see https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/no-confusing-void-expression.md
     */
    '@typescript-eslint/no-confusing-void-expression': 'warn',

    /**
     * off because nonsensical
     *
     * @see https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/promise-function-async.md
     */
    '@typescript-eslint/promise-function-async': 'off',

    /**
     * off because handled by prettier
     *
     * @see https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/quotes.md
     */
    '@typescript-eslint/quotes': 'off',

    /**
     * prevents using `[].sort()` without compare function
     *
     * @see https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/require-array-sort-compare.md
     */
    '@typescript-eslint/require-array-sort-compare': 'warn',

    /**
     * enforces both sides of an addition to be of the same type
     *
     * @see https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/restrict-plus-operands.md
     */
    '@typescript-eslint/restrict-plus-operands': 'warn',

    /**
     * enforces template literal expressions to be of type string
     *
     * @see https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/restrict-template-expressions.md
     */
    '@typescript-eslint/restrict-template-expressions': [
      'warn',
      {
        allowBoolean: true,
        allowNumber: true,
      },
    ],

    /**
     * prevents using `async` without `await`
     *
     * @see https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/require-await.md
     */
    '@typescript-eslint/return-await': 'error',

    /**
     * off because handled by prettier
     *
     * @see https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/semi.md
     * @see semi
     */
    '@typescript-eslint/semi': 'off',

    /**
     * off because handled by prettier
     *
     * @see https://github.com/typescript-eslint/typescript-eslint/blob/main/packages/eslint-plugin/docs/rules/space-before-blocks.md
     */
    '@typescript-eslint/space-before-blocks': 'off',

    /**
     * off because handled by prettier
     *
     * @see https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/space-before-function-paren.md
     */
    '@typescript-eslint/space-before-function-paren': 'off',

    /**
     * off because handled by prettier
     *
     * @see https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/space-infix-ops.md
     * @see space-infix-ops
     */
    '@typescript-eslint/space-infix-ops': 'off',

    /**
     * off because opinionated. unless you have odd types going on, this shouldn't
     * be an issue following best practices.
     *
     * @see https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/strict-boolean-expressions.md
     */
    '@typescript-eslint/strict-boolean-expressions': 'off',

    /**
     * enforces switch statements cover all cases
     *
     * @see https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/switch-exhaustiveness-check.md
     */
    '@typescript-eslint/switch-exhaustiveness-check': 'warn',

    /**
     * prefer import over triple slash references
     *
     * @see https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/triple-slash-reference.md
     */
    '@typescript-eslint/triple-slash-reference': 'warn',

    /**
     * off because handled by prettier
     *
     * @see https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/type-annotation-spacing.md
     */
    '@typescript-eslint/type-annotation-spacing': 'off',

    /**
     * off because inference works
     *
     * @see https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/typedef.md
     */
    '@typescript-eslint/typedef': 'off',

    /**
     * enforces unbound methods are called with their expected scope
     *
     * off in react because it reports plenty of false positives with hooks
     *
     * @see https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/unbound-method.md
     */
    '@typescript-eslint/unbound-method': hasReact ? 'off' : 'warn',

    /**
     * prefer unions for function parameters instead of separate overloads
     *
     * @see https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/unified-signatures.md
     */
    '@typescript-eslint/unified-signatures': 'warn',
  };
};

/**
 * @see https://github.com/nestjs/typescript-starter/blob/master/.eslintrc.js
 */
export const getNestJsRules: RulesCreator = ({ hasNest }) => {
  if (!hasNest) {
    return null;
  }

  return {
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-extraneous-class': 'off',
  };
};
