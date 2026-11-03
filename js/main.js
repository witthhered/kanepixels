(function () {
    var links = Array.from(document.querySelectorAll('.headernav .nav-link'));
    var audioCtx;

    function playBeep() {
        audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
        var osc = audioCtx.createOscillator();
        var gain = audioCtx.createGain();
        osc.frequency.value = 660;
        gain.gain.value = 0.05;
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.1);
    }

    function moveFocus(step) {
        var index = links.indexOf(document.activeElement);
        if (index === -1) return;
        var next = (index + step + links.length) % links.length;
        links[next].focus();
    }

    document.addEventListener('keydown', function (e) {
        switch (e.key) {
            case 'ArrowRight':
            case 'ArrowDown':
                moveFocus(1);
                break;
            case 'KeyM':
            case 'ArrowUp':
                moveFocus(-1);
                break;
        }
    });

    document.querySelectorAll('.btn').forEach(function (btn) {
        btn.addEventListener('click', playBeep);
    });
})();

$(document).ready(function () {
    console.log('jQuery is ready!');

    function updateProgress() {
        var max = $(document).height() - $(window).height();
        var percent = max > 0 ? $(window).scrollTop() / max * 100 : 0;
        $('.scrollfill').css('width', percent + '%');
    }

    function lazyLoad() {
        var bottom = $(window).scrollTop() + $(window).height() + 200;
        $('img[data-src]').each(function () {
            var img = $(this);
            var box = img.closest('.carousel');
            if (!box.length) box = img;
            if (box.offset().top < bottom) {
                var src = img.attr('data-src');
                img.removeAttr('data-src');
                img.on('load', function () {
                    img.addClass('loaded');
                });
                img.attr('src', src);
            }
        });
    }

    $(window).on('scroll resize', function () {
        updateProgress();
        lazyLoad();
    });
    updateProgress();
    lazyLoad();

    $('.counter').each(function () {
        var el = $(this);
        var target = el.data('target');
        $({ n: 0 }).animate({ n: target }, {
            duration: 2000,
            step: function (now) {
                el.text(Math.floor(now));
            },
            complete: function () {
                el.text(target);
            }
        });
    });
});
