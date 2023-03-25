import packageJson from '../../package.json';
import { createSonarjsPlugin } from '../../src/plugins/sonarjs';
import tsConfig from '../../tsconfig.json';
import { defaultProject } from '../shared';

test('allows passing rules', () => {
  const ruleName = 'foo';
  const ruleValue = 'off';

  const result = createSonarjsPlugin({
    ...defaultProject,
    rules: {
      [ruleName]: ruleValue,
    },
  });

  expect(result?.[ruleName]).toBe(ruleValue);
});

test('with typescript', () => {
  expect(
    createSonarjsPlugin({
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
