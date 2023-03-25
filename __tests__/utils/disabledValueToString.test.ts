import { disabledValueToString } from '../../src/utils/prettier';

test('disabledValueToString', () => {
  expect(disabledValueToString(0)).toBe('off');
  expect(disabledValueToString('off')).toBe('off');
});
