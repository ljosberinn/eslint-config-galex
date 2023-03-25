process.env.createConfigArgs = JSON.stringify({
  enableJavaScriptSpecificRulesInTypeScriptProject: true,
});
module.exports = require('../abstractConfig');
