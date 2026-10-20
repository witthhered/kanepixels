(function () {
    var area = document.querySelector('.white');
    var buttons = document.querySelectorAll('.btn-group[aria-label="Page sections"] .btn');
    if (!area || !buttons.length) return;

    area.style.transition = 'background-color 0.4s ease';

    buttons.forEach(function (btn) {
        btn.addEventListener('click', function () {
            area.style.backgroundColor = btn.dataset.bg;
            buttons.forEach(function (b) { b.classList.remove('active'); });
            btn.classList.add('active');
        });
    });
})();
