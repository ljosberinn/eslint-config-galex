# eslint-config-galex

![Build and Publish](https://github.com/ljosberinn/eslint-config-galex/workflows/Build%20and%20Publish/badge.svg?branch=master)

![npm](https://img.shields.io/npm/v/eslint-config-galex)
![NPM](https://img.shields.io/npm/l/eslint-config-galex)

# Extends

## Always

- [react-app](https://github.com/facebook/create-react-app/blob/master/packages/eslint-config-react-app/README.md)
- [prettier](https://github.com/prettier/eslint-config-prettier)

## with Jest detected

- [kentcdodds/jest](https://github.com/kentcdodds/eslint-config-kentcdodds)
- [jest-formatting/strict](https://github.com/dangreenisrael/eslint-plugin-jest-formatting)

# Plugins

## Always

- [import](https://github.com/benmosher/eslint-plugin-import)
  - import/order groups imports by origin, adds an empty line and alphabetizeses
  - import/newline-after-import enforces a simple new line after all imports
  - import/no-anonymous-default-exports enforces just that. better for errors & readability
- [prettier](https://github.com/prettier/eslint-plugin-prettier)
- [sort-keys-fix](https://github.com/leo-buneev/eslint-plugin-sort-keys-fix)
  - alphabetical order of keys in objects
- [unicorn](https://github.com/sindresorhus/eslint-plugin-unicorn)
  - mostly modern language features, e.g. unicorn/prefer-flat-map
  - disallow disabling linting more than healthy
- [promise](https://github.com/xjamundx/eslint-plugin-promise)

## with react | preact | next detected

- [react](https://github.com/yannickcr/eslint-plugin-react)
- [react-hooks](https://github.com/facebook/react/tree/master/packages/eslint-plugin-react-hooks)
- [flowtype](https://github.com/gcazaciuc/eslint-plugin-flowtype)
- [jsx-a11y](https://github.com/jsx-eslint/eslint-plugin-jsx-a11y)

## with typescript detected

- [@typescript-eslint](https://github.com/typescript-eslint/typescript-eslint/tree/master/packages/eslint-plugin)

## with @testing-library/jest-dom detected

- [jest-dom](https://github.com/testing-library/eslint-plugin-jest-dom)

## with @testing-library/(dom|react|angular|vue) detected

- [testing-library](https://github.com/testing-library/eslint-plugin-testing-library)
