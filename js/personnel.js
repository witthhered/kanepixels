var requestForm = document.getElementById("requestForm");
var nameInput = document.getElementById("name");
var emailInput = document.getElementById("email");
var passwordInput = document.getElementById("password");
var confirmPasswordInput = document.getElementById("confirmPassword");
var messageInput = document.getElementById("message");
var confirmDetails = document.getElementById("confirmDetails");

var nameError = document.getElementById("nameError");
var emailError = document.getElementById("emailError");
var passwordError = document.getElementById("passwordError");
var confirmPasswordError = document.getElementById("confirmPasswordError");
var messageError = document.getElementById("messageError");
var confirmDetailsError = document.getElementById("confirmDetailsError");
var formSuccess = document.getElementById("formSuccess");

requestForm.addEventListener("submit", function (event) {
    event.preventDefault();

    var isValid = true;

    var errorTexts = document.querySelectorAll(".error-text");
    for (var i = 0; i < errorTexts.length; i++) {
        errorTexts[i].textContent = "";
    }
    formSuccess.textContent = "";

    if (nameInput.value.trim() === "") {
        nameError.textContent = "Please enter your name.";
        isValid = false;
    }

    var emailValue = emailInput.value.trim();
    var atPosition = emailValue.indexOf("@");
    var dotPosition = emailValue.lastIndexOf(".");

    if (emailValue === "") {
        emailError.textContent = "Please enter your email.";
        isValid = false;
    } else if (atPosition < 1 || dotPosition < atPosition + 2 || dotPosition === emailValue.length - 1) {
        emailError.textContent = "Please enter a valid email, for example name@example.com.";
        isValid = false;
    }

    if (passwordInput.value === "") {
        passwordError.textContent = "Please enter a password.";
        isValid = false;
    } else if (passwordInput.value.length < 8) {
        passwordError.textContent = "Password must be at least 8 characters long.";
        isValid = false;
    }

    if (confirmPasswordInput.value === "") {
        confirmPasswordError.textContent = "Please confirm your password.";
        isValid = false;
    } else if (confirmPasswordInput.value !== passwordInput.value) {
        confirmPasswordError.textContent = "Passwords do not match.";
        isValid = false;
    }

    if (messageInput.value.trim() === "") {
        messageError.textContent = "Please write your message.";
        isValid = false;
    }

    if (!confirmDetails.checked) {
        confirmDetailsError.textContent = "Please confirm that your details are accurate.";
        isValid = false;
    }

    if (isValid) {
        formSuccess.textContent = "Your request has been sent. The personnel desk will review it soon.";
        requestForm.reset();
    }
});


var popup = document.getElementById("contactPopup");
var openPopupButton = document.getElementById("openPopup");
var closePopupButton = document.getElementById("closePopup");
var contactForm = document.getElementById("contactForm");

openPopupButton.addEventListener("click", function () {
    popup.style.display = "flex";
});

closePopupButton.addEventListener("click", function () {
    popup.style.display = "none";
});

popup.addEventListener("click", function (event) {
    if (event.target === popup) {
        popup.style.display = "none";
    }
});

contactForm.addEventListener("submit", function (event) {
    event.preventDefault();
    alert("Thank you! The personnel desk will contact you soon.");
    contactForm.reset();
    popup.style.display = "none";
});
