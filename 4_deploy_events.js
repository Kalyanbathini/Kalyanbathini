var Events = artifacts.require('./EventRegistry.sol');

module.exports = function (deployer) {
  deployer.deploy(Events);
};
