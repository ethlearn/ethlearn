
window.$ = window.jQuery = jQuery;

var hashRet = "";
var questionCount = 0;
var optionCount = 0;
var optionArray = [];
const ipfs = window.IpfsApi('localhost', 5001)
function upload() {
  const reader = new FileReader();
  reader.onloadend = function() {
     // Connect to IPFS
    const buf = buffer.Buffer(reader.result) // Convert data into buffer
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
  const photo = document.getElementById("photo");
  reader.readAsArrayBuffer(photo.files[0]); // Read Provided File
}
function myFunction() {
  var x = document.getElementById("files");
  if (x.style.display === "none") {
    x.style.display = "block";
    console.log(hashRet);
    var pdfFile = document.getElementById("pdfFile");
    const source = "http://localhost:8080/ipfs/"+hashRet
    pdfFile.src = source

  } else {
    x.style.display = "none";
  }
}

function addQuestion() {
  questionCount++;
  //console.log(questionCount);
  optionCount = 0;
  var questions = document.getElementById("questions");

  var fieldset = document.createElement("fieldset");
  fieldset.id = "f"+questionCount;
  var legend = document.createElement('legend');
  legend.innerHTML = "Question " + questionCount;

  var input = document.createElement("input");
  input.type = "text";
  //input.name = "Question" + questionCount;
  input.name = "Q"+questionCount+"[question]";
  input.placeholder = "Question " + questionCount;
  input.id = "q"+questionCount;
  console.log(input.getAttribute("id"));

  var button = document.createElement("button");
  button.innerHTML = "Add Option";
  button.id = "bq"+questionCount;
  button.setAttribute("onclick", "addOption(); return false;");

  var ansButton = document.createElement("button");
  ansButton.innerHTML = "Add Answer";
  ansButton.id = "ba"+questionCount;
  ansButton.setAttribute("onclick", "addAnswer(); return false;");

  var clearButton = document.createElement("button");
  clearButton.innerHTML = "Clear";
  clearButton.id = "bc"+questionCount;
  clearButton.setAttribute("onclick", "clearOptions(); return false;");

  var doneButton = document.createElement("button");
  doneButton.innerHTML = "Done";
  doneButton.id = "bc"+questionCount;
  doneButton.setAttribute("onclick", "done(); return false;");

  //button.onclick = function(){ addOption(questionCount); } ;
  console.log(button.getAttribute("onclick"));
  fieldset.appendChild(input);
  fieldset.appendChild(button);
  fieldset.appendChild(ansButton);
  fieldset.appendChild(clearButton);
  fieldset.appendChild(doneButton);
  fieldset.appendChild(legend);
  questions.appendChild(fieldset);

  var optionsDiv = document.createElement("div");
  optionsDiv.id = "q"+questionCount+"div"
  fieldset.appendChild(optionsDiv);
  document.getElementById("addQ").disabled = true;
}

function addOption() {
  console.log(questionCount);
  optionCount++;
  var options = document.getElementById("q"+questionCount+"div");
  var input = document.createElement("input");
  input.type = "text";
  input.placeholder = "Option " + optionCount;
  input.name = "Q"+questionCount+"[Option[" + optionCount+"]]";
  //input.name = "Option" + optionCount;
  input.id = "o"+optionCount;

  var ul = document.createElement("ul");
  var li = document.createElement("li");

  console.log(input.getAttribute("id"));
  console.log("inside button");
  li.appendChild(input);
  ul.appendChild(li);
  options.appendChild(ul);
}

function addAnswer() {
  var input = document.createElement("input");
  var options = document.getElementById("q"+questionCount+"div");
  input.type = "text";
  input.placeholder = "Answer " + questionCount;
  input.name = "Q"+questionCount+"[Answer]";
  input.id = "a" + questionCount;

  document.getElementById('ba'+questionCount).disabled = true;
  options.appendChild(input);
}

function clearOptions() {
  var div = document.getElementById("q"+questionCount+"div");
  div.innerHTML = "";
  optionCount = 0;

  document.getElementById('ba'+questionCount).disabled = false;
}

function done() {
  document.getElementById("addQ").disabled = false;
  document.getElementById("ba"+ questionCount).disabled = true;
  document.getElementById("bq"+ questionCount).disabled = true;
  console.log("oc",optionCount);
  optionArray.push(optionCount);
}

function submitCourse() {
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
    const source = "http://localhost:8080/ipfs/"+ipfsHash
    console.log(source);
  });
  //http://localhost:8080/ipfs/QmaLBPiSggsC2xJJc2fFFuzomFSoHz3Fhoe8T13jjLhhxe
}
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
