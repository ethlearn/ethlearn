window.$ = window.jQuery = jQuery;
var hashRet = "";
var questionCount = 0;
var optionCount = 0;
var optionArray = [];
var ipfsHash = "";
//const ipfs = window.IpfsApi('localhost', 5001)
const buffer = require('buffer');
const ipfs = window.IpfsApi({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' });
//const ipfs = new IPFS({ host: 'localhost', port: 5001, protocol: 'https' });
//const ipfs = window.IpfsApi({ host: 'localhost', port: 5001, protocol: 'https' });
App = {
  web3Provider: null,
  contracts: {},
  account: '0x0',
  load: async () => {
    await App.loadWeb3()
    await App.loadAccount()
    await App.loadContract()
    //await App.render()
  },

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
        web3.eth.sendTransaction({/* ... */})
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
    web3.eth.getCoinbase(function(err, account) {
      console.log(account);
     if (err === null) {
       console.log("in");
       App.account = account;
       //$("#accountAddress").html("Your Account: " + account);
     }
     else {
       console.log(err);
     }
   });
    console.log(App.account);
  },

  /*  initContract: function() {
    $.getJSON("CourseList.json", function(courseList) {
      // Instantiate a new truffle contract from the artifact
      App.contracts.CourseList = TruffleContract(courseList);
      // Connect provider to interact with contract
      App.contracts.CourseList.setProvider(App.web3Provider);

      //App.listenForEvents();

      //return App.render();
    });
  },*/

loadContract: async () => {
    // Create a JavaScript version of the smart contract
    const list = await $.getJSON('CourseList.json')
    //console.log(list);
    App.contracts.CourseList = TruffleContract(list)
    App.contracts.CourseList.setProvider(App.web3Provider)

    App.list = await App.contracts.CourseList.deployed()
  },
  filePreview: function() {
    var x = document.getElementById("files");
    if (x.style.display === "none") {
      x.style.display = "block";
      console.log(hashRet);
      var pdfFile = document.getElementById("pdfFile");
      const source = "https://ipfs.io/ipfs/"+hashRet
      pdfFile.src = source

    } else {
      x.style.display = "none";
    }
  },


 upload: function () {
  const reader = new FileReader();
  console.log(reader);
  reader.onloadend = function() {
     // Connect to IPFS
    const buf = buffer.Buffer(reader.result) // Convert data into buffer
    console.log(buf);
    ipfs.files.add(buf, (err, result) => { // Upload buffer to IPFS
      if(err) {
        console.error(err)
        return
      }
      alert("File Uploaded");
      let url = `https://ipfs.io/ipfs/${result[0].hash}`
      console.log(result[0].hash)
      hashRet = result[0].hash
      console.log(`Url --> ${url}`)
      document.getElementById("hash").placeholder = hashRet;
      document.getElementById("hash").disabled = true;
    })
  }
  const photo = document.getElementById("customFile");
  reader.readAsArrayBuffer(photo.files[0]); // Read Provided File

},

addQuestion: function () {
  questionCount++;
  //console.log(questionCount);
  optionCount = 0;
  var questions = document.getElementById("questions");

  var card = document.createElement("div");
  card.classList.add('card');

  var cardBody = document.createElement('div');
  cardBody.id = "f"+questionCount;
  cardBody.classList.add('card-body');

  var cardHeader = document.createElement('div');
  cardHeader.classList.add('card-header');
  cardHeader.innerHTML = "Question "+questionCount;

  var input = document.createElement("input");
  input.type = "text";
  //input.name = "Question" + questionCount;
  input.name = "Q"+questionCount+"[question]";
  input.placeholder = "Question " + questionCount;
  input.id = "q"+questionCount;
  input.classList.add('form-control');
  //console.log(input.getAttribute("id"));

  var bf = document.createElement('div')
  bf.classList.add('card-footer')

  var br = document.createElement('br')

  var buttonGroup = document.createElement('div')
  buttonGroup.classList.add('btn-group')
  buttonGroup.role = "group";

  var button = document.createElement("button");
  button.innerHTML = "Add Option";
  button.id = "bq"+questionCount;
  button.classList.add("btn");
  button.classList.add("btn-primary");
  button.classList.add("btn-sm");
  button.setAttribute("onclick", "App.addOption(); return false;");

  var ansButton = document.createElement("button");
  ansButton.innerHTML = "Add Answer";
  ansButton.id = "ba"+questionCount;
  ansButton.classList.add("btn");
  ansButton.classList.add("btn-primary");
  ansButton.classList.add("btn-sm");
  ansButton.setAttribute("onclick", "App.addAnswer(); return false;");

  var clearButton = document.createElement("button");
  clearButton.innerHTML = "Clear";
  clearButton.id = "bc"+questionCount;
  clearButton.classList.add("btn");
  clearButton.classList.add("btn-primary");
  clearButton.classList.add("btn-sm");
  clearButton.setAttribute("onclick", "App.clearOptions(); return false;");

  var doneButton = document.createElement("button");
  doneButton.innerHTML = "Done";
  doneButton.disabled = true;
  doneButton.id = "bd"+questionCount;
  doneButton.classList.add("btn");
  doneButton.classList.add("btn-primary");
  doneButton.classList.add("btn-sm");
  doneButton.setAttribute("onclick", "App.done(); return false;");

  //button.onclick = function(){ addOption(questionCount); } ;
  //console.log(button.getAttribute("onclick"));

  var optionsDiv = document.createElement("div");
  optionsDiv.id = "q"+questionCount+"div"
  document.getElementById("addQ").disabled = true;


  cardBody.appendChild(input);
  cardBody.appendChild(br);
  cardBody.appendChild(optionsDiv);
  buttonGroup.appendChild(button);
  buttonGroup.appendChild(ansButton);
  buttonGroup.appendChild(clearButton);
  buttonGroup.appendChild(doneButton);
  bf.appendChild(buttonGroup);
  card.appendChild(cardHeader);
  card.appendChild(cardBody);
  card.appendChild(bf);
  questions.appendChild(card);
},

addOption: function () {
  console.log(questionCount);
  optionCount++;
  var options = document.getElementById("q"+questionCount+"div");
  var input = document.createElement("input");
  input.type = "text";
  input.placeholder = "Option " + optionCount;
  input.name = "Q"+questionCount+"[Option[" + optionCount+"]]";
  //input.name = "Option" + optionCount;
  input.id = "o"+optionCount;
  input.classList.add('form-control');

  var ul = document.createElement("ul");
  var li = document.createElement("li");

  console.log(input.getAttribute("id"));
  console.log("inside button");
  li.appendChild(input);
  ul.appendChild(li);
  options.appendChild(ul);
},

addAnswer: function () {
  var input = document.createElement("input");
  var options = document.getElementById("q"+questionCount+"div");
  input.type = "text";
  input.placeholder = "Answer " + questionCount;
  input.name = "Q"+questionCount+"[Answer]";
  input.classList.add('form-control');
  input.id = "a" + questionCount;

  document.getElementById('ba'+questionCount).disabled = true;
  document.getElementById('bd'+questionCount).disabled = false;
  options.appendChild(input);
},

clearOptions: function () {
  var div = document.getElementById("q"+questionCount+"div");
  div.innerHTML = "";
  optionCount = 0;

  document.getElementById('ba'+questionCount).disabled = false;
},

done: function () {
  document.getElementById("addQ").disabled = false;
  document.getElementById("ba"+ questionCount).disabled = true;
  document.getElementById("bq"+ questionCount).disabled = true;
  console.log("oc",optionCount);
  optionArray.push(optionCount);
},

submitCourse: function () {
  var obj = $('#form').serializeJSON();
  console.log(questionCount);
  console.log(optionArray);
  obj["questionCount"] = questionCount;
  obj["file_hash"] = hashRet;
  for (var i = 1; i <= questionCount; i++) {
    var d = "Q"+i;
    for (var j = 0; j < optionArray.length; j++) {
      obj[d]["optionCount"] = optionArray[j];
    }
  }
  console.log('obj', obj);
  var jsonString = JSON.stringify(obj);
  console.log('jsonString', jsonString);
  ipfs.add([buffer.Buffer(jsonString)], function(err, res) {
    if (err) throw err
    ipfsHash = res[0].hash

    console.log('creating user on eth for',ipfsHash);
    const source = "https://ipfs.io/ipfs/"+ipfsHash
    console.log(source);
    console.log(obj["course_title"]);
    console.log(ipfsHash);
    App.contracts.CourseList.deployed().then(function(instance) {
        return instance.createCourse(ipfsHash, obj["course_title"], "MCET", {from: App.account});
      }).then(function(result) {
        // Wait for votes to update
        alert("Done");
      }).catch(function(err) {
        console.error(err);
      });
  });


  //http://localhost:8080/ipfs/QmaLBPiSggsC2xJJc2fFFuzomFSoHz3Fhoe8T13jjLhhxe
}
}
$(() => {
  $(window).load(() => {
    App.load()
  })
})
//const MyContract = artifacts.require("MyContract")

/*async function test() {
  /*const data = JSON.stringify({
    name: "JSON Statehem",
    link0: "stackexchange.com",
    link1: "github.com",
    link2: "myfacebook.com"
  })*/

  /*var userJson = {
      username: "username",
      title: "title",
      intro: {
        name: "Arvind",
        roll: "asd"
      }
    };
/*console.log('userJson', userJson);
    ipfs.add([buffer.Buffer(JSON.stringify(userJson))], function(err, res) {
      if (err) throw err
      ipfsHash = res[0].hash

      console.log('creating user on eth for',ipfsHash);
      const source = "http://localhost:8080/ipfs/"+ipfsHash
      console.log(source);
    });
  //const ipfsHash = await ipfs.add(data)
  //const instance = await MyContract.deployed()

  //await instance.setHash.sendTransaction(ipfsHash)

  //let returnedHash = await instance.ipfsHash.call()

  //console.log(ipfsHash)
  //console.log(returnedHash)

  //console.log(JSON.parse(await ipfs.cat(returnedHash)))

}

test()
// Setting HLS Config values
/*Hls.DefaultConfig.loader = HlsjsIpfsLoader
Hls.DefaultConfig.debug = false

async function P2PMagic () {
  if (!Hls.isSupported()) {
    return displayError(new Error('Your Browser does not support the HTTP Live Streaming Protocol'))
  }

  const video = document.getElementById('video')
  const bigBuckBunnyCID = 'QmYGs1ksGX3eMiGvxNuvRT6PD7zPKZpHyiUDXKGQoL4R7S'

  // Create an IPFS node inside your browser
  let node;
  // Init a new repo for this run
  const repoPath = 'ipfs-' + Math.random()
  try {
    // Instatiate your IPFS node
    node = await Ipfs.create({ repo: repoPath })
  } catch(err) {
    displayError(err)
  }

  const hls = new Hls()
  hls.config.ipfs = node
  hls.config.ipfsHash = bigBuckBunnyCID
  hls.loadSource('master.m3u8')
  hls.attachMedia(video)
  hls.on(Hls.Events.MANIFEST_PARSED, () => video.play())
}

function displayError(err) {
  const modalElement = document.getElementById('modal');
  modalElement.style.display = 'flex';

  const errStr = String(err).toLowerCase();
  const spanElement = document.getElementById('errorText');

  spanElement.innerHTML = errorStr.includes('SecurityError'.toLowerCase())
    ? 'You must use Chrome or Firefox to test this embedded app!'
    : 'Something went wrong. See the console to get further details.';
}

P2PMagic()*/
