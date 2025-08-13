class KissApp {
    constructor() {
        this.currentPage = 'home';
        this.pages = ['home', 'about', 'services', 'portfolio', 'contact'];
        this.isLoading = false;
        this.theme = localStorage.getItem('theme') || 'light';
        
        this.init();
    }

    init() {
        this.initTheme();
        this.hideLoadingScreen();
        this.setupEventListeners();
        this.loadPage('home', false);
        this.setupBackgroundAnimation();
    }

    initTheme() {
        document.documentElement.setAttribute('data-theme', this.theme);
        const themeIcon = document.querySelector('#theme-toggle i');
        if (themeIcon) {
            themeIcon.className = this.theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
        }
    }

    hideLoadingScreen() {
        setTimeout(() => {
            const loadingScreen = document.getElementById('loading-screen');
            if (loadingScreen) {
                loadingScreen.style.opacity = '0';
                setTimeout(() => {
                    loadingScreen.style.display = 'none';
                }, 500);
            }
        }, 1500);
    }

    setupEventListeners() {
        // Navigation links
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const page = e.currentTarget.getAttribute('data-page');
                if (page && page !== this.currentPage) {
                    this.loadPage(page);
                }
            });
        });

        // Mobile menu toggle
        const hamburger = document.querySelector('.hamburger');
        const navMenu = document.querySelector('.nav-menu');
        
        if (hamburger && navMenu) {
            hamburger.addEventListener('click', () => {
                hamburger.classList.toggle('active');
                navMenu.classList.toggle('active');
            });

            // Close mobile menu when clicking on a link
            document.querySelectorAll('.nav-link').forEach(link => {
                link.addEventListener('click', () => {
                    hamburger.classList.remove('active');
                    navMenu.classList.remove('active');
                });
            });
        }

        // Theme toggle
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => {
                this.toggleTheme();
            });
        }

        // Handle browser back/forward
        window.addEventListener('popstate', (e) => {
            if (e.state && e.state.page) {
                this.loadPage(e.state.page, false);
            }
        });

        // Smooth scrolling for anchor links
        document.addEventListener('click', (e) => {
            if (e.target.matches('a[href^="#"]')) {
                e.preventDefault();
                const targetId = e.target.getAttribute('href').substring(1);
                const targetElement = document.getElementById(targetId);
                if (targetElement) {
                    targetElement.scrollIntoView({ behavior: 'smooth' });
                }
            }
        });
    }

    async loadPage(pageName, pushState = true) {
        if (this.isLoading || !this.pages.includes(pageName)) {
            return;
        }

        this.isLoading = true;
        const pageContent = document.getElementById('page-content');
        
        // Add exit animation
        pageContent.classList.remove('loaded');
        pageContent.classList.add('page-exit');

        try {
            // Wait for exit animation
            await this.delay(200);

            // Fetch page content
            const response = await fetch(`pages/${pageName}.html`);
            if (!response.ok) {
                throw new Error(`Failed to load page: ${response.status}`);
            }
            
            const content = await response.text();
            
            // Update content
            pageContent.innerHTML = content;
            
            // Update active navigation
            this.updateActiveNav(pageName);
            
            // Update page state
            this.currentPage = pageName;
            
            // Update browser history
            if (pushState) {
                history.pushState({ page: pageName }, '', `#${pageName}`);
            }
            
            // Add enter animation
            pageContent.classList.remove('page-exit');
            pageContent.classList.add('loaded');
            
            // Initialize page-specific functionality
            this.initPageFeatures();
            
            // Scroll to top
            window.scrollTo({ top: 0, behavior: 'smooth' });
            
        } catch (error) {
            console.error('Error loading page:', error);
            pageContent.innerHTML = `
                <div class="container">
                    <div class="section text-center">
                        <h2>Oops! Something went wrong</h2>
                        <p>We couldn't load the requested page. Please try again.</p>
                        <button onclick="kissApp.loadPage('home')" class="btn-primary" style="margin-top: 20px;">Go Home</button>
                    </div>
                </div>
            `;
            pageContent.classList.add('loaded');
        }
        
        this.isLoading = false;
    }

    updateActiveNav(pageName) {
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });
        
        const activeLink = document.querySelector(`[data-page="${pageName}"]`);
        if (activeLink) {
            activeLink.classList.add('active');
        }
    }

    initPageFeatures() {
        // Initialize contact form
        const contactForm = document.getElementById('contact-form');
        if (contactForm) {
            contactForm.addEventListener('submit', this.handleContactForm.bind(this));
        }

        // Initialize portfolio filters
        const portfolioFilters = document.querySelectorAll('.portfolio-filter');
        if (portfolioFilters.length > 0) {
            portfolioFilters.forEach(filter => {
                filter.addEventListener('click', this.handlePortfolioFilter.bind(this));
            });
        }

        // Animate elements on scroll
        this.setupScrollAnimations();
    }

    handleContactForm(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData.entries());
        
        // Simulate form submission
        this.showNotification('Thank you for your message! We\'ll get back to you soon.', 'success');
        e.target.reset();
    }

    handlePortfolioFilter(e) {
        e.preventDefault();
        const filter = e.target.getAttribute('data-filter');
        
        // Update active filter
        document.querySelectorAll('.portfolio-filter').forEach(f => f.classList.remove('active'));
        e.target.classList.add('active');
        
        // Filter portfolio items
        const items = document.querySelectorAll('.portfolio-item');
        items.forEach(item => {
            if (filter === 'all' || item.classList.contains(filter)) {
                item.style.display = 'block';
                item.style.animation = 'fadeIn 0.5s ease';
            } else {
                item.style.display = 'none';
            }
        });
    }

    setupScrollAnimations() {
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

        // Observe animated elements
        document.querySelectorAll('.card, .section-header, .hero-content').forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(el);
        });
    }

    toggleTheme() {
        this.theme = this.theme === 'light' ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', this.theme);
        localStorage.setItem('theme', this.theme);
        
        const themeIcon = document.querySelector('#theme-toggle i');
        if (themeIcon) {
            themeIcon.className = this.theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
        }
        
        this.showNotification(`Switched to ${this.theme} mode`, 'info');
    }

    setupBackgroundAnimation() {
        // Add mouse move effect to floating shapes
        document.addEventListener('mousemove', (e) => {
            const shapes = document.querySelectorAll('.shape');
            const mouseX = e.clientX / window.innerWidth;
            const mouseY = e.clientY / window.innerHeight;
            
            shapes.forEach((shape, index) => {
                const speed = (index + 1) * 0.5;
                const x = (mouseX - 0.5) * speed * 20;
                const y = (mouseY - 0.5) * speed * 20;
                
                shape.style.transform = `translate(${x}px, ${y}px)`;
            });
        });
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check' : type === 'error' ? 'exclamation' : 'info'}-circle"></i>
            <span>${message}</span>
        `;
        
        // Add notification styles if not already added
        if (!document.getElementById('notification-styles')) {
            const styles = document.createElement('style');
            styles.id = 'notification-styles';
            styles.textContent = `
                .notification {
                    position: fixed;
                    top: 100px;
                    right: 20px;
                    background: var(--surface-color);
                    color: var(--text-primary);
                    padding: 15px 20px;
                    border-radius: 12px;
                    box-shadow: 0 10px 30px var(--shadow-medium);
                    border-left: 4px solid var(--primary-color);
                    z-index: 9999;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    transform: translateX(400px);
                    transition: transform 0.3s ease;
                }
                .notification-success { border-left-color: #10b981; }
                .notification-error { border-left-color: #ef4444; }
                .notification-info { border-left-color: var(--primary-color); }
                .notification.show { transform: translateX(0); }
            `;
            document.head.appendChild(styles);
        }
        
        document.body.appendChild(notification);
        
        // Show notification
        setTimeout(() => notification.classList.add('show'), 100);
        
        // Hide and remove notification
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.kissApp = new KissApp();
});

// Add some additional utility functions
window.scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
};

window.preloadPages = () => {
    const pages = ['about', 'services', 'portfolio', 'contact'];
    pages.forEach(page => {
        fetch(`pages/${page}.html`).catch(err => 
            console.log(`Preload failed for ${page}:`, err)
        );
    });
};

// Preload pages after initial load
setTimeout(window.preloadPages, 2000);
