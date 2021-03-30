/* eslint-disable inclusive-language/use-inclusive-words */
const fs = require('fs');
const { resolve } = require('path');
const readPkgUp = require('read-pkg-up');
const ts = require('typescript');

const { createJestOverride } = require('./overrides/jest');
const { createReactOverride } = require('./overrides/react');
const { createStorybookOverride } = require('./overrides/storybook');
const { createTSOverride } = require('./overrides/typescript');
const { createEslintCoreRules } = require('./rulesets/eslint-core');
const { createImportRules } = require('./rulesets/import');
const {
  createInclusiveLanguageRules,
} = require('./rulesets/inclusive-language');
const { createPromiseRules } = require('./rulesets/promise');
const { createSonarjsRules } = require('./rulesets/sonarjs');
const { createUnicornRules } = require('./rulesets/unicorn');
const { applyFlagFilter, mergeSortOverrides } = require('./utils');
const cacheImpl = require('./utils/cache');

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
  'unicorn',
  'promise',
  'sonarjs',
  'inclusive-language',
];

const defaultEnv = {
  browser: false,
  es2021: true,
  node: false,
};

const defaultParserOptions = {
  ecmaVersion: 2021,
  sourceType: 'module',
};

const defaultIgnorePatterns = [];

const defaultTsConfigName = 'tsconfig.json';

const defaultSettings = {};

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
 *  cwd: string;
 *  babelConfig?: Record<string, unknown>;
 * }} detectionOptions
 */
const getBabelConfig = ({ cwd, babelConfig }) => {
  if (babelConfig) {
    return babelConfig;
  }

  const babelConfigJsonPath = resolve(cwd, 'babel.config.json');

  if (fs.existsSync(babelConfigJsonPath)) {
    return JSON.parse(fs.readFileSync(babelConfigJsonPath, 'utf-8'));
  }

  const babelConfigJsPath = resolve(cwd, 'babel.config.js');

  if (fs.existsSync(babelConfigJsPath)) {
    // eslint-disable-next-line import/no-dynamic-require
    return require(babelConfigJsPath);
  }

  const babelRcJsPath = resolve(cwd, '.babelrc.js');

  if (fs.existsSync(babelRcJsPath)) {
    // eslint-disable-next-line import/no-dynamic-require
    return require(babelRcJsPath);
  }

  const babelRcPath = resolve(cwd, '.babelrc');

  if (fs.existsSync(babelRcPath)) {
    return JSON.parse(fs.readFileSync(babelRcPath, 'utf-8'));
  }
};

/**
 * @param {{
 *  cwd?: string;
 *  tsConfigPath?: string
 *  babelConfig?: Record<string, unknown>;
 * }} detectionOptions
 */
