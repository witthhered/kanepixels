var faqQuestions = document.querySelectorAll(".faq-question");

for (var i = 0; i < faqQuestions.length; i++) {
    faqQuestions[i].addEventListener("click", function () {
        var answer = this.nextElementSibling;
        this.classList.toggle("active");
        answer.classList.toggle("open");
    });
}


var pageBackground = document.getElementById("pageBackground");
var colorButton = document.getElementById("colorButton");
var colors = ["#f3f0e6", "#e6eadf", "#e3e6ee", "#efe3e0", "#ecebd2"];
var colorIndex = 0;

colorButton.addEventListener("click", function () {
    colorIndex = colorIndex + 1;

    if (colorIndex === colors.length) {
        colorIndex = 0;
    }

    pageBackground.style.backgroundColor = colors[colorIndex];
});


var dateTime = document.getElementById("dateTime");
var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

function showDateTime() {
    var now = new Date();
    var month = months[now.getMonth()];
    var day = now.getDate();
    var year = now.getFullYear();
    var hours = now.getHours();
    var minutes = now.getMinutes();
    var seconds = now.getSeconds();
    var period = "AM";

    if (hours >= 12) {
        period = "PM";
    }

    if (hours > 12) {
        hours = hours - 12;
    }

    if (hours === 0) {
        hours = 12;
    }

    if (minutes < 10) {
        minutes = "0" + minutes;
    }

    if (seconds < 10) {
        seconds = "0" + seconds;
    }

    dateTime.textContent = month + " " + day + ", " + year + ", " + hours + ":" + minutes + ":" + seconds + " " + period;
}

showDateTime();
setInterval(showDateTime, 1000);
