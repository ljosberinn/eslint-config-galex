import type { RulesetCreator } from '../types';

export const createTailwindPlugin: RulesetCreator = ({
  rules: customRules,
  ...dependencies
}) => ({
  ...createTailwindRules(dependencies),
  ...customRules,
});

/**
 * @see https://github.com/francoismassart/eslint-plugin-tailwindcss
 *
 */
export const createTailwindRules: RulesetCreator = ({ hasTailwind }) => {
  if (!hasTailwind) {
    return null;
  }

  return {
    /**
     * order classnames for consistency and it makes merge conflict a bit easier to resolve
     *
     * @see https://github.com/francoismassart/eslint-plugin-tailwindcss/blob/master/docs/rules/classnames-order.md
     */
    'tailwindcss/classnames-order': 'warn',

    /**
     * make sure to use negative arbitrary values classname without the negative classname e.g. -top-[5px] should become top-[-5px]
     *
     * @see https://github.com/francoismassart/eslint-plugin-tailwindcss/blob/master/docs/rules/enforces-negative-arbitrary-values.md
     */
    'tailwindcss/enforces-negative-arbitrary-values': 'warn',

    /**
     * merge multiple classnames into shorthand if possible e.g. mx-5 my-5 should become m-5
     *
     * @see https://github.com/francoismassart/eslint-plugin-tailwindcss/blob/master/docs/rules/enforces-shorthand.md
     */
    'tailwindcss/enforces-shorthand': 'warn',

    /**
     * for easy upgrade from Tailwind CSS v2 to v3. Warning: at the moment you should temporary turn off the no-custom-classname rule if you want to see the warning from migration-from-tailwind-2
     *
     * @see https://github.com/francoismassart/eslint-plugin-tailwindcss/blob/master/docs/rules/migration-from-tailwind-2.md
     */
    'tailwindcss/migration-from-tailwind-2': 'warn',

    /**
     * forbid using arbitrary values in classnames (turned off by default)
     *
     * @see https://github.com/francoismassart/eslint-plugin-tailwindcss/blob/master/docs/rules/no-arbitrary-value.md
     */
    'tailwindcss/no-arbitrary-value': 'off',

    /**
     * only allow classnames from Tailwind CSS and the values from the whitelist option
     *
     * @see https://github.com/francoismassart/eslint-plugin-tailwindcss/blob/master/docs/rules/no-custom-classname.md
     */
    'tailwindcss/no-custom-classname': 'warn',

    /**
     * e.g. avoid p-2 p-3, different Tailwind CSS classnames (pt-2 & pt-3) but targeting the same property several times for the same variant.
     *
     * @see https://github.com/francoismassart/eslint-plugin-tailwindcss/blob/master/docs/rules/no-contradicting-classname.md
     */
    'tailwindcss/no-contradicting-classname': 'error',
  };
};
