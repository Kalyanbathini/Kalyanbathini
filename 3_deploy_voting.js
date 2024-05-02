var Voting = artifacts.require("./Create.sol");

module.exports = function (deployer) {
  deployer.deploy(Voting);
};
