// script.js - Assignment 6 (jQuery)
// One file for all pages. Every block first checks that its elements exist on the page.
// Task 1-3: FAQ search | Task 4: scroll progress bar | Task 5: number counter
// Task 6: submit spinner | Task 7: toasts | Task 8: copy button | Task 9: lazy images

// ---------- Task 7: toast notification ----------
// global function: other files (validation.js, etc.) can call it too
function showToast(message) {
    var $box = $("#toastBox");

    // the box for all toasts is created only once
    if ($box.length === 0) {
        $box = $('<div id="toastBox" aria-live="polite"></div>').appendTo("body");
    }

    // .text() is used so the message is never treated as HTML
    var $toast = $('<div class="toast-note"></div>').text(message).hide().appendTo($box);

    // fade in, wait 2.5 seconds, fade out and remove from the page
    $toast.fadeIn(250).delay(2500).fadeOut(500, function () {
        $(this).remove();
    });
}

// ---------- helpers for search ----------
// makes special characters of the query safe for a regular expression
function escapeRegExp(text) {
    return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// splits the text by the query and returns DOM nodes,
// the matching parts are wrapped in the given tag (mark or strong)
function markParts(text, query, tagName, className) {
    var regex = new RegExp("(" + escapeRegExp(query) + ")", "gi");
    var parts = text.split(regex);
    var nodes = [];

    // split() with a group puts the matches on the odd positions
    for (var i = 0; i < parts.length; i++) {
        if (parts[i] === "") {
            continue;
        }
        if (i % 2 === 1) {
            nodes.push($("<" + tagName + ">").addClass(className).text(parts[i])[0]);
        } else {
            nodes.push(document.createTextNode(parts[i]));
        }
    }

    return nodes;
}

// ---------- Task 1, 2, 3: search in the FAQ ----------
function initFaqSearch() {
    var $input = $("#faqSearch");
    if ($input.length === 0) {
        return;
    }

    var $items = $(".faq-item");
    var $list = $("#suggestions");
    var $count = $("#searchCount");
    var $none = $("#noResults");
    var activeIndex = -1;
    var questions = [];

    // the texts are saved once, before any highlighting changes the HTML
    $items.each(function () {
        var $item = $(this);
        var title = $item.find(".faq-question").contents().first().text().trim();
        var answer = $item.find(".faq-answer").text();

        $item.data("text", (title + " " + answer).toLowerCase());
        questions.push({ title: title, text: (title + " " + answer).toLowerCase() });
    });

    // opens or closes an answer (same classes as in accordion.js)
    function setOpen($item, open) {
        var $answer = $item.find(".faq-answer");

        $item.toggleClass("open", open);
        $item.find(".faq-question").attr("aria-expanded", open);
        $answer.css("max-height", open ? $answer[0].scrollHeight + "px" : "");
    }

    // Task 3: removes all old <mark> tags and puts the plain text back
    function clearHighlights() {
        $items.find("mark.hl").each(function () {
            $(this).replaceWith(document.createTextNode($(this).text()));
        });
        $items.each(function () {
            this.normalize();
        });
    }

    // Task 3: wraps every match in <mark>; only text nodes are changed, so the HTML never breaks
    function highlight($visibleItems, query) {
        $visibleItems.find(".faq-question, .faq-answer").find("*").addBack().contents().each(function () {
            if (this.nodeType !== 3 || $(this).parent().hasClass("faq-icon")) {
                return;
            }

            var nodes = markParts(this.nodeValue, query, "mark", "hl");
            if (nodes.length > 1 || (nodes.length === 1 && nodes[0].nodeType === 1)) {
                $(this).replaceWith(nodes);
            }
        });
    }

    // Task 1: live filter + Task 3: highlight
    function applySearch(query) {
        var q = query.toLowerCase();

        clearHighlights();

        // .filter() keeps only the items that contain the query
        var $matches = $items.filter(function () {
            return $(this).data("text").indexOf(q) !== -1;
        });

        $items.hide();
        $matches.show();

        if (q === "") {
            // empty search: close the answers that were opened by the search
            $items.each(function () {
                if ($(this).data("auto")) {
                    setOpen($(this), false);
                    $(this).data("auto", false);
                }
            });
            $count.text("");
            $none.hide();
            return;
        }

        highlight($matches, query);

        // open the found answers, so the highlighted words are visible
        $matches.each(function () {
            if (!$(this).hasClass("open")) {
                setOpen($(this), true);
                $(this).data("auto", true);
            }
        });

        $count.text($matches.length + " of " + $items.length + " questions found");
        $none.text("Nothing found for \u201C" + query + "\u201D.").toggle($matches.length === 0);
    }

    // Task 2: dropdown with suggestions
    function showSuggestions(query) {
        $list.empty();
        activeIndex = -1;

        if (query === "") {
            $list.hide();
            return;
        }

        var q = query.toLowerCase();
        var found = questions
            .filter(function (item) {
                return item.text.indexOf(q) !== -1;
            })
            .slice(0, 5);

        if (found.length === 0) {
            $list.hide();
            return;
        }

        found.forEach(function (item) {
            var $li = $('<li role="option"></li>').data("title", item.title);

            // the typed part is bold, if it is in the title
            $li.append(markParts(item.title, query, "strong", ""));
            $list.append($li);
        });

        $list.show();
    }

    // a suggestion was chosen: put it into the input and search
    function chooseSuggestion(title) {
        $input.val(title);
        $list.hide();
        applySearch(title);
    }

    // "input" works for typing, paste and the clear (x) button
    $input.on("input", function () {
        var query = $input.val().trim();

        showSuggestions(query);
        applySearch(query);
    });

    // keyboard: arrows, Enter and Escape
    $input.on("keydown", function (event) {
        var $options = $list.children();

        if (event.key === "Escape") {
            $list.hide();
            return;
        }
        if ($options.length === 0 || $list.is(":hidden")) {
            return;
        }

        if (event.key === "ArrowDown" || event.key === "ArrowUp") {
            event.preventDefault();
            activeIndex += event.key === "ArrowDown" ? 1 : -1;
            if (activeIndex >= $options.length) {
                activeIndex = 0;
            }
            if (activeIndex < 0) {
                activeIndex = $options.length - 1;
            }
            $options.removeClass("active").eq(activeIndex).addClass("active");
        } else if (event.key === "Enter" && activeIndex >= 0) {
            event.preventDefault();
            chooseSuggestion($options.eq(activeIndex).data("title"));
        }
    });

    // mouse: one handler for all <li> (event delegation)
    $list.on("click", "li", function () {
        chooseSuggestion($(this).data("title"));
    });

    // click outside of the search box closes the list
    $(document).on("click", function (event) {
        if ($(event.target).closest(".search-box").length === 0) {
            $list.hide();
        }
    });
}

// ---------- Task 4: scroll progress bar ----------
function initScrollProgress() {
    var $bar = $('<div class="bar"></div>');

    // the bar is created by jQuery, so it is the same on every page
    $('<div id="scrollProgress" aria-hidden="true"></div>').append($bar).prependTo("body");

    function update() {
        var scrollable = $(document).height() - $(window).height();
        var percent = scrollable > 0 ? ($(window).scrollTop() / scrollable) * 100 : 0;

        $bar.css("width", percent + "%").toggleClass("active", percent > 0.5);
    }

    $(window).on("scroll resize", update);
    update();
}

// ---------- Task 5: animated number counter ----------
function initCounters() {
    var $stats = $("#stats");
    if ($stats.length === 0) {
        return;
    }

    var started = false;

    function runCounters() {
        $(".stat-number").each(function () {
            var $number = $(this);
            var target = parseFloat($number.attr("data-target"));
            var decimals = parseInt($number.attr("data-decimals"), 10) || 0;
            var suffix = $number.attr("data-suffix") || "";

            // animate() changes a number of a plain object, step() writes it to the page
            $({ value: 0 }).animate({ value: target }, {
                duration: 2000,
                easing: "swing",
                step: function (now) {
                    $number.text(now.toFixed(decimals) + suffix);
                },
                complete: function () {
                    $number.text(target.toFixed(decimals) + suffix);
                }
            });
        });
    }

    // the counters start once, when the block comes into view
    function checkStats() {
        if (started) {
            return;
        }

        var bottomOfScreen = $(window).scrollTop() + $(window).height();

        if ($stats.offset().top < bottomOfScreen - 80) {
            started = true;
            runCounters();
            $(window).off("scroll", checkStats);
        }
    }

    $(window).on("scroll", checkStats);
    checkStats();
}

// ---------- Task 6: spinner on submit ----------
function initSubmitSpinner() {
    var $form = $("#orderForm");
    var $button = $("#submitBtn");
    if ($form.length === 0) {
        return;
    }

    var normalHtml = $button.html();
    var sending = false;

    // validation.js triggers "orderValid" when all fields are correct
    $form.on("orderValid", function () {
        if (sending) {
            return;
        }
        sending = true;

        // spinner + text, and the button is disabled against double clicks
        $button
            .prop("disabled", true)
            .html('<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Please wait...');

        // fake server call: 2 seconds
        setTimeout(function () {
            sending = false;
            $button.prop("disabled", false).html(normalHtml);

            $form[0].reset();
            $("#formSuccess").removeClass("d-none")[0].scrollIntoView({ behavior: "smooth", block: "center" });
            playSound("success");
            showToast("Request submitted successfully");
        }, 2000);
    });
}

// ---------- Task 7: toast when the theme is changed ----------
function initThemeToast() {
    // common.js changes the theme first, then this handler runs
    $("#themeToggle").on("click", function () {
        showToast($("body").hasClass("night") ? "Night mode is on" : "Day mode is on");
    });
}

// ---------- Task 8: copy to clipboard ----------
var copyIcon =
    '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
    '<rect x="9" y="9" width="12" height="12" rx="2"></rect><path d="M5 15V5a2 2 0 0 1 2-2h10"></path></svg>';

var checkIcon =
    '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
    '<path d="M5 13l4 4L19 7"></path></svg>';

// copies the text; returns a promise
function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) {
        return navigator.clipboard.writeText(text);
    }

    // old way for pages opened without https (for example from a file)
    return new Promise(function (resolve, reject) {
        var $area = $("<textarea></textarea>").val(text).css({ position: "fixed", top: 0, opacity: 0 }).appendTo("body");

        $area[0].select();
        var done = document.execCommand("copy");
        $area.remove();

        if (done) {
            resolve();
        } else {
            reject();
        }
    });
}

