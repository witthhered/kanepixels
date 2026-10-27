// complex.js - "Show more" button on the Popular Users block

var readMoreBtn = document.getElementById("readMoreBtn");
var moreText = document.getElementById("moreText");

readMoreBtn.addEventListener("click", function () {
    // the hidden text is shown or hidden with style.display
    if (moreText.style.display === "block") {
        moreText.style.display = "none";
        readMoreBtn.textContent = "Show more";
    } else {
        moreText.style.display = "block";
        readMoreBtn.textContent = "Show less";
    }
});
