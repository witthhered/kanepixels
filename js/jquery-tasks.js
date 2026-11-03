$(document).ready(function () {
    console.log("jQuery is ready!");

    $(window).on("scroll", function () {
        var scrollTop = $(window).scrollTop();
        var pageHeight = $(document).height() - $(window).height();
        var percent = scrollTop / pageHeight * 100;
        $("#progressBar").css("width", percent + "%");
    });

    function showToast(message) {
        $("#toast").text(message).fadeIn(400).delay(2000).fadeOut(400);
    }

    $("#contactForm").on("submit", function (event) {
        event.preventDefault();

        var button = $("#sendButton");
        button.prop("disabled", true);
        button.html('<span class="spinner-border spinner-border-sm"></span> Please wait...');

        setTimeout(function () {
            button.prop("disabled", false);
            button.text("SEND");
            $("#contactForm input, #contactForm textarea").val("");
            $("#contactPopup").hide();
            showToast("Message sent successfully!");
        }, 2000);
    });
});
