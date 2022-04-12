import packageJson from '../../package.json';
import { createEslintCoreRules } from '../../src/plugins/eslint-core';
import tsConfig from '../../tsconfig.json';
import { defaultProject } from '../shared';

test('allwos passing rules', () => {
  const ruleName = 'foo';
  const ruleValue = 'off';

  const result = createEslintCoreRules({
    ...defaultProject,
    rules: {
      [ruleName]: ruleValue,
    },
  });

  expect(result[ruleName]).toBe(ruleValue);
});

test('with typescript', () => {
  expect(
    createEslintCoreRules({
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
    createEslintCoreRules({
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
    createEslintCoreRules({
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
    createEslintCoreRules({
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
    createEslintCoreRules({
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
    createEslintCoreRules({
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
