# eslint-config-galex

![Build and Publish](https://github.com/ljosberinn/eslint-config-galex/workflows/Build%20and%20Publish/badge.svg?branch=master)

[npm-shield]: https://img.shields.io/npm/dt/eslint-config-galex.svg
[npm-url]: https://www.npmjs.com/package/eslint-config-galex

![npm](https://img.shields.io/npm/v/eslint-config-galex)
[![NPM Total Downloads][npm-shield]][npm-url]
![NPM](https://img.shields.io/npm/l/eslint-config-galex)

```sh
yarn add -D eslint-config-galex

npm install --save-dev eslint-config-galex
```

```
// .eslintrc
{
  extends: ['galex'],
  rules: {
    // overrides here
  }
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

You check npm and see there are 2.8k+ (August 2020) `eslint-plugin-*` package
s out there. And even worse - 10k+ `eslint-config-*` packages. Which to choose?
You sort by popularity and see some familiar faces. "Now is the time to finally
read through their rulesets and decide which I want!" you scream out loud, but
find yourself finishing the first repo after 6 hours.

Setting up ESLint wasn't that easy after all.

Couldn't this be easier?

## What should you do, then?

The recommended approach would be to fork this and adapt to your own likings.

Yes, that will still cost time. But at least you don't have to wade through the
endless amounts of repos out there, as I already did. Consider this a blueprint.

You may of course just use it directly too.

## What makes this different than all the other configs out there?

This one is brand new with a _heavy_ focus on code quality, best practices and
tries to omit opinions. We're using a subset at work too, and it has exclusively
detected overseen/undetected bugs and reasonable improvements.

Feedback so far has been generally positive. The only rule that raised eyebrows
was `import/order` because it leads to a huge git diff when applied on existing
projects.

## What's included?

Everything is dynamically included based on your `package.json`.
Rules are selectively applied based on file name patterns.

All rules are commented and link to their docs.

- [x] React
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
- improve code quality (such as `unicorn/prefer-flat-map`)
- only minor stylistic influence (such as `import/newline-after-import`)

## When should you not use this?

When you can't use modern DOM apis such as `Array.flatMap`.

When using Vue/Svelte/Angular, because those are currently not supported.

And obviously, when disagreeing with most of the choices made here. Your time to
build your own config might have come, after all.

# List of opinions coming with this config

- let typescript inference work where possible. only strongly type exports
- `null` is not forbidden, as it conveys meaning. Enjoy debugging code which
  does not differentiate between intentional `undefined` and unintentional
  `undefined`.
- use whitespace between test blocks
- use describe blocks
- sort your imports (this does not work when using absolute imports, sadly)
- sort your object keys alphabetically
- don't write unecessary code (e.g. `return undefined` or `if(condition === true)`)
- new line after all imports
- group imports at the top

# Want to build your own config with the standards defined in this?

All rulesets are created through a function that accepts an object matching this
schema:

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
   * whether `typescript` is present
   */
  hasTypeScript: boolean;
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
     * version of react
     *
     * @default ''
     */
    version: string;
  };
}
```

That means you can leverage the preset by importing e.g. `createTSOverride` and
feeding it the required params. And on top - your `customRules` object, which
will be merged onto the predefined, overwriting previously defined rules or
adding to it.

```js
import { createTSOverride } from 'eslint-config-galex/overrides/typescript';

createTSOverride({
  react: {
    exists: boolean;
  };
  hasTypeScript: boolean;
  customRules: Record<string, string | [string, object | string]>
});

```

## Available exports:

### Overrides

- `import { createTSOverride } from 'eslint-config-galex/overrides/typescript'`
- `import { createReactOverride } from 'eslint-config-galex/overrides/react'`
- `import { createTestOverride } from 'eslint-config-galex/overrides/test'`

### Rulesets

- `import { createEslintCoreRules } from 'eslint-config-galex/rulesets/eslint-core'`
- `import { createImportRules } from 'eslint-config-galex/rulesets/import'`
- `import { createInclusiveLanguageRules } from 'eslint-config-galex/rulesets/inclusive-language'`
- `import { createPromiseRules } from 'eslint-config-galex/rulesets/promise'`
- `import { createSonarjsRules } from 'eslint-config-galex/rulesets/sonarjs'`
- `import { createSortKeysFixRules } from 'eslint-config-galex/rulesets/sort-keys-fix'`
- `import { createUnicornRules } from 'eslint-config-galex/rulesets/unicorn'`

# Meta

This project follows semver.
