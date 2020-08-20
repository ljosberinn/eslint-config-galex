/* eslint-disable inclusive-language/use-inclusive-words */
const { sync } = require('read-pkg-up');

const { createReactOverride } = require('./overrides/react');
const { createTestOverride } = require('./overrides/test');
const { createTSOverride } = require('./overrides/typescript');
const { createEslintCoreRules } = require('./rulesets/eslint-core');
const { createImportRules } = require('./rulesets/import');
const {
  createInclusiveLanguageRules,
} = require('./rulesets/inclusive-language');
const { createPromiseRules } = require('./rulesets/promise');
const { createSonarjsRules } = require('./rulesets/sonarjs');
const { createSortKeysFixRules } = require('./rulesets/sort-keys-fix');
const { createUnicornRules } = require('./rulesets/unicorn');

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

    /**
     * anything that isn't `jest-dom`, `user-event` or `jest-native`
     *
     * @see https://www.npmjs.com/org/testing-library
     */
    const testingLibFamily = [
      'angular',
      'cypress',
      'dom',
      'nightwatch',
      'preact',
      'preact-hooks',
      'react',
      'react-hooks',
      'react-native',
      'svelte',
      'testcafe',
      'vue',
    ];

    const reactFlavours = ['react', 'preact', 'next'];

    return {
      hasJest: deps.has('jest'),
      hasJestDom: deps.has('@testing-library/jest-dom'),
      hasNodeTypes: deps.has('@types/node'),
      hasTestingLibrary: testingLibFamily.some(pkg =>
        deps.has(`@testing-library/${pkg}`)
      ),
      hasTypeScript: deps.has('typescript'),
      react: {
        hasReact: reactFlavours.some(pkg => deps.has(pkg)),
        isNext: deps.has('next'),
        version: deps.get('react') || '',
      },
    };
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('error parsing package.json!', error);

    return {
      hasJest: false,
      hasJestDom: false,
      hasNodeTypes: false,
      hasTestingLibrary: false,
      hasTypeScript: false,
      react: {
        hasReact: false,
        isNext: false,
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

const defaultPlugins = [
  'import',
  'sort-keys-fix',
  'unicorn',
  'promise',
  'sonarjs',
  'inclusive-language',
];

const rules = {
  ...createEslintCoreRules(project),
  ...createUnicornRules(project),
  ...createPromiseRules(project),
  ...createImportRules(project),
  ...createSortKeysFixRules(project),
  ...createSonarjsRules(project),
  ...createInclusiveLanguageRules(project),
};

// schema reference: https://github.com/eslint/eslint/blob/master/conf/config-schema.js
module.exports = {
  env: {
    browser: project.react.hasReact,
    es2020: true,
    node: project.hasTypeScript ? project.hasNodeTypes : true,
  },
  extends: ['prettier'],
  overrides,
  parserOptions: {
    // ecmaVersion: 2020,
    sourceType: 'module',
  },
  plugins: defaultPlugins,
  rules,
};
