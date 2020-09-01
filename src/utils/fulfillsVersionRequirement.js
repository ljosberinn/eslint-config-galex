module.exports = {
  /**
   * naive version detection
   *
   * @param {string|number} version
   * @param {{
   *  major: number;
   *  minor?: number;
   *  patch?: number;
   * }} minRequiredVersion
   */
  fulfillsVersionRequirement: (version, { major, minor = 0, patch = 0 }) => {
    try {
      const [depMajor, depMinor, depPatch] = version
        .split('.')
        .map(str => Number.parseInt(str));

      // version is identical to required
      if (depMajor === major && depMinor === minor && depPatch === patch) {
        return true;
      }

      // bail if major is higher than required
      if (depMajor > major) {
        return true;
      }

      // bail if major is lower than required
      if (depMajor < major) {
        return false;
      }

      // major is equal to requirements

      // bail if minor is higher than required
      if (depMinor > minor) {
        return true;
      }

      // bail if minor is lower than required
      if (depMinor < minor) {
        return false;
      }

      // major and minor are equal to requirements

      // bail if patch is higher than required
      if (depPatch > patch) {
        return true;
      }

      // bail if patch is lower than required
      return false;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(`Error parsing version: ${error.message}`);

      return false;
    }
  },
};
