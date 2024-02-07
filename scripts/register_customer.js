const pg = document.title;
if (pg === "Register") {
    document.querySelector("#registerForm").addEventListener("submit", function (event) {
        event.preventDefault();
        var username = $("#username").val();
        var password = $("#password").val();
        var confirmPassword = $("#confirmPassword").val();
        var firstName = $("#firstName").val();
        var lastName = $("#lastName").val();
        var dateOfBirth = $("#dob").prop("value");
        var email = $("#email").val();
        var phone = $("#phoneNumber").val();
        var address = $("#address").val();
        console.log(phone);
        if (username == "") {
            alert("Please enter a username.");
            return false;
        }

        if (password == "") {
            alert("Please enter a password.");
            return false;
        }

        if (confirmPassword != password) {
            alert("Passwords do not match.");
            return false;
        }

        if (password.length < 8) {
            alert("Password must be at least 8 characters long.");
            return false;
        }

        if (dateOfBirth == "") {
            alert("Please enter a date of birth.");
            return false;
        }

        if (!dateOfBirth.match(/^\d{4}-\d{2}-\d{2}$/)) {
            alert("Date of birth must be in the format MM/DD/YYYY.");
            return false;
        }

        if (email == "") {
            alert("Please enter an email address.");
            return false;
        }

        if (phone == "") {
            alert("Please enter a valid phone number.");
            return false;
        }

        if (!email.match(/^[\w\.-]+@[\w\.-]+\.[a-zA-Z]{2,}$/)) {
            alert("Invalid email address.");
            return false;
        }

        if (address == "") {
            alert("Please enter an address.");
            return false;
        }

        $.ajax({
            url: "../scripts/register_customer.php",
            method: "POST",
            data: {
                username: username,
                password: password,
                firstName: firstName,
                lastName: lastName,
                dateOfBirth: dateOfBirth,
                phoneNumber: phone,
                email: email,
                address: address
            },
            success: function (response) {
                //console.log(typeof(response));
                success = "success";
                if (response.localeCompare(success)) {
                    alert("Customer registered successfully.");
                    setTimeout(function () {
                        document.querySelector("#registerForm").reset();
                        // Redirect or perform other actions here
                        window.location.href = "Login.html";
                    }, 2000); // 2000 milliseconds (2 seconds) delay
                } else {
                    alert("Error registering customer.");
                }
            },
            error: function () {
                alert("Error making AJAX request");
            }
        });
    });
}