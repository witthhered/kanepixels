const form = document.getElementById('orderForm');
const successBox = document.getElementById('formSuccess');

function value(id) {
    return document.getElementById(id).value.trim();
}

const rules = {
    facility: function () {
        if (!form.querySelector('input[name="facilityType"]:checked')) {
            return 'Please select a facility type.';
        }
        return '';
    },
    fullName: function () {
        const v = value('fullName');
        if (v === '') return 'Full name or organization is required.';
        if (v.length < 2) return 'Name must be at least 2 characters long.';
        return '';
    },
    email: function () {
        const v = value('email');
        const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
        if (v === '') return 'Email address is required.';
        if (!pattern.test(v)) return 'Enter a valid email, for example name@company.com.';
        return '';
    },
    phone: function () {
        const v = value('phone');
        const pattern = /^\+?[0-9\s()\-]{7,18}$/;
        if (v === '') return 'Phone number is required.';
        if (!pattern.test(v)) return 'Enter a valid phone number (digits, spaces, + ( ) - only).';
        return '';
    },
    password: function () {
        const v = document.getElementById('password').value;
        if (v === '') return 'Password is required.';
        if (v.length < 8) return 'Password must be at least 8 characters long.';
        return '';
    },
    confirmPassword: function () {
        const v = document.getElementById('confirmPassword').value;
        if (v === '') return 'Please confirm your password.';
        if (v !== document.getElementById('password').value) return 'Passwords do not match.';
        return '';
    },
    sqmeters: function () {
        const v = value('sqmeters');
        if (v === '') return '';
        if (Number(v) < 1000) return 'Minimum area is 1000 m2.';
        return '';
    },
    terms: function () {
        if (!document.getElementById('terms').checked) {
            return 'You must agree to the policies to continue.';
        }
        return '';
    }
};

function setError(id, message) {
    const input = document.getElementById(id);
    if (input) input.classList.add('is-invalid');
    document.getElementById(id + 'Error').textContent = message;
}

function clearError(id) {
    const input = document.getElementById(id);
    if (input) input.classList.remove('is-invalid');
    document.getElementById(id + 'Error').textContent = '';
}

function validateField(id) {
    const message = rules[id]();
    if (message !== '') {
        setError(id, message);
        return false;
    }
    clearError(id);
    return true;
}

form.addEventListener('submit', function (e) {
    e.preventDefault();
    successBox.classList.add('d-none');

    let allValid = true;
    for (const id in rules) {
        if (!validateField(id)) {
            allValid = false;
        }
    }

    if (!allValid) {
        const firstError = form.querySelector('.is-invalid') || document.getElementById('facilityError');
        firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return;
    }

    form.reset();
    successBox.classList.remove('d-none');
    successBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
});

form.addEventListener('input', function (e) {
    const id = e.target.id;
    if (e.target.name === 'facilityType') {
        validateField('facility');
    }
    if (rules[id] && e.target.classList.contains('is-invalid')) {
        validateField(id);
    }
    if (id === 'password' && document.getElementById('confirmPassword').value !== '') {
        validateField('confirmPassword');
    }
});

form.addEventListener('reset', function () {
    for (const id in rules) {
        clearError(id);
    }
    successBox.classList.add('d-none');
});
