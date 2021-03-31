window.$ = window.jQuery = jQuery;
const queryString = window.location.search;
////console.log(queryString);
const urlParams = new URLSearchParams(queryString);
const name = urlParams.get('name')
const id = urlParams.get('id')
const student = urlParams.get('user')
var hashRet = "";
var questionCount = 0;
var optionCount = 0;
var optionArray = [];
var ipfsHash = "";
var signerT = "";
var signer = "";
var signerUser = "";
var signature = "";
var pdfBytes = "";
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
    if (window.location.pathname == "/issueCertificate.html") {
      ////console.log("zdfsfn");
      await App.modifyPdf()
    }
  },

  loadAccount: async () => {
    document.getElementById('userName').innerHTML = name;
    document.getElementById('accountHash').innerHTML = App.account;
    window.ethereum.on('accountsChanged', function (accounts) {
      ////console.log(accounts);
      window.location.reload()
      App.account = accounts[0];
    })
  },

  loadContract: async () => {

    //use for local deploy

    //const list = await $.getJSON('CourseList.json')
    //const user = await $.getJSON('UserContract.json')
    const provider = new ethers.providers.Web3Provider(App.Provider)
    signer = provider.getSigner()
    ////console.log(signer);

    const userAbi = [
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
    const courseAbi = [
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
    //////console.log(web3.version);
    UserContract = new ethers.Contract("0xF6F28868f0Bb99D9F72F917762A04A15e196EBa9", userAbi, provider)
    CourseList = new ethers.Contract('0x5C5846C242bc5E6BA3275aA4E572ef5E4EDD3070', courseAbi, provider);
    signerT = CourseList.connect(signer)
    signerUser = UserContract.connect(signer)
    //////console.log(CourseList);

  },
  modifyPdf: async () => {

    const {
      degrees,
      PDFDocument,
      rgb,
      StandardFonts
    } = PDFLib
    // Fetch an existing PDF document
    const url = 'cert.pdf'
    const existingPdfBytes = await fetch(url).then(res => res.arrayBuffer())

    // Load a PDFDocument from the existing PDF bytes
    const pdfDoc = await PDFDocument.load(existingPdfBytes)

    // Embed the Helvetica font
    const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica)

    // Get the first page of the document
    const pages = pdfDoc.getPages()
    const firstPage = pages[0]

    // Get the width and height of the first page
    const {
      width,
      height
    } = firstPage.getSize()
    //console.log(student);
    const name = await UserContract.checkUser(student)
    //console.log(name[1]);
    const coursename = await CourseList.getCourse(id)
    //console.log(coursename[2]);

    // Draw a string of text diagonally across the first page
    firstPage.drawText(name[1], {
      x: 108,
      y: 335,
      size: 35,
      font: helveticaFont
    })
    firstPage.drawText(coursename[1], {
      x: 108,
      y: 245,
      size: 25,
      font: helveticaFont
    })
    firstPage.drawText(coursename[2], {
      x: 108,
      y: 110,
      size: 20,
      font: helveticaFont
    })
    firstPage.drawText(App.account.toString(), {
      x: 108,
      y: 90,
      size: 12,
      font: helveticaFont
    })
    firstPage.drawText('100%', {
      x: 220,
      y: 217.5,
      size: 15.6,
      font: helveticaFont
    })
    // Serialize the PDFDocument to bytes (a Uint8Array)
    pdfBytes = await pdfDoc.save()
    //console.log(pdfBytes);
    const pdfDataUri = await pdfDoc.saveAsBase64({
      dataUri: true
    });
    document.getElementById('pdf').src = pdfDataUri;
  },
  filePreview: function () {
    var x = document.getElementById("files");
    if (x.style.display === "none") {
      x.style.display = "block";
      //console.log(hashRet);
      var pdfFile = document.getElementById("pdfFile");
      const source = "https://ipfs.io/ipfs/" + hashRet
      pdfFile.src = source

    } else {
      x.style.display = "none";
    }
  },

  sign: async () => {
    const hash = document.getElementById('certHash').value
    const descr = "Course Completed Successfully"
    let payload = ethers.utils.defaultAbiCoder.encode(["string", "string"], [hash, descr]);
    //console.log("Payload:", payload);

    let payloadHash = ethers.utils.keccak256(payload);
    //console.log("PayloadHash:", payloadHash);
    // See the note in the Solidity; basically this would save 6 gas and QmUm5Uwvfyoebz9cXW5HZhczVjH9FkMibNJcj5ur6hhZSa
    // can potentially add security vulnerabilities in the future
    // let payloadHash = ethers.utils.solidityKeccak256([ "bytes32", "string" ], [ someHash, someDescr ]);

    // This adds the message prefix
    signature = await signer.signMessage(ethers.utils.arrayify(payloadHash));
    //console.log(signature);
    document.getElementById('sign').value = signature;
    let sig = ethers.utils.splitSignature(signature);
    //console.log("Signature:", sig);
    //console.log("Recovered:", ethers.utils.verifyMessage(ethers.utils.arrayify(payloadHash), sig));
  },

  issueCertificate: async () => {
    const hash = document.getElementById('certHash').value
    //console.log(signature);
    //console.log(id);
    //console.log(student);
    signerUser.issueCertificate(id, hash, signature, student).catch(function (error) {
      if (!error) {
        alert("Certificate Issued")
        window.location.href = "course.html?id" + id + "&type=" + "Insti"
      }
    })
  },

  upload: function () {
    $('#upload').html('<span class="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true"></span>Loading...')
      .attr('disabled', true);

    if (window.location.pathname == "/issueCertificate.html") {
      //console.log("nfufub");
      const buf = buffer.Buffer(pdfBytes)
      ipfs.files.add(buf, (err, result) => { // Upload buffer to IPFS
        if (err) {
          //console.error(err)
          return
        }
        ////console.log(result[0].hash)
        document.getElementById("certHash").value = result[0].hash;
        ////console.log(`Url --> ${url}`)
        //0x17F6AD8Ef982297579C203069C1DbfFE4348c372 stu
        //0x1aE0EA34a72D944a8C7603FfB3eC30a6669E454C insti
        $('#upload').html('Upload').attr('disabled', false);
        alert('File Uploaded Successfully, Click Preview to verify');
      })
    } else {
      //console.log("fvs");
      const reader = new FileReader();
      //console.log(reader);
      reader.onloadend = function () {
        // Connect to IPFS
        const buf = buffer.Buffer(reader.result)
        //console.log(buf);
        ipfs.files.add(buf, (err, result) => { // Upload buffer to IPFS
          if (err) {
            //console.error(err)
            return
          }
          let url = `https://ipfs.io/ipfs/${result[0].hash}`
          ////console.log(result[0].hash)
          hashRet = result[0].hash
          ////console.log(`Url --> ${url}`)
          //0x17F6AD8Ef982297579C203069C1DbfFE4348c372 stu
          //0x1aE0EA34a72D944a8C7603FfB3eC30a6669E454C insti
          $('#upload').html('Upload').attr('disabled', false);
          alert('File Uploaded Successfully, Click Preview to verify');
        })
      }

    const photo = document.getElementById("customFile");
    reader.readAsArrayBuffer(photo.files[0]); // Read Provided File
    }

  },

  addQuestion: function () {
    questionCount++;
    ////console.log(questionCount);
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
    ////console.log(input.getAttribute("id"));

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
    ////console.log(button.getAttribute("onclick"));
    name
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

  addOption: function () {
    //console.log(questionCount);
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

    //console.log(input.getAttribute("id"));
    //console.log("inside button");
    li.appendChild(input);
    ul.appendChild(li);
    options.appendChild(ul);
  },

  addAnswer: function () {
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

  clearOptions: function () {
    var div = document.getElementById("q" + questionCount + "div");
    div.innerHTML = "";
    optionCount = 0;

    document.getElementById('ba' + questionCount).disabled = false;
  },

  done: function () {
    document.getElementById("addQ").disabled = false;
    document.getElementById("ba" + questionCount).disabled = true;
    document.getElementById("bq" + questionCount).disabled = true;
    //console.log("oc", optionCount);
    optionArray.push(optionCount);
  },

  submitCourse: function () {
    $('#submit').html('<span class="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true"></span>Loading...')
      .attr('disabled', true);
    var obj = $('#form').serializeJSON();
    //console.log(questionCount);
    //console.log(optionArray);
    obj["questionCount"] = questionCount;
    obj["file_hash"] = hashRet;
    /*let privateKey = document.getElementById("privateKey").value;
    //console.log(privateKey);
    const cipher = CryptoJS.AES.encrypt('my message', privateKey).toString();  
    //console.log(cipher);
    var bytes  = CryptoJS.AES.decrypt(cipher, privateKey);
  var originalText = bytes.toString(CryptoJS.enc.Utf8);
  //console.log(originalText);*/
    for (var j = 1; j <= optionArray.length; j++) {
      var d = "Q" + j;
      /*let encryptedAnswer = CryptoJS.AES.encrypt(obj[d]["Answer"], privateKey).toString();
      obj[d]["Answer"] = encryptedAnswer;*/
      obj[d]["optionCount"] = optionArray[j - 1];
      //console.log('objc', obj[d]["optionCount"]);
    }
    //console.log('obj', obj);
    var jsonString = JSON.stringify(obj);
    //console.log('jsonString', jsonString);
    ipfs.add([buffer.Buffer(jsonString)], function (err, res) {
      if (err) throw err
      ipfsHash = res[0].hash

      //console.log('creating user on eth for', ipfsHash);
      const source = "https://ipfs.io/ipfs/" + ipfsHash
      //console.log(source);
      //console.log(obj["course_title"]);
      //console.log(ipfsHash);
      signerT.createCourse(ipfsHash, obj["course_title"], name, App.account.toString()).catch(function (error) {
        if (!error) {
          $('#submit').html('Upload').attr('disabled', false);
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