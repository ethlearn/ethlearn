var CourseList;
var signerT;
//const TruffleContract = require('truffle-contract');
App = {
  loading: false,
  contracts: {},

  load: async () => {
    App.Provider = await getProvider()
    App.account = await getAccount()
    await App.loadAccount()
    await App.loadContract()
    if (window.location.pathname == "/courses.html") {
      console.log("sdfgthy");
      //  await App.renderInstiCourses()
    } else if (window.location.pathname == "/learn.html") {
      console.log("asdfghjk");
      await App.renderList()
    }
  },

  loadAccount: async () => {
    console.log(window.location);
    window.ethereum.on('accountsChanged', function(accounts) {
      console.log(accounts);
      window.location.reload()
      App.account = accounts[0];
    })
  },

  loadContract: async () => {
    // Create a JavaScript version of the smart contract

    //Use for local deploy
    const list = await $.getJSON('CourseList.json')
    //console.log(list);
    /*App.contracts.CourseList = TruffleContract(list)
    App.contracts.CourseList.setProvider(App.web3Provider)

    App.list = await App.contracts.CourseList.deployed()*/
    //use for rinkeby
    const provider = new ethers.providers.Web3Provider(App.Provider)
    const signer = provider.getSigner()
    console.log(signer);

    var courselistAbi = [{
      "constant": true,
      "inputs": [{
        "name": "index",
        "type": "uint256"
      }],
      "name": "getCourse",
      "outputs": [{
        "name": "",
        "type": "uint256"
      }, {
        "name": "",
        "type": "string"
      }, {
        "name": "",
        "type": "string"
      }, {
        "name": "",
        "type": "string"
      }],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    }, {
      "constant": true,
      "inputs": [],
      "name": "courseCount",
      "outputs": [{
        "name": "",
        "type": "uint256"
      }],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    }, {
      "constant": false,
      "inputs": [{
        "name": "hash",
        "type": "string"
      }, {
        "name": "name",
        "type": "string"
      }, {
        "name": "by",
        "type": "string"
      }],
      "name": "createCourse",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    }, {
      "constant": true,
      "inputs": [],
      "name": "getCourseCount",
      "outputs": [{
        "name": "",
        "type": "uint256"
      }],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    }, {
      "constant": true,
      "inputs": [{
        "name": "",
        "type": "uint256"
      }],
      "name": "courseDetails",
      "outputs": [{
        "name": "courseId",
        "type": "uint256"
      }, {
        "name": "courseName",
        "type": "string"
      }, {
        "name": "offeredBy",
        "type": "string"
      }, {
        "name": "courseHash",
        "type": "string"
      }],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    }]
    //console.log(web3.version);0xe4E5e3228334d24b33387DC3F213F4A8f0173DC8

    CourseList = new ethers.Contract('0x7B11fd7Aec12FefabC139dd5438B35617D1CF10d', list.abi, provider);

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

      setCookie("hash" + courseId, courseHash)
      console.log(getCookie("hash" + courseId));
      $('#allItems').append(card)
    }
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

      setCookie("hash" + courseId, courseHash)
      console.log(getCookie("hash" + courseId));
      $('#allItems').append(card)
    }
  }
}

$(() => {
  $(window).load(() => {
    App.load()
  })
})