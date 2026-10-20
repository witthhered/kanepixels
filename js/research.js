var questions = document.querySelectorAll(".faq-question");

for (var i = 0; i < questions.length; i++) {
    questions[i].addEventListener("click", function () {
        this.nextElementSibling.classList.toggle("open");
    });
}

var colors = ["#f3f0e6", "#e6eadf", "#e3e6ee"];
var colorNumber = 0;
var colorButton = document.getElementById("colorButton");
var background = document.getElementById("pageBackground");

colorButton.addEventListener("click", function () {
    colorNumber = colorNumber + 1;
    if (colorNumber === colors.length) {
        colorNumber = 0;
    }
    background.style.backgroundColor = colors[colorNumber];
});

var dateTime = document.getElementById("dateTime");

function showTime() {
    dateTime.textContent = new Date().toLocaleString();
}

showTime();
setInterval(showTime, 1000);