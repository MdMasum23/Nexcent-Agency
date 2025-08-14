// Registration form validation and handling

document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('registerForm');
    const inputs = form.querySelectorAll('input, select');
    const successMsg = document.getElementById('successMessage');

    // Regex patterns for validation
    const patterns = {
        firstName: /^[a-zA-Z]{2,30}$/,
        lastName: /^[a-zA-Z]{2,30}$/,
        email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        phone: /^[\+]?[0-9][\d]{0,10}$/,
        organization: /^[a-zA-Z0-9\s\-\.]{2,100}$/,
        password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
    };

    // Error messages
    const errorMessages = {
        firstName: 'First name must contain only letters (2-30 characters)',
        lastName: 'Last name must contain only letters (2-30 characters)',
        email: 'Please enter a valid email address',
        phone: 'Please enter a valid phone number',
        organization: 'Organization name must be 2-100 characters',
        organizationType: 'Please select an organization type',
        password: 'Password must meet all requirements',
        confirmPassword: 'Passwords do not match',
        terms: 'You must agree to the terms and conditions'
    };

    // Password requirements elements
    const passwordRequirements = {
        length: document.getElementById('lengthReq'),
        uppercase: document.getElementById('uppercaseReq'),
        lowercase: document.getElementById('lowercaseReq'),
        number: document.getElementById('numberReq'),
        special: document.getElementById('specialReq')
    };

    function validateField(field) {
        const value = field.value.trim();
        const fieldName = field.name;
        const errorElement = document.getElementById(fieldName + 'Error');
        let isValid = true;

        // Clear previous error
        if (errorElement) errorElement.textContent = '';
        field.classList.remove('error', 'valid');

        if (field.hasAttribute('required') && value === '') {
            if (errorElement) errorElement.textContent = 'This field is required';
            field.classList.add('error');
            return false;
        }

        if (value === '' && !field.hasAttribute('required')) {
            return true;
        }

        switch (fieldName) {
            case 'firstName':
            case 'lastName':
                if (!patterns[fieldName].test(value)) {
                    if (errorElement) errorElement.textContent = errorMessages[fieldName];
                    field.classList.add('error');
                    isValid = false;
                }
                break;

            case 'email':
                if (!patterns.email.test(value)) {
                    if (errorElement) errorElement.textContent = errorMessages.email;
                    field.classList.add('error');
                    isValid = false;
                }
                break;

            case 'phone':
                if (!patterns.phone.test(value)) {
                    if (errorElement) errorElement.textContent = errorMessages.phone;
                    field.classList.add('error');
                    isValid = false;
                }
                break;

            case 'organization':
                if (!patterns.organization.test(value)) {
                    if (errorElement) errorElement.textContent = errorMessages.organization;
                    field.classList.add('error');
                    isValid = false;
                }
                break;

            case 'organizationType':
                if (value === '') {
                    if (errorElement) errorElement.textContent = errorMessages.organizationType;
                    field.classList.add('error');
                    isValid = false;
                }
                break;

            case 'password':
                isValid = validatePassword(value);
                if (!isValid && errorElement) {
                    errorElement.textContent = errorMessages.password;
                    field.classList.add('error');
                }
                break;

            case 'confirmPassword':
                const password = document.getElementById('password').value;
                if (value !== password) {
                    if (errorElement) errorElement.textContent = errorMessages.confirmPassword;
                    field.classList.add('error');
                    isValid = false;
                }
                break;

            case 'terms':
                if (!field.checked) {
                    if (errorElement) errorElement.textContent = errorMessages.terms;
                    isValid = false;
                }
                break;
        }

        if (isValid && value !== '') {
            field.classList.add('valid');
        }

        return isValid;
    }

    function validatePassword(password) {
        const requirements = {
            length: password.length >= 8,
            uppercase: /[A-Z]/.test(password),
            lowercase: /[a-z]/.test(password),
            number: /\d/.test(password),
            special: /[@$!%*?&]/.test(password)
        };

        Object.keys(requirements).forEach(req => {
            const element = passwordRequirements[req];
            if (element) {
                element.classList.remove('valid', 'invalid');
                element.classList.add(requirements[req] ? 'valid' : 'invalid');
            }
        });

        return Object.values(requirements).every(req => req);
    }

    function validateForm() {
        let isFormValid = true;
        inputs.forEach(input => {
            if (!validateField(input)) {
                isFormValid = false;
            }
        });
        return isFormValid;
    }

    inputs.forEach(input => {
        input.addEventListener('blur', function () {
            validateField(this);
        });

        if (input.name === 'password') {
            input.addEventListener('input', function () {
                validatePassword(this.value);
                const confirmPassword = document.getElementById('confirmPassword');
                if (confirmPassword.value) {
                    validateField(confirmPassword);
                }
            });
        }

        if (input.name === 'confirmPassword') {
            input.addEventListener('input', function () {
                validateField(this);
            });
        }

        if (!['password', 'confirmPassword'].includes(input.name)) {
            input.addEventListener('input', function () {
                this.classList.remove('error');
                const errorElement = document.getElementById(this.name + 'Error');
                if (errorElement) {
                    errorElement.textContent = '';
                }
            });
        }
    });

    form.addEventListener('submit', function (e) {
        e.preventDefault();

        if (validateForm()) {
            const submitBtn = form.querySelector('.submit-btn');
            const originalText = submitBtn.innerHTML;

            submitBtn.disabled = true;
            submitBtn.innerHTML = 'Creating Account...';

            setTimeout(() => {
                successMsg.style.display = 'block';

                // Reset form
                form.reset();
                inputs.forEach(input => {
                    input.classList.remove('error', 'valid');
                    const errorElement = document.getElementById(input.name + 'Error');
                    if (errorElement) {
                        errorElement.textContent = '';
                    }
                });

                Object.values(passwordRequirements).forEach(element => {
                    if (element) {
                        element.classList.remove('valid', 'invalid');
                    }
                });

                submitBtn.disabled = false;
                submitBtn.innerHTML = originalText;

                // Optional: auto hide success message
                setTimeout(() => {
                    successMsg.style.display = 'none';
                    window.location.href = 'index.html';
                }, 2000);

            }, 2000);
        } else {
            const firstError = form.querySelector('.error');
            if (firstError) {
                firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
                firstError.focus();
            }
        }
    });

    const formInputs = document.querySelectorAll('.form-input, .form-select');
    formInputs.forEach(input => {
        input.addEventListener('focus', function () {
            this.parentElement.classList.add('focused');
        });

        input.addEventListener('blur', function () {
            this.parentElement.classList.remove('focused');
        });
    });

    const homeLinks = document.querySelectorAll('a[href="index.html"]');
    homeLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            window.location.href = 'index.html';
        });
    });

    window.addEventListener('load', function () {
        document.body.classList.add('loaded');
    });

    function updateFormProgress() {
        const totalFields = inputs.length;
        const validFields = form.querySelectorAll('.valid').length;
        const progress = (validFields / totalFields) * 100;
        console.log(`Form completion: ${Math.round(progress)}%`);
    }

    inputs.forEach(input => {
        input.addEventListener('blur', updateFormProgress);
    });
});
