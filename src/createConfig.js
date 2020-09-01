/* eslint-disable inclusive-language/use-inclusive-words */
const fs = require('fs');
const { resolve } = require('path');
const readPkgUp = require('read-pkg-up');

const { createJestOverride } = require('./overrides/jest');
const { createReactOverride } = require('./overrides/react');
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

const reactFlavours = ['react', 'preact', 'next'];

const defaultPlugins = [
  'import',
  'sort-keys-fix',
  'unicorn',
  'promise',
  'sonarjs',
  'inclusive-language',
];

const env = {
  browser: false,
  es2020: true,
  node: false,
};

const parserOptions = {
  sourceType: 'module',
};

/**
 * @param {
 *  cwd?: string
 * } detectionOptions
 */
const getDependencies = ({ cwd = process.cwd() } = {}) => {
  // adapted from https://github.com/kentcdodds/eslint-config-kentcdodds/blob/master/jest.js
  try {
    /* istanbul ignore next line 75 is supposedly uncovered :shrug: */
    const {
      packageJson: {
        peerDependencies = {},
        devDependencies = {},
        dependencies = {},
      },
    } = readPkgUp.sync({ cwd, normalize: true });

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

    const hasTestingLibrary = testingLibFamily.some(pkg =>
      deps.has(`@testing-library/${pkg}`)
    );

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
          fs.accessSync(resolve(cwd, 'tsconfig.json'));

          return true;
        } catch {
          // eslint-disable-next-line no-console
          console.info(
            'TypeScript found in `package.json` but no `tsconfig.json` was found.'
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
        version: undefined,
      },
      typescript: {
        hasTypeScript: false,
        version: undefined,
      },
    };
  }
};

/**
 * @param {
 *  cwd?: string
 * } detectionOptions
 */
const createConfig = ({ cwd, customRules = {} } = {}) => {
  const project = getDependencies({ cwd });

  const overrides = [
    createReactOverride(project),
    createTSOverride(project),
    // order is important - test must come last, as it has overrides for e.g. ts
    createJestOverride(project),
  ].filter(Boolean);

  const rules = Object.entries({
    ...createEslintCoreRules(project),
    ...createUnicornRules(project),
    ...createPromiseRules(project),
    ...createImportRules(project),
    ...createSortKeysFixRules(project),
    ...createSonarjsRules(project),
    ...createInclusiveLanguageRules(project),
    ...customRules,
  }).reduce((carry, [key, value]) => {
    if (value === 'off') {
      return carry;
    }

    carry[key] = value;

    return carry;
  }, {});

  // schema reference: https://github.com/eslint/eslint/blob/master/conf/config-schema.js
  return {
    env: {
      ...env,
      browser: project.react.hasReact,
      node: project.typescript.hasTypeScript ? project.hasNodeTypes : true,
    },
    overrides,
    parserOptions,
    plugins: defaultPlugins,
    rules,
  };
};

module.exports = {
  createConfig,
  defaultPlugins,
  env,
  getDependencies,
  parserOptions,
  reactFlavours,
  testingLibFamily,
};
