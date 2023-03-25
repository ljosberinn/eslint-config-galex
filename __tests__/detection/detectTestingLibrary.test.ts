import { detectTestingLibrary } from '../../src/getDependencies';
import { testingLibFamily } from '../../src/utils/defaultsAndDetection';

describe('detectTestingLibrary', () => {
  test.each([testingLibFamily])('with %s', pkg => {
    const map = new Map([[`@testing-library/${pkg}`, '1.0.0']]);

    expect(detectTestingLibrary(map)).toBe(true);
  });

  test('without', () => {
    expect(detectTestingLibrary(new Map())).toBe(false);
  });
});
