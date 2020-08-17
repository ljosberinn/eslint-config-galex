/* eslint-disable inclusive-language/use-inclusive-words */
const { sync } = require('read-pkg-up');

const { createReactOverride } = require('./overrides/react');
const { createTestOverride } = require('./overrides/test');
const { createTSOverride } = require('./overrides/typescript');
const { createEslintCoreRules } = require('./rulesets/eslint-core');
const importRules = require('./rulesets/import');
const inclusiveLanguageRules = require('./rulesets/inclusive-language');
const { createPromiseRules } = require('./rulesets/promise');
const { createSonarjsRules } = require('./rulesets/sonarjs');
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

    const deps = new Map(
      Object.entries({
        ...dependencies,
        ...devDependencies,
        ...peerDependencies,
      })
    );

    return {
      hasJest: deps.has('jest'),
      hasJestDom: deps.has('@testing-library/jest-dom'),
      hasTestingLibrary: deps.has('@testing-library/react'),
      hasTypeScript: deps.has('typescript'),
      react: {
        exists: ['react', 'preact', 'next'].some(pkg => deps.has(pkg)),
        isNext: deps.has('next'),
        version: deps.get('react') ?? '',
      },
    };
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('error parsing package.json!', error);

    return {
      hasJest: false,
      hasJestDom: false,
      hasTestingLibrary: false,
      hasTypeScript: false,
      react: {
        exists: false,
        next: false,
        version: '',
      },
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
    browser: project.react.exists,
    es2020: true,
    node: true,
  },
  extends: ['prettier'],
  overrides,
  parserOptions: {
    // ecmaVersion: 2020,
    sourceType: 'module',
  },
  plugins: [
    'import',
    'sort-keys-fix',
    'unicorn',
    'promise',
    'sonarjs',
    'inclusive-language',
  ],
  rules: {
    ...createEslintCoreRules(project),
    ...unicornRules,
    ...createPromiseRules(project),
    ...importRules,
    ...sortKeysFixRules,
    ...createSonarjsRules(project),
    ...inclusiveLanguageRules,
  },
};
