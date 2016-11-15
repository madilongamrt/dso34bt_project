
/*
functional wrapper for ajax calls 
*/
function url_fetch(url, onresponse, method='POST', async=false) {
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function () {
    onresponse(this)
  }
  xhttp.open(method, url, async);
  return xhttp;
}


/*
Checks whether the entered details are fine and don't exist before
procceding with registration
*/
function validateRegisterForm() {
  var email = document.forms["registerForm"]["email"].value;
  var returnvalue = true;
  if (document.forms["registerForm"]["p2"].value == document.forms["registerForm"]["password"].value) {
    var fetch = url_fetch("/does_user_exist?email=" + email, function (data) {
      if (data.status == 200) {
        var response = JSON.parse(data.response);
        if (response['status'] != 1) {
          alert("Email account already exists");
          returnvalue = false;
        }
      }
    }, method = "GET");
    fetch.send();
    return returnvalue;
  }
  return false;
}

/*
Checks whether the entered account is valid without errors, beforeLogin
procceding to login
*/
function beforeLogin() {
  var email = document.forms["loginForm"]["email"].value;
  var password = document.forms["loginForm"]["password"].value;
  var returnvalue = false;

  var fetch = url_fetch('/validate_login?email=' + email + "&password=" + password, function (data) {
    if (data.status == 200) {
      var response = JSON.parse(data.response);
      if (response['status'] == 1)
        returnvalue = true;
      else
        alert(response['message']);
      console.info(response['message']);
    }
  }, "GET");
  fetch.send();
  return returnvalue;
}

var selected = "";


var options = document.getElementsByClassName("dropcon");
for (var i = 0; i < options.length; i++) {
  options[i].addEventListener("click", function () {
    selected = this.innerHTML;
    console.info(selected);
  });
}

function uploadfile() {
  var form_input = {
    "file": document.getElementById("upload").value,
    "recipient": document.getElementById("rec").value
  };
  if (form_input['recipient'] == '') {
    alert("Please type the email of the recipient");
    return false;
  }
  if (form_input['file'] == '') {
    alert("Please upload a file");
    return false;
  }
  return false;
}