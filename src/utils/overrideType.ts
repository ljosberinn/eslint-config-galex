import merge from 'lodash.merge';

import type { OverrideESLintConfig, WithOverrideType } from '../types';

const createOverrideType = (type: string) => `eslint-config-galex/${type}`;

export const jestOverrideType = createOverrideType('jest');
export const jestConfigOverrideType = createOverrideType('jest-config');
export const reactOverrideType = createOverrideType('react');
export const tsOverrideType = createOverrideType('typescript');
export const storybookOverrideType = createOverrideType('storybook');

export const dropOverrideType = (
  override: WithOverrideType<OverrideESLintConfig>
): OverrideESLintConfig => {
  const copy: Omit<typeof override, 'overrideType'> & {
    overrideType?: string;
  } = { ...override };

  delete copy.overrideType;

  return copy;
};

/**
 * the lower number, the higher the priority of the override is
 */
const overrideOrder = {
  [jestOverrideType]: 0,
  [jestConfigOverrideType]: 0,
  [storybookOverrideType]: 0,
  [tsOverrideType]: 1,
  [reactOverrideType]: 2,
};

/**
 * @param {object[]} overrides
 */
export const mergeSortOverrides = (
  overrides: WithOverrideType<OverrideESLintConfig>[]
): WithOverrideType<OverrideESLintConfig>[] => {
  return [...overrides]
    .reduce<WithOverrideType<OverrideESLintConfig>[]>((carry, override) => {
      const isInternalOverride = !!override.overrideType;

      if (isInternalOverride) {
        const previousDefaultOverrideTypeIndex = carry.findIndex(
          o => o.overrideType === override.overrideType
        );

        if (previousDefaultOverrideTypeIndex > -1) {
          const previousOverride = carry[previousDefaultOverrideTypeIndex];
          /* istanbul ignore next previousOverride must be present here */
          const previousDefaultOverrideTypeFiles = previousOverride
            ? [...new Set(previousOverride.files)]
            : [];

          const nextDefaultOverrideTypeFiles = new Set(override.files);

          const hasIdenticalFilesArr = previousDefaultOverrideTypeFiles.every(
            file => nextDefaultOverrideTypeFiles.has(file)
          );

          if (!hasIdenticalFilesArr) {
            return [...carry, override];
          }

          return carry.map((dataset, index) =>
            index === previousDefaultOverrideTypeIndex
              ? merge(dataset, override)
              : dataset
          );
        }
      }

      return [...carry, override];
    }, [])
    .sort((a, b) => {
      /* istanbul ignore next dumb conditionals to satisfy TS, don't have to test */
      const priorityA = a.overrideType ? overrideOrder[a.overrideType] : -1;
      /* istanbul ignore next dumb conditionals to satisfy TS, don't have to test */
      const priorityB = b.overrideType ? overrideOrder[b.overrideType] : -1;

      /* istanbul ignore next dumb conditionals to satisfy TS, don't have to test */
      return (priorityB ?? -1) - (priorityA ?? -1);
    });
};
