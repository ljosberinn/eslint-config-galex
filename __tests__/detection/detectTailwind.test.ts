import { detectTailwind } from '../../src/getDependencies';

describe('detectTailwind', () => {
  test('with tailwindcss', () => {
    const map = new Map<string, string>([['tailwindcss', '1.0.0']]);

    expect(detectTailwind(map)).toBe(true);
  });

  test('without any', () => {
    expect(detectTailwind(new Map())).toBe(false);
  });
});
