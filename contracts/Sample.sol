pragma solidity ^0.5.0;
import "./strings.sol";
contract Sample {

    using StringUtils for string;

    bool result;
    uint[] marks = new uint[](2);
    uint public totalMarks;


    function checkAnswers(string memory _answer, bool _ans) public returns (string memory){
        if(_answer.equal("distributed")){
            marks.push(1);
        }
        else{
            marks.push(0);
        }
        if(_ans == true){
            marks.push(1);
        }
        else{
            marks.push(0);
        }
        for(uint i = 0; i<marks.length;i++){
            totalMarks = totalMarks+marks[i];
        }
        if(totalMarks>0)
          return "Passed";
        else
          return "Failed";
    }

}
