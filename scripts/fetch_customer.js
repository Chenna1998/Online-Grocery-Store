if(document.title === "My Account")
{
    //const customerId = localStorage.getItem("customerId");

    //if(customerId)
    //{
        $.ajax({
            url: "../scripts/customer_data.php", // Replace with the actual script URL
            method: "GET",
            //data: {
              //customerId: localStorage.getItem("customerId") // Pass the customer ID retrieved from the login script
            //},
            success: function (response) {
              //console.log(typeof(response));
              
              const customerData = response; // Parse the JSON response
              if(customerData.status === "success")
              {
                //console.log(customerData);

                $("#customer_firstName").text(customerData.firstName);
                $("#customer_lastName").text(customerData.lastName);
                $("#customer_dob").text(customerData.dob);
                $("#customer_age").text(customerData.age);
                $("#customer_phone").text(customerData.phone);
                $("#customer_email").text(customerData.email);
                $("#customer_Addresss").text(customerData.address);
              }
            },
            error: function() {
              alert("Error retrieving customer data.");
            }
          });
    //}
}