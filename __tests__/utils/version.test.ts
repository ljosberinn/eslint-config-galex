import { fulfillsVersionRequirement } from '../../src/utils/version';

test.each([
  ['4.1.2', '^3.7.0', true],
  ['4.1.2', '^4.1.2', true],
  ['4.1.2', '^4.2.0', false],
  ['3.0.0', '4.1.2', false],
  ['3.0', '4.1.2', false],
  ['3', '4.1.2', false],
  ['.', '4.1.2', false],
])('fulfillsVersionRequirement(%s, %s)', (version, required, result) => {
  expect(
    fulfillsVersionRequirement({ given: version, expected: required })
  ).toBe(result);
  expect(
    fulfillsVersionRequirement({ given: version, expected: required })
  ).toMatchSnapshot();
});
