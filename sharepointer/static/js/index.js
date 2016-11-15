function url_fetch(url, onresponse, method = 'POST', async = false) {
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function () {
    onresponse(this)
  }
  xhttp.open(method, url, async);
  return xhttp;
}

$('.form').find('input, textarea').on('keyup blur focus', function (e) {

  var $this = $(this),
    label = $this.prev('label');

  if (e.type === 'keyup') {
    if ($this.val() === '') {
      label.removeClass('active highlight');
    } else {
      label.addClass('active highlight');
    }
  } else if (e.type === 'blur') {
    if ($this.val() === '') {
      label.removeClass('active highlight');
    } else {
      label.removeClass('highlight');
    }
  } else if (e.type === 'focus') {

    if ($this.val() === '') {
      label.removeClass('highlight');
    }
    else if ($this.val() !== '') {
      label.addClass('highlight');
    }
  }

});

$('.tab a').on('click', function (e) {

  e.preventDefault();

  $(this).parent().addClass('active');
  $(this).parent().siblings().removeClass('active');

  target = $(this).attr('href');

  $('.tab-content > div').not(target).hide();

  $(target).fadeIn(600);

});


var file_contents = "";


function fileProperty(e) {
  var file = e.target.files[0];
  if (!file) {
    return;
  }
  var reader = new FileReader();
  reader.onload = function (e) {
    file_contents = e.target.result;
    file_contents = { 'content': e.target.result, 'filename': file["name"] };
  };
  reader.readAsText(file);
}

function csrf_protection(xhr) {

  var cookieValue = null;
  var name = 'csrftoken';
  if (document.cookie && document.cookie != '') {
    var cookies = document.cookie.split(';');
    for (var i = 0; i < cookies.length; i++) {
      var cookie = jQuery.trim(cookies[i]);
      // Does this cookie string begin with the name we want?
      if (cookie.substring(0, name.length + 1) == (name + '=')) {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }

  xhr.setRequestHeader("X-CSRFToken", cookieValue);

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
  if (file_contents == "") {
    alert("Error in reading file contents");
    return false;
  }
  var req = url_fetch("/sendfile", function () {
    window.location = "/home";
  }, "POST", true);
  var formData = new FormData();
  csrf_protection(req);
  formData.append("content", file_contents["content"]);
  formData.append("filename", file_contents["filename"])
  formData.append("to", form_input["recipient"]);
  req.send(formData);

}

document.getElementById('upload').addEventListener('change', fileProperty, false);
document.getElementById('sendbutton').addEventListener('click', uploadfile);