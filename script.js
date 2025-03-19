document.addEventListener('DOMContentLoaded', () => {
    // Theme Toggle Functionality
    const themeToggle = document.getElementById('themeToggle');
    const html = document.documentElement;
    
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme') || 'dark';
    html.setAttribute('data-theme', savedTheme);

    themeToggle.addEventListener('click', () => {
        const currentTheme = html.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        html.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    });

    // Section Animations
    const sections = document.querySelectorAll('.section');
    const container = document.querySelector('.container');

    const observerOptions = {
        root: container,
        threshold: 0.5,
        rootMargin: '0px'
    };

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                // Animate skill tags when about section is visible
                if (entry.target.id === 'about') {
                    const skillTags = entry.target.querySelectorAll('.skill-tags span');
                    skillTags.forEach((tag, index) => {
                        tag.style.animationDelay = `${index * 0.1}s`;
                    });
                }
                // Animate project cards when projects section is visible
                if (entry.target.id === 'projects') {
                    const projectCards = entry.target.querySelectorAll('.project-card');
                    projectCards.forEach((card, index) => {
                        card.style.animationDelay = `${index * 0.2}s`;
                    });
                }
            } else {
                entry.target.classList.remove('active');
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        sectionObserver.observe(section);
    });

    // Horizontal Scrolling and Navigation
    const navDots = document.querySelectorAll('.nav-dot');
    let currentSection = 0;
    let isScrolling = false;

    // Handle wheel scrolling
    container.addEventListener('wheel', (e) => {
        e.preventDefault();
        if (!isScrolling) {
            isScrolling = true;
            const direction = e.deltaY > 0 ? 1 : -1;
            scroll(direction);
        }
    });

    // Handle touch events for mobile
    let touchStartX = 0;
    let touchEndX = 0;

    container.addEventListener('touchstart', (e) => {
        touchStartX = e.touches[0].clientX;
    });

    container.addEventListener('touchmove', (e) => {
        e.preventDefault();
    });

    container.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].clientX;
        const direction = touchStartX > touchEndX ? 1 : -1;
        scroll(direction);
    });

    // Scroll function
    function scroll(direction) {
        const nextSection = currentSection + direction;
        if (nextSection >= 0 && nextSection < sections.length) {
            currentSection = nextSection;
            container.scrollTo({
                left: sections[currentSection].offsetLeft,
                behavior: 'smooth'
            });
            updateNavDots();
        }
        setTimeout(() => {
            isScrolling = false;
        }, 1000);
    }

    // Navigation dots click handling
    navDots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            currentSection = index;
            container.scrollTo({
                left: sections[currentSection].offsetLeft,
                behavior: 'smooth'
            });
            updateNavDots();
        });
    });

    // Update navigation dots
    function updateNavDots() {
        navDots.forEach((dot, index) => {
            if (index === currentSection) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
    }

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
            scroll(1);
        } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
            scroll(-1);
        }
    });

    // Smooth scroll for navigation
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            if (targetSection) {
                targetSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // Mouse move parallax effect for profile image
    const profileImage = document.querySelector('.profile-image');
    const maxRotate = 5; // Maximum rotation in degrees

    document.addEventListener('mousemove', (e) => {
        if (!profileImage) return;
        
        const x = e.clientX / window.innerWidth - 0.5;
        const y = e.clientY / window.innerHeight - 0.5;
        
        profileImage.style.transform = `
            translateX(-50%)
            rotateY(${x * maxRotate}deg)
            rotateX(${-y * maxRotate}deg)
        `;
    });

    // Reset profile image transform on mouse leave
    document.addEventListener('mouseleave', () => {
        if (!profileImage) return;
        profileImage.style.transform = 'translateX(-50%)';
    });

    // Initial navigation dot state
    updateNavDots();
});
