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

(function () {
    var moreBtn = document.getElementById('morebtn');
    var moreText = document.getElementById('moretext');
    if (!moreBtn || !moreText) return;

    moreBtn.addEventListener('click', function () {
        var isOpen = moreText.style.display === 'block';
        moreText.style.display = isOpen ? 'none' : 'block';
        moreBtn.textContent = isOpen ? 'Read more' : 'Read less';
    });
})();

(function () {
    var list = document.getElementById('statuslist');
    var count = document.getElementById('statuscount');
    var filters = document.querySelectorAll('#statusfilters .btn');
    var timeBtn = document.getElementById('timebtn');
    var timeOut = document.getElementById('timeout');
    if (!list) return;

    var sectors = [
        { name: 'Sector 7', status: 'online', drift: 0.6 },
        { name: 'Sector 3', status: 'online', drift: 1.1 },
        { name: 'Sector 9', status: 'offline', drift: 4.8 },
        { name: 'Threshold 3', status: 'online', drift: 0.9 },
        { name: 'Sub-Level 2', status: 'offline', drift: 3.2 }
    ];

    var panel = {
        describe: function (sector) {
            return 'Dimensional drift: ' + sector.drift + '%';
        },
        filter: function (type) {
            switch (type) {
                case 'online':
                    return sectors.filter(function (s) { return s.status === 'online'; });
                case 'offline':
                    return sectors.filter(function (s) { return s.status === 'offline'; });
                default:
                    return sectors;
            }
        },
        render: function (items) {
            list.innerHTML = '';
            for (var i = 0; i < items.length; i++) {
                var col = document.createElement('div');
                col.className = 'col-12 col-md-6 col-lg-4';
                col.innerHTML =
                    '<div class="statuscard p-3 ' + items[i].status + '">' +
                    '<h3 class="mb-2">' + items[i].name + '</h3>' +
                    '<p>' + this.describe(items[i]) + '</p>' +
                    '<p>Status: ' + items[i].status + '</p></div>';
                list.appendChild(col);
            }
            count.textContent = 'Showing ' + items.length + ' of ' + sectors.length + ' sectors';
        }
    };

    filters.forEach(function (btn) {
        btn.addEventListener('click', function () {
            panel.render(panel.filter(btn.dataset.filter));
        });
    });

    timeBtn.addEventListener('click', function () {
        timeOut.textContent = 'Facility time: ' + new Date().toLocaleTimeString();
    });

    panel.render(panel.filter('all'));
})();
