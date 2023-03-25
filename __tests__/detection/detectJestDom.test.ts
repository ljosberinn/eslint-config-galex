import { detectJestDom } from '../../src/getDependencies';

describe('detectJestDom', () => {
  test('with @testing-library/jest-dom', () => {
    const map = new Map<string, string>([
      ['@testing-library/jest-dom', '1.0.0'],
    ]);

    expect(detectJestDom(map)).toBe(true);
  });

  test('without any', () => {
    expect(detectJestDom(new Map())).toBe(false);
  });
});