const getDependencies = ({
  cwd = process.cwd(),
  tsConfigPath,
  babelConfig,
} = {}) => {
  // adapted from https://github.com/kentcdodds/eslint-config-kentcdodds/blob/master/jest.js
  try {
    /* istanbul ignore next line supposedly uncovered :shrug: */
    const {
      packageJson: {
        peerDependencies = {},
        devDependencies = {},
        dependencies = {},
      },
    } = readPkgUp.sync({ cwd, normalize: true });

    const depsAsTuple = Object.entries({
      ...dependencies,
      ...devDependencies,
      ...peerDependencies,
    });

    const deps = new Map(depsAsTuple);

    const hasReact = reactFlavours.some(pkg => deps.has(pkg));
    const isNext = deps.has('next');
    const isCreateReactApp = deps.has('react-scripts');

    const babel = (() => {
      if (!hasReact || isNext || isCreateReactApp) {
        return;
      }

      try {
        return getBabelConfig({ cwd, babelConfig });
        // eslint-disable-next-line no-empty
      } catch {}
    })();

    const react = {
      hasReact,
      isCreateReactApp,
      isNext,
      // no effect yet
      isPreact: deps.has('preact'),
      // might have to be adjusted for preact in the future
      version: deps.get('react'),
      // required for @babel/eslint-parser
      babelConfig: babel,
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
          ? `[eslint-config-galex] TypeScript found in \`package.json\`, but no config was found or is readable at "${tsConfigPath}":`
          : '[eslint-config-galex] TypeScript found in `package.json` but no `tsconfig.json` was found:';
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
    const hasStorybook = depsAsTuple.some(([dep]) =>
      dep.startsWith('@storybook/')
    );

    const hasTestingLibrary = testingLibFamily.some(pkg =>
      deps.has(`@testing-library/${pkg}`)
    );

    return {
      hasJest,
      hasJestDom,
      hasNodeTypes,
      hasTestingLibrary,
      hasStorybook,
      react,
      typescript,
    };
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('[eslint-config-galex] error parsing `package.json`!', error);

    return {
      hasJest: false,
      hasJestDom: false,
      hasNodeTypes: false,
      hasTestingLibrary: false,
      hasStorybook: false,
      react: {
        hasReact: false,
        isCreateReactApp: undefined,
        isNext: false,
        isPreact: false,
        version: undefined,
        babelConfig: undefined,
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
 *  tsConfigPath?: string;
 *  rules?: object;
 *  overrides?: unknown[];
 *  plugins?: string[];
 *  env?: object;
 *  parserOptions?: object;
 *  ignorePatterns?: string[];
 *  settings?: Record<string, any>;
 *  convertToESLintInternals?: boolean;
 *  cacheOptions?: {
 *   enabled?: boolean;
 *   expiresAfterMs?: number
 *  };
 *  babelConfig?: Record<string, unknown>;
 * }} config
 */
const createConfig = ({
  cwd,
  tsConfigPath,
  rules: customRules = {},
  overrides: customOverrides = [],
  plugins: customPlugins = [],
  env: customEnv = {},
  parserOptions: customParserOptions = {},
  ignorePatterns: customIgnorePattenrs = [],
  settings: customSettings = {},
  convertToESLintInternals = true,
  cacheOptions: {
    enabled: cachingEnabled = true,
    expiresAfterMs: cachingExpiresAfterMs = 10 * 60 * 1000,
  } = {},
  babelConfig,
} = {}) => {
  const cacheOptions = {
    enabled: cachingEnabled,
    expiresAfterMs: cachingExpiresAfterMs,
  };

  const now = Date.now();
  const dependencies = {
    cwd,
    tsConfigPath,
    customRules,
    customPlugins,
    customOverrides,
    customEnv,
    customParserOptions,
    convertToESLintInternals,
    cacheOptions,
    babelConfig,
  };

  if (
    !cacheImpl.mustInvalidate(cacheImpl.cache, {
      now,
      dependencies,
    })
  ) {
    return cacheImpl.cache.config;
  }

  const project = getDependencies({ cwd, tsConfigPath, babelConfig });

  const flags = {
    convertToESLintInternals,
  };

  const overrides = mergeSortOverrides([
    createReactOverride(project),
    createTSOverride(project),
    createJestOverride(project),
    createStorybookOverride(project),
    ...customOverrides,
  ]).map(override => {
    const { rules, ...rest } = override;

    const result = {
      ...rest,
      rules: applyFlagFilter(rules, flags),
    };

    // TODO: find a better way to purge overrideType; it throws an info log
    /* istanbul ignore next line */
    if (process.env.NODE_ENV !== 'test') {
      /* istanbul ignore next line */
      delete result.overrideType;
    }

    return result;
  });

  const rules = applyFlagFilter(
    {
      ...createEslintCoreRules(project),
      ...createUnicornRules(project),
      ...createPromiseRules(project),
      ...createImportRules(project),
      ...createSonarjsRules(project),
      ...createInclusiveLanguageRules(project),
      ...customRules,
    },
    flags
  );

  const plugins = [...defaultPlugins, ...customPlugins];

  const env = {
    ...defaultEnv,
    browser: project.react.hasReact,
    node: project.typescript.hasTypeScript ? project.hasNodeTypes : true,
    ...customEnv,
  };

  const parserOptions = {
    ...defaultParserOptions,
    ...customParserOptions,
  };

  const ignorePatterns = [...defaultIgnorePatterns, ...customIgnorePattenrs];

  // in case `defaultSettings` should ever be filled, ensure these objects are merged deeply
  const settings = {
    ...defaultSettings,
    ...customSettings,
  };

  // schema reference: https://github.com/eslint/eslint/blob/master/conf/config-schema.js
  const config = {
    env,
    overrides,
    parserOptions,
    plugins,
    rules,
    ignorePatterns,
    reportUnusedDisableDirectives: true,
    settings,
  };

  if (cacheOptions.enabled) {
    cacheImpl.set(cacheImpl.cache, { now, config, dependencies });
  }

  return config;
};

module.exports = {
  createConfig,
  defaultPlugins,
  env: defaultEnv,
  getDependencies,
  parserOptions: defaultParserOptions,
  reactFlavours,
  testingLibFamily,
  ignorePatterns: defaultIgnorePatterns,
  settings: defaultSettings,
  getBabelConfig,
};
