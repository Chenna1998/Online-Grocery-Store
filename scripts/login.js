const pg = document.title;
if (pg === "Login") {
    document.querySelector("#loginForm").addEventListener("submit", function (event) {
        console.log("in login function");
        event.preventDefault();
        var username = $("#username").val();
        var password = $("#password").val();

        if (username == "") {
            alert("Please enter a username.");
            return false;
        }

        if (password == "") {
            alert("Please enter a password.");
            return false;
        }

        /*if(username === "admin" && password === "admin")
        {
            window.location.href = "Admin.html";
            return;
        }*/

        $.ajax({
            url: "../scripts/login.php",
            method: "POST",
            data: {
                username: username,
                password: password
            },
            success: function (response) {
                try {
                    const parsedResponse = JSON.parse(response);
                    const status = parsedResponse.status;
                    const customerId = parsedResponse.customerId;

                    if (status === "success") {
                        alert("Customer logged in successfully.");
                        setTimeout(function () {
                            //localStorage.setItem("customerId", customerId);
                            document.querySelector("#loginForm").reset();
                            // Redirect or perform other actions here
                            window.location.href = "Home.html";
                        }, 2000); // 2000 milliseconds (2 seconds) delay
                    } else {
                        alert("Error logging customer.");
                    }
                } catch (error) {
                    console.error("Error parsing JSON response:", error);
                    alert("Error logging customer.");
                }
            },
            error: function () {
                alert("Error making AJAX request");
            }
        });
    });
}