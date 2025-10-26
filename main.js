// ArcadeZone - Main JavaScript File

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initMobileMenu();
    initTypedText();
    initBannerCarousel();
    initGameBlocks();
    initStatsCounter();
    initParticleBackground();
    initScrollAnimations();
});

// Mobile Menu Toggle
function initMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', function() {
            mobileMenu.classList.toggle('hidden');
        });
    }
}

// Typed Text Animation
function initTypedText() {
    const typedElement = document.getElementById('typed-text');
    if (typedElement) {
        new Typed('#typed-text', {
            strings: [
                'WELCOME TO ARCADEZONE',
                'PLAY THE BEST GAMES',
                'EXPERIENCE GAMING MAGIC',
                'JOIN THE ADVENTURE'
            ],
            typeSpeed: 50,
            backSpeed: 30,
            backDelay: 2000,
            loop: true,
            showCursor: true,
            cursorChar: '|'
        });
    }
}

// Banner Carousel
function initBannerCarousel() {
    const bannerCarousel = document.getElementById('banner-carousel');
    if (bannerCarousel) {
        new Splide('#banner-carousel', {
            type: 'loop',
            autoplay: true,
            interval: 4000,
            pauseOnHover: true,
            arrows: true,
            pagination: true,
            speed: 1000,
            easing: 'cubic-bezier(0.25, 1, 0.5, 1)',
            breakpoints: {
                768: {
                    arrows: false,
                }
            }
        }).mount();
    }
}

// Game Block Interactions
function initGameBlocks() {
    const gameBlocks = document.querySelectorAll('.game-block');
    const playButtons = document.querySelectorAll('.play-button');
    
    // Make entire game block clickable
    gameBlocks.forEach(block => {
        const href = block.getAttribute('data-href');
        if (href) {
            block.addEventListener('click', function(e) {
                // Don't trigger if clicking the play button directly (it has its own link)
                if (!e.target.closest('.play-button')) {
                    window.location.href = href;
                }
            });
        }
    });
    
    // Add hover effects with Anime.js
    gameBlocks.forEach((block, index) => {
        block.addEventListener('mouseenter', function() {
            anime({
                targets: this,
                scale: 1.05,
                rotateX: 5,
                rotateY: 5,
                duration: 300,
                easing: 'easeOutQuad'
            });
        });
        
        block.addEventListener('mouseleave', function() {
            anime({
                targets: this,
                scale: 1,
                rotateX: 0,
                rotateY: 0,
                duration: 300,
                easing: 'easeOutQuad'
            });
        });
    });
    
    // Play button interactions
    playButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            // If it's a link with href, let it navigate
            if (this.tagName === 'A' && this.getAttribute('href')) {
                // Don't prevent default, let the link work
                return;
            }
            
            e.preventDefault();
            
            // Button animation
            anime({
                targets: this,
                scale: [1, 1.2, 1],
                duration: 300,
                easing: 'easeOutElastic(1, .8)'
            });
            
            // Show loading message
            showGameLoading(this);
        });
    });
}

// Show Game Loading Animation
function showGameLoading(button) {
    const originalText = button.textContent;
    button.textContent = 'LOADING...';
    button.disabled = true;
    
    // Create loading particles
    const particles = [];
    for (let i = 0; i < 5; i++) {
        const particle = document.createElement('div');
        particle.style.cssText = `
            position: absolute;
            width: 4px;
            height: 4px;
            background: #ff6b35;
            border-radius: 50%;
            pointer-events: none;
            z-index: 1000;
        `;
        document.body.appendChild(particle);
        particles.push(particle);
        
        anime({
            targets: particle,
            translateX: anime.random(-100, 100),
            translateY: anime.random(-100, 100),
            scale: [0, 1, 0],
            opacity: [1, 0],
            duration: 1000,
            delay: i * 100,
            easing: 'easeOutQuad',
            complete: function() {
                document.body.removeChild(particle);
            }
        });
    }
    
    // Simulate game loading
    setTimeout(() => {
        button.textContent = originalText;
        button.disabled = false;
        
        // Show success message
        showNotification('Game launched successfully!', 'success');
    }, 2000);
}

// Stats Counter Animation
function initStatsCounter() {
    const stats = [
        { id: 'games-count', target: 150 },
        { id: 'players-count', target: 50000 },
        { id: 'hours-count', target: 1000000 }
    ];
    
    // Animate counters when they come into view
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                stats.forEach(stat => {
                    animateCounter(stat.id, stat.target);
                });
                observer.unobserve(entry.target);
            }
        });
    });
    
    const statsSection = document.querySelector('.stats-card').parentElement.parentElement;
    if (statsSection) {
        observer.observe(statsSection);
    }
}

// Animate Counter
function animateCounter(elementId, target) {
    const element = document.getElementById(elementId);
    if (!element) return;
    
    anime({
        targets: { count: 0 },
        count: target,
        duration: 2000,
        easing: 'easeOutQuad',
        update: function(anim) {
            const value = Math.floor(anim.animatables[0].target.count);
            element.textContent = value.toLocaleString();
        }
    });
}

// Particle Background System
function initParticleBackground() {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const particlesContainer = document.getElementById('particles');
    
    if (!particlesContainer) return;
    
    particlesContainer.appendChild(canvas);
    
    let particles = [];
    const particleCount = 50;
    
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    
    function createParticle() {
        return {
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * 0.5,
            vy: (Math.random() - 0.5) * 0.5,
            size: Math.random() * 3 + 1,
            opacity: Math.random() * 0.5 + 0.2,
            color: Math.random() > 0.5 ? '#ff6b35' : '#4a7c59'
        };
    }
    
    function initParticles() {
        particles = [];
        for (let i = 0; i < particleCount; i++) {
            particles.push(createParticle());
        }
    }
    
    function updateParticles() {
        particles.forEach(particle => {
            particle.x += particle.vx;
            particle.y += particle.vy;
            
            if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
            if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;
        });
    }
    
    function drawParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach(particle => {
            ctx.save();
            ctx.globalAlpha = particle.opacity;
            ctx.fillStyle = particle.color;
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        });
    }
    
    function animate() {
        updateParticles();
        drawParticles();
        requestAnimationFrame(animate);
    }
    
    // Initialize
    resizeCanvas();
    initParticles();
    animate();
    
    // Handle window resize
    window.addEventListener('resize', () => {
        resizeCanvas();
        initParticles();
    });
}

// Scroll Animations
function initScrollAnimations() {
    // Animate elements as they come into view
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
    
    // Observe game blocks
    const gameBlocks = document.querySelectorAll('.game-block');
    gameBlocks.forEach((block, index) => {
        block.style.opacity = '0';
        block.style.transform = 'translateY(30px)';
        block.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
        observer.observe(block);
    });
    
    // Observe stats cards
    const statsCards = document.querySelectorAll('.stats-card');
    statsCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = `opacity 0.6s ease ${index * 0.2}s, transform 0.6s ease ${index * 0.2}s`;
        observer.observe(card);
    });
}

// Notification System
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `fixed top-20 right-4 z-50 p-4 rounded-lg shadow-lg max-w-sm transform translate-x-full transition-transform duration-300`;
    
    // Set notification style based on type
    switch (type) {
        case 'success':
            notification.classList.add('bg-green-600', 'text-white');
            break;
        case 'error':
            notification.classList.add('bg-red-600', 'text-white');
            break;
        default:
            notification.classList.add('bg-blue-600', 'text-white');
    }
    
    notification.innerHTML = `
        <div class="flex items-center justify-between">
            <span class="font-semibold">${message}</span>
            <button class="ml-4 text-white hover:text-gray-200" onclick="this.parentElement.parentElement.remove()">
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path>
                </svg>
            </button>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(full)';
        setTimeout(() => {
            if (notification.parentElement) {
                notification.parentElement.removeChild(notification);
            }
        }, 300);
    }, 5000);
}

// Smooth scrolling for navigation links
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

// Add loading state management
window.addEventListener('beforeunload', function() {
    document.body.classList.add('loading');
});

// Performance optimization: Lazy load images
function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// Initialize lazy loading when DOM is ready
document.addEventListener('DOMContentLoaded', initLazyLoading);