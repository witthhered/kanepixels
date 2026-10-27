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


var readMoreButton = document.getElementById("readMoreButton");
var moreText = document.getElementById("moreText");

readMoreButton.addEventListener("click", function () {
    if (moreText.style.display === "block") {
        moreText.style.display = "none";
        readMoreButton.textContent = "READ MORE";
    } else {
        moreText.style.display = "block";
        readMoreButton.textContent = "READ LESS";
    }
});


var printButton = document.getElementById("printButton");

printButton.addEventListener("click", function () {
    window.print();
});


var archive = {
    project: "KV31",
    department: "Research",
    access: "Internal",
    records: ["Everything Must Go", "Static Dead End", "Lighting and Tile Survey"],
    countRecords: function () {
        return this.records.length;
    }
};

var archiveNotes = document.getElementById("archiveNotes");
archiveNotes.innerHTML = "<p>Project: " + archive.project + "</p>" +
    "<p>Department: " + archive.department + "</p>" +
    "<p>Access: " + archive.access + "</p>" +
    "<p>Records shown: " + archive.countRecords() + "</p>";

var recordList = document.getElementById("recordList");

for (var j = 0; j < archive.records.length; j++) {
    recordList.innerHTML = recordList.innerHTML + "<li>" + archive.records[j] + "</li>";
}


var navLinks = document.querySelectorAll(".headernav .nav-link");
var currentLink = -1;

document.addEventListener("keydown", function (event) {
    switch (event.key) {
        case "ArrowRight":
            currentLink = currentLink + 1;
            if (currentLink === navLinks.length) {
                currentLink = 0;
            }
            navLinks[currentLink].focus();
            break;
        case "ArrowLeft":
            currentLink = currentLink - 1;
            if (currentLink < 0) {
                currentLink = navLinks.length - 1;
            }
            navLinks[currentLink].focus();
            break;
    }
});
