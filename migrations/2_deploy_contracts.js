const CourseList = artifacts.require("CourseList.sol");

module.exports = function(deployer) {
  deployer.deploy(CourseList);
};
