function submitForm(e) {
    e.preventDefault();
    
    var firstName = document.getElementById("firstName").value;
    var lastName = document.getElementById("lastName").value;
    var username = document.getElementById("username").value;
    var password = document.getElementById("password").value;

    var data = JSON.stringify({
		firstName: firstName,
		lastName: lastName,
        username: username,
        password: password
	});

	var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function () {
        if (this.readyState === 4) {
            if (this.status === 200) {
                console.log("Registration successful");
                document.getElementById("page-message").innerHTML = "User created";
            } 
            else {
                var response = JSON.parse(this.responseText);

                document.getElementById("page-message").innerHTML = "Error: " + response.message;
                console.log("Error " + this.statusText + ": " + response.message);
            }
        }
    };

	xmlhttp.open("POST", "/todoapi/users", true);
	xmlhttp.setRequestHeader("Content-type", "application/json");
	xmlhttp.send(data);
}

function cancel() {
    window.location = "login.html";
}