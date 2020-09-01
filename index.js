/* eslint-disable inclusive-language/use-inclusive-words */
const { sync } = require('read-pkg-up');

const { createJestOverride } = require('./src/overrides/jest');
const { createReactOverride } = require('./src/overrides/react');
const { createTSOverride } = require('./src/overrides/typescript');
const { createEslintCoreRules } = require('./src/rulesets/eslint-core');
const { createImportRules } = require('./src/rulesets/import');
const {
  createInclusiveLanguageRules,
} = require('./src/rulesets/inclusive-language');
const { createPromiseRules } = require('./src/rulesets/promise');
const { createSonarjsRules } = require('./src/rulesets/sonarjs');
const { createSortKeysFixRules } = require('./src/rulesets/sort-keys-fix');
const { createUnicornRules } = require('./src/rulesets/unicorn');

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

    const hasTypeScript =
      deps.has('typescript') &&
      (() => {
        try {
          const tsconfig = require('./tsconfig');
          return !!tsconfig;
        } catch {
          // eslint-disable-next-line no-console
          console.warn(
            'TypeScript found in package.json, however, no tsconfig.json found.'
          );
          return false;
        }
      })();

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
        version: '',
      },
      typescript: {
        hasTypeScript: false,
        version: '',
      },
    };
  }
})();

const overrides = [
  createReactOverride(project),
  createTSOverride(project),
  // order is important - test must come last, as it has overrides for e.g. ts
  createJestOverride(project),
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
