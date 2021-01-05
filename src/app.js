const TruffleContract = require('truffle-contract');
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
      const list = await $.getJSON('/build/contracts/CourseList.json')
      //console.log(list);
      App.contracts.CourseList = TruffleContract(list)
      App.contracts.CourseList.setProvider(App.web3Provider)

      App.list = await App.contracts.CourseList.deployed()
      /*contract = web3.eth.contract('"[{"constant":false,"inputs":[{"name":"index","type":"uint256"}],"name":"getCourse","outputs":[{"name":"","type":"uint256"},{"name":"","type":"string"},{"name":"","type":"string"},{"name":"","type":"string"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"courseCount","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"hash","type":"string"},{"name":"name","type":"string"},{"name":"by","type":"string"}],"name":"createCourse","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"getCourseCount","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"courseDetails","outputs":[{"name":"courseId","type":"uint256"},{"name":"courseName","type":"string"},{"name":"offeredBy","type":"string"},{"name":"courseHash","type":"string"}],"payable":false,"stateMutability":"view","type":"function"}]"', '0xDcC65a39d6FAf163D0409294F6008D596Db5091B');

      //contract.setProvider(App.web3Provider);
      //console.log(contract);

      //App.list = await contract.deploy()*/


    },

  renderTasks: async () => {
    /*contract.methods.getCourseCount().call({from : App.account}, function(error, res){
      console.log(result);
    });*/
    const courseCount = App.list.courseCount()
    //console.log(courseCount);
    const $newTemplate = $('.template')
    for (var i = 1; i <= courseCount; i++) {
      //console.log(i);
      const course = await App.list.courseDetails(i)
      const courseId = course[0].toNumber()
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

      /*const $eachTemplate = $newTemplate.clone()
      $eachTemplate.find('.title').html(courseName)
      $eachTemplate.find('.by').html(offeredBy)
      setCookie("hash", courseHash)
      console.log(getCookie("hash"));
      $('#items').append($eachTemplate)
      $eachTemplate.show()*/

    }
  }
}

$(() => {
  $(window).load(() => {
    App.load()
  })
})
