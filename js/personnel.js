var form = document.getElementById("requestForm");

form.addEventListener("submit", function (event) {
    event.preventDefault();

    var name = document.getElementById("name").value;
    var email = document.getElementById("email").value;
    var password = document.getElementById("password").value;
    var confirmPassword = document.getElementById("confirmPassword").value;

    var errorTexts = document.querySelectorAll(".error-text");
    errorTexts.forEach(function (errorText) {
        errorText.textContent = "";
    });
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


var contactForm = document.getElementById("contactForm");
var contactSuccess = document.getElementById("contactSuccess");

contactForm.addEventListener("submit", function (event) {
    event.preventDefault();

    fetch("https://jsonplaceholder.typicode.com/posts", {
        method: "POST",
        body: new FormData(contactForm)
    }).then(function () {
        contactSuccess.textContent = "Message sent! The personnel desk will contact you soon.";
        contactForm.reset();
    });
});


var checkInButton = document.getElementById("checkInButton");
var checkInText = document.getElementById("checkInText");
var checkInSound = new Audio("assets/checkin.mp3");

checkInButton.addEventListener("click", function () {
    checkInText.textContent = "Checked in at " + new Date().toLocaleTimeString();
    checkInText.classList.add("show");
    checkInSound.currentTime = 0;
    checkInSound.play();
});
