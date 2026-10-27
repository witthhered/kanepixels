// common.js - features shared by all pages:
// sounds, click animation, keyboard navigation and Day/Night theme

// ---------- Sounds ----------
// an object that stores all sounds of the site
var sounds = {
    click: new Audio("assets/click.wav"),
    success: new Audio("assets/success.wav")
};

sounds.click.volume = 0.4;
sounds.success.volume = 0.5;

// plays one sound; all other sounds are stopped first, so they never overlap
function playSound(name) {
    var sound = sounds[name];
    if (!sound) {
        return;
    }

    for (var key in sounds) {
        sounds[key].pause();
        sounds[key].currentTime = 0;
    }

    // play() returns a promise, the browser may block it, so we catch the error
    sound.play().catch(function () {});
}

// ---------- Click sound + animation ----------
document.addEventListener("click", function (event) {
    var target = event.target.closest(".btn, .faq-question");
    if (!target) {
        return;
    }

    playSound("click");

    // restart the pulse animation on every click
    target.classList.remove("pulse");
    void target.offsetWidth;
    target.classList.add("pulse");
});

// remove the class when the animation is finished
document.addEventListener("animationend", function (event) {
    event.target.classList.remove("pulse");
});

// ---------- Keyboard navigation in the menu ----------
var navBox = document.querySelector(".headernav");

if (navBox) {
    navBox.addEventListener("keydown", function (event) {
        var links = Array.from(navBox.querySelectorAll(".nav-link"));
        var index = links.indexOf(document.activeElement);

        // do nothing if focus is not on a menu link
        if (index === -1) {
            return;
        }

        switch (event.key) {
            case "ArrowRight":
            case "ArrowDown":
                event.preventDefault();
                links[(index + 1) % links.length].focus();
                break;
            case "ArrowLeft":
            case "ArrowUp":
                event.preventDefault();
                links[(index - 1 + links.length) % links.length].focus();
                break;
            case "Home":
                event.preventDefault();
                links[0].focus();
                break;
            case "End":
                event.preventDefault();
                links[links.length - 1].focus();
                break;
            default:
                break;
        }
    });
}

// ---------- Day / Night theme ----------
var themeButton = document.getElementById("themeToggle");

function applyTheme(theme) {
    if (theme === "night") {
        document.body.classList.add("night");
        document.documentElement.setAttribute("data-bs-theme", "dark");
        themeButton.textContent = "DAY MODE";
    } else {
        document.body.classList.remove("night");
        document.documentElement.setAttribute("data-bs-theme", "light");
        themeButton.textContent = "NIGHT MODE";
    }
}

if (themeButton) {
    // the chosen theme is saved, so it stays after reload
    applyTheme(localStorage.getItem("theme") || "day");

    themeButton.addEventListener("click", function () {
        var newTheme = document.body.classList.contains("night") ? "day" : "night";
        applyTheme(newTheme);
        localStorage.setItem("theme", newTheme);
    });
}
