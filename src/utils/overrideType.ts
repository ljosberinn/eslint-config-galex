import { OverrideESLintConfig, WithOverrideType } from '../types';

const createOverrideType = (type: string) => `eslint-config-galex/${type}`;

export const jestOverrideType = createOverrideType('jest');
export const jestConfigOverrideType = createOverrideType('jest-config');
export const reactOverrideType = createOverrideType('react');
export const tsOverrideType = createOverrideType('typescript');
export const storybookOverrideType = createOverrideType('storybook');

export const dropOverrideType = (
  override: WithOverrideType<OverrideESLintConfig>
): OverrideESLintConfig => {
  const { overrideType, ...rest } = override;

  return rest;
};
