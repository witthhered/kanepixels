
(function () {
    var items = document.querySelectorAll('.faqitem');

    items.forEach(function (item) {
        var btn = item.querySelector('.faqq');
        var panel = item.querySelector('.faqa');

        btn.addEventListener('click', function () {
            var isOpen = item.classList.toggle('open');
            btn.setAttribute('aria-expanded', isOpen);
            panel.style.maxHeight = isOpen ? panel.scrollHeight + 'px' : '0px';
        });
    });

   
    window.addEventListener('resize', function () {
        items.forEach(function (item) {
            if (item.classList.contains('open')) {
                var panel = item.querySelector('.faqa');
                panel.style.maxHeight = panel.scrollHeight + 'px';
            }
        });
    });
})();

(function () {
    var dateEl = document.getElementById('clockdate');
    var timeEl = document.getElementById('clocktime');
    if (!dateEl || !timeEl) return;

    function tick() {
        var now = new Date();
        dateEl.textContent = now.toLocaleDateString('en-US', {
            year: 'numeric', month: 'long', day: 'numeric'
        });
        timeEl.textContent = now.toLocaleTimeString('en-US', {
            hour: 'numeric', minute: '2-digit', second: '2-digit'
        });
    }

    tick();
    setInterval(tick, 1000);
})();
