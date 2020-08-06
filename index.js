const { sync } = require('read-pkg-up');

const { createReactOverride } = require('./overrides/react');
const { createTestOverride } = require('./overrides/test');
const { createTSOverride } = require('./overrides/typescript');
const eslintCoreRules = require('./rulesets/eslint-core');
const importRules = require('./rulesets/import');
const promiseRules = require('./rulesets/promise');
const sortKeysFixRules = require('./rulesets/sort-keys-fix');
const unicornRules = require('./rulesets/unicorn');

const project = (() => {
  // adapted from https://github.com/kentcdodds/eslint-config-kentcdodds/blob/master/jest.js
  try {
    const {
      packageJson: {
        peerDependencies = {},
        devDependencies = {},
        dependencies = {},
      },
    } = sync({ normalize: true });

    const deps = Object.keys(dependencies);

    const allDeps = new Set([
      ...Object.keys({
        ...peerDependencies,
        ...devDependencies,
      }),
      ...deps,
    ]);

    return {
      hasJest: allDeps.has('jest'),
      hasJestDom: allDeps.has('@testing-library/jest-dom'),
      hasReact: ['react', 'preact', 'next'].some(pkg => allDeps.has(pkg)),
      hasTestingLibrary: allDeps.has('@testing-library/react'),
      hasTypeScript: allDeps.has('typescript'),
    };
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('error parsing package.json!', error);
    return {
      hasJest: false,
      hasJestDom: false,
      hasReact: false,
      hasTestingLibrary: false,
      hasTypeScript: false,
    };
  }
})();

const overrides = [
  createTestOverride(project),
  createReactOverride(project),
  createTSOverride(project),
].filter(Boolean);

// schema reference: https://github.com/eslint/eslint/blob/master/conf/config-schema.js
module.exports = {
  env: {
    browser: true,
    es2020: true,
    jest: project.hasJest,
    node: true,
  },
  extends: ['prettier'],
  overrides,
  parserOptions: {
    // ecmaVersion: 2020,
    sourceType: 'module',
  },
  plugins: ['import', 'sort-keys-fix', 'unicorn', 'promise'],
  rules: {
    ...eslintCoreRules,
    ...unicornRules,
    ...promiseRules,
    ...importRules,
    ...sortKeysFixRules,
  },
};
