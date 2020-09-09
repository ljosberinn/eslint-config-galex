# eslint-config-galex

[npm-shield]: https://img.shields.io/npm/dt/eslint-config-galex.svg
[npm-url]: https://www.npmjs.com/package/eslint-config-galex

![npm](https://img.shields.io/npm/v/eslint-config-galex)
[![NPM Total Downloads][npm-shield]][npm-url]
![NPM](https://img.shields.io/npm/l/eslint-config-galex)
[![Test Coverage](https://api.codeclimate.com/v1/badges/9c3a13e05f2a195ba0d5/test_coverage)](https://codeclimate.com/github/ljosberinn/eslint-config-galex/test_coverage)

```sh
yarn add -D eslint-config-galex eslint

npm install --save-dev eslint-config-galex eslint
```

```js
// eslintrc.js
module.exports = {
  extends: 'galex',
};

// or .eslintrc
{
  "extends": "galex"
}
```

# I went through 30+ eslint-plugins so you don't have to.

Setting up ESLint can be easy.

Plug in someone's config or one of the many "industry standards" and be done
with it. Eventually you learn that some of those practices maybe aren't the best
idea. Too restrictive, treading into Prettier territory, conflicting with other
rules, too opinionated or even outdated, you name it. What to do?

You begin adding `// eslint-disable-next-line rulename-here`. It works, but
litters the code.

You begin disabling rules altogether. Maybe because you don't know better, or
because the rule is actually bad for your situation. You begin to wonder.

You check npm and see there are 2.8k+ (August 2020) `eslint-plugin-*` packages
out there. And even worse - 10k+ `eslint-config-*` packages. Which to choose?
You sort by popularity and see some familiar faces. Time to install!

A few hours into stitching all those popular linting rules together you notice
some rules collide, some rules are outdated, some expect others to be disabled,
but only circumstantially. Enough!

_"Now is the time to finally read through all rulesets and decide which I want!"_
you scream out loud, _"it can't be that many!"_ - but find yourself finishing the
first repo after 6 hours.

Setting up ESLint _properly_ wasn't that easy after all.

Couldn't this be easier?

## What makes this different than all the other configs out there?

- All internals, literally everything, is re-exported.Don't like some
  decision? Rules too weak? Want to add custom rules? Everything is covered!

  This hopefully prevents the need of having to migrate between configs every
  once in a while which builds up frustration due to misconfiguration and the
  entire overhead related to that. Dependency injection, just for an eslint
  config!

  > The following examples are not exhaustive - there's a lot more. Check out
  > the source!

  ```js
  // .eslintrc.js

  // customize the config as-is:
  const { createConfig } = require('eslint-config-galex/src/createConfig');

  module.exports = createConfig();

  // pass in your own rules
  module.exports = createConfig({ rules: myCustomRules });
  // or plugins
  module.exports = createConfig({ plugins: myCustomPluginArray });

  // package.json / tsconfig.json in other directories?
  module.exports = createConfig({ cwd: 'path/to/file' });

  // only use the TS override:
  const {
    createTSOverride,
  } = require('eslint-config-galex/src/overrides/typescript');

  // then compose with e.g. other overrides and createConfig
  const override = createTSOverride({
    react: {
      hasReact: true,
      // might also be a good idea to `require('./package.json') and reference
      // `packageJson.dependencies.react`
      version: '17.0.0-rc.1',
      isCreateReactApp: false,
    },
    typescript: {
      hasTypeScript: true,
      version: '4.0.2',
    },
    rules: {
      // typescript specific rules go here
    },
  });

  // only use the glob pattern for TS files:
  const { files } = require('eslint-config-galex/src/overrides/typescript');

  // only use testing-library rules:
  const {
    getTestingLibraryRules,
  } = require('eslint-config-galex/src/overrides/jest');

  const testingLibRules = getTestingLibraryRules({ hasReact: boolean });
  ```

  Learn more on customizing [here](#customization).

- This one is brand new with a _heavy_ focus on code quality, best practices and
  tries to omit opinions. We're using a subset at work too, and it has exclusively
  detected overseen/undetected bugs and reasonable improvements.

  Feedback so far has been generally positive. The only rule that raised eyebrows
  was `import/order` because it leads to a huge git diff when applied on existing
  projects.

- You may of course just use it as is!

## What's included?

Everything is dynamically included based on your `package.json`.
Rules are selectively applied based on file name patterns.

All rules are commented and link to their docs.

- [x] React
- [x] Next.js
- [x] TypeScript
- [x] Node.js
- [x] jest
- [x] jest-dom
- [x] @testing-library
- [x] prettier

## What can you do?

Contribute! I've been searching for months to find only the best and in my
opinion most relevant plugins. I'll happily add more if they match the following
criteria:

- actively maintained
- follow best practices in their domain

  how can you find out? if a rule such as `no-anonymous-default-exports` is
  [actively encouraged by the React core team](https://twitter.com/dan_abramov/status/1255229440860262400),
  you should probably consider using it.

- improve code quality (such as `unicorn/prefer-flat-map`)
- only minor stylistic influence (such as `import/newline-after-import`)

If you want to add support, please follow the detection logic in `index.js`.

# Customization

All rulesets and overrides are created through functions accepting an object
matching this schema:

```ts
interface Project {
  /**
   * whether `jest` is present
   */
  hasJest: boolean;
  /**
   * whether `@testing-library/jest-dom` is present
   */
  hasJestDom: boolean;
  /**
   * whether `@types/node` is present
   */
  hasNodeTypes: boolean;
  /**
   * whether any `@testing-library/<environment>` is present
   */
  hasTestingLibrary: boolean;
  typescript: {
    /**
     * whether `typescript` is present
     */
    hasTypeScript: boolean;
    /**
     * the installed version
     */
    version: string;
    /**
     * your tsConfig; used to detect feature availability
     */
    config?: object;
  };
  react: {
    /**
     * whether any flavour of react is present
     */
    hasReact: boolean;
    /**
     * whether `next` is present
     */
    isNext: boolean;
    /**
     * whether `preact` is present
     * currently without effect
     */
    isPreact: boolean;
    /**
     * the installed version
     */
    version: string;
    /**
     * whether the project was bootstrapped with create-react-app
     */
    isCreateReactApp: boolean;
  };
  /**
   * your custom rules on top
   */
  rules?: object;
}
```

## Available main exports:

This list only mentions the exports most people will need. For an exhaustive
list, check out the source.

### Overrides

- `const { createTSOverride } = require('eslint-config-galex/src/overrides/typescript')`
- `const { createReactOverride } = require('eslint-config-galex/src/overrides/react')`
- `const { createJestOverride } = require('eslint-config-galex/src/overrides/jest')`

> Please note that the test override should always come last.

### Rulesets

- `const { createEslintCoreRules } = require('eslint-config-galex/src/rulesets/eslint-core')`
- `const { createImportRules } = require('eslint-config-galex/src/rulesets/import')`
- `const { createInclusiveLanguageRules } = require('eslint-config-galex/src/rulesets/inclusive-language')`
- `const { createNextJsRules } = require('eslint-config-galex/src/rulesets/next')`
- `const { createPromiseRules } = require('eslint-config-galex/src/rulesets/promise')`
- `const { createSonarjsRules } = require('eslint-config-galex/src/rulesets/sonarjs')`
- `const { createSortKeysFixRules } = require('eslint-config-galex/src/rulesets/sort-keys-fix')`
- `const { createUnicornRules } = require('eslint-config-galex/src/rulesets/unicorn')`

# List of included opinions

## TypeScript:

- let inference work where possible:

  - only strongly type exports (enforced via `@typescript-eslint/explicit-module-boundary-types`)

  - strongly type complex return types (currently not enforceable)

## JavaScript

- `null` is not forbidden, as it conveys meaning. Enjoy debugging code which
  does not differentiate between intentional `undefined` and unintentional
  `undefined`.

- `prefer-const`

- `curly`: prefer

  ```js
  if (true) {
    doSomething();
  }
  ```

  over

  ```js
  if (true) doSomething();
  ```

## Tests

- use new lines between test blocks & `expect` and non-`expect`-code

  stylistic choice that can't be enforced by prettier

- use describe blocks

  [considered best practice](https://github.com/jest-community/eslint-plugin-jest/blob/master/src/rules/require-top-level-describe.ts#L8) by `eslint-plugin-jest`

## General

- sort your imports (this does not work when using absolute imports, sadly)
- sort your object keys alphabetically
- don't write unecessary code (e.g. `return undefined` or `if(condition === true)`)
- new line after all imports
- group imports at the top

# Meta

This project follows semver.
