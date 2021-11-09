const {
  storybookOverrideType: overrideType,
} = require('../utils/overrideTypes');

const files = ['*.stories.*'];

/**
 * @param {{
 *  hasStorybook: boolean;
 *  rules?: Record<string, any>;
 *  files?: string[];
 *  react: {
 *    hasReact: boolean;
 *  };
 *  typescript: {
 *    hasTypeScript: boolean;
 *  };
 * }} options
 */
const createStorybookOverride = ({
  hasStorybook,
  react,
  typescript,
  rules: customRules = {},
  files: customFiles,
}) => {
  if (!hasStorybook) {
    return null;
  }

  const finalRules = {
    ...createStorybookRules({ react, typescript }),
    ...customRules,
  };

  const finalFiles = customFiles || files;

  return {
    rules: finalRules,
    files: finalFiles,
    overrideType,
  };
};

const createStorybookRules = ({
  react: { hasReact },
  typescript: { hasTypeScript },
}) => ({
  'import/no-default-export': 'off',
  /**
   * allow exporting anonymous config object
   */
  'import/no-anonymous-default-export': 'off',
  /**
   * allow typing template components with Storybook's `Story` type
   */
  ...(hasReact ? { 'react/function-component-definition': 'off' } : null),
  /**
   * disable return type requirement
   */
  ...(hasTypeScript
    ? { '@typescript-eslint/explicit-module-boundary-types': 'off' }
    : null),
  /**
   * allow dummy functions satisfying
   */
  ...(hasTypeScript ? { '@typescript-eslint/no-empty-function': 'off' } : null),
});

module.exports = {
  createStorybookOverride,
  files,
  createStorybookRules,
  overrideType,
};
