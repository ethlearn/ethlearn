pragma solidity ^0.5.0;

contract CourseList {
    uint public courseCount = 0;

    struct CourseDetails {
        uint courseId;
        string courseName;
        string offeredBy;
        string courseHash;
    }

    mapping(uint => CourseDetails) public courseDetails;

    function createCourse (string memory hash, string memory name, string memory by) public {
        ++courseCount;
        courseDetails[courseCount] = CourseDetails(courseCount, name, by, hash);
    }

    function getCourseCount() public returns(uint){
      return courseCount;
    }

   function getCourse(uint index) public returns(uint, string memory, string memory, string memory){
      return (courseDetails[index].courseId, courseDetails[index].courseName, courseDetails[index].offeredBy, courseDetails[index].courseHash);
   }

}
