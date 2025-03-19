document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("subscribe-form"); // Form element
    const emailInput = document.getElementById("email"); // Email input field

    form.addEventListener("submit", function (e) {
        e.preventDefault(); // Prevent the default form submission

        const email = emailInput.value; // Get the email from input field

        // Create a new FormData object to send the email via POST
        const formData = new FormData();
        formData.append("email", email);

        // Send the form data using Fetch
        fetch("subscribe.php", {
            method: "POST",
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                alert(data.message);
                emailInput.value = ""; // Clear the input field after successful submission
            } else {
                alert(data.message);
            }
        })
        .catch(error => console.error('Error submitting form:', error));
    });
});
