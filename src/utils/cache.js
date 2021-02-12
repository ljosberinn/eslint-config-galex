const cache = {
  createdAt: null,
  config: null,
  dependencies: null,
};

const mustBustCache = ({ now, dependencies }) => {
  // neither enabled nor previously ran
  if (!dependencies.cacheOptions.enabled || !cache.config) {
    return true;
  }

  const hasChangedDependencies =
    JSON.stringify(dependencies) !== cache.dependencies;

  if (hasChangedDependencies) {
    return true;
  }

  return now - dependencies.cacheOptions.expiresAfterMs > cache.createdAt;
};

const setCache = ({ now, config, dependencies }) => {
  cache.createdAt = now;
  cache.config = config;
  cache.dependencies = JSON.stringify(dependencies);
};

/**
 * @returns {object | null}
 */
const getCache = () => cache.config;

module.exports = {
  setCache,
  mustBustCache,
  getCache,
};
