checkUser();

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

function submitForm(e) {
    e.preventDefault();
    
    var name = document.getElementById("listName").value;

    var data = JSON.stringify({
        name: name
    });

    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function () {
        if (this.readyState === 4) {
            if (this.status === 201) {
                console.log("Post successful");
                document.getElementById("page-message").innerHTML = "Record Added";
                window.location.assign("todo-list.html");
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

    if (token != null && token != "") {
        authHeader = token;
    }
    
    xmlhttp.open("POST", "/todoapi/lists", true);
    xmlhttp.setRequestHeader("Content-type", "application/json");
    xmlhttp.setRequestHeader("Authorization" , authHeader);
    xmlhttp.send(data);
}