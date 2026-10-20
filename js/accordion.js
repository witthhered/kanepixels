const faqItems = document.querySelectorAll('.faq-item');

faqItems.forEach(function (item) {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');

    question.addEventListener('click', function () {
        const isOpen = item.classList.contains('open');

        if (isOpen) {
            item.classList.remove('open');
            answer.style.maxHeight = null;
            question.setAttribute('aria-expanded', 'false');
        } else {
            item.classList.add('open');
            answer.style.maxHeight = answer.scrollHeight + 'px';
            question.setAttribute('aria-expanded', 'true');
        }
    });
});

window.addEventListener('resize', function () {
    faqItems.forEach(function (item) {
        if (item.classList.contains('open')) {
            const answer = item.querySelector('.faq-answer');
            answer.style.maxHeight = answer.scrollHeight + 'px';
        }
    });
});
