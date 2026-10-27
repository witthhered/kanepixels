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
            case 'ArrowLeft':
            case 'ArrowUp':
                moveFocus(-1);
                break;
        }
    });

    document.querySelectorAll('.btn').forEach(function (btn) {
        btn.addEventListener('click', playBeep);
    });
})();
