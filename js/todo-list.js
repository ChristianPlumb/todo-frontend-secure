var start = 0;
var page = 5;

checkUser();
createTable(start);

function getId() {
    var todos = document.getElementsByName("selectedRow");
    var i = todos.length;
    while (i--) {
        if (todos[i].checked) {
            return todos[i].value;
        }
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

function createTable() {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            var lists = JSON.parse(this.responseText).lists;
            var tableHTML =
                '<tr><th width= "100px">Todo Lists</th><th width= "100px">Actions</th></tr>';
            for (var i = 0; i < lists.length; i++) {
                var todo = lists[i];
                tableHTML += `<tr><td><a href="todo-update.html?id=${todo.id}">${todo.name}</a></td><td><form class="inline" onsubmit="deleteListID(event, ${todo.id}, ${i})"><button type="submit">Delete</button></form></td>`
            }
            tableHTML += "</table>";
            document.getElementById("todo-list-table").innerHTML = tableHTML;
        }
    };

    var token = localStorage.getItem("token");
    var authHeader = "";

    if (token != null && token != "") {
        authHeader = token;
    }
    
    xhttp.open(
        "GET",
        "/todoapi/lists",
        true
    );
    
    xhttp.setRequestHeader("Authorization" , authHeader);
    
    xhttp.send();
}

function logout() {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            localStorage.removeItem("token");
            window.location = "todo-list.html";
        }
    };
    
    var token = localStorage.getItem("token");
    var authHeader = "";

    if (token != null && token != "") {
        authHeader = token;
    }
    
    xhttp.open("POST", "/todoapi/users/logout", true);
    xhttp.setRequestHeader("Authorization" , authHeader);

    xhttp.send();
}