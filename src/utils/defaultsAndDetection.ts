import type { Linter } from 'eslint';

export const plugins = ['import', 'unicorn', 'promise', 'sonarjs'];

/**
 * @see https://www.npmjs.com/org/testing-library
 */
export const testingLibFamily = [
  'angular',
  'cypress',
  'dom',
  // jasmine-dom
  // jest-dom
  // jest-native
  'nightwatch',
  'preact',
  'preact-hooks',
  'react',
  'react-hooks',
  'react-native',
  'svelte',
  'testcafe',
  // user-event
  'vue',
];

export const parserOptions: Required<Linter.ParserOptions> = {
  ecmaVersion: 'latest',
  sourceType: 'module',
  ecmaFeatures: {},
};
