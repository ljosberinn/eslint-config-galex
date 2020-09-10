const {
  fulfillsVersionRequirement,
} = require('../../utils/fulfillsVersionRequirement');

describe('fulfillsVersionRequirement', () => {
  test.each([
    ['17.0.0-rc.1', { major: 16 }, true],

    ['16.13.1', { major: 16 }, true],
    ['16.13.1', { major: 16, minor: 13 }, true],
    ['16.13.1', { major: 16, minor: 13, patch: 1 }, true],

    ['16.13.1', { major: 16 }, true],
    ['16.13.1', { major: 16, minor: 14 }, false],
    ['16.13.1', { major: 16, minor: 13, patch: 2 }, false],
    ['^16.13.1', { major: 16, minor: 13, patch: 2 }, false],

    ['16.13.1', { major: 17 }, false],
    ['16.13.1', { major: 17, minor: 13 }, false],
    ['16.13.1', { major: 17, minor: 13, patch: 1 }, false],

    ['16.13.1', { major: 17 }, false],
    ['16.13.1', { major: 17, minor: 14 }, false],
    ['16.13.1', { major: 17, minor: 13, patch: 2 }, false],
  ])('fulfillsVersionRequirement(%s, %s)', (version, required, result) => {
    expect(fulfillsVersionRequirement(version, required)).toBe(result);
    expect(fulfillsVersionRequirement(version, required)).toMatchSnapshot();
  });

  test('warns instead of throwing', () => {
    // eslint-disable-next-line no-console
    const consoleError = console.error;

    const consoleErrorSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    expect(fulfillsVersionRequirement(undefined, { major: 16 })).toBe(false);
    expect(
      fulfillsVersionRequirement(undefined, { major: 16 })
    ).toMatchSnapshot();

    expect(consoleErrorSpy).toHaveBeenCalledTimes(2);
    expect(consoleErrorSpy).toHaveBeenLastCalledWith(
      "Error parsing version: Cannot read property 'split' of undefined"
    );

    // eslint-disable-next-line no-console
    console.error = consoleError;
  });
});
