//const TruffleContract = require('truffle-contract');
window.$ = window.jQuery = jQuery;
var courseArray = [];
var certHashArray = [];
var signatureArray = [];
var signerList = "";
var signerUser = "";
var dataRes = "";
const queryString = window.location.search;
////console.log(queryString);
const urlParams = new URLSearchParams(queryString);
const user = urlParams.get('user')

var UserContract, CourseList;
var name, instiCourseCount;
var accountHash, userId;
App = {
  loading: false,
  contracts: {},

  load: async () => {
    App.Provider = await getProvider()
    App.account = await getAccount()
    await App.loadContract()
    await App.loadAccount()
    await App.renderAccount()
    if (window.location.pathname == "/teach.html") {
      ////console.log("sdfgthy");
      await App.renderProfile()
      await App.renderInstiCourses()
    } else if (window.location.pathname == "/") {
      ////console.log("asdfghjk");
    } else if (window.location.pathname == "/learn.html") {
      ////console.log("nfufub");
      await App.renderList()
      await App.renderCourses()
    } else if (window.location.pathname == "/course.html") {
      ////console.log("nfufub");
      await App.displayData()
    } else if (window.location.pathname == "/hire.html") {
      ////console.log("nfufub");
      await App.renderList()
      await App.displayStudents()
    } else if (window.location.pathname == "/view.html") {
      ////console.log("nfufub");
      await App.studentProfile()
    }
  },

  studentProfile: async () => {
    ////console.log("adg");

    const users = await UserContract.getStudentDetails(user)
    document.getElementById('title').innerHTML = users[1]
    document.getElementById('account').innerHTML = users[2]
    document.getElementById('noCourses').innerHTML = "No of Courses: " + users[3].length
    instiCourseCount = users[3].length
    courseArray = users[3]
    ////console.log(courseArray);
    ////console.log(users);
    for (var i = 0; i < courseArray.length; i++) {
      ////console.log(courseArray[i].toNumber());
      ////console.log(user);
      var li = document.createElement("li");

      var card = document.createElement("div")
      card.classList.add("card")

      const details = await CourseList.getCourse(courseArray[i].toNumber())
      ////console.log(details);
      var cardBody = document.createElement("div")
      cardBody.classList.add("card-body")
      cardBody.id = i
      var text = document.createElement("p")
      text.innerHTML = "Course Name: " + details[1]
      text.classList.add("card-text")


      var a = document.createElement("button")
      a.classList.add("btn")
      a.classList.add("btn-primary")
      cardBody.append(text)


      var vc = document.createElement("a")
      vc.classList.add("btn")
      vc.classList.add("btn-primary")
      vc.innerHTML = "View Certificate"
      ////console.log(UserContract.getCourseInfo(user, courseArray[i].toNumber()));
      const info = await UserContract.getCourseInfo(user, courseArray[i].toNumber())
      ////console.log(info[3]);
      ////console.log(details);
      if (info[3]) {
        a.innerHTML = "Verify"
        a.setAttribute("onclick", "App.verify(" + i + "); return false;")
        ////console.log(name);
        var mark = document.createElement("p")
        mark.innerHTML = "Marks : " + info[4]
        cardBody.append(mark)
        if (info[2] == "") {
          var cert = document.createElement("p")
          cert.innerHTML = "Certificate not issued yet"
          vc.disabled = true
          cardBody.append(cert)
        } else {
          var cert = document.createElement("p")
          cert.innerHTML = "Certificate Hash: " + info[2]
          certHashArray[i] = info[2]
          signatureArray[i] = info[1]
          vc.href = "https://ipfs.io/ipfs/" + info[2]
          cardBody.append(cert)
        }
      } else {
        a.innerHTML = "Not Completed"
      }
      cardBody.append(a)
      cardBody.append(vc)
      card.append(cardBody)
      li.append(card)
      $('#courseList').append(li);
    }
  },

  verify: async (i) => {
    ////console.log(i);
    ////console.log(certHashArray[i]);
    ////console.log(signatureArray[i]);
    const hash = certHashArray[i]
    const descr = "Course Completed Successfully"
    let payload = ethers.utils.defaultAbiCoder.encode(["string", "string"], [hash, descr]);
    ////console.log("Payload:", payload);

    let payloadHash = ethers.utils.keccak256(payload);
    ////console.log("PayloadHash:", payloadHash);
    // See the note in the Solidity; basically this would save 6 gas and QmUm5Uwvfyoebz9cXW5HZhczVjH9FkMibNJcj5ur6hhZSa
    // can potentially add security vulnerabilities in the future
    // let payloadHash = ethers.utils.solidityKeccak256([ "bytes32", "string" ], [ someHash, someDescr ]);

    // This adds the message prefix
    let sig = ethers.utils.splitSignature(signatureArray[i]);
    ////console.log("Signature:", sig);
    ////console.log("Recovered:", ethers.utils.verifyMessage(ethers.utils.arrayify(payloadHash), sig));
    var r = ethers.utils.verifyMessage(ethers.utils.arrayify(payloadHash), sig);
    var p = document.createElement("p")
    p.innerHTML = "Institute Address : " + r;
    const insti = await UserContract.getDetails(r)
    ////console.log(insti);
    ////console.log(insti[0]);
    var e = document.createElement("p")
    e.innerHTML = "Institute Name : " + insti[1];
    $("#" + i).append(e)
    $("#" + i).append(p)
  },

  displayStudents: async () => {
    const studentsCount = await UserContract.studentCount()
    ////console.log(studentsCount);
    for (var i = 1; i <= studentsCount; i++) {
      ////console.log(studentsCount);
      const details = await UserContract.getStudentDetails(i)
      ////console.log(details);

      var li = document.createElement("li");

      var card = document.createElement("div")
      card.classList.add("card")

      var cardBody = document.createElement("div")
      cardBody.classList.add("card-body")
      var text = document.createElement("p")
      text.innerHTML = details[1]
      text.classList.add("card-text")


      var a = document.createElement("a")
      a.classList.add("btn")
      a.classList.add("btn-primary")
      a.innerHTML = "View"
      a.href = "view.html?user=" + details[0]
      cardBody.append(text)
      cardBody.append(a)
      card.append(cardBody)
      li.append(card)
      $('#studentsList').append(li);
    }

  },

  displayData: async () => {
    const queryString = window.location.search;
    ////console.log(queryString);
    const urlParams = new URLSearchParams(queryString);
    const id = urlParams.get('id')
    ////console.log(id);
    const type = urlParams.get('type')
    ////console.log(type);
    const courseUrl = "https://ipfs.io/ipfs/" + getCookie("hash" + id)
    ////console.log(courseUrl);
    ////console.log(getCookie("hash" + id));
    if (type == "Insti") {
      const studentsCount = await CourseList.getStudentList(id)
      ////console.log(studentsCount);
      for (var i = 0; i < studentsCount.length; i++) {
        ////console.log(studentsCount[i]);
        const details = await UserContract.getStudentDetails(studentsCount[i])
        ////console.log(details);

        var li = document.createElement("li");

        var card = document.createElement("div")
        card.classList.add("card")

        var cardBody = document.createElement("div")
        cardBody.classList.add("card-body")
        var text = document.createElement("p")
        text.innerHTML = details[1]
        text.classList.add("card-text")


        var a = document.createElement("a")
        a.classList.add("btn")
        a.classList.add("btn-primary")
        cardBody.append(text)

        ////console.log(UserContract.getCourseInfo(details[0], id));
        const info = await UserContract.getCourseInfo(details[0], id)
        ////console.log(info[3]);
        ////console.log(details[2]);
        if (info[3]) {
          if (info[2] == "") {
            a.innerHTML = "Issue Certificate"
            ////console.log(name);
            ////console.log(id);
            a.href = "issueCertificate.html?name=" + name + "&id=" + id + "&user=" + details[2]
            var mark = document.createElement("p")
            mark.innerHTML = "Marks : " + info[4]
            mark.classList.add("card-text")
            cardBody.append(mark)
          } else {
            a.innerHTML = "View";
            a.href = "view.html?user=" + details[0]
          }
        } else {
          a.innerHTML = "Not Completed"
        }
        cardBody.append(a)
        card.append(cardBody)
        li.append(card)
        $('#studentsList').append(li);
      }

    } else if (type == "Hire") {
      document.getElementById('data').style.display = "none"
      const studentsCount = await CourseList.getStudentList(id)
      ////console.log(studentsCount);
      for (var i = 0; i < studentsCount.length; i++) {
        ////console.log(studentsCount[i]);
        const details = await UserContract.getStudentDetails(studentsCount[i])
        ////console.log(details);

        var li = document.createElement("li");

        var card = document.createElement("div")
        card.classList.add("card")

        var cardBody = document.createElement("div")
        cardBody.classList.add("card-body")
        var text = document.createElement("p")
        text.innerHTML = details[1]
        text.classList.add("card-text")


        var a = document.createElement("a")
        a.classList.add("btn")
        a.classList.add("btn-primary")
        cardBody.append(text)

        ////console.log(UserContract.getCourseInfo(details[0], id));
        const info = await UserContract.getCourseInfo(details[0], id)
        ////console.log(info[3]);
        ////console.log(details[2]);
        if (info[3]) {
          a.innerHTML = "View"
          ////console.log(name);
          ////console.log(id);
          a.href = "view.html?user=" + details[0]
        } else {
          a.innerHTML = "Not Completed"
        }
        cardBody.append(a)
        card.append(cardBody)
        li.append(card)
        $('#studentsList').append(li);
      }

    } else {
      ////console.log("dfhdgsh");
      document.getElementById('list').style.display = "none"
      document.getElementById("submitMarks").setAttribute("onclick", "App.submitAnswer(" + id + "); return false;");
    }
    $.getJSON(courseUrl, function(data) {
      var items = [];
      //////console.log(data);
      dataRes = data;
      //////console.log(dataRes);
      var result = document.getElementById("questionsResult");
      document.getElementById("cTitle").innerHTML = data.course_title;
      var url = "https://ipfs.io/ipfs/" + data.file_hash
      document.getElementById("pdfFile").src = url;
      var ol = document.createElement("ol");
      for (var i = 1; i <= data.questionCount; i++) {
        ////console.log(i);
        var d = "Q" + i;
        ////console.log(d);
        ////console.log(data[d].question);
        ////console.log(data[d].optionCount);
        var li = document.createElement("li");
        li.innerHTML = data[d].question;
        var ul = document.createElement("ul");
        ul.class = "list";
        //////console.log(data[d].optionCount);
        li.appendChild(ul);
        for (var j = 1; j <= data[d].optionCount; j++) {
          ////console.log("j", j);
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
      ////console.log(accounts);
      window.location.reload()
      App.account = accounts[0];
    })
  },

  loadContract: async () => {
    // Create a JavaScript version of the smart contract

    //Use for local deploy
    //const user = await $.getJSON('UserContract.json')
    //const list = await $.getJSON('CourseList.json')
    /*////console.log(user);
    App.contracts.UserContract = TruffleContract(user)
    App.contracts.UserContract.setProvider(App.web3Provider)

    App.user = await App.contracts.UserContract.deployed()
    //use for rinkeby*/
    var courseAbi = [
    {
      "constant": true,
      "inputs": [],
      "name": "courseCount",
      "outputs": [
        {
          "name": "",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function",
      "signature": "0x66055159"
    },
    {
      "constant": true,
      "inputs": [
        {
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "courseDetails",
      "outputs": [
        {
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
      "inputs": [
        {
          "name": "_userContractAddress",
          "type": "address"
        }
      ],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "constructor",
      "signature": "constructor"
    },
    {
      "constant": false,
      "inputs": [
        {
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
      "outputs": [
        {
          "name": "",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function",
      "signature": "0x96cfda06"
    },
    {
      "constant": false,
      "inputs": [
        {
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
      "inputs": [
        {
          "name": "index",
          "type": "uint256"
        }
      ],
      "name": "getCourse",
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
      "inputs": [
        {
          "name": "id",
          "type": "uint256"
        }
      ],
      "name": "getStudentList",
      "outputs": [
        {
          "name": "",
          "type": "uint256[]"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function",
      "signature": "0xe5a43d87"
    }
  ]
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

    //////console.log(web3.version);
    const provider = new ethers.providers.Web3Provider(App.Provider)
    const signer = provider.getSigner()
    ////console.log(signer);
    UserContract = new ethers.Contract("0xF6F28868f0Bb99D9F72F917762A04A15e196EBa9", userContractAbi, provider)
    CourseList = new ethers.Contract('0x5C5846C242bc5E6BA3275aA4E572ef5E4EDD3070', courseAbi, provider);
    signerList = CourseList.connect(signer)
    signerUser = UserContract.connect(signer)
    //////console.log(CourseList);

  },

  renderList: async () => {
    //Use for local deploy
    const c = await CourseList.courseCount()
    ////console.log(c);
    const count = await CourseList.getCourseCount().catch(function(error) {
      alert("No Courses Found")
    })
    ////console.log(c);
    for (var i = 1; i <= count; i++) {
      ////console.log(i);
      const course = await CourseList.getCourse(i)
      const courseId = course[0].toNumber()
      const courseName = course[1]
      const offeredBy = course[2]
      const courseHash = course[3]
      ////console.log(course);
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

      if (window.location.pathname == "/hire.html") {

        var a = document.createElement("a")
        a.innerHTML = "View"
        a.classList.add("btn")
        a.classList.add("btn-primary")
        a.classList.add("stretched-link")
        a.href = "course.html?id=" + courseId + "&type=Hire"

      } else {
        var a = document.createElement("button")
        a.innerHTML = "Enroll"
        a.classList.add("btn")
        a.classList.add("btn-primary")
        a.classList.add("stretched-link")
        a.setAttribute("onclick", "App.registerCourse(" + courseId + "," + userId + "); return false;");
      }
      cardBody.appendChild(title)
      cardBody.appendChild(by)
      cardBody.appendChild(a)
      card.appendChild(cardBody)

      setCookie("hash" + courseId, courseHash)
      ////console.log(getCookie("hash" + courseId));
      $('#allItems').append(card)
    }
  },

  registerCourse: async (cid, uid) => {
    signerList.registerCourse(cid, uid, App.account.toString()).catch(function(error) {
      if (!error) {
        alert("Course Registered")
      }
    })
  },

  renderInstiCourses: async () => {

    //Use for local deploy
    ////console.log(instiCourseCount);
    await asd(instiCourseCount, "Insti")
  },

  renderCourses: async () => {

    //Use for local deploy
    ////console.log(instiCourseCount);
    await asd(instiCourseCount, "Stu")
  },


  renderAccount: async () => {
    ////console.log(window.location.pathname);
    const users = await UserContract.checkUser(App.account.toString())
    ////console.log(users);
    if (users[0] != 0) {
      userId = users[0]
      instiCourseCount = users[3].length
      ////console.log(userId);
      document.getElementById('userName').innerHTML = users[1]
      name = users[1]
      document.getElementById('accountHash').innerHTML = App.account
      ////console.log(users[3]);
      courseArray = users[3]
    } else {
      ////console.log(users);
      window.location.href = 'registerUser.html'
    }
  },

  submitAnswer: async (cid) => {
    ////console.log(userId);
    var marks = 0;
    var answer = $('#form').serializeJSON();
    ////console.log(answer);
    $.each(answer, function(k, v) {
       ////console.log(k);
       ////console.log("from", dataRes[k]["Answer"]);
       ////console.log("V", v);
      if (!(v.toLowerCase().localeCompare(dataRes[k]["Answer"].toLowerCase()))) {
        marks++
      }
    });
    signerUser.submitAnswers(cid, marks, App.account.toString()).catch(function(error) {
      if (!error) {
        alert("Submitted")
      }
    })
  },

  renderProfile: async () => {
    ////console.log("adg");

    const users = await UserContract.checkUser(App.account.toString()).catch(function(error) {
      ////console.log(error);
    })
    ////console.log(users);
    if (users[0] != 0) {
      document.getElementById('title').innerHTML = users[1]
      document.getElementById('account').innerHTML = users[2]
      document.getElementById('noCourses').innerHTML = "No of Courses: " + users[3].length
      instiCourseCount = users[3].length
      courseArray = users[3]
      ////console.log(courseArray);
      document.getElementById("createCourse").href = "CourseCreation.html?name=" + users[1]
    } else {
      ////console.log(users);
      window.location.href = 'registerUser.html'
    }
  }
}

async function asd(count, type) {
  ////console.log(type);
  for (var i = 0; i < count; i++) {
    ////console.log(i);
    const course = await CourseList.getCourse(courseArray[i])
    const info = await UserContract.getCourseInfo(userId, courseArray[i])
    const courseId = course[0].toNumber()
    const courseName = course[1]
    const offeredBy = course[2]
    const courseHash = course[3]
    ////console.log(course);
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
    a.classList.add("btn")
    a.classList.add("btn-primary")
    a.classList.add("stretched-link")

    if(info[3]){
      a.innerHTML = "View Details"
      a.href = "view.html?user=" + userId
    }
    else {
      a.innerHTML = "View Course"
      a.href = "course.html?id=" + courseId
    }
    if (type == "Insti") {
      a.innerHTML = "View Course"
      a.href = "course.html?id=" + courseId + "&type=" + type
      setCookie("hash" + courseId, courseHash)
      ////console.log(getCookie("hash" + courseId));
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