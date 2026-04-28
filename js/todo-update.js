var id;

checkUser();

function urlParam(name) {
	var results = new RegExp("[\?&]" + name + "=([^&#]*)").exec(window.location.href);

	if (results == null) {
		return null;
	} 
	else {
		return results[1] || 0;
	}
}

function checkUser() {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            var user = JSON.parse(this.responseText).user;
            document.getElementById("userDisplay").innerHTML = `<p>Hello, ` + user.firstName + " " + user.lastName + ` (<a onclick="logout()">Logout</a>)</p>`;
        }
    };
    
    var token = localStorage.getItem("token");
    var authHeader = "";

    if (token != null && token != "") {
        authHeader = "Bearer " + token;
    }

    xhttp.open("GET", "/todoapi/users", true);
    xhttp.setRequestHeader("Authorization" , authHeader);

    xhttp.send();
}

function loadListInfo() {
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function () {
		if (xhttp.readyState === 4 && xhttp.status === 200) {
			var response = JSON.parse(this.responseText).list;

			document.getElementById("listName").value = response.name;
		}
	};

	xhttp.open("GET", "/todoapi/lists/" + id, true);
	xhttp.send();
}

function loadItems() {
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function () {
		if (xhttp.readyState === 4 && xhttp.status === 200) {
			var items = JSON.parse(this.responseText).items;

            var tableHTML =
                `<tr>
					<th width="100px">Complete</th>
					<th width="100px">Name</th>
					<th width="100px">Description</th>
					<th width="100px">State</th>
					<th width= 100px">Action</th>
				</tr>`;
            for (var i = 0; i < items.length; i++) {
                var item = items[i];
				tableHTML +=
					`<tr>
						<td>
							<form class="inline">
								<input type="checkbox" id="completeBox${item.id}" ${item.state === "complete" ? "checked" : ""}></input>
							</form>
						</td>
						<td>
							<form class="inline">
								<input type="text" id="nameBox${item.id}" value="${item.name}"></input>
								<span id="name${item.id}Err" class="error" style="position: absolute;">* </span>
							</form>
						</td>
						<td>
							<form class="inline">
								<input type="text" id="descriptionBox${item.id}" value="${item.description}"></input>
							</form>
						</td>
						<td>
							<select id="stateBox${item.id}">
								<option value="in-progress" ${item.state === "in-progress" ? "selected" : ""}>in-progress</option>
								<option value="complete" ${item.state === "complete" ? "selected" : ""}>complete</option>
								<option value="canceled" ${item.state === "canceled" ? "selected" : ""}>canceled</option>
							</select>
						</td>
						<td>
							<form class="inline" onsubmit="submitForm(event, ${item.id})" id="save${item.id}">
								<button type="submit" style="width: 40px; height: 24px; font-size: 12px; padding: 0;">Save</button>
							</form>
							<form class="inline" onsubmit="deleteListItem(event, ${id}, ${item.id})" id="delete${item.id}">
								<button type="submit" style="width: 40px; height: 24px; font-size: 12px; padding: 0;">Delete</button>
							</form>
						</td>
					</tr>`;
            }

			tableHTML +=
				`<tr>	
					<td>
						<form class="inline">
							<input type="checkbox" id="completeBoxNew"></input>
						</form>
					</td>
					<td>
						<form class="inline">
							<input type="text" id="nameBoxNew"></input>
							<span id="nameNewErr" class="error" style="position: absolute;">* </span>
						</form>
					</td>
					<td>
						<form class="inline">
							<input type="text" id="descriptionBoxNew"></input>
						</form>
					</td>
					<td>
						<form class="inline">
							<select id="stateBoxNew">
								<option value="in-progress">in-progress</option>
								<option value="complete">complete</option>
								<option value="canceled">canceled</option>
							</select>
						</form>
					</td>
					<td>
						<form class="inline" onsubmit="addItem(event)">
							<button type="submit" style="width: 40px; height: 24px; font-size: 12px; padding: 0;">Save</button>
						</form>
						<form class="inline" onsubmit="addItem(event)">
							<button type="submit" style="width: 40px; height: 24px; font-size: 12px; padding: 0;">Add</button>
						</form>
					</td>
				</tr>`;

            tableHTML += "</table>";
            document.getElementById("todo-list-table").innerHTML = tableHTML;
		}
	};

	var token = localStorage.getItem("token");
    var authHeader = "";

    if (token != null && token != "") {
        authHeader = token;
    }

	xhttp.open("GET", "/todoapi/lists/" + id + "/items", true);
	xhttp.send();
}

function updateList(e) {
	e.preventDefault();

	var name = document.getElementById("listName").value;

	var data = JSON.stringify({
		id: id,
		name: name
	});

	var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState === 4) {
            if (this.status === 200) {
                console.log("Update successful");
                document.getElementById("page-message").innerHTML = "List name updated";
            } 
            else {
                var response = JSON.parse(this.responseText);

                document.getElementById("page-message").innerHTML = "Error: " + response.message;
                console.log("Error " + this.statusText + ": " + response.message);
            }
        }
    };

	var token = localStorage.getItem("token");
    var authHeader = "";

	console.log(token);

	if((token != "") && (token != null)) {
        authHeader = token;
    }

	xhttp.open("PUT", "/todoapi/lists/" + id, true);
	xhttp.setRequestHeader("Content-type", "application/json");

	//xhttp.withCredentials = true;
    xhttp.setRequestHeader("Authorization" , authHeader);

	xhttp.send(data);
}

function submitForm(e, itemID) {
	e.preventDefault();

	var completed = document.getElementById(`completeBox${itemID}`).checked;
	var name = document.getElementById(`nameBox${itemID}`).value;
	var description = document.getElementById(`descriptionBox${itemID}`).value;
	var state = document.getElementById(`stateBox${itemID}`).value;

	if (completed || state === "complete") {
		state = "complete";
	}
	else {
		if (state !== "in-progress" && state !== "canceled") {
			state = "in-progress";
		}
	}

	var data = JSON.stringify({
		name: name,
		description: description,
		state: state,
	});

	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function () {
		if (this.readyState === 4) {
			if (this.status === 406) {
				var message = JSON.parse(this.responseText);
				var errorElements = document.getElementsByClassName("error");

				for (var j = 0; j < errorElements.length; j++) {
					errorElements[j].innerHTML = "*";
				}

				for (var i = 0; i < message.length; i++) {
					document.getElementById(message[i].attributeName + "Err").innerHTML = message[i].message;
					console.log("Error " + message[i].attributeName + " " + message[i].message);
				}

				document.getElementById("page-message").innerHTML = "Fix errors and click Save";
			} 
			else if (this.status === 200) {
				console.log("Post successful");
				document.getElementById("page-message").innerHTML = "Record updated";
				window.location.assign(`todo-update.html?id=${id}`);
			} 
			else {
				document.getElementById("page-message").innerHTML = "Error:" + this.statusText;
				console.log("error " + this.statusText);
				console.log("incoming Text " + this.responseText);
			}
		}
	};

	var token = localStorage.getItem("token");
    var authHeader = "";

	
    if((token != "") && (token != null)) {
		authHeader = token;
    }
	console.log(authHeader);

	xhttp.open("PUT", "/todoapi/lists/" + id + "/items/" + itemID, true);
	xhttp.setRequestHeader("Content-Type", "application/json");

	//xhttp.withCredentials = true;
    xhttp.setRequestHeader("Authorization" , authHeader);

	xhttp.send(data);
}

function addItem(e) {
	e.preventDefault();

	var completed = document.getElementById("completeBoxNew").checked;
	var name = document.getElementById("nameBoxNew").value;
	var description = document.getElementById("descriptionBoxNew").value;
	var state = document.getElementById("stateBoxNew").value;

	if (completed || state === "complete") {
		state = "complete";
	}
	else {
		if (state !== "in-progress" && state !== "canceled") {
			state = "in-progress";
		}
	}

	var data = JSON.stringify({
		name: name,
		description: description,
		state: state,
	});

	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function () {
		if (this.readyState === 4) {
			if (this.status === 406) {
				var message = JSON.parse(this.responseText);
				var errorElements = document.getElementsByClassName("error");

				for (var j = 0; j < errorElements.length; j++) {
					errorElements[j].innerHTML = "*";
				}

				for (var i = 0; i < message.length; i++) {
					document.getElementById(message[i].attributeName + "Err").innerHTML = message[i].message;
					console.log("Error " + message[i].attributeName + " " + message[i].message);
				}

				document.getElementById("page-message").innerHTML = "Fix errors and click Save";
			} 
			else if (this.status === 201) {
				console.log("Post successful");
				document.getElementById("page-message").innerHTML = "Record Added";
				window.location.assign(`todo-update.html?id=${id}`);
			} 
			else {
				document.getElementById("page-message").innerHTML = "Error:" + this.statusText;
				console.log("error " + this.statusText);
				console.log("incoming Text " + this.responseText);
			}
		}
	};

	var token = localStorage.getItem("token");
    var authHeader = "";

	if((token != "") && (token != null)) {
        authHeader = token;
    }

	console.log(authHeader);

	xhttp.open("POST", "/todoapi/lists/" + id + "/items", true);
	xhttp.setRequestHeader("Content-type", "application/json");

	//xhttp.withCredentials = true;
    xhttp.setRequestHeader("Authorization" , authHeader);

	xhttp.send(data);
} 

function logout() {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            localStorage.removeItem("token");
            window.location = "todo-update.html?id=" + id;
        }
    };
    
    var token = localStorage.getItem("token");
    var authHeader = "";
    
    if(token != null && token != "") {
        authHeader = token;
    }
    
    xhttp.open("POST", "/todoapi/users/logout", true);
    //xhttp.withCredentials = true;
    xhttp.setRequestHeader("Authorization" , authHeader);

    xhttp.send();
}

document.onreadystatechange = function () {
	if (document.readyState === "complete") {
		id = urlParam("id");

		loadListInfo();
		loadItems();
	}
};