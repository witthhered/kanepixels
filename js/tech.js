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

$(document).ready(function () {
    var list = $('#statuslist');
    if (!list.length) return;

    var sectors = [
        { name: 'Sector 7', status: 'online', drift: 0.6 },
        { name: 'Sector 3', status: 'online', drift: 1.1 },
        { name: 'Sector 9', status: 'offline', drift: 4.8 },
        { name: 'Threshold 3', status: 'online', drift: 0.9 },
        { name: 'Sub-Level 2', status: 'offline', drift: 3.2 }
    ];
    var type = 'all';

    var panel = {
        describe: function (sector) {
            return 'Dimensional drift: ' + sector.drift + '%';
        },
        highlight: function (text, query) {
            if (!query) return text;
            var safe = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            return text.replace(new RegExp(safe, 'gi'), '<mark>$&</mark>');
        },
        filter: function (query) {
            return sectors.filter(function (s) {
                var typeOk = type === 'all' || s.status === type;
                var nameOk = s.name.toLowerCase().indexOf(query.toLowerCase()) !== -1;
                return typeOk && nameOk;
            });
        },
        render: function () {
            var query = $('#statussearch').val().trim();
            var items = this.filter(query);
            list.empty();
            if (!items.length) {
                list.append('<p class="col-12">No sectors found</p>');
            }
            $.each(items, function (i, s) {
                list.append(
                    '<div class="col-12 col-md-6 col-lg-4">' +
                    '<div class="statuscard p-3 ' + s.status + '">' +
                    '<h3 class="mb-2">' + panel.highlight(s.name, query) + '</h3>' +
                    '<p>' + panel.describe(s) + '</p>' +
                    '<p>Status: ' + s.status + '</p></div></div>'
                );
            });
            $('#statuscount').text('Showing ' + items.length + ' of ' + sectors.length + ' sectors');
        }
    };

    $('#statusfilters .btn').on('click', function () {
        type = $(this).data('filter');
        $(this).addClass('active').siblings().removeClass('active');
        panel.render();
    });

    $('#statussearch').on('input', function () {
        panel.render();
    });

    $('#timebtn').on('click', function () {
        $('#timeout').text('Facility time: ' + new Date().toLocaleTimeString());
    });

    panel.render();
});

$(document).ready(function () {
    var codes = $('.safetyrow .code');

    codes.each(function () {
        var box = $(this);
        box.data('code', box.text().trim());
        box.append('<span class="copyicon"></span><span class="copytip">Copied to clipboard!</span>');
    });

    codes.on('click', function () {
        var box = $(this);
        navigator.clipboard.writeText(box.data('code'));
        box.find('.copytip').stop(true, true).fadeIn(200).delay(1200).fadeOut(300);
     
    });
});
