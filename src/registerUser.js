var UserContract;
var signer;
window.$ = window.jQuery = jQuery;
App = {
  loading: false,
  contracts: {},

  load: async () => {
    App.Provider = await getProvider()
    App.account = await getAccount()
    await App.loadAccount()
    await App.loadContract()
  },

  loadAccount: async () => {
    // Set the current blockchain acco
    document.getElementById('accountHash').value = App.account;
    window.ethereum.on('accountsChanged', function(accounts) {
      //console.log(accounts);
      document.getElementById('accountHash').value = accounts[0];
      App.account = accounts[0];
    })
  },

  loadContract: async () => {
    // Create a JavaScript version of the smart contract

    //Use for local deploy
    const user = await $.getJSON('UserContract.json')
    var userContractAbi = [
    {
      "constant": true,
      "inputs": [],
      "name": "userCount",
      "outputs": [
        {
          "name": "",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function",
      "signature": "0x07973ccf"
    },
    {
      "constant": true,
      "inputs": [
        {
          "name": "",
          "type": "address"
        }
      ],
      "name": "companyAcc",
      "outputs": [
        {
          "name": "id",
          "type": "uint256"
        },
        {
          "name": "name",
          "type": "string"
        },
        {
          "name": "accountHash",
          "type": "string"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function",
      "signature": "0x0b665155"
    },
    {
      "constant": true,
      "inputs": [
        {
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "institution",
      "outputs": [
        {
          "name": "id",
          "type": "uint256"
        },
        {
          "name": "name",
          "type": "string"
        },
        {
          "name": "accountHash",
          "type": "string"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function",
      "signature": "0x2eb78bf6"
    },
    {
      "constant": true,
      "inputs": [
        {
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "student",
      "outputs": [
        {
          "name": "id",
          "type": "uint256"
        },
        {
          "name": "name",
          "type": "string"
        },
        {
          "name": "accountHash",
          "type": "string"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function",
      "signature": "0x35f34232"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "instiCount",
      "outputs": [
        {
          "name": "",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function",
      "signature": "0x632b8bc2"
    },
    {
      "constant": true,
      "inputs": [
        {
          "name": "",
          "type": "address"
        }
      ],
      "name": "studentAcc",
      "outputs": [
        {
          "name": "id",
          "type": "uint256"
        },
        {
          "name": "name",
          "type": "string"
        },
        {
          "name": "accountHash",
          "type": "string"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function",
      "signature": "0x8bf06de9"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "companyCount",
      "outputs": [
        {
          "name": "",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function",
      "signature": "0x8e75dd47"
    },
    {
      "constant": true,
      "inputs": [
        {
          "name": "",
          "type": "address"
        }
      ],
      "name": "institutionAcc",
      "outputs": [
        {
          "name": "id",
          "type": "uint256"
        },
        {
          "name": "name",
          "type": "string"
        },
        {
          "name": "accountHash",
          "type": "string"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function",
      "signature": "0x8fc3dc65"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "studentCount",
      "outputs": [
        {
          "name": "",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function",
      "signature": "0xe581f9ee"
    },
    {
      "constant": true,
      "inputs": [
        {
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "company",
      "outputs": [
        {
          "name": "id",
          "type": "uint256"
        },
        {
          "name": "name",
          "type": "string"
        },
        {
          "name": "accountHash",
          "type": "string"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function",
      "signature": "0xeacebba3"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "_name",
          "type": "string"
        },
        {
          "name": "_account",
          "type": "address"
        },
        {
          "name": "_accountHash",
          "type": "string"
        },
        {
          "name": "_userType",
          "type": "string"
        }
      ],
      "name": "createUser",
      "outputs": [
        {
          "name": "",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function",
      "signature": "0xb1307ee4"
    },
    {
      "constant": true,
      "inputs": [
        {
          "name": "_index",
          "type": "address"
        }
      ],
      "name": "checkUser",
      "outputs": [
        {
          "name": "",
          "type": "uint256"
        },
        {
          "name": "",
          "type": "string"
        },
        {
          "name": "",
          "type": "string"
        },
        {
          "name": "",
          "type": "uint256[]"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function",
      "signature": "0x1e9d48cf"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "_courseId",
          "type": "uint256"
        },
        {
          "name": "institutionAccount",
          "type": "address"
        }
      ],
      "name": "addCourse",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function",
      "signature": "0x92edfa89"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "_courseId",
          "type": "uint256"
        },
        {
          "name": "studentAccount",
          "type": "address"
        }
      ],
      "name": "registerCourse",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function",
      "signature": "0xcaa5b84e"
    },
    {
      "constant": true,
      "inputs": [
        {
          "name": "account",
          "type": "address"
        }
      ],
      "name": "getDetails",
      "outputs": [
        {
          "name": "",
          "type": "uint256"
        },
        {
          "name": "",
          "type": "string"
        },
        {
          "name": "",
          "type": "string"
        },
        {
          "name": "",
          "type": "uint256[]"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function",
      "signature": "0x30289c61"
    },
    {
      "constant": true,
      "inputs": [
        {
          "name": "index",
          "type": "uint256"
        }
      ],
      "name": "getStudentDetails",
      "outputs": [
        {
          "name": "",
          "type": "uint256"
        },
        {
          "name": "",
          "type": "string"
        },
        {
          "name": "",
          "type": "string"
        },
        {
          "name": "",
          "type": "uint256[]"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function",
      "signature": "0x86a9b364"
    },
    {
      "constant": true,
      "inputs": [
        {
          "name": "userId",
          "type": "uint256"
        },
        {
          "name": "_courseId",
          "type": "uint256"
        }
      ],
      "name": "getCourseInfo",
      "outputs": [
        {
          "name": "",
          "type": "uint256"
        },
        {
          "name": "",
          "type": "string"
        },
        {
          "name": "",
          "type": "string"
        },
        {
          "name": "",
          "type": "bool"
        },
        {
          "name": "",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function",
      "signature": "0xd7c1f144"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "_courseId",
          "type": "uint256"
        },
        {
          "name": "_marks",
          "type": "uint256"
        },
        {
          "name": "studentAccount",
          "type": "address"
        }
      ],
      "name": "submitAnswers",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function",
      "signature": "0x72cd73da"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "_courseId",
          "type": "uint256"
        },
        {
          "name": "_certificateHash",
          "type": "string"
        },
        {
          "name": "_signature",
          "type": "string"
        },
        {
          "name": "studentAccount",
          "type": "address"
        }
      ],
      "name": "issueCertificate",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function",
      "signature": "0xee96c675"
    }
  ]
    const provider = new ethers.providers.Web3Provider(App.Provider)
    signer = provider.getSigner()
    //console.log(signer);
    UserContract = new ethers.Contract("0xF6F28868f0Bb99D9F72F917762A04A15e196EBa9", userContractAbi, provider)

    ////console.log(CourseList);*/


  },

  /*renderTasks: async () => {
    CourseList.getCourseCount.call(function(error, result){
      if (!error) {
        //console.log(result);
        const courseCount = result;
        //console.log(courseCount[0]);
        for (var i = 1; i <= courseCount; i++) {
        //console.log(i);
          CourseList.getCourse.call(i, function(error, result){
            if (!error) {
              const course = result
              //console.log(course);
              const courseId = course[0]
              const courseName = course[1]
              const offeredBy = course[2]
              const courseHash = course[3]

              var card = document.createElement("div")
              card.classList.add("card")

              var cardBody = document.createElement("div")
              cardBody.classList.add("card-body")

              var title = document.createElement("h2")
              title.innerHTML = courseName
              title.classList.add("card-title")

              var by = document.createElement("p")
              by.innerHTML = offeredBy
              by.classList.add("card-text")

              var a = document.createElement("a")
              a.innerHTML = "View Course"
              a.classList.add("btn")
              a.classList.add("btn-primary")
              a.classList.add("stretched-link")
              a.href = "course.html?id="+courseId

              cardBody.appendChild(title)
              cardBody.appendChild(by)
              cardBody.appendChild(a)
              card.appendChild(cardBody)

              setCookie("hash"+courseId, courseHash)
              //console.log(getCookie("hash"+courseId));
              $('#items').append(card)
            }
          });

        }
      }
      else {
        //console.log(error);
      }
    });
  }*/

  createUser: function() {
    //console.log(document.getElementById("name").value);
    //console.log(document.getElementById("type").value);
    //console.log(App.account);
    const signerT = UserContract.connect(signer)
    signerT.createUser(document.getElementById("name").value, App.account.toString(), App.account.toString(), document.getElementById("type").value)
      .then(function(result) {
        //console.log(result);
        alert("Created")
        window.location.replace('index.html')
      }).catch(function(error) {
        //console.error(error);
      });
  }

}

$(() => {
  $(window).load(() => {
    App.load()
  })
})