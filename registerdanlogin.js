document.addEventListener("DOMContentLoaded", function () {
    // Registration Form
    const registerForm = document.querySelector("#register-form form"); // Registration form element
    const nameInput = document.getElementById("register-name"); // Name input field
    const emailInput = document.getElementById("register-email"); // Email input field
    const passwordInput = document.getElementById("register-password"); // Password input field

    registerForm.addEventListener("submit", function (e) {
        e.preventDefault(); // Prevent the default form submission

        const name = nameInput.value; // Get the name from input field
        const email = emailInput.value; // Get the email from input field
        const password = passwordInput.value; // Get the password from input field

        // Create a new FormData object to send the data via POST
        const formData = new FormData();
        formData.append("name", name);
        formData.append("email", email);
        formData.append("password", password);

        // Send the form data using Fetch
        fetch("login_register/register.php", {
            method: "POST",
            body: formData
        })
        .then(response => response.json()) // Parse the response as JSON
        .then(data => {
            if (data.status === 'success') {
                alert(data.message); // Display success message
                // Clear the input fields after successful submission
                nameInput.value = "";
                emailInput.value = "";
                passwordInput.value = "";
                showLogin(); // Switch to the login form after registration
            } else {
                alert(data.message); // Display error message
            }
        })
        .catch(error => console.error('Error submitting form:', error));
    });

    // Login Form
    const loginForm = document.getElementById("login-form-id"); // Login form element
    const loginEmailInput = document.getElementById("login-email"); // Email input field
    const loginPasswordInput = document.getElementById("login-password"); // Password input field
    const loginErrorMessageDiv = document.getElementById("login-error"); // Div to display errors

    loginForm.addEventListener("submit", function (e) {
        e.preventDefault(); // Prevent the default form submission
    
        const email = loginEmailInput.value; // Get the email from input field
        const password = loginPasswordInput.value; // Get the password from input field
    
        // Create a new FormData object to send the email and password via POST
        const formData = new FormData();
        formData.append("email", email);
        formData.append("password", password);
    
        // Send the form data using Fetch
        fetch("login_register/login.php", {
            method: "POST",
            body: formData
        })
        .then(response => response.json()) // Parse the response as JSON
        .then(data => {
            // Check if the server returned a success status
            if (data.status === 'success') {
                alert(data.message); // Show success message
                // Optionally redirect to another page after successful login
                window.location.href = 'index.html'; // Example redirection to dashboard
            } else {
                alert(data.message); // Show error message
                loginErrorMessageDiv.textContent = data.message; // Display error message in the div
            }
        })
        .catch(error => {
            console.error('Error submitting form:', error);
            alert('An error occurred while processing your request. Please try again later.');
        });
    });
});    