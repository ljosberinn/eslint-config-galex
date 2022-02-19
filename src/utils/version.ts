const cache = new Map<string, [number, number, number]>();

const toNumbers = (str: string): [number, number, number] => {
  const maybeCached = cache.get(str);

  if (maybeCached) {
    return maybeCached;
  }

  const [major = 0, minor = 0, patch = 0] = str
    .split('.')
    .map(str =>
      [...str]
        .map(char => Number.parseInt(char))
        .filter(maybeNumber => !Number.isNaN(maybeNumber))
        .join('')
    )
    .map(char => Number.parseInt(char));

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
  try {
    const [givenMajor, givenMinor, givenPatch] = toNumbers(given);
    const [expectedMajor, expectedMinor, expectedPatch] = toNumbers(expected);

    return (
      givenMajor > expectedMajor ||
      givenMinor > expectedMinor ||
      givenPatch > expectedPatch
    );
  } catch {
    return false;
  }
};