// creates a button with an icon and a hidden tooltip
function makeCopyButton(text, label, message) {
    var timer;
    var $button = $('<button type="button" class="copy-btn"></button>')
        .attr("aria-label", label)
        .html(copyIcon)
        .append('<span class="copy-tip" role="status">Copied to clipboard!</span>');

    $button.on("click", function () {
        copyText(text).then(function () {
            // icon becomes a checkmark and the tooltip is shown
            $button.addClass("copied").find("svg").replaceWith(checkIcon);
            $button.find(".copy-tip").stop(true, true).fadeIn(150).delay(1500).fadeOut(200);
            showToast(message);

            // after 2 seconds everything is back to normal
            clearTimeout(timer);
            timer = setTimeout(function () {
                $button.removeClass("copied").find("svg").replaceWith(copyIcon);
            }, 2000);
        }).catch(function () {
            showToast("Could not copy. Select the text and press Ctrl+C.");
        });
    });

    return $button;
}

function initCopyButtons() {
    // any text marked with class "copy-snippet" gets a copy button next to it
    $(".copy-snippet").each(function () {
        var text = $(this).text().trim();

        $(this).after(makeCopyButton(text, "Copy " + text, text + " copied to clipboard"));
    });

    // code snippets (media.html)
    $("pre.code").each(function () {
        var text = $(this).text();

        $(this)
            .wrap('<div class="code-wrap"></div>')
            .after(makeCopyButton(text, "Copy code", "Code copied to clipboard").addClass("copy-btn-code"));
    });
}

// ---------- Task 9: lazy loading of images ----------
// a real image is in data-src, the src has a tiny empty picture until the image is needed
function isNearScreen($element) {
    var bottomOfScreen = $(window).scrollTop() + $(window).height();

    // 200px extra, so the image starts loading a little before it is visible
    return $element.offset().top < bottomOfScreen + 200;
}

function loadImage($img) {
    var realSrc = $img.attr("data-src");
    if (!realSrc) {
        return;
    }

    $img.removeAttr("data-src");
    // the fade-in class is added only when the image is really loaded
    $img.one("load", function () {
        $(this).addClass("loaded");
    });
    $img.attr("src", realSrc);
}

function initLazyImages() {
    if ($("img[data-src]").length === 0) {
        return;
    }

    function checkImages() {
        // normal images: load when they are near the screen
        $("img[data-src]").not(".carousel img").each(function () {
            if (isNearScreen($(this))) {
                loadImage($(this));
            }
        });

        // carousel: hidden slides have no position (offset), so the carousel itself is checked
        // and only the first (active) slide is loaded
        $(".carousel").each(function () {
            if (isNearScreen($(this))) {
                loadImage($(this).find(".carousel-item.active img"));
            }
        });
    }

    // other slides are loaded when the carousel is going to show them
    $(".carousel").on("slide.bs.carousel", function (event) {
        loadImage($(event.relatedTarget).find("img"));
    });

    $(window).on("scroll resize", checkImages);
    checkImages();
}

// ---------- Task 0: start ----------
$(document).ready(function () {
    console.log("jQuery is ready!");

    initScrollProgress();
    initFaqSearch();
    initCounters();
    initSubmitSpinner();
    initThemeToast();
    initCopyButtons();
    initLazyImages();
});
