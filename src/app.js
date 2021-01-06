var CourseList;
App = {
  loading: false,
  contracts: {},

  load: async () => {
    await App.loadWeb3()
    await App.loadAccount()
    await App.loadContract()
    await App.renderTasks()
  },

  // https://medium.com/metamask/https-medium-com-metamask-breaking-change-injecting-web3-7722797916a8
  loadWeb3: async () => {
      if (typeof web3 !== 'undefined') {
      App.web3Provider = web3.currentProvider
      web3 = new Web3(web3.currentProvider)
    } else {
      window.alert("Please connect to Metamask.")
    }
    // Modern dapp browsers...
    if (window.ethereum) {
      window.web3 = new Web3(ethereum)
      try {
        // Request account access if needed
        await ethereum.enable()
        // Acccounts now exposed
        //web3.eth.sendTransaction({/* ... */})
      } catch (error) {
        // User denied account access...
      }
    }
    // Legacy dapp browsers...
    else if (window.web3) {
      App.web3Provider = web3.currentProvider
      window.web3 = new Web3(web3.currentProvider)
      // Acccounts always exposed
      //web3.eth.sendTransaction({/* ... */})
    }
    // Non-dapp browsers...
    else {
      console.log('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }
  },

  loadAccount: async () => {
    // Set the current blockchain account
    App.account = web3.eth.accounts[0]
  },

  loadContract: async () => {
      // Create a JavaScript version of the smart contract
      /*
      Use for local deploy
      const list = await $.getJSON('CourseList.json')
      console.log(list);
      App.contracts.CourseList = TruffleContract(list)
      App.contracts.CourseList.setProvider(App.web3Provider)

      App.list = await App.contracts.CourseList.deployed()*/
      var courselistContract =  web3.eth.contract([{"constant":true,"inputs":[],"name":"courseCount","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"courseDetails","outputs":[{"internalType":"uint256","name":"courseId","type":"uint256"},{"internalType":"string","name":"courseName","type":"string"},{"internalType":"string","name":"offeredBy","type":"string"},{"internalType":"string","name":"courseHash","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"string","name":"hash","type":"string"},{"internalType":"string","name":"name","type":"string"},{"internalType":"string","name":"by","type":"string"}],"name":"createCourse","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"uint256","name":"index","type":"uint256"}],"name":"getCourse","outputs":[{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"string","name":"","type":"string"},{"internalType":"string","name":"","type":"string"},{"internalType":"string","name":"","type":"string"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"getCourseCount","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"}]);
//console.log(web3.version);

      CourseList = courselistContract.at('0xDcC65a39d6FAf163D0409294F6008D596Db5091B');

      //console.log(CourseList);


    },

  renderTasks: async () => {
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
      /*
      Use for local deploy
      const courseCount = App.list.courseCount()
    console.log(courseCount);
    for (var i = 1; i <= courseCount; i++) {
    console.log(i);
      const course = await App.list.courseDetails(i)
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
      a.href = "course.html?id="+courseId

      cardBody.appendChild(title)
      cardBody.appendChild(by)
      cardBody.appendChild(a)
      card.appendChild(cardBody)

      setCookie("hash"+courseId, courseHash)
      console.log(getCookie("hash"+courseId));
      $('#items').append(card)

    }*/
  }
}

$(() => {
  $(window).load(() => {
    App.load()
  })
})
