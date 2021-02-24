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
      console.log(accounts);
      document.getElementById('accountHash').value = accounts[0];
      App.account = accounts[0];
    })
  },

  loadContract: async () => {
    // Create a JavaScript version of the smart contract

    //Use for local deploy
    //const user = await $.getJSON('UserContract.json')
    /*console.log(user);
      App.contracts.UserContract = TruffleContract(user)
      App.contracts.UserContract.setProvider(App.web3Provider)

      App.list = await App.contracts.UserContract.deployed()
      /*var courselistContract =  web3.eth.contract([{"constant":true,"inputs":[],"name":"courseCount","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"courseDetails","outputs":[{"internalType":"uint256","name":"courseId","type":"uint256"},{"internalType":"string","name":"courseName","type":"string"},{"internalType":"string","name":"offeredBy","type":"string"},{"internalType":"string","name":"courseHash","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"string","name":"hash","type":"string"},{"internalType":"string","name":"name","type":"string"},{"internalType":"string","name":"by","type":"string"}],"name":"createCourse","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"uint256","name":"index","type":"uint256"}],"name":"getCourse","outputs":[{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"string","name":"","type":"string"},{"internalType":"string","name":"","type":"string"},{"internalType":"string","name":"","type":"string"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"getCourseCount","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"}]);
//console.log(web3.version);*/
    var userContractAbi = [{
        "constant": true,
        "inputs": [],
        "name": "userCount",
        "outputs": [{
          "name": "",
          "type": "uint256"
        }],
        "payable": false,
        "stateMutability": "view",
        "type": "function",
        "signature": "0x07973ccf"
      },
      {
        "constant": true,
        "inputs": [{
          "name": "",
          "type": "address"
        }],
        "name": "companyAcc",
        "outputs": [{
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
        "inputs": [{
          "name": "",
          "type": "uint256"
        }],
        "name": "institution",
        "outputs": [{
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
        "inputs": [{
          "name": "",
          "type": "uint256"
        }],
        "name": "student",
        "outputs": [{
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
        "outputs": [{
          "name": "",
          "type": "uint256"
        }],
        "payable": false,
        "stateMutability": "view",
        "type": "function",
        "signature": "0x632b8bc2"
      },
      {
        "constant": true,
        "inputs": [{
          "name": "",
          "type": "address"
        }],
        "name": "studentAcc",
        "outputs": [{
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
        "outputs": [{
          "name": "",
          "type": "uint256"
        }],
        "payable": false,
        "stateMutability": "view",
        "type": "function",
        "signature": "0x8e75dd47"
      },
      {
        "constant": true,
        "inputs": [{
          "name": "",
          "type": "address"
        }],
        "name": "institutionAcc",
        "outputs": [{
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
        "outputs": [{
          "name": "",
          "type": "uint256"
        }],
        "payable": false,
        "stateMutability": "view",
        "type": "function",
        "signature": "0xe581f9ee"
      },
      {
        "constant": true,
        "inputs": [{
          "name": "",
          "type": "uint256"
        }],
        "name": "company",
        "outputs": [{
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
        "inputs": [{
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
        "outputs": [{
          "name": "",
          "type": "uint256"
        }],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function",
        "signature": "0xb1307ee4"
      },
      {
        "constant": true,
        "inputs": [{
          "name": "_index",
          "type": "address"
        }],
        "name": "checkUser",
        "outputs": [{
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
        "inputs": [{
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
        "inputs": [{
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
        "inputs": [{
          "name": "id",
          "type": "uint256"
        }],
        "name": "getInstituionDetails",
        "outputs": [{
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
        "signature": "0xf216193b"
      },
      {
        "constant": true,
        "inputs": [{
          "name": "index",
          "type": "uint256"
        }],
        "name": "getStudentDetails",
        "outputs": [{
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
      }
    ]
    const provider = new ethers.providers.Web3Provider(App.Provider)
    signer = provider.getSigner()
    console.log(signer);
    UserContract = new ethers.Contract("0x1EfAE59350B0840bC5B2DF15b715f3F10CA1C899", userContractAbi, provider)

    //console.log(CourseList);*/


  },

  /*renderTasks: async () => {
    CourseList.getCourseCount.call(function(error, result){
      if (!error) {
        console.log(result);
        const courseCount = result;
        console.log(courseCount[0]);
        for (var i = 1; i <= courseCount; i++) {
        console.log(i);
          CourseList.getCourse.call(i, function(error, result){
            if (!error) {
              const course = result
              console.log(course);
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
              console.log(getCookie("hash"+courseId));
              $('#items').append(card)
            }
          });

        }
      }
      else {
        console.log(error);
      }
    });
  }*/

  createUser: function() {
    console.log(document.getElementById("name").value);
    console.log(document.getElementById("type").value);
    console.log(App.account);
    const signerT = UserContract.connect(signer)
    signerT.createUser(document.getElementById("name").value, App.account.toString(), App.account.toString(), document.getElementById("type").value)
      .then(function(result) {
        alert("Created");

        window.location.replace('index.html')
      }).catch(function(error) {
        console.error(error);
      });
  }

}

$(() => {
  $(window).load(() => {
    App.load()
  })
})