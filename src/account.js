//const TruffleContract = require('truffle-contract');
window.$ = window.jQuery = jQuery;
var courseArray = [];
var signerT = "";
var dataRes = "";

var UserContract, CourseList;
var name, instiCourseCount;
var accountHash, userId;
/*const forwarderOrigin = 'http://localhost:3000';
const initialize = () => {
  //Basic Actions Section
  const onboardButton = document.getElementById('connectButton');

  //Created check function to see if the MetaMask extension is installed
  const isMetaMaskInstalled = () => {
    //Have to check the ethereum binding on the window object to see if it's installed
    const {
      ethereum
    } = window;
    return Boolean(ethereum && ethereum.isMetaMask);
  };

  //This will start the onboarding proccess
  const onClickInstall = () => {
    alert("Please Visit metamask.io to install Metamask")
  };
  const onClickConnect = async () => {
    try {
      // Will open the MetaMask UI
      await window.ethereum.request({
        method: 'eth_requestAccounts'
      });
    } catch (error) {
      console.error(error);
    }
  };
  //------Inserted Code------\\
  const MetaMaskClientCheck = () => {
    //Now we check to see if Metmask is installed
    if (!isMetaMaskInstalled()) {
      //If it isn't installed we ask the user to click to install it
      onboardButton.innerText = 'Click here to install MetaMask!';
      //When the button is clicked we call th is function
      onboardButton.onclick = onClickInstall;
      //The button is now disabled
      onboardButton.disabled = false;
    } else {
      //If MetaMask is installed we ask the user to connect to their wallet
      onboardButton.innerText = 'Connect';
      //When the button is clicked we call this function to connect the users MetaMask Wallet
      onboardButton.onclick = onClickConnect;
      //The button is now disabled
      onboardButton.disabled = false;
    }
  };
  MetaMaskClientCheck();
};*/
App = {
  loading: false,
  contracts: {},

  load: async () => {
    App.Provider = await getProvider()
    App.account = await getAccount()
    await App.loadContract()
    await App.loadAccount()
    await App.renderAccount()
    if (window.location.pathname == "/courses.html") {
      console.log("sdfgthy");
      await App.renderProfile()
      await App.renderInstiCourses()
    } else if (window.location.pathname == "/") {
      console.log("asdfghjk");
    } else if (window.location.pathname == "/learn.html") {
      console.log("nfufub");
      await App.renderList()
      await App.renderInstiCourses()
    } else if (window.location.pathname == "/course.html") {
      console.log("nfufub");
      await App.displayData()
    } else if (window.location.pathname == "/hire.html") {
      console.log("nfufub");
      await App.renderList()
      await App.displayStudents()
    }
  },

  displayStudents: async () => {
    const studentsCount = await UserContract.studentCount()
    console.log(studentsCount);
    for (var i = 1; i <= studentsCount; i++) {
      console.log(studentsCount);
      const details = await UserContract.getStudentDetails(i)
      console.log(details);

      var li = document.createElement("li");
      li.innerHTML = details[1];
      $('#studentsList').append(li);
    }

  },

  displayData: async () => {
    const queryString = window.location.search;
    console.log(queryString);
    const urlParams = new URLSearchParams(queryString);
    const id = urlParams.get('id')
    console.log(id);
    const type = urlParams.get('type')
    console.log(type);
    const courseUrl = "https://ipfs.io/ipfs/" + getCookie("hash" + id)
    console.log(courseUrl);
    console.log(getCookie("hash" + id));
    if (type == "Insti") {
      const studentsCount = await CourseList.getStudentList(id)
      console.log(studentsCount);
      for (var i = 0; i < studentsCount.length; i++) {
        console.log(studentsCount[i]);
        const details = await UserContract.getStudentDetails(studentsCount[i])
        console.log(details);

        var li = document.createElement("li");
        li.innerHTML = details[1];
        $('#studentsList').append(li);
      }

    } else {
      console.log("dfhdgsh");
    }
    $.getJSON(courseUrl, function(data) {
      var items = [];
      //console.log(data);
      dataRes = data;
      //console.log(dataRes);
      var result = document.getElementById("questionsResult");
      document.getElementById("cTitle").innerHTML = data.course_title;
      var url = "https://ipfs.io/ipfs/" + data.file_hash
      document.getElementById("pdfFile").src = url;
      var ol = document.createElement("ol");
      for (var i = 1; i <= data.questionCount; i++) {
        console.log(i);
        var d = "Q" + i;
        console.log(d);
        console.log(data[d].question);
        console.log(data[d].optionCount);
        var li = document.createElement("li");
        li.innerHTML = data[d].question;
        var ul = document.createElement("ul");
        ul.class = "list";
        //console.log(data[d].optionCount);
        li.appendChild(ul);
        for (var j = 1; j <= data[d].optionCount; j++) {
          console.log("j", j);
          var l = document.createElement("li");
          //l.innerHTML = data[d].Option[i]
          var div = document.createElement("div");
          div.classList.add('form-check');
          var input = document.createElement("input");
          input.type = "radio";
          input.name = "Q" + i;
          input.value = data[d].Option[j];
          input.id = "o" + j;
          input.classList.add('form-check-input')

          var label = document.createElement("label");
          label.for = "o" + j;
          label.classList.add('form-check-label')
          label.innerHTML = data[d].Option[j];
          div.appendChild(input);
          div.appendChild(label);
          l.appendChild(div);
          ul.appendChild(l);
        }
        ol.appendChild(li);
      }
      result.appendChild(ol);
    });
  },

  loadAccount: async () => {
    window.ethereum.on('accountsChanged', function(accounts) {
      console.log(accounts);
      window.location.reload()
      App.account = accounts[0];
    })
  },

  loadContract: async () => {
    // Create a JavaScript version of the smart contract

    //Use for local deploy
    //const user = await $.getJSON('UserContract.json')
    //const list = await $.getJSON('CourseList.json')
    /*console.log(user);
    App.contracts.UserContract = TruffleContract(user)
    App.contracts.UserContract.setProvider(App.web3Provider)

    App.user = await App.contracts.UserContract.deployed()
    //use for rinkeby*/
    var courseAbi = [{
        "constant": true,
        "inputs": [],
        "name": "courseCount",
        "outputs": [{
          "name": "",
          "type": "uint256"
        }],
        "payable": false,
        "stateMutability": "view",
        "type": "function",
        "signature": "0x66055159"
      },
      {
        "constant": true,
        "inputs": [{
          "name": "",
          "type": "uint256"
        }],
        "name": "courseDetails",
        "outputs": [{
            "name": "courseId",
            "type": "uint256"
          },
          {
            "name": "courseName",
            "type": "string"
          },
          {
            "name": "offeredBy",
            "type": "string"
          },
          {
            "name": "courseHash",
            "type": "string"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function",
        "signature": "0xd1be5309"
      },
      {
        "inputs": [{
          "name": "_userContractAddress",
          "type": "address"
        }],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "constructor",
        "signature": "constructor"
      },
      {
        "constant": false,
        "inputs": [{
            "name": "hash",
            "type": "string"
          },
          {
            "name": "name",
            "type": "string"
          },
          {
            "name": "by",
            "type": "string"
          },
          {
            "name": "_institutionHash",
            "type": "address"
          }
        ],
        "name": "createCourse",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function",
        "signature": "0x64395a1b"
      },
      {
        "constant": true,
        "inputs": [],
        "name": "getCourseCount",
        "outputs": [{
          "name": "",
          "type": "uint256"
        }],
        "payable": false,
        "stateMutability": "view",
        "type": "function",
        "signature": "0x96cfda06"
      },
      {
        "constant": false,
        "inputs": [{
            "name": "_courseId",
            "type": "uint256"
          },
          {
            "name": "_userId",
            "type": "uint256"
          },
          {
            "name": "_registerAccount",
            "type": "address"
          }
        ],
        "name": "registerCourse",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function",
        "signature": "0xaa77db46"
      },
      {
        "constant": true,
        "inputs": [{
          "name": "index",
          "type": "uint256"
        }],
        "name": "getCourse",
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
            "type": "string"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function",
        "signature": "0x0b91e28d"
      },
      {
        "constant": true,
        "inputs": [{
          "name": "id",
          "type": "uint256"
        }],
        "name": "getStudentList",
        "outputs": [{
          "name": "",
          "type": "uint256[]"
        }],
        "payable": false,
        "stateMutability": "view",
        "type": "function",
        "signature": "0xe5a43d87"
      }
    ]
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

    //console.log(web3.version);
    const provider = new ethers.providers.Web3Provider(App.Provider)
    const signer = provider.getSigner()
    console.log(signer);
    UserContract = new ethers.Contract("0x1EfAE59350B0840bC5B2DF15b715f3F10CA1C899", userContractAbi, provider)
    CourseList = new ethers.Contract('0xd2370aa2fABb6A3Cafa2e32C2618556800C6D0ae', courseAbi, provider);
    signerT = CourseList.connect(signer)
    //console.log(CourseList);


  },
  renderList: async () => {

    /*CourseList.getCourseCount.call(function(error, result){
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
              $('#allItems').append(card)
            }
          });

        }
      }
      else {
        console.log(error);
      }
    });*/

    //Use for local deploy
    const c = await CourseList.courseCount()
    console.log(c);
    const count = await CourseList.getCourseCount().catch(function(error) {
      alert("No Courses Found")
    })
    console.log(c);
    for (var i = 1; i <= count; i++) {
      console.log(i);
      const course = await CourseList.getCourse(i)
      const courseId = course[0].toNumber()
      const courseName = course[1]
      const offeredBy = course[2]
      const courseHash = course[3]
      console.log(course);
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

      var a = document.createElement("button")
      a.innerHTML = "Enroll"
      a.classList.add("btn")
      a.classList.add("btn-primary")
      a.classList.add("stretched-link")
      a.setAttribute("onclick", "App.registerCourse(" + courseId + "," + userId + "); return false;");

      cardBody.appendChild(title)
      cardBody.appendChild(by)
      cardBody.appendChild(a)
      card.appendChild(cardBody)

      setCookie("hash" + courseId, courseHash)
      console.log(getCookie("hash" + courseId));
      $('#allItems').append(card)
    }
  },

  registerCourse: async (cid, uid) => {
    signerT.registerCourse(cid, uid, App.account.toString()).catch(function(error) {
      if (!error) {
        alert("Course Registered")
      }
    })
  },

  renderInstiCourses: async () => {

    /*CourseList.getCourseCount.call(function(error, result){
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
              $('#allItems').append(card)
            }
          });

        }
      }
      else {
        console.log(error);
      }
    });*/

    //Use for local deploy
    console.log(instiCourseCount);
    await asd(instiCourseCount, "Insti")
    /*for (var i = 0; i < instiCourseCount; i++) {
          console.log(i);
          const course = await CourseList.getCourse(courseArray[i])
          const courseId = course[0].toNumber()
          const courseName = course[1]
          const offeredBy = course[2]
          const courseHash = course[3]
          console.log(course);
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
          a.href = "course.html?id=" + courseId

          cardBody.appendChild(title)
          cardBody.appendChild(by)
          cardBody.appendChild(a)
          card.appendChild(cardBody)
          $('#myCourses').append(card)
        }*/
  },

  renderAccount: async () => {
    console.log(window.location.pathname);
    const users = await UserContract.checkUser(App.account.toString())
    console.log(users);
    if (users[0] != 0) {
      userId = users[0]
      instiCourseCount = users[3].length
      console.log(userId);
      document.getElementById('userName').innerHTML = users[1]
      document.getElementById('accountHash').innerHTML = App.account
      console.log(users[3]);
      courseArray = users[3]
    } else {
      console.log(users);
      window.location.href = 'registerUser.html'
    }
    /*App.contracts.UserContract.deployed().then(function(instance) {
      console.log(instance);
        return instance.getUserAcc(App.account);
      }).then(function(result) {
          console.log(result);
          if (result[1] == "") {
            window.location.href= 'registerUser.html';
          }
          else{
            document.getElementById('userName').innerHTML = result[1]
            document.getElementById('name').innerHTML = result[1].charAt(0).toUpperCase()
            document.getElementById('accountHash').innerHTML = App.account
            /*setCookie("name", result[1])
            setCookie("account", App.account)
          }
        }).catch(function(err) {
        console.error(err);
      });*/
  },

  submitAnswer: async () => {
    //console.log(dataRes);
    var marks = 0;
    var answer = $('#form').serializeJSON();
    //console.log(answer);
    $.each(answer, function(k, v) {
      //console.log(k);
      //console.log("from", dataRes[k]["Answer"]);
      //console.log("V", v);
      if (!(v.toLowerCase().localeCompare(dataRes[k]["Answer"].toLowerCase()))) {
        marks++
      }
      //else {
      //  console.log("false", v);
      //}
    });
    alert("Your Marks : " + marks);
    /*for (key in answer){
      console.log(key);
      //console.log(answer[key]);
      //console.log(dataRes[key]["Answer"]);
      if (answer[key].localeCompare(dataRes[key]["Answer"])) {
        console.log("true");
      }
    }*/
  },

  renderProfile: async () => {
    console.log("adg");
    const users = await UserContract.checkUser(App.account.toString()).catch(function(error) {
      console.log(error);
    })
    console.log(users);
    if (users[0] != 0) {
      document.getElementById('title').innerHTML = users[1]
      document.getElementById('account').innerHTML = users[2]
      document.getElementById('noCourses').innerHTML = "No of Courses: " + users[3].length
      instiCourseCount = users[3].length
      courseArray = users[3]
      console.log(courseArray);
      document.getElementById("createCourse").href = "CourseCreation.html?name=" + users[1]
    } else {
      console.log(users);
      window.location.href = 'registerUser.html'
    }
    /*App.contracts.UserContract.deployed().then(function(instance) {
      console.log(instance);
        return instance.getUserAcc(App.account);
      }).then(function(result) {
          console.log(result);
          if (result[1] == "") {
            window.location.href= 'registerUser.html';
          }
          else{
            document.getElementById('userName').innerHTML = result[1]
            document.getElementById('name').innerHTML = result[1].charAt(0).toUpperCase()
            document.getElementById('accountHash').innerHTML = App.account
            /*setCookie("name", result[1])
            setCookie("account", App.account)
          }
        }).catch(function(err) {
        console.error(err);
      });*/
  }
}

async function asd(count, type) {
  console.log(type);
  for (var i = 0; i < count; i++) {
    console.log(i);
    const course = await CourseList.getCourse(courseArray[i])
    const courseId = course[0].toNumber()
    const courseName = course[1]
    const offeredBy = course[2]
    const courseHash = course[3]
    console.log(course);
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
    if (type == "Insti") {
      a.href = "course.html?id=" + courseId + "&type=" + type
    } else {
      a.href = "course.html?id=" + courseId
    }

    cardBody.appendChild(title)
    cardBody.appendChild(by)
    cardBody.appendChild(a)
    card.appendChild(cardBody)
    $('#myCourses').append(card)
  }
}

$(() => {
  $(window).load(() => {
    App.load()
  })
})