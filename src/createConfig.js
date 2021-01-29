/* eslint-disable inclusive-language/use-inclusive-words */
const fs = require('fs');
const { resolve } = require('path');
const readPkgUp = require('read-pkg-up');
const ts = require('typescript');

const {
  createJestOverride,
  overrideType: jestOverrideType,
} = require('./overrides/jest');
const {
  createReactOverride,
  overrideType: reactOverrideType,
} = require('./overrides/react');
const {
  createTSOverride,
  overrideType: tsOverrideType,
} = require('./overrides/typescript');
const { createEslintCoreRules } = require('./rulesets/eslint-core');
const { createImportRules } = require('./rulesets/import');
const {
  createInclusiveLanguageRules,
} = require('./rulesets/inclusive-language');
const { createPromiseRules } = require('./rulesets/promise');
const { createSonarjsRules } = require('./rulesets/sonarjs');
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
    /* istanbul ignore next line 124 is supposedly uncovered :shrug: */
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

const pseudoDeepMerge = (override, previous) => {
  return Object.entries(override).reduce((carry, [key, value]) => {
    /* istanbul ignore next line 217 is supposedly uncovered :shrug: */
    if (carry[key]) {
      if (Array.isArray(carry[key])) {
        carry[key] = [...new Set(...carry[key], ...value)];
        return carry;
      }

      if (typeof carry[key] === 'object') {
        return {
          ...carry,
          [key]: {
            ...carry[key],
            ...value,
          },
        };
      }

      carry[key] = value;
    }

    return carry;
  }, previous);
};

/**
 * @param {object[]} overrides
 */
const mergeSortOverrides = overrides => {
  const overrideOrder = {
    [jestOverrideType]: 0,
    [tsOverrideType]: 1,
    [reactOverrideType]: 2,
  };

  return overrides
    .filter(Boolean)
    .reduce((carry, override) => {
      const isInternalOverride = !!override.overrideType;

      if (isInternalOverride) {
        const previousDefaultOverrideTypeIndex = carry.findIndex(
          o => o.overrideType === override.overrideType
        );

        if (previousDefaultOverrideTypeIndex > -1) {
          return carry.map((dataset, index) =>
            index === previousDefaultOverrideTypeIndex
              ? pseudoDeepMerge(override, dataset)
              : dataset
          );
        }
      }

      return [...carry, override];
    }, [])
    .sort((a, b) => {
      const priorityA = a.overrideType ? overrideOrder[a.overrideType] : -1;
      const priorityB = b.overrideType ? overrideOrder[b.overrideType] : -1;

      return priorityB - priorityA;
    });
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
} = {}) => {
  const project = getDependencies({ cwd, tsConfigPath });

  const overrides = mergeSortOverrides([
    createReactOverride(project),
    createTSOverride(project),
    // order is important - test must come last, as it has overrides for e.g. ts
    createJestOverride(project),
    ...customOverrides,
  ]);

  const rules = {
    ...createEslintCoreRules(project),
    ...createUnicornRules(project),
    ...createPromiseRules(project),
    ...createImportRules(project),
    ...createSonarjsRules(project),
    ...createInclusiveLanguageRules(project),
    ...customRules,
  };

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
