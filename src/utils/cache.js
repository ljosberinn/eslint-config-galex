const cache = {
  createdAt: null,
  config: null,
  dependencies: null,
};

const mustInvalidate = ({ now, dependencies }) => {
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

const set = ({ now, config, dependencies }) => {
  cache.createdAt = now;
  cache.config = config;
  cache.dependencies = JSON.stringify(dependencies);
};

/**
 * @returns {object | null}
 */
const get = () => cache.config;

module.exports = {
  set,
  mustInvalidate,
  get,
};
