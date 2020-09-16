/* eslint-disable inclusive-language/use-inclusive-words */
const fs = require('fs');
const { resolve } = require('path');
const readPkgUp = require('read-pkg-up');
const ts = require('typescript');

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

const defaultEnv = {
  browser: false,
  es2020: true,
  node: false,
};

const defaultParserOptions = {
  sourceType: 'module',
};

const defaultTsConfigName = 'tsconfig.json';

/**
 * @param {{
 *  cwd: string;
 *  tsConfigPath?: string
 * }} detectionOptions
 */
const getTopLevelTsConfig = ({ cwd, tsConfigPath }) => {
  const resolveArgs = tsConfigPath
    ? [tsConfigPath]
    : [cwd, cwd.includes('.json') ? '' : defaultTsConfigName];
  const path = resolve(...resolveArgs);

  const tsConfigName = tsConfigPath
    ? tsConfigPath.split('/').pop()
    : defaultTsConfigName;
  const tsConfigRaw = fs.readFileSync(path, 'utf-8');
  const tsConfig = ts.convertToObject(
    ts.parseJsonText(tsConfigName, tsConfigRaw)
  );

  // really only thing we need from the config
  if (tsConfig.compilerOptions) {
    return tsConfig;
  }

  // no compilerOptions, check for parent configs
  if (tsConfig.extends) {
    return getTopLevelTsConfig({
      // on current path, replace tsConfigName with nothing to prevent having
      // an path with 2x file names
      cwd: resolve(path.replace(tsConfigName, ''), tsConfig.extends),
    });
  }

  return tsConfig;
};

/**
 * @param {{
 *  cwd?: string;
 *  tsConfigPath?: string
 * }} detectionOptions
 */
const getDependencies = ({ cwd = process.cwd(), tsConfigPath } = {}) => {
  // adapted from https://github.com/kentcdodds/eslint-config-kentcdodds/blob/master/jest.js
  try {
    /* istanbul ignore next line 101 is supposedly uncovered :shrug: */
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

    const hasReact = reactFlavours.some(pkg => deps.has(pkg));

    const react = {
      hasReact,
      isCreateReactApp: deps.has('react-scripts'),
      isNext: deps.has('next'),
      // no effect yet
      isPreact: deps.has('preact'),
      // might have to be adjusted for preact in the future
      version: deps.get('react'),
    };

    const hasTypeScriptDependency = deps.has('typescript');

    const tsConfig = (() => {
      if (!hasTypeScriptDependency) {
        return;
      }

      try {
        return getTopLevelTsConfig({ cwd, tsConfigPath });
      } catch (error) {
        /* istanbul ignore next warning aint that relevant */
        const info = tsConfigPath
          ? `TypeScript found in \`package.json\`, but no config was found or is readable at "${tsConfigPath}":`
          : 'TypeScript found in `package.json` but no `tsconfig.json` was found:';
        // eslint-disable-next-line no-console
        console.info(info, error.message);
      }
    })();

    const typescript = {
      config: tsConfig,
      hasTypeScript: hasTypeScriptDependency && !!tsConfig,
      version: deps.get('typescript'),
    };

    const hasJest = react.isCreateReactApp ? true : deps.has('jest');
    const hasJestDom = deps.has('@testing-library/jest-dom');
    const hasNodeTypes = deps.has('@types/node');

    const hasTestingLibrary = testingLibFamily.some(pkg =>
      deps.has(`@testing-library/${pkg}`)
    );

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
    console.error('error parsing `package.json`!', error);

    return {
      hasJest: false,
      hasJestDom: false,
      hasNodeTypes: false,
      hasTestingLibrary: false,
      react: {
        hasReact: false,
        isCreateReactApp: undefined,
        isNext: false,
        isPreact: false,
        version: undefined,
      },
      typescript: {
        config: undefined,
        hasTypeScript: false,
        version: undefined,
      },
    };
  }
};

/**
 * @param {{
 *  cwd?: string
 *  rules?: object;
 *  overrides?: unknown[];
 *  plugins?: string[];
 *  env?: object;
 *  parserOptions?: object;
 *  tsConfigPath?: string
 * }} param
 */
const createConfig = ({
  cwd,
  tsConfigPath,
  rules: customRules = {},
  overrides: customOverrides = [],
  plugins: customPlugins = [],
  env: customEnv = {},
  parserOptions: customParserOptions = {},
} = {}) => {
  const project = getDependencies({ cwd, tsConfigPath });

  const overrides = [
    createReactOverride(project),
    createTSOverride(project),
    // order is important - test must come last, as it has overrides for e.g. ts
    createJestOverride(project),
    ...customOverrides,
  ].filter(Boolean);

  const rules = {
    ...createEslintCoreRules(project),
    ...createUnicornRules(project),
    ...createPromiseRules(project),
    ...createImportRules(project),
    ...createSortKeysFixRules(project),
    ...createSonarjsRules(project),
    ...createInclusiveLanguageRules(project),
    ...customRules,
  };

  const plugins = [...defaultPlugins, ...customPlugins];

  const env = {
    ...defaultEnv,
    browser: project.react.hasReact,
    node: project.typescript.hasTypeScript ? project.hasNodeTypes : false,
    ...customEnv,
  };

  const parserOptions = {
    ...defaultParserOptions,
    ...customParserOptions,
  };

  // schema reference: https://github.com/eslint/eslint/blob/master/conf/config-schema.js
  return {
    env,
    overrides,
    parserOptions,
    plugins,
    rules,
  };
};

module.exports = {
  createConfig,
  defaultPlugins,
  env: defaultEnv,
  getDependencies,
  parserOptions: defaultParserOptions,
  reactFlavours,
  testingLibFamily,
};
