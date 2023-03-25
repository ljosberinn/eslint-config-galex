import packageJson from '../../package.json';
import {
  createBestPracticesTypescriptRules,
  createES6TypeScriptRules,
  createEslintCoreRules,
  createPossibleTypeScriptErrorRules,
  createStylisticIssuesTypeScriptRules,
  createVariableTypeScriptRules,
  eslintDefaultRulesTypeScriptOverride,
} from '../../src/plugins/eslint-core';
import tsConfig from '../../tsconfig.json';
import { defaultProject } from '../shared';

test('allows passing rules', () => {
  const ruleName = 'foo';
  const ruleValue = 'off';

  const result = createEslintCoreRules({
    ...defaultProject,
    rules: {
      [ruleName]: ruleValue,
    },
  });

  expect(result?.[ruleName]).toBe(ruleValue);
});

[
  createES6TypeScriptRules,
  createVariableTypeScriptRules,
  createPossibleTypeScriptErrorRules,
  createBestPracticesTypescriptRules,
  createStylisticIssuesTypeScriptRules,
].forEach(fn => {
  test(`${fn.name} does nothing without typescript`, () => {
    expect(fn(defaultProject)).toBeNull();
  });
});

describe('createEslintCoreRules', () => {
  test('defaults', () => {
    expect(createEslintCoreRules(defaultProject)).toMatchSnapshot();
  });
});

describe('eslintDefaultRulesTypeScriptOverride', () => {
  test('with typescript', () => {
    expect(
      eslintDefaultRulesTypeScriptOverride({
        ...defaultProject,
        typescript: {
          hasTypeScript: true,
          version: packageJson.dependencies.typescript,
          // @ts-expect-error false positive
          config: tsConfig,
        },
      })
    ).toMatchSnapshot();
  });

  test('with create-react-app', () => {
    expect(
      eslintDefaultRulesTypeScriptOverride({
        ...defaultProject,
        react: {
          ...defaultProject.react,
          hasReact: true,
          isCreateReactApp: true,
        },
      })
    ).toMatchSnapshot();
  });

  test('with next', () => {
    expect(
      eslintDefaultRulesTypeScriptOverride({
        ...defaultProject,
        react: {
          ...defaultProject.react,
          hasReact: true,
          isNext: true,
        },
      })
    ).toMatchSnapshot();
  });

  test('with typescript and create-react-app', () => {
    expect(
      eslintDefaultRulesTypeScriptOverride({
        ...defaultProject,
        typescript: {
          hasTypeScript: true,
          version: packageJson.dependencies.typescript,
          // @ts-expect-error false positive
          config: tsConfig,
        },
        react: {
          ...defaultProject.react,
          hasReact: true,
          isCreateReactApp: true,
        },
      })
    ).toMatchSnapshot();
  });

  test('with typescript and next', () => {
    expect(
      eslintDefaultRulesTypeScriptOverride({
        ...defaultProject,
        typescript: {
          hasTypeScript: true,
          version: packageJson.dependencies.typescript,
          // @ts-expect-error false positive
          config: tsConfig,
        },
        react: {
          ...defaultProject.react,
          hasReact: true,
          isNext: true,
        },
      })
    ).toMatchSnapshot();
  });

  test('with typescript and experimentalDecorators', () => {
    expect(
      eslintDefaultRulesTypeScriptOverride({
        ...defaultProject,
        typescript: {
          hasTypeScript: true,
          version: packageJson.dependencies.typescript,
          config: {
            compilerOptions: {
              experimentalDecorators: true,
            },
          },
        },
      })
    ).toMatchSnapshot();
  });

  test('with typescript and checkJs', () => {
    expect(
      eslintDefaultRulesTypeScriptOverride({
        ...defaultProject,
        typescript: {
          hasTypeScript: true,
          version: packageJson.dependencies.typescript,
          config: {
            compilerOptions: {
              checkJs: true,
            },
          },
        },
      })
    ).toMatchSnapshot();
  });
});
