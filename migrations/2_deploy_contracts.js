const CourseList = artifacts.require("CourseList.sol");
const UserContract = artifacts.require("UserContract.sol");

module.exports = function(deployer) {
  deployer.deploy(UserContract).then(function() {
    return deployer.deploy(CourseList, UserContract.address);
  }).then(function() {})
};