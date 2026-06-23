/* main.js - ARSM Technologies Landing Page Interactivity */

document.addEventListener('DOMContentLoaded', () => {
    initMobileNav();
    initProductTabs();
    initContactForm();
});

/* -------------------------------------------------------------
   1. MOBILE NAVIGATION DRAWER
------------------------------------------------------------- */
function initMobileNav() {
    const navToggle = document.querySelector('.mobile-nav-toggle');
    const primaryNav = document.querySelector('.primary-navigation');
    const navLinks = document.querySelectorAll('.nav-link');

    if (!navToggle || !primaryNav) return;

    // Toggle menu visibility
    navToggle.addEventListener('click', () => {
        const isOpened = navToggle.getAttribute('aria-expanded') === 'true';
        
        navToggle.setAttribute('aria-expanded', !isOpened);
        primaryNav.classList.toggle('open');
        
        // Prevent body scrolling when menu is open
        document.body.style.overflow = !isOpened ? 'hidden' : '';
    });

    // Close menu when a link is clicked
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navToggle.setAttribute('aria-expanded', 'false');
            primaryNav.classList.remove('open');
            document.body.style.overflow = '';
            
            // Update active link styling
            navLinks.forEach(navL => navL.classList.remove('active'));
            link.classList.add('active');
        });
    });

    // Close menu when resizing beyond mobile layout width
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) {
            navToggle.setAttribute('aria-expanded', 'false');
            primaryNav.classList.remove('open');
            document.body.style.overflow = '';
        }
    });
}

/* -------------------------------------------------------------
   2. PRODUCT TAB SWITCHER
------------------------------------------------------------- */
function initProductTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabPanels = document.querySelectorAll('.tab-panel');

    if (tabButtons.length === 0 || tabPanels.length === 0) return;

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetPanelId = button.getAttribute('aria-controls');
            const targetPanel = document.getElementById(targetPanelId);

            if (!targetPanel) return;

            // Remove active states from all buttons and panels
            tabButtons.forEach(btn => {
                btn.classList.remove('active');
                btn.setAttribute('aria-selected', 'false');
                btn.setAttribute('tabindex', '-1');
            });

            tabPanels.forEach(panel => {
                panel.classList.remove('active');
                panel.setAttribute('hidden', 'true');
            });

            // Set active states for clicked button and corresponding panel
            button.classList.add('active');
            button.setAttribute('aria-selected', 'true');
            button.setAttribute('tabindex', '0');

            targetPanel.classList.add('active');
            targetPanel.removeAttribute('hidden');
        });

        // Keyboard arrow navigation support inside tab nav
        button.addEventListener('keydown', (e) => {
            const list = Array.from(tabButtons);
            const index = list.indexOf(button);
            let nextBtn;

            if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
                nextBtn = list[index + 1] || list[0];
            } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
                nextBtn = list[index - 1] || list[list.length - 1];
            }

            if (nextBtn) {
                nextBtn.focus();
                nextBtn.click();
            }
        });
    });
}

/* -------------------------------------------------------------
   3. B2B CONTACT FORM VALIDATION
------------------------------------------------------------- */
function initContactForm() {
    const form = document.getElementById('contactForm');
    const formSuccess = document.getElementById('formSuccess');

    if (!form || !formSuccess) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        let isFormValid = true;

        // Form Fields
        const nameField = form.elements['name'];
        const companyField = form.elements['company'];
        const emailField = form.elements['email'];
        const areaField = form.elements['area'];

        // Helper validation checks
        if (!validateRequired(nameField)) isFormValid = false;
        if (!validateRequired(companyField)) isFormValid = false;
        if (!validateEmail(emailField)) isFormValid = false;
        if (!validateRequired(areaField)) isFormValid = false;

        // If form is valid, trigger simulated submission and animation
        if (isFormValid) {
            // Assemble lead data for simulated integration
            const leadData = {
                nombre: nameField.value.trim(),
                empresa: companyField.value.trim(),
                correo: emailField.value.trim(),
                areaAyuda: areaField.value,
                fechaEnvio: new Date().toISOString()
            };

            console.log('Simulated Lead Submission Success (ARSM B2B CRM):', leadData);

            // Animate transition to success block
            form.style.opacity = '0';
            setTimeout(() => {
                form.setAttribute('hidden', 'true');
                formSuccess.removeAttribute('hidden');
                formSuccess.style.opacity = '0';
                formSuccess.style.transition = 'opacity 0.4s ease';
                
                // Allow layout engine to register hidden state before fading in
                setTimeout(() => {
                    formSuccess.style.opacity = '1';
                }, 50);

                form.reset();
            }, 300);
        }
    });

    // Live validation check on input event
    form.querySelectorAll('input, select').forEach(input => {
        input.addEventListener('input', () => {
            clearFieldError(input);
        });

        input.addEventListener('blur', () => {
            if (input.name === 'email') {
                validateEmail(input);
            } else {
                validateRequired(input);
            }
        });
    });
}

// Validation helpers
function validateRequired(input) {
    if (!input.value || input.value.trim() === '') {
        setFieldError(input);
        return false;
    }
    clearFieldError(input);
    return true;
}

function validateEmail(input) {
    if (!validateRequired(input)) return false;
    
    // Simple standard email regex
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(input.value.trim())) {
        setFieldError(input);
        return false;
    }
    clearFieldError(input);
    return true;
}

function setFieldError(input) {
    const group = input.closest('.form-group');
    if (group) {
        group.classList.add('invalid');
    }
}

function clearFieldError(input) {
    const group = input.closest('.form-group');
    if (group) {
        group.classList.remove('invalid');
    }
}
