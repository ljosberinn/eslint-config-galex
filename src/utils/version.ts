const cache = new Map<string, [number, number, number]>();

const toNumbers = (str: string): [number, number, number] => {
  const maybeCached = cache.get(str);

  if (maybeCached) {
    return maybeCached;
  }

  /* istanbul ignore next major cant ever be undefined, even if only "." is forwarded */
  const [major = 0, minor = 0, patch = 0] = str
    .split('.')
    .map(str =>
      [...str]
        .map(char => Number.parseInt(char))
        .filter(maybeNumber => !Number.isNaN(maybeNumber))
        .join('')
    )
    .map(char => {
      const maybeNumber = Number.parseInt(char);

      return typeof maybeNumber !== 'number' || Number.isNaN(maybeNumber)
        ? 0
        : maybeNumber;
    });

  const sane: [number, number, number] = [major, minor, patch];

  cache.set(str, sane);

  return sane;
};

export const fulfillsVersionRequirement = ({
  given,
  expected,
}: {
  expected: string;
  given: string;
}): boolean => {
  const [givenMajor, givenMinor, givenPatch] = toNumbers(given);
  const [expectedMajor, expectedMinor, expectedPatch] = toNumbers(expected);

  // satisfying major
  if (givenMajor > expectedMajor) {
    return true;
  }

  if (givenMajor === expectedMajor) {
    // satisfying minor
    if (givenMinor > expectedMinor) {
      return true;
    }

    // satisfying patch
    return givenMinor === expectedMinor && givenPatch >= expectedPatch;
  }

  return false;
};
