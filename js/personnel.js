var form = document.getElementById("requestForm");

form.addEventListener("submit", function (event) {
    event.preventDefault();

    var name = document.getElementById("name").value;
    var email = document.getElementById("email").value;
    var password = document.getElementById("password").value;
    var confirmPassword = document.getElementById("confirmPassword").value;

    document.getElementById("nameError").textContent = "";
    document.getElementById("emailError").textContent = "";
    document.getElementById("passwordError").textContent = "";
    document.getElementById("confirmPasswordError").textContent = "";
    document.getElementById("formSuccess").textContent = "";

    var ok = true;

    if (name === "") {
        document.getElementById("nameError").textContent = "Enter your name";
        ok = false;
    }

    if (email.indexOf("@") === -1) {
        document.getElementById("emailError").textContent = "Enter a valid email";
        ok = false;
    }

    if (password.length < 8) {
        document.getElementById("passwordError").textContent = "Password must be at least 8 characters";
        ok = false;
    }

    if (password !== confirmPassword) {
        document.getElementById("confirmPasswordError").textContent = "Passwords do not match";
        ok = false;
    }

    if (ok) {
        document.getElementById("formSuccess").textContent = "Form submitted!";
        form.reset();
    }
});

var popup = document.getElementById("contactPopup");
var openButton = document.getElementById("openPopup");
var closeButton = document.getElementById("closePopup");

openButton.addEventListener("click", function () {
    popup.style.display = "flex";
});

closeButton.addEventListener("click", function () {
    popup.style.display = "none";
});