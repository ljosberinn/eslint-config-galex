import packageJson from '../../package.json';
import { createPromisePlugin } from '../../src/plugins/promise';
import tsConfig from '../../tsconfig.json';
import { defaultProject } from '../shared';

test('allows passing rules', () => {
  const ruleName = 'foo';
  const ruleValue = 'off';

  const result = createPromisePlugin({
    ...defaultProject,
    rules: {
      [ruleName]: ruleValue,
    },
  });

  expect(result?.[ruleName]).toBe(ruleValue);
});

test('with typescript', () => {
  expect(
    createPromisePlugin({
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
