pragma solidity ^0.5.0;

import "./UserContract.sol";

contract CourseList {
    uint public courseCount = 0;
    address userContractAddress;
    UserContract userContract;

    constructor (address _userContractAddress) public{
      userContractAddress = _userContractAddress;
      userContract = UserContract(userContractAddress);
    }

  //  UserContract userContract = UserContract();

    struct CourseDetails {
        uint courseId;
        string courseName;
        string offeredBy;
        string courseHash;
        uint[] students;
    }

    mapping(uint => CourseDetails) public courseDetails;

    function createCourse (string memory hash, string memory name, string memory by, address _institutionHash) public {
        ++courseCount;
        courseDetails[courseCount].courseId = courseCount;
        courseDetails[courseCount].courseName = name;
        courseDetails[courseCount].offeredBy = by;
        courseDetails[courseCount].courseHash = hash;
        userContract.addCourse(courseCount, _institutionHash);
    }

    function getCourseCount() public view returns(uint){
      return courseCount;
    }

    function registerCourse(uint _courseId, uint _userId, address _registerAccount) public{
        userContract.registerCourse(_courseId, _registerAccount);
        courseDetails[_courseId].students.push(_userId);
    }

   function getCourse(uint index) public view returns(uint, string memory, string memory, string memory){
      return (courseDetails[index].courseId, courseDetails[index].courseName, courseDetails[index].offeredBy, courseDetails[index].courseHash);
   }

   function getStudentList(uint id) public view returns(uint [] memory){
       return courseDetails[id].students;
   }

}
