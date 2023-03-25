import { createTailwindPlugin } from '../../src/plugins/tailwindcss';
import { defaultProject } from '../shared';

test('allows passing rules', () => {
  const ruleName = 'foo';
  const ruleValue = 'off';

  const result = createTailwindPlugin({
    ...defaultProject,
    rules: {
      [ruleName]: ruleValue,
    },
  });

  expect(result?.[ruleName]).toBe(ruleValue);
});

test('with tailwind', () => {
  expect(
    createTailwindPlugin({
      ...defaultProject,
      hasTailwind: true,
    })
  ).toMatchSnapshot();
});
