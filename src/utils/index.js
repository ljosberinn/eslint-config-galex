const {
  jestOverrideType,
  reactOverrideType,
  tsOverrideType,
  storybookOverrideType,
} = require('./overrideTypes');

const severityLevels = {
  off: 0,
  warn: 1,
  error: 2,
};

const convertRuleToEslintInternalValue = value => {
  if (severityLevels[value] !== undefined) {
    return severityLevels[value];
  }

  if (Array.isArray(value) && severityLevels[value[0]] !== undefined) {
    const options = [...value];
    options[0] = severityLevels[options[0]];

    return options;
  }

  return value;
};

/**
 * naive version detection
 *
 * @param {string|number} version
 * @param {{
 *  major: number;
 *  minor?: number;
 *  patch?: number;
 * }} minRequiredVersion
 */
const fulfillsVersionRequirement = (
  version,
  { major, minor = 0, patch = 0 }
) => {
  try {
    if (!version) {
      throw new Error('no version given');
    }

    // consider using `node-semver` in the future instead
    const isGreaterThanOrEqual = version.startsWith('>=');
    const sanitizedVersion = isGreaterThanOrEqual ? version.slice(2) : version;

    const [depMajor, depMinor = 0, depPatch = 0] = sanitizedVersion
      .split('.')
      .map(str => Number.parseInt(str));

    // version is identical to required
    if (depMajor === major && depMinor === minor && depPatch === patch) {
      return true;
    }

    // bail if major is higher than required
    if (depMajor > major) {
      return true;
    }

    // bail if major is lower than required
    if (depMajor < major) {
      return false;
    }

    // major is equal to requirements

    // bail if minor is higher than required
    if (depMinor > minor) {
      return true;
    }

    // bail if minor is lower than required
    if (depMinor < minor) {
      return false;
    }

    // major and minor are equal to requirements

    // bail if patch is higher than required
    if (depPatch > patch) {
      return true;
    }

    // bail if patch is lower than required
    return false;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(`Error parsing version: ${error.message}`);

    return false;
  }
};

const applyFlagFilter = (rules, { convertToESLintInternals = true }) => {
  if (!convertToESLintInternals) {
    return rules;
  }

  return Object.fromEntries(
    Object.entries(rules).map(([key, value]) => [
      key,
      convertRuleToEslintInternalValue(value),
    ])
  );
};

const pseudoDeepMerge = (override, previous) =>
  Object.entries(override).reduce((carry, [key, value]) => {
    /* istanbul ignore next line 217 is supposedly uncovered :shrug: */
    if (carry[key]) {
      if (Array.isArray(carry[key])) {
        return {
          ...carry,
          [key]: uniqueArrayEntries(
            ...carry[key],
            ...(Array.isArray(value) ? value : [value])
          ),
        };
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

/**
 * the lower number, the higher the priority of the override is
 */
const overrideOrder = {
  [jestOverrideType]: 0,
  [storybookOverrideType]: 0,
  [tsOverrideType]: 1,
  [reactOverrideType]: 2,
};

/**
 * @param {object[]} overrides
 */
const mergeSortOverrides = overrides => {
  return overrides
    .filter(Boolean)
    .reduce((carry, override) => {
      const isInternalOverride = !!override.overrideType;

      if (isInternalOverride) {
        const previousDefaultOverrideTypeIndex = carry.findIndex(
          o => o.overrideType === override.overrideType
        );

        if (previousDefaultOverrideTypeIndex > -1) {
          const previousDefaultOverrideTypeFiles = new Set(override.files);
          const hasIdenticalFilesArr = carry[
            previousDefaultOverrideTypeIndex
          ].files.every(file => previousDefaultOverrideTypeFiles.has(file));

          if (!hasIdenticalFilesArr) {
            return [...carry, override];
          }

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

const uniqueArrayEntries = (...args) => [...new Set(args)].filter(Boolean);

module.exports = {
  applyFlagFilter,
  fulfillsVersionRequirement,
  mergeSortOverrides,
  uniqueArrayEntries,
};
