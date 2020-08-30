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

const fulfillsMinVersion = (version, min) => {
  try {
    const [major] = version.split('.');

    return Number.parseInt(major) >= min;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(`Error determining version; ${error.message}`);
    return false;
  }
};

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
      is17OrLater: hasReact ? fulfillsMinVersion(deps.get('react'), 17) : false,
      isNext: deps.has('next'),
    };

    const hasTypeScript = deps.has('typescript');

    const typescript = {
      hasTypeScript,
      is4OrLater: hasTypeScript
        ? fulfillsMinVersion(deps.get('typescript'), 4)
        : false,
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
        is17OrLater: false,
        isNext: false,
      },
      typescript: {
        hasTypeScript: false,
        is4OrLater: false,
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
  extends: ['prettier'],
  overrides,
  parserOptions: {
    // ecmaVersion: 2020,
    sourceType: 'module',
  },
  plugins: defaultPlugins,
  rules,
};
