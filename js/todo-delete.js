function urlParam(name) {
	var results = new RegExp("[\?&]" + name + "=([^&#]*)").exec(window.location.href);

	if (results == null) {
		return null;
	} 
	else {
		return results[1] || 0;
	}
}

function deleteListItem(e, listId, id) {
	e.preventDefault();

	console.log("delete list item");
	document.getElementById("page-message").innerHTML = "Deleting list item ... wait";
	document.getElementById(`save${id}`).setAttribute("disabled", true);
	document.getElementById(`delete${id}`).setAttribute("disabled", true);

	var xmlhttp = new XMLHttpRequest();
	xmlhttp.onreadystatechange = function () {
		if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
			console.log("Delete success");
			window.location.assign(`todo-update.html?id=${listId}`);
		} 
		else if (xmlhttp.readyState === 4) {
			console.log("Delete error " + this.statusText);
			console.log("incoming Text " + this.responseText);
			document.getElementById(`save${id}`).removeAttribute("disabled");
			document.getElementById(`delete${id}`).removeAttribute("disabled");
		}
	};

	var token = localStorage.getItem("token");
    var authHeader = "";

    if (token != null && token != "") {
        authHeader = token;
    }

	xmlhttp.open("DELETE", "/todoapi/lists/" + listId + "/items/" + id, true);
    xmlhttp.setRequestHeader("Authorization" , authHeader);
	
	xmlhttp.send();
}

function deleteList(e) {
	e.preventDefault();

	deleteListID(e, urlParam("id"), -1);
}

function deleteListID(e, id, index) {
    e.preventDefault();

    console.log("delete list " + id);
	document.getElementById("page-message").innerHTML = "Deleting record ... wait";

	if (index != -1) {
		document.getElementById("todo-list-table").getElementsByTagName("button")[index].setAttribute("disabled", true);
	}

	var xmlhttp = new XMLHttpRequest();
	xmlhttp.onreadystatechange = function () {
		if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
			console.log("Delete success");
			window.location.assign("todo-list.html");
		} 
		else if (xmlhttp.readyState === 4) {
			console.log("Delete error " + this.statusText);
			console.log("incoming Text " + this.responseText);
            document.getElementById("page-message").innerHTML = JSON.parse(this.responseText).message;

			if(index != -1) {
				document.getElementById("todo-list-table").getElementsByTagName("button")[index].removeAttribute("disabled");
			}
		}
	};

	var token = localStorage.getItem("token");
    var authHeader = "";

    if (token != null && token != "") {
        authHeader = token;
    }

	xmlhttp.open("DELETE", "/todoapi/lists/" + id, true);
    xmlhttp.setRequestHeader("Authorization" , authHeader);
	xmlhttp.send();
}