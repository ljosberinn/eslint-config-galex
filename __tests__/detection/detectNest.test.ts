import { detectNodeTypes } from '../../src/getDependencies';

describe('detectNodeTypes', () => {
  test('with @types/node', () => {
    const map = new Map<string, string>([['@types/node', '1.0.0']]);

    expect(detectNodeTypes(map)).toBe(true);
  });

  test('without any', () => {
    expect(detectNodeTypes(new Map())).toBe(false);
  });
});
