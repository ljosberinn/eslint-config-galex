const set = (cache, { now, config, dependencies }) => {
  cache.createdAt = now;
  cache.config = config;
  cache.dependencies = dependencies;
};

const mustInvalidate = (cache, { now, dependencies }) => {
  // neither enabled nor previously ran
  if (!dependencies.cacheOptions.enabled || !cache.config) {
    return true;
  }

  const hasChangedDependencies =
    JSON.stringify(dependencies) !== JSON.stringify(cache.dependencies);

  if (hasChangedDependencies) {
    return true;
  }

  return now - dependencies.cacheOptions.expiresAfterMs > cache.createdAt;
};

const createCache = () => {
  const cache = {
    createdAt: null,
    config: null,
    dependencies: null,
  };

  return {
    cache,
    set,
    mustInvalidate,
  };
};

module.exports = {
  createCache,
};
