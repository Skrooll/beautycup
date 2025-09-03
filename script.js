// FAQ Toggle Functionality
document.addEventListener('DOMContentLoaded', function() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    console.log('FAQ items found:', faqItems.length); // Debug info
    
    faqItems.forEach((item, index) => {
        const question = item.querySelector('.faq-question');
        
        if (question) {
            question.addEventListener('click', () => {
                console.log(`FAQ item ${index + 1} clicked`); // Debug info
                
                // Close other FAQ items
                faqItems.forEach((otherItem, otherIndex) => {
                    if (otherItem !== item) {
                        otherItem.classList.remove('active');
                        console.log(`FAQ item ${otherIndex + 1} closed`); // Debug info
                    }
                });
                
                // Toggle current item
                item.classList.toggle('active');
                const isActive = item.classList.contains('active');
                console.log(`FAQ item ${index + 1} ${isActive ? 'opened' : 'closed'}`); // Debug info
            });
        } else {
            console.error(`FAQ question not found for item ${index + 1}`);
        }
    });
    
    // Form submission
    const registrationForm = document.getElementById('registrationForm');
    
    registrationForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(registrationForm);
        const data = Object.fromEntries(formData);
        
        // Basic validation
        if (!data.name || !data.telegram || !data.tft_nick || !data.email || !data.rank) {
            alert('Пожалуйста, заполните все обязательные поля');
            return;
        }
        
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.email)) {
            alert('Пожалуйста, введите корректный email адрес');
            return;
        }
        
        // Telegram username validation
        if (!data.telegram.startsWith('@')) {
            data.telegram = '@' + data.telegram;
        }
        
        // Form submission
        const submitBtn = registrationForm.querySelector('.cta-button');
        const originalText = submitBtn.textContent;
        
        submitBtn.textContent = 'Отправляем...';
        submitBtn.disabled = true;
        
        // For testing: simulate form submission on localhost
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
            // Local development - simulate submission
            setTimeout(() => {
                alert('Спасибо за регистрацию! Мы свяжемся с вами в ближайшее время.');
                registrationForm.reset();
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }, 1500);
            return;
        }
        
        // Send data to Google Apps Script
        fetch('https://script.google.com/macros/s/AKfycbwRYmaXNvduFX9EW3u2VBL5TjJGHP5ocJk_OQdGh9PlX-BZNGt4o3NOX5gz2QIlJFZd/exec', {
            method: 'POST',
            mode: 'no-cors',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams(data)
        })
        .then(() => {
            // Since we're using no-cors, we can't read the response
            // But we can assume success if no error was thrown
            alert('Спасибо за регистрацию! Проверьте ваш email для подтверждения.');
            registrationForm.reset();
        })
        .catch(error => {
            console.error('Ошибка:', error);
            // Fallback: try alternative method
            sendFormAlternative(data);
        })
        .finally(() => {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        });
    });
    
    // Alternative form submission method
    function sendFormAlternative(data) {
        // Create a hidden form and submit it
        const form = document.createElement('form');
        form.method = 'POST';
        form.action = 'https://script.google.com/macros/s/AKfycbwRYmaXNvduFX9EW3u2VBL5TjJGHP5ocJk_OQdGh9PlX-BZNGt4o3NOX5gz2QIlJFZd/exec';
        form.target = '_blank';
        form.style.display = 'none';
        
        // Add form fields
        Object.keys(data).forEach(key => {
            const input = document.createElement('input');
            input.type = 'hidden';
            input.name = key;
            input.value = data[key];
            form.appendChild(input);
        });
        
        // Submit form
        document.body.appendChild(form);
        form.submit();
        document.body.removeChild(form);
        
        alert('Спасибо за регистрацию! Проверьте ваш email для подтверждения.');
        registrationForm.reset();
    }
    
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Add scroll effect to hero section
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const hero = document.querySelector('.hero');
        if (hero) {
            hero.style.transform = `translateY(${scrolled * 0.5}px)`;
        }
    });
    
    // Add intersection observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    document.querySelectorAll('.faq-item, .registration-form').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});
