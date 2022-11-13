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

# Compatibility

<details>
  <summary>Usage with create-react-app</summary>

~~As of January 2021 / due to CRA v5, currently no additional steps are required! 🎉~~

Beginning with `eslint-config-galex` `v4.2.2` or newer, until this disclaimer is removed you need to install the following dependencies additionally:

- `"eslint-plugin-jest": "27.1.5"`

```sh
npm i --save-dev eslint-plugin-jest@27.1.5

yarn add -D eslint-plugin-jest@27.1.5
```

</details>

<details>
  <summary>Usage with Next.js</summary>

In your `next.config.js`, I heavily recommend setting [`eslint.ignoreDuringBuilds`](https://nextjs.org/docs/api-reference/next.config.js/ignoring-eslint) to `true`. Otherwise, you'll have to install `eslint-config-next` separately and won't benefit of this config and your customization on top.

</details>

<details>
  <summary>Usage with Remix Run</summary>

No additional setup is required! 🎉

</details>

# Setup

## Basic

You profit automatically of automatic dependency and feature detection. Due to the nature of ESLint configs however this approach is significantly harder to customize.

```js
// .eslintrc.js
module.exports = {
  extends: 'galex',
};
```

## Advanced

This showcases the required setup to begin with customizing your config on an advanced level. Please check out the `Examples` section below for more details.

```js
// .eslintrc.js
const { createConfig } = require('eslint-config-galex/dist/createConfig');

module.exports = createConfig();
```

# Features

<details>
  <summary>Incremental Adoption</summary>

```js
// .eslintrc.js
const { createConfig } = require('eslint-config-galex/dist/createConfig');

module.exports = createConfig({
  incrementalAdoption: true,
});
```

</details>

<details>
  <summary>Standalone Generation</summary>

By default, `eslint-config-galex` reads your `package.json` as well as, if present, `tsconfig.json` to determine feature availability. On weaker machines however, this turned out to be a performance bottleneck. Realistically, neither your dependencies nor your tsconfig change _that_ often.

To generate a static config based on your _current_ dependencies & tsconfig, use:

```js
node node_modules/eslint-config-galex/dist/generateStandalone
```

which will create a `.eslintrc.json` in your root directory.

**How do I pass settings for `createConfig` to standalone generation?**

Simple! Have a `eslint-galex-settings.json` file in your root directory and it will be picked up.

An example would look like this:

```js
// eslint-galex-settings.json (remove this comment as its invalid json)
{
  "incrementalAdoption": true
}
```

**Important**: to keep this in sync with your dependencies, I recommend adding a `postinstall` step to your scripts:

```js
// package.json
"scripts": {
  // other scripts
  "postinstall": "node node_modules/eslint-config-galex/dist/generateStandalone"
}
```

**Remember to re-run this command whenever you make feature-availability-relevant changes to your `tsconfig.json` as well, such as `module`, `target` or `lib`.**

History: prior to v4, `eslint-config-galex` shipped with internal caching. Sadly, this prove to be both a maintenance overhead as well as not as useful as it initially promised to be for various reasons (e.g. VSCode ESLint apparently restarting the process when switching files which cachebusted due to a different process).

</details>

<details>
  <summary>Starting with a blank slate</summary>

You like all the features `eslint-config-galex` ships with but you heavily disagree with many rule settings?

Say no more. Simply pass `{ blankSlate: true }` to `createConfig` and you still benefit from automatic dependency detection, the general override setup based on file patterns, but **every rule will be set to `off`**.

This way, you can customize it entirely to your likings without having to create n overrides for rules and or rulesets.

</details>

<details>
  <summary>Migrating a codebase to TypeScript</summary>

While in the process of migration, you may end up in a situation where you cannot turn on `compilerOptions.checkJs` from TypeScript itself due to e.g. builds breaking. However, by default certain rules will be disabled for JavaScript files because they are technically shadowed by TypeScript itself, e.g. `no-undef`.

You can opt out of this behaviour by either:

- passing `enableJavaScriptSpecificRulesInTypeScriptProject` as `true` to `createConfig`
- enabling `compilerOptions.checkJs` once you're there

Example:

```js
const { createConfig } = require('eslint-config-galex/dist/createConfig');

module.exports = createConfig({
  enableJavaScriptSpecificRulesInTypeScriptProject: true,
});
```

</details>

# Examples

<details>
  <summary>Disabling a specific @typescript-eslint rule</summary>

```js
const { createConfig } = require('eslint-config-galex/dist/createConfig');
const { getDependencies } = require('eslint-config-galex/dist/getDependencies');
const {
  createTypeScriptOverride,
} = require('eslint-config-galex/dist/overrides/typescript');

const dependencies = getDependencies();

const customTypescriptOverride = createTypeScriptOverride({
  ...dependencies,
  rules: {
    // here goes anything that applies **exclusively** to typescript files based on the `files` glob pattern also exported from ../overrides/typescript
    '@typescript-eslint/explicit-module-boundary-types': 'warn', // downgrading the default from "error" to "warn"
  },
});

module.exports = createConfig({
  overrides: [customTypescriptOverride],
});
```

</details>

<details>
  <summary>Changing a eslint-plugin-unicorn rule specifically for React files</summary>

```js
const { createConfig } = require('eslint-config-galex/dist/createConfig');
const { getDependencies } = require('eslint-config-galex/dist/getDependencies');
const {
  createReactOverride,
} = require('eslint-config-galex/dist/overrides/react');

const dependencies = getDependencies();

const customReactOverride = createReactOverride({
  ...dependencies,
  rules: {
    'unicorn/no-abusive-eslint-disable': 'off',
  },
});

module.exports = createConfig({
  overrides: [customReactOverride],
});
```

</details>

<details>
  <summary>Adding plugins to any override</summary>

```js
const { createConfig } = require('eslint-config-galex/dist/createConfig');
const { getDependencies } = require('eslint-config-galex/dist/getDependencies');
const {
  createReactOverride,
} = require('eslint-config-galex/dist/overrides/react');

const dependencies = getDependencies();

const customReactOverride = createReactOverride({
  ...dependencies,
  plugins: ['my-fancy-plugin'],
  rules: {
    'plugin/foo': 'warn',
    'plugin/bar': 'error',
    'plugin/baz': 'off',
  },
});

module.exports = createConfig({
  overrides: [customReactOverride],
});
```

</details>

<details>
  <summary>Building your own config with the available exports</summary>

```js
const { getDependencies } = require('eslint-config-galex/dist/getDependencies');
const {
  files,
  parser,
  defaultSettings,
} = require('eslint-config-galex/dist/overrides/react');

const dependencies = getDependencies();

const myReactOverride = {
  // using the internal react glob pattern
  files,
  // using the internal default react parser
  parser,
  // defining your custom rules
  rules: {
    'react/react-in-jsx-scope': 'warn',
  },
  // using the default settings
  settings: defaultSettings,
};

module.exports = {
  overrides: [myReactOverride],
  rules: {
    'no-await-in-loop': 'warn',
  },
};
```

</details>

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

You check npm and see there are ~~2.8k+ (August 2020)~~ _4.1k+ (December 2021)_ `eslint-plugin-*` packages
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

- It's incrementally adoptable! Usually you pick a config at one point in time:
  when starting a fresh project, or at least early on. Migrating later on,
  especially when working in teams with lots of code movement, you'd run into
  merging conflicts real quick.

  Good news: you can use `createConfig({ incrementalAdoption: true })` to
  _downgrade all errors to warnings, and disable all warnings_!

  This allows you to introduce the config at an arbitrary point in time, while
  still profiting of it from minute one and still allows you to continue. Most
  urgent issues won't break the build - the best of both worlds!

  Once you feel comfortable raising the reporting level, simply set
  `incrementalAdoption` to false or remove it from the arguments passed to
  `createConfig`.

- Integration tests for all cases.

- All internals, literally everything, is re-exported. Don't like some
  decision? Rules too weak? Want to add custom rules? Everything is covered!

  This hopefully prevents the need of having to migrate between configs every
  once in a while which builds up frustration due to misconfiguration and the
  entire overhead related to that. Dependency injection, just for an eslint
  config!

- This config has a _heavy_ focus on code quality, best practices and
  tries to omit opinions.

## What's included?

Everything is dynamically included based on your `package.json` and when using TypeScript, your `tsconfig.json`.
Rules are selectively applied based on file name patterns.

All rules are commented and link to their docs.

- [x] React
- [x] Next.js
- [x] Remix Run
- [x] TypeScript
- [x] Node.js
- [x] jest
- [x] jest-dom
- [x] @testing-library
- [x] prettier
- [x] storybook & storybook/testing-library
- [x] NestJS (with TypeScript)

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
  /**
   * whether `@nestjs/core` is present
   */
  hasNest: boolean;
  storybook: {
    /**
     * whether any `@storybook/` is present that is not `@storybook/testing-library`
     */
    hasStorybook: boolean;
    /**
     * whether `@storybook/testing-library` is present
     */
    hasStorybookTestingLibrary: boolean;
  };
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
     *  whether `@remix-run/react` is present
     */
    isRemix: boolean;
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

- `const { createTypeScriptOverride } = require('eslint-config-galex/dist/overrides/typescript')`
- `const { createReactOverride } = require('eslint-config-galex/dist/overrides/react')`
- `const { createJestOverride } = require('eslint-config-galex/dist/overrides/jest')`
- `const { createStorybookOverride } = require('eslint-config-galex/dist/overrides/storybook')`

> Please note that the test override should always come last.

### Rulesets

- `const { createEslintCoreRules } = require('eslint-config-galex/dist/rulesets/eslint-core')`
- `const { createImportRules } = require('eslint-config-galex/dist/rulesets/import')`
- `const { createNextJsRules } = require('eslint-config-galex/dist/rulesets/next')`
- `const { createPromiseRules } = require('eslint-config-galex/dist/rulesets/promise')`
- `const { createSonarjsRules } = require('eslint-config-galex/dist/rulesets/sonarjs')`
- `const { createUnicornRules } = require('eslint-config-galex/dist/rulesets/unicorn')`

# Examples

## Custom TypeScript override to disable a rule

```js
const { createConfig } = require('eslint-config-galex/dist/createConfig');
const {
  createTypeScriptOverride,
} = require('eslint-config-galex/dist/overrides/typescript');
const packageJson = require('./package.json');

// since `createTypeScriptOverride` is entirely configurable, we need to inform it about its environment
const tsOverrideConfig = {
  react: {
    hasReact: true,
  },
  rules: {
    '@typescript-eslint/ban-ts-comment': 'off',
  },
  typescript: {
    hasTypeScript: true,
    // sync with package.json should you upgrade TS
    version: packageJson.dependencies.typescript,
  },
};

// solely an override for TS
const tsOverride = createTypeScriptOverride(tsOverrideConfig);

// pass it into createConfig as array as it will be merged with the other overrides
module.exports = createConfig({ overrides: [tsOverride] });
```

## Custom Jest override changing included `files`:

```js
const { createConfig } = require('eslint-config-galex/dist/createConfig');
const { getDependencies } = require('eslint-config-galex/dist/getDependencies');
const {
  createJestOverride,
} = require('eslint-config-galex/dist/overrides/jest');

/**
 * override to enable jest globals for `/testUtils` folder
 */
const customJestLikeOverride = createJestOverride({
  ...getDependencies(),
  files: ['testUtils/*.ts?(x)'],
});

module.exports = createConfig({
  overrides: [customJestLikeOverride],
});
```

# Meta

This project follows semver.
