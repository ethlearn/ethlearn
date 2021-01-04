window.$ = window.jQuery = jQuery;
var dataRes = "";
const queryString = window.location.search;
console.log(queryString);
const urlParams = new URLSearchParams(queryString);
const id = urlParams.get('id')
console.log(id);
const courseUrl = "http://ipfs.io/ipfs/"+getCookie("hash"+id)
console.log(courseUrl);
console.log(getCookie("hash"+id));
function displayData() {

  $.getJSON(courseUrl , function( data ) {
  var items = [];
  //console.log(data);
  dataRes = data;
  //console.log(dataRes);
  var result = document.getElementById("questionsResult");
  document.getElementById("cTitle").innerHTML = data.course_title;
  var url = "http://ipfs.io/ipfs/"+ data.file_hash
  document.getElementById("pdfFile").src = url;
  var ol = document.createElement("ol");
  for (var i = 1; i <= data.questionCount; i++) {
    console.log(i);
    var d = "Q"+i;
    console.log(d);
    //console.log(data[d].question);
    //console.log(data[d].option);
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
      var input = document.createElement("input");
      input.type = "radio";
      input.name = "Q"+i;
      input.value = data[d].Option[j];
      input.id = "o"+j;

      var label = document.createElement("label");
      label.for = "o"+j;
      label.innerHTML = data[d].Option[j];
      l.appendChild(input);
      l.appendChild(label);
      ul.appendChild(l);
    }
    ol.appendChild(li);
  }
  result.appendChild(ol);
});
}
displayData()

function submitAnswer() {
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
  alert("Your Marks : "+ marks);
  /*for (key in answer){
    console.log(key);
    //console.log(answer[key]);
    //console.log(dataRes[key]["Answer"]);
    if (answer[key].localeCompare(dataRes[key]["Answer"])) {
      console.log("true");
    }
  }*/
}
