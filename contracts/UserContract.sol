pragma solidity ^0.5.0;

    import {StringUtils} from './StringUtils.sol';

contract UserContract {

    using StringUtils for string;

    uint public studentCount = 0;
    uint public instiCount = 0;
    uint public companyCount = 0;
    uint public userCount = 0;

    struct Student{
        uint id;
        string name;
        string accountHash;
        uint[] courses;
        CourseInfo[] courseInfo;
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

    struct CourseInfo{
        uint courseId;
        bool status;
        string certificateHash;
        uint mark;
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
        uint userId = institutionAcc[institutionAccount].id;

        institution[userId].courses.push(_courseId);
    }

    function registerCourse(uint _courseId, address studentAccount) public{
        studentAcc[studentAccount].courses.push(_courseId);
        uint userId = studentAcc[studentAccount].id;

        student[userId].courses.push(_courseId);
    }

    function getInstituionDetails(uint id) public view returns(uint, string memory, string memory, uint [] memory) {
        return (institution[id].id, institution[id].name, institution[id].accountHash, institution[id].courses);
    }


    function getStudentDetails(uint index) public view returns(uint, string memory, string memory, uint [] memory) {
        return (student[index].id, student[index].name, student[index].accountHash, student[index].courses);
    }

}
