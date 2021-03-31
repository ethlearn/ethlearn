pragma solidity ^0.5.0;

    import {StringUtils} from './StringUtils.sol';

contract UserContract {

    using StringUtils for string;

    uint public studentCount = 0;
    uint public instiCount = 0;
    uint public companyCount = 0;
    uint public userCount = 0;

    struct CourseInfo{
        uint courseId;
        bool status;
        string certificateHash;
        uint marks;
        string signature;
    }

    struct Student{
        uint id;
        string name;
        string accountHash;
        uint[] courses;
        mapping(uint => CourseInfo) courseInfo;
    }

    struct Institution{
        uint id;
        string name;
        string accountHash;
        uint[] courses;
    }

    struct Company{
        uint id;
        string name;
        string accountHash;
    }

    mapping(uint => Student) public student;
    mapping(address => Student) public studentAcc;

    mapping(uint => Institution) public institution;
    mapping(address => Institution) public institutionAcc;

    mapping(uint => Company) public company;
    mapping(address => Company) public companyAcc;


    function createUser(string memory _name, address _account, string memory _accountHash, string memory _userType) public returns(uint){
        ++userCount;
        if(_userType.equal("Student")){
            ++studentCount;
            student[studentCount].name = _name;
            student[studentCount].accountHash = _accountHash;
            student[studentCount].id = studentCount;

            studentAcc[_account].name = _name;
            studentAcc[_account].accountHash = _accountHash;
            studentAcc[_account].id = studentCount;
        }
        else if(_userType.equal("Institution")){
            ++instiCount;
            institution[instiCount].name = _name;
            institution[instiCount].accountHash = _accountHash;
            institution[instiCount].id = studentCount;

            institutionAcc[_account].name = _name;
            institutionAcc[_account].accountHash = _accountHash;
            institutionAcc[_account].id = instiCount;
        }
        else if(_userType.equal("Company")){
            ++companyCount;
            company[companyCount].name = _name;
            company[companyCount].accountHash = _accountHash;
            company[companyCount].id = studentCount;

            companyAcc[_account].name = _name;
            companyAcc[_account].accountHash = _accountHash;
            companyAcc[_account].id = instiCount;
        }

    }

    /*function getUserCount() public view returns(uint) {
        return userCount;
    }

    function getStudentCount() public view returns(uint) {
        return studentCount;
    }

    function getCompanyCount() public view returns(uint) {
        return companyCount;
    }

    function getInstitutionCount() public view returns(uint) {
        return instiCount;
    }

    function getUser(uint _index) public view returns(uint, string memory, string memory, string memory){
        return (user[_index].uid, user[_index].name, user[_index].accountHash, user[_index].userType);
    }
    */

    function checkUser(address _index) public view returns(uint, string memory, string memory, uint [] memory){
        if (studentAcc[_index].id<=studentCount && studentAcc[_index].id!=0){
           return (studentAcc[_index].id, studentAcc[_index].name, studentAcc[_index].accountHash, studentAcc[_index].courses);
        }
        //else if (companyAcc[_index].id<=companyCount && companyAcc[_index].id!=0){
         //   return true;
        //}
        else if (institutionAcc[_index].id<=instiCount && institutionAcc[_index].id!=0){
          return (institutionAcc[_index].id, institutionAcc[_index].name, institutionAcc[_index].accountHash, institutionAcc[_index].courses);
        }
        else{
           return (institutionAcc[_index].id, institutionAcc[_index].name, institutionAcc[_index].accountHash, institutionAcc[_index].courses);
        }
        //return (userAcc[_index].uid, userAcc[_index].name, userAcc[_index].accountHash, userAcc[_index].userType);
    }

    function addCourse(uint _courseId, address institutionAccount) public{
        institutionAcc[institutionAccount].courses.push(_courseId);
    }

    function registerCourse(uint _courseId, address studentAccount) public{
        studentAcc[studentAccount].courses.push(_courseId);
        //StudentAcc storage s = studentAcc[studentAccount];

        uint userId = studentAcc[studentAccount].id;

        student[userId].courses.push(_courseId);
        student[userId].courseInfo[_courseId].courseId = _courseId;
        student[userId].courseInfo[_courseId].status = false;
    }

    function getDetails(address account) public view returns(uint, string memory, string memory, uint [] memory) {
        return (institutionAcc[account].id, institutionAcc[account].name, institutionAcc[account].accountHash, institutionAcc[account].courses);
    }


    function getStudentDetails(uint index) public view returns(uint, string memory, string memory, uint [] memory) {
        return (student[index].id, student[index].name, student[index].accountHash, student[index].courses);
    }

    function getCourseInfo(uint userId, uint _courseId) public view returns(uint, string memory, string memory, bool, uint){
        return (student[userId].courseInfo[_courseId].courseId,student[userId].courseInfo[_courseId].signature , student[userId].courseInfo[_courseId].certificateHash, student[userId].courseInfo[_courseId].status, student[userId].courseInfo[_courseId].marks);
    }

    function submitAnswers(uint _courseId, uint _marks, address studentAccount) public {
        studentAcc[studentAccount].courseInfo[_courseId].marks = _marks;
        studentAcc[studentAccount].courseInfo[_courseId].status = true;
        uint userId = studentAcc[studentAccount].id;

        student[userId].courseInfo[_courseId].marks = _marks;
        student[userId].courseInfo[_courseId].status = true;

    }

    function issueCertificate(uint _courseId, string memory _certificateHash, string memory _signature, address studentAccount) public{
        studentAcc[studentAccount].courseInfo[_courseId].certificateHash = _certificateHash;
        studentAcc[studentAccount].courseInfo[_courseId].signature = _signature;
        uint userId = studentAcc[studentAccount].id;

        student[userId].courseInfo[_courseId].certificateHash = _certificateHash;
        student[userId].courseInfo[_courseId].signature = _signature;


    }
}
