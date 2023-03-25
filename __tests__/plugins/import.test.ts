import packageJson from '../../package.json';
import { createImportPlugin } from '../../src/plugins/import';
import tsConfig from '../../tsconfig.json';
import { defaultProject } from '../shared';

test('allows passing rules', () => {
  const ruleName = 'foo';
  const ruleValue = 'off';

  const result = createImportPlugin({
    ...defaultProject,
    rules: {
      [ruleName]: ruleValue,
    },
  });

  expect(result?.[ruleName]).toBe(ruleValue);
});

test('with typescript', () => {
  expect(
    createImportPlugin({
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
    createImportPlugin({
      ...defaultProject,
      react: {
        ...defaultProject.react,
        hasReact: true,
        isCreateReactApp: true,
      },
    })
  ).toMatchSnapshot();
});
