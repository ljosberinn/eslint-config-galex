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

    const hasJest = deps.has('jest');
    const hasJestDom = deps.has('@testing-library/jest-dom');
    const hasNodeTypes = deps.has('@types/node');

    /**
     * @see https://www.npmjs.com/org/testing-library
     */
    const testingLibFamily = [
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

    const hasTestingLibrary = testingLibFamily.some(pkg =>
      deps.has(`@testing-library/${pkg}`)
    );

    const reactFlavours = ['react', 'preact', 'next'];
    const hasReact = reactFlavours.some(pkg => deps.has(pkg));

    const react = {
      hasReact,
      isNext: deps.has('next'),
      // no effect yet
      isPreact: deps.has('preact'),
      // might have to be adjusted for preact in the future
      version: deps.get('react'),
    };

    const hasTypeScript = deps.has('typescript');

    const typescript = {
      hasTypeScript,
      version: deps.get('typescript'),
    };

    return {
      hasJest,
      hasJestDom,
      hasNodeTypes,
      hasTestingLibrary,
      react,
      typescript,
    };
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('error parsing package.json!', error);

    return {
      hasJest: false,
      hasJestDom: false,
      hasNodeTypes: false,
      hasTestingLibrary: false,
      react: {
        hasReact: false,
        isNext: false,
        isPreact: false,
        version: '17.0.0-rc.1',
      },
      typescript: {
        hasTypeScript: false,
        version: '4.0.2',
      },
    };
  }
})();

const overrides = [
  createReactOverride(project),
  createTSOverride(project),
  // order is important - test must come last, as it has overrides for e.g. ts
  createTestOverride(project),
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
  overrides,
  parserOptions: {
    // ecmaVersion: 2020,
    sourceType: 'module',
  },
  plugins: defaultPlugins,
  rules,
};
