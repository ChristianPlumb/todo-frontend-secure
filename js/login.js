function submitForm(e) {
    e.preventDefault();
    
    var username = document.getElementById("username").value;
    var password = document.getElementById("password").value;

	var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function () {
        if (this.readyState === 4) {
            if (this.status === 200) {
                document.getElementById("page-message").innerHTML = "Logged in";
                localStorage.setItem("token", JSON.parse(this.responseText).token);
                window.location = "todo-list.html";
            } 
            else {
                var response = JSON.parse(this.responseText);

                document.getElementById("page-message").innerHTML = "Error: " + response.message;
                console.log("Error " + this.statusText + ": " + response.message);
            }
        }
    };

	xmlhttp.open("POST", "/todoapi/users/login", true);
    xmlhttp.withCredentials = true;
    xmlhttp.setRequestHeader("Authorization", "Basic " + btoa(username + ":" + password));
	xmlhttp.send();
}

function cancel() {
    window.location = "todo-list.html";
}