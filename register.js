// Registration form validation and handling

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('registerForm');
    const inputs = form.querySelectorAll('input, select');
    
    // Regex patterns for validation
    const patterns = {
        firstName: /^[a-zA-Z]{2,30}$/,
        lastName: /^[a-zA-Z]{2,30}$/,
        email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        phone: /^[\+]?[1-9][\d]{0,15}$/,
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

    // Validation functions
    function validateField(field) {
        const value = field.value.trim();
        const fieldName = field.name;
        const errorElement = document.getElementById(fieldName + 'Error');
        let isValid = true;

        // Clear previous error
        errorElement.textContent = '';
        field.classList.remove('error', 'valid');

        // Check if field is required and empty
        if (field.hasAttribute('required') && value === '') {
            errorElement.textContent = 'This field is required';
            field.classList.add('error');
            return false;
        }

        // Skip validation if field is empty and not required
        if (value === '' && !field.hasAttribute('required')) {
            return true;
        }

        // Specific field validations
        switch (fieldName) {
            case 'firstName':
            case 'lastName':
                if (!patterns[fieldName].test(value)) {
                    errorElement.textContent = errorMessages[fieldName];
                    field.classList.add('error');
                    isValid = false;
                }
                break;

            case 'email':
                if (!patterns.email.test(value)) {
                    errorElement.textContent = errorMessages.email;
                    field.classList.add('error');
                    isValid = false;
                }
                break;

            case 'phone':
                if (!patterns.phone.test(value)) {
                    errorElement.textContent = errorMessages.phone;
                    field.classList.add('error');
                    isValid = false;
                }
                break;

            case 'organization':
                if (!patterns.organization.test(value)) {
                    errorElement.textContent = errorMessages.organization;
                    field.classList.add('error');
                    isValid = false;
                }
                break;

            case 'organizationType':
                if (value === '') {
                    errorElement.textContent = errorMessages.organizationType;
                    field.classList.add('error');
                    isValid = false;
                }
                break;

            case 'password':
                isValid = validatePassword(value);
                if (!isValid) {
                    errorElement.textContent = errorMessages.password;
                    field.classList.add('error');
                }
                break;

            case 'confirmPassword':
                const password = document.getElementById('password').value;
                if (value !== password) {
                    errorElement.textContent = errorMessages.confirmPassword;
                    field.classList.add('error');
                    isValid = false;
                }
                break;

            case 'terms':
                if (!field.checked) {
                    errorElement.textContent = errorMessages.terms;
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

        // Update visual indicators
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

    // Real-time validation
    inputs.forEach(input => {
        // Validate on blur
        input.addEventListener('blur', function() {
            validateField(this);
        });

        // Special handling for password field
        if (input.name === 'password') {
            input.addEventListener('input', function() {
                validatePassword(this.value);
                
                // Also validate confirm password if it has a value
                const confirmPassword = document.getElementById('confirmPassword');
                if (confirmPassword.value) {
                    validateField(confirmPassword);
                }
            });
        }

        // Special handling for confirm password
        if (input.name === 'confirmPassword') {
            input.addEventListener('input', function() {
                validateField(this);
            });
        }

        // Real-time validation for other fields
        if (!['password', 'confirmPassword'].includes(input.name)) {
            input.addEventListener('input', function() {
                // Clear error state while typing
                this.classList.remove('error');
                const errorElement = document.getElementById(this.name + 'Error');
                if (errorElement) {
                    errorElement.textContent = '';
                }
            });
        }
    });

    // Form submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (validateForm()) {
            // Simulate form submission
            const submitBtn = form.querySelector('.submit-btn');
            const originalText = submitBtn.innerHTML;
            
            submitBtn.disabled = true;
            submitBtn.innerHTML = 'Creating Account...';
            
            // Simulate API call
            setTimeout(() => {
                alert('Account created successfully! Welcome to Nexcent!');
                
                // Reset form
                form.reset();
                inputs.forEach(input => {
                    input.classList.remove('error', 'valid');
                    const errorElement = document.getElementById(input.name + 'Error');
                    if (errorElement) {
                        errorElement.textContent = '';
                    }
                });
                
                // Reset password requirements
                Object.values(passwordRequirements).forEach(element => {
                    if (element) {
                        element.classList.remove('valid', 'invalid');
                    }
                });
                
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalText;
                
                // Redirect to main page
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 2000);
                
            }, 2000);
        } else {
            // Scroll to first error
            const firstError = form.querySelector('.error');
            if (firstError) {
                firstError.scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'center' 
                });
                firstError.focus();
            }
        }
    });

    // Add some interactive enhancements
    const formInputs = document.querySelectorAll('.form-input, .form-select');
    formInputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');
        });
        
        input.addEventListener('blur', function() {
            this.parentElement.classList.remove('focused');
        });
    });

    // Handle back to home
    const homeLinks = document.querySelectorAll('a[href="index.html"]');
    homeLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            window.location.href = 'index.html';
        });
    });

    // Add loading animation for the page
    window.addEventListener('load', function() {
        document.body.classList.add('loaded');
    });

    // Form progress indicator (optional enhancement)
    function updateFormProgress() {
        const totalFields = inputs.length;
        const validFields = form.querySelectorAll('.valid').length;
        const progress = (validFields / totalFields) * 100;
        
        // You can add a progress bar here if desired
        console.log(`Form completion: ${Math.round(progress)}%`);
    }

    // Update progress on field validation
    inputs.forEach(input => {
        input.addEventListener('blur', updateFormProgress);
    });
});