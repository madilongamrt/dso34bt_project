function url_fetch(url, onresponse, method = 'POST', async = false) {
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function () {
    onresponse(this)
  }
  xhttp.open(method, url, async);
  return xhttp;
}


function download_sent_file(id) {
	window.location = "/downloadfile?section=sent&uid=" + String(id);
}


function delete_sent_file(id) {
	var req = url_fetch('/deletefile?section=sent&uid=' + String(id), function(e){
		if (e.status == 200 || e.status == 0) {
			window.location = '/';
		} else {
			alert("Could not delete file");
		}
	}, 'GET', true);
	req.send();
}


function edit_sent_file(id, filename) {
	var win = window.open("/editfile?section=sent&uid=" + String(id), filename,
				"width=1200,height=700");

	var x = screen.width / 2 - 1200 / 2;
    var y = screen.height / 2 - 700 / 2;
	win.moveTo(x, y);
}


function download_received_file(id) {
	window.location = "/downloadfile?section=received&uid=" + String(id);
}


function delete_received_file(id) {
	var req = url_fetch('/deletefile?section=received&uid=' + String(id), function(e){
		if (e.status == 200 || e.status == 0) {
			window.location = '/';
		} else {
			alert("Could not delete file");
		}
	}, 'GET', true);
	req.send();
}

function edit_received_file(id, filename) {
	var win = window.open("/editfile?section=received&uid=" + String(id), filename,
				"width=1200,height=700");

	var x = screen.width/2 - 1200/2;
    var y = screen.height/2 - 700/2;
	win.moveTo(x, y);
}