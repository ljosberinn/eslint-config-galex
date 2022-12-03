import packageJson from '../../package.json';
import { createEtcPlugin } from '../../src/plugins/etc';
import tsConfig from '../../tsconfig.json';
import { defaultProject } from '../shared';

test('no-deprecated is off by default on typescript', () => {
  const result = createEtcPlugin({
    ...defaultProject,
    typescript: {
      hasTypeScript: true,
      version: packageJson.dependencies.typescript,
      // @ts-expect-error false positive
      config: tsConfig,
    },
  });

  expect(result['etc/no-deprecated']).toBe('off');
});

test('allows passing rules', () => {
  const ruleName = 'foo';
  const ruleValue = 'off';

  const result = createEtcPlugin({
    ...defaultProject,
    rules: {
      [ruleName]: ruleValue,
    },
  });

  expect(result[ruleName]).toBe(ruleValue);
});

test('with typescript', () => {
  expect(
    createEtcPlugin({
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
    createEtcPlugin({
      ...defaultProject,
      react: {
        ...defaultProject.react,
        hasReact: true,
        isCreateReactApp: true,
      },
    })
  ).toMatchSnapshot();
});
