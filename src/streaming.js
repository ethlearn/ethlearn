window.$ = window.jQuery = jQuery;
const queryString = window.location.search;
console.log(queryString);
const urlParams = new URLSearchParams(queryString);
const name = urlParams.get('name')
var hashRet = "";
var questionCount = 0;
var optionCount = 0;
var optionArray = [];
var ipfsHash = "";
var signerT = "";
//const ipfs = window.IpfsApi('localhost', 5001)
const buffer = require('buffer');
const ipfs = window.IpfsApi({
  host: 'ipfs.infura.io',
  port: 5001,
  protocol: 'https'
});
//const ipfs = new IPFS({ host: 'localhost', port: 5001, protocol: 'https' });
//const ipfs = window.IpfsApi({ host: 'localhost', port: 5001, protocol: 'https' });
App = {
  Provider: null,
  contracts: {},
  account: '0x0',
  load: async () => {
    App.Provider = await getProvider()
    App.account = await getAccount()
    await App.loadAccount()
    await App.loadContract()
    //await App.render()
  },

  loadAccount: async () => {
    document.getElementById('userName').innerHTML = name;
    document.getElementById('accountHash').innerHTML = App.account;
    window.ethereum.on('accountsChanged', function(accounts) {
      console.log(accounts);
      window.location.reload()
      App.account = accounts[0];
    })
  },

  loadContract: async () => {

    //use for local deploy

    //    const list = await $.getJSON('CourseList.json')
    //console.log(list);
    /*App.contracts.CourseList = TruffleContract(list)
    App.contracts.CourseList.setProvider(App.web3Provider)

    App.list = await App.contracts.CourseList.deployed()*/

    //use for test network deploy

    const provider = new ethers.providers.Web3Provider(App.Provider)
    const signer = provider.getSigner()
    console.log(signer);

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
    //console.log(web3.version);

    CourseList = new ethers.Contract('0xd2370aa2fABb6A3Cafa2e32C2618556800C6D0ae', courseAbi, provider);
    signerT = CourseList.connect(signer)
    //console.log(CourseList);

  },
  filePreview: function() {
    var x = document.getElementById("files");
    if (x.style.display === "none") {
      x.style.display = "block";
      console.log(hashRet);
      var pdfFile = document.getElementById("pdfFile");
      const source = "https://ipfs.io/ipfs/" + hashRet
      pdfFile.src = source

    } else {
      x.style.display = "none";
    }
  },

  upload: function() {
    $('#upload').html('<span class="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true"></span>Loading...')
      .attr('disabled', true);
    const reader = new FileReader();
    console.log(reader);
    reader.onloadend = function() {
      // Connect to IPFS
      const buf = buffer.Buffer(reader.result) // Convert data into buffer
      console.log(buf);
      ipfs.files.add(buf, (err, result) => { // Upload buffer to IPFS
        if (err) {
          console.error(err)
          return
        }
        let url = `https://ipfs.io/ipfs/${result[0].hash}`
        //console.log(result[0].hash)
        hashRet = result[0].hash
        //console.log(`Url --> ${url}`)
        //0x17F6AD8Ef982297579C203069C1DbfFE4348c372 stu
        //0x1aE0EA34a72D944a8C7603FfB3eC30a6669E454C insti
        $('#upload').html('Upload').attr('disabled', false);
        alert('File Uploaded Successfully, Click Preview to verify');
      })
    }
    const photo = document.getElementById("customFile");
    reader.readAsArrayBuffer(photo.files[0]); // Read Provided File

  },

  addQuestion: function() {
    questionCount++;
    //console.log(questionCount);
    optionCount = 0;
    var questions = document.getElementById("questions");

    var card = document.createElement("div");
    card.classList.add('card');

    var cardBody = document.createElement('div');
    cardBody.id = "f" + questionCount;
    cardBody.classList.add('card-body');

    var cardHeader = document.createElement('div');
    cardHeader.classList.add('card-header');
    cardHeader.innerHTML = "Question " + questionCount;

    var input = document.createElement("input");
    input.type = "text";
    //input.name = "Question" + questionCount;
    input.name = "Q" + questionCount + "[question]";
    input.placeholder = "Question " + questionCount;
    input.id = "q" + questionCount;
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
    button.id = "bq" + questionCount;
    button.classList.add("btn");
    button.classList.add("btn-primary");
    button.classList.add("btn-sm");
    button.setAttribute("onclick", "App.addOption(); return false;");

    var ansButton = document.createElement("button");
    ansButton.innerHTML = "Add Answer";
    ansButton.id = "ba" + questionCount;
    ansButton.classList.add("btn");
    ansButton.classList.add("btn-primary");
    ansButton.classList.add("btn-sm");
    ansButton.setAttribute("onclick", "App.addAnswer(); return false;");

    var clearButton = document.createElement("button");
    clearButton.innerHTML = "Clear";
    clearButton.id = "bc" + questionCount;
    clearButton.classList.add("btn");
    clearButton.classList.add("btn-primary");
    clearButton.classList.add("btn-sm");
    clearButton.setAttribute("onclick", "App.clearOptions(); return false;");

    var doneButton = document.createElement("button");
    doneButton.innerHTML = "Done";
    doneButton.disabled = true;
    doneButton.id = "bd" + questionCount;
    doneButton.classList.add("btn");
    doneButton.classList.add("btn-primary");
    doneButton.classList.add("btn-sm");
    doneButton.setAttribute("onclick", "App.done(); return false;");

    //button.onclick = function(){ addOption(questionCount); } ;
    //console.log(button.getAttribute("onclick"));

    var optionsDiv = document.createElement("div");
    optionsDiv.id = "q" + questionCount + "div"
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

  addOption: function() {
    console.log(questionCount);
    optionCount++;
    var options = document.getElementById("q" + questionCount + "div");
    var input = document.createElement("input");
    input.type = "text";
    input.placeholder = "Option " + optionCount;
    input.name = "Q" + questionCount + "[Option[" + optionCount + "]]";
    //input.name = "Option" + optionCount;
    input.id = "o" + optionCount;
    input.classList.add('form-control');

    var ul = document.createElement("ul");
    var li = document.createElement("li");

    console.log(input.getAttribute("id"));
    console.log("inside button");
    li.appendChild(input);
    ul.appendChild(li);
    options.appendChild(ul);
  },

  addAnswer: function() {
    var input = document.createElement("input");
    var options = document.getElementById("q" + questionCount + "div");
    input.type = "text";
    input.placeholder = "Answer " + questionCount;
    input.name = "Q" + questionCount + "[Answer]";
    input.classList.add('form-control');
    input.id = "a" + questionCount;

    document.getElementById('ba' + questionCount).disabled = true;
    document.getElementById('bd' + questionCount).disabled = false;
    options.appendChild(input);
  },

  clearOptions: function() {
    var div = document.getElementById("q" + questionCount + "div");
    div.innerHTML = "";
    optionCount = 0;

    document.getElementById('ba' + questionCount).disabled = false;
  },

  done: function() {
    document.getElementById("addQ").disabled = false;
    document.getElementById("ba" + questionCount).disabled = true;
    document.getElementById("bq" + questionCount).disabled = true;
    console.log("oc", optionCount);
    optionArray.push(optionCount);
  },

  submitCourse: function() {
    $('#submit').html('<span class="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true"></span>Loading...')
      .attr('disabled', true);
    var obj = $('#form').serializeJSON();
    console.log(questionCount);
    console.log(optionArray);
    obj["questionCount"] = questionCount;
    obj["file_hash"] = hashRet;
    for (var j = 1; j <= optionArray.length; j++) {
      var d = "Q" + j;
      obj[d]["optionCount"] = optionArray[j - 1];
      console.log('objc', obj[d]["optionCount"]);
    }
    console.log('obj', obj);
    var jsonString = JSON.stringify(obj);
    console.log('jsonString', jsonString);
    ipfs.add([buffer.Buffer(jsonString)], function(err, res) {
      if (err) throw err
      ipfsHash = res[0].hash

      console.log('creating user on eth for', ipfsHash);
      const source = "https://ipfs.io/ipfs/" + ipfsHash
      console.log(source);
      console.log(obj["course_title"]);
      console.log(ipfsHash);
      signerT.createCourse("QmcwST2fhBkCHYAZVMEYTEacEHG3uJYaNr6HCCKPua9KVk", "Blockchain", name, App.account.toString()).catch(function(error) {
        if (!error) {
          $('#upload').html('Upload').attr('disabled', false);
          alert("Course Created")
        }
      })
      //http://localhost:8080/ipfs/QmaLBPiSggsC2xJJc2fFFuzomFSoHz3Fhoe8T13jjLhhxe
    })
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