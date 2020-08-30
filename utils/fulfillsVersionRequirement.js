module.exports = {
  /**
   * naive semver detection
   *
   * @param {string|number} version
   * @param {{
   *  major: number;
   *  minor?: number;
   *  patch?: number;
   * }} minRequiredVersion
   */
  fulfillsVersionRequirement: (version, { major, minor, patch }) => {
    try {
      const [depMajor, depMinor, depPatch] = version.split('.');

      const fulfillsMajor = Number.parseInt(depMajor) >= major;
      const fulfillsMinor = minor ? Number.parseInt(depMinor) >= minor : true;
      const fulfillsPatch = patch ? Number.parseInt(depPatch) >= patch : true;

      return fulfillsMajor && fulfillsMinor && fulfillsPatch;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(`Error parsing version: ${error.message}`);
      return false;
    }
  },
};
