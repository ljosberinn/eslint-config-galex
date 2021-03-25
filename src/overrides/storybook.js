const { uniqueArrayEntries } = require('../utils');
const {
  storybookOverrideType: overrideType,
} = require('../utils/overrideTypes');

const files = ['*.stories.*'];

/**
 * @param {{
 *  hasStorybook: boolean;
 *  rules?: Record<string, any>;
 *  files?: string[];
 * }} options
 */
const createStorybookOverride = ({
  hasStorybook,
  rules: customRules = {},
  files: customFiles = [],
}) => {
  if (!hasStorybook) {
    return null;
  }

  const finalRules = {
    ...rules,
    ...customRules,
  };

  const finalFiles = uniqueArrayEntries(...customFiles, ...files);

  return {
    rules: finalRules,
    files: finalFiles,
    overrideType,
  };
};

const rules = {
  'import/no-default-export': 'off',
  /**
   * allow exporting anonymous config object
   */
  'import/no-anonymous-default-export': 'off',
  /**
   * allow typing template components with Storybook's `Story` type
   */
  'react/function-component-definition': 'off',
};

module.exports = {
  createStorybookOverride,
  files,
  rules,
  overrideType,
};
