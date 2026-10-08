/* ==========================================================================
   Moaz Amr Portfolio JavaScript Logic
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Mobile Menu Toggle
    const mobileToggle = document.querySelector('.mobile-toggle');
    const menuGroup = document.querySelector('.module-group.right');

    if (mobileToggle && menuGroup) {
        mobileToggle.addEventListener('click', () => {
            menuGroup.classList.toggle('active');
            const icon = mobileToggle.querySelector('i');
            if (icon.classList.contains('fa-bars')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-xmark');
            } else {
                icon.classList.remove('fa-xmark');
                icon.classList.add('fa-bars');
            }
        });

        // Close menu when clicking link
        const menuLinks = document.querySelectorAll('.menu-item a');
        menuLinks.forEach(link => {
            link.addEventListener('click', () => {
                menuGroup.classList.remove('active');
                const icon = mobileToggle.querySelector('i');
                icon.classList.remove('fa-xmark');
                icon.classList.add('fa-bars');
            });
        });
    }

    // 2. Interactive Tab Switching (Skills / Experience / Certifications)
    const tabTexts = document.querySelectorAll('.nav-item__text');
    const tabPanes = document.querySelectorAll('.tab-pane');

    tabTexts.forEach(tab => {
        tab.addEventListener('click', () => {
            // Remove active classes
            tabTexts.forEach(t => t.classList.remove('active'));
            tabPanes.forEach(pane => pane.classList.remove('active-content'));

            // Add active class to clicked tab
            tab.classList.add('active');

            // Find matching tab pane
            const tabId = tab.getAttribute('data-tab');
            const matchingPane = document.getElementById(tabId);
            if (matchingPane) {
                matchingPane.classList.add('active-content');
            }
        });
    });

    // 3. Project Grid Filtering
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectItems = document.querySelectorAll('.project-item');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Active button state
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            projectItems.forEach(item => {
                const category = item.getAttribute('data-category');
                
                // Animate showing/hiding
                if (filterValue === 'all' || category === filterValue) {
                    item.style.display = 'flex';
                    // Trigger reflow
                    item.offsetHeight; 
                    item.style.opacity = '1';
                    item.style.transform = 'translateY(0)';
                } else {
                    item.style.opacity = '0';
                    item.style.transform = 'translateY(15px)';
                    // Hide after animation finishes
                    setTimeout(() => {
                        if (btn.getAttribute('data-filter') !== 'all' && category !== btn.getAttribute('data-filter')) {
                            item.style.display = 'none';
                        }
                    }, 250);
                }
            });
        });
    });

    // 4. Testimonials Slider
    const testimonialItems = document.querySelectorAll('.testimonial-item');
    const dotBtns = document.querySelectorAll('.button-dot');
    let currentSlide = 0;
    let slideInterval;

    function showSlide(index) {
        testimonialItems.forEach(item => item.classList.remove('active'));
        dotBtns.forEach(dot => dot.classList.remove('active'));

        testimonialItems[index].classList.add('active');
        dotBtns[index].classList.add('active');
        currentSlide = index;
    }

    function nextSlide() {
        let nextIndex = (currentSlide + 1) % testimonialItems.length;
        showSlide(nextIndex);
    }

    function startSlideShow() {
        slideInterval = setInterval(nextSlide, 5000); // Change testimonial every 5 seconds
    }

    function resetSlideShow() {
        clearInterval(slideInterval);
        startSlideShow();
    }

    // Dot button click handlers
    dotBtns.forEach((dot, idx) => {
        dot.addEventListener('click', () => {
            showSlide(idx);
            resetSlideShow();
        });
    });

    // Start auto slider if elements exist
    if (testimonialItems.length > 0) {
        startSlideShow();
    }

    // 5. Philosophy Text Animation Loop
    const phrases = document.querySelectorAll('.text-animation-container .phrase');
    let currentPhraseIdx = 0;

    function animatePhrases() {
        if (phrases.length <= 1) return;

        setInterval(() => {
            phrases[currentPhraseIdx].classList.remove('active');
            currentPhraseIdx = (currentPhraseIdx + 1) % phrases.length;
            phrases[currentPhraseIdx].classList.add('active');
        }, 4000); // Change phrase every 4 seconds
    }

    if (phrases.length > 0) {
        animatePhrases();
    }

    // 6. Contact Form Submission Handling
    const contactForm = document.getElementById('portfolio-contact-form');
    const feedbackMessage = document.querySelector('.form-feedback-message');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Change button state to loading
            const submitBtn = contactForm.querySelector('.wpcf7-submit-btn');
            const originalBtnText = submitBtn.textContent;
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;

            // Extract form values
            const formData = new FormData(contactForm);
            const name = formData.get('your-name');
            const email = formData.get('your-email');

            // Send actual email using Web3Forms
            const object = Object.fromEntries(formData);
            const json = JSON.stringify(object);

            fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: json
            })
            .then(async (response) => {
                let res = await response.json();
                if (response.status === 200) {
                    // Success
                    feedbackMessage.style.display = 'block';
                    feedbackMessage.className = 'form-feedback-message success';
                    feedbackMessage.textContent = `Thank you, ${name}! Your message has been sent to my email.`;
                    contactForm.reset();
                } else {
                    // Error from API (e.g. invalid key)
                    feedbackMessage.style.display = 'block';
                    feedbackMessage.className = 'form-feedback-message error';
                    feedbackMessage.textContent = res.message || "Error submitting message. Please check the access key.";
                }
            })
            .catch(error => {
                feedbackMessage.style.display = 'block';
                feedbackMessage.className = 'form-feedback-message error';
                feedbackMessage.textContent = "Network error. Please check your internet connection.";
            })
            .then(() => {
                submitBtn.textContent = originalBtnText;
                submitBtn.disabled = false;
                setTimeout(() => {
                    if (feedbackMessage) {
                        feedbackMessage.style.display = 'none';
                    }
                }, 6000);
            });
        });
    }
});
