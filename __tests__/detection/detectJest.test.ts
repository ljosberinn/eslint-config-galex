import { detectJest } from '../../src/getDependencies';

describe('detectJest', () => {
  test('with react-scripts', () => {
    const map = new Map<string, string>([['react-scripts', '1.0.0']]);

    expect(detectJest(map)).toBe(true);
  });

  test('with jest', () => {
    const map = new Map<string, string>([['jest', '1.0.0']]);

    expect(detectJest(map)).toBe(true);
  });

  test('without any', () => {
    expect(detectJest(new Map())).toBe(false);
  });
});
