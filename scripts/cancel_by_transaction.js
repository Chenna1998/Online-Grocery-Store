function cancelOneItem() {
    const tId = prompt("Enter the transaction number to cancel:");

    if (tId) {
        $.ajax({
            url: "../scripts/cancel_by_transaction.php",
            method: "POST",
            data: {
                transactionId: tId,
            },
            success: function (response) {
                response = JSON.parse(response);
                if (response.success) {
                    alert("Transaction canceled successfully!");

                    if (response.removeTransactionId && (tId === localStorage.getItem('transactionId'))) {
                        localStorage.removeItem('transactionId');
                        console.log("id removed from storage");
                    }
                } else {
                    alert("Error canceling transaction: Transaction is in SHOPPED status" + response.error);
                }
            },
            error: function (error) {
                alert("Error canceling item.");
            },
        });
    }
}