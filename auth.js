// ArcadeZone - Authentication System

class AuthSystem {
    constructor() {
        this.currentUser = null;
        this.users = this.loadUsers();
        this.init();
    }

    init() {
        this.checkExistingSession();
        this.bindEvents();
        this.updateNavigation();
    }

    // User Management
    loadUsers() {
        const stored = localStorage.getItem('arcadezone-users');
        return stored ? JSON.parse(stored) : [];
    }

    saveUsers() {
        localStorage.setItem('arcadezone-users', JSON.stringify(this.users));
    }

    createUser(userData) {
        const user = {
            id: Date.now().toString(),
            username: userData.username,
            email: userData.email,
            password: userData.password, // In real app, this would be hashed
            createdAt: new Date().toISOString(),
            games: [],
            preferences: {
                theme: 'dark',
                notifications: true
            }
        };

        this.users.push(user);
        this.saveUsers();
        return user;
    }

    findUser(identifier) {
        return this.users.find(user => 
            user.email === identifier || user.username === identifier
        );
    }

    // Authentication
    register(userData) {
        // Validation
        if (!userData.username || userData.username.length < 3) {
            throw new Error('Username must be at least 3 characters long');
        }

        if (!userData.email || !this.isValidEmail(userData.email)) {
            throw new Error('Please enter a valid email address');
        }

        if (!userData.password || userData.password.length < 6) {
            throw new Error('Password must be at least 6 characters long');
        }

        if (userData.password !== userData.confirmPassword) {
            throw new Error('Passwords do not match');
        }

        if (this.findUser(userData.email)) {
            throw new Error('Email address is already registered');
        }

        if (this.users.find(user => user.username === userData.username)) {
            throw new Error('Username is already taken');
        }

        const user = this.createUser(userData);
        this.login(user.email, userData.password);
        return user;
    }

    login(identifier, password, rememberMe = false) {
        const user = this.findUser(identifier);
        
        if (!user) {
            throw new Error('Invalid email/username or password');
        }

        if (user.password !== password) {
            throw new Error('Invalid email/username or password');
        }

        this.currentUser = user;
        this.createSession(rememberMe);
        this.updateNavigation();
        return user;
    }

    logout() {
        this.currentUser = null;
        this.clearSession();
        this.updateNavigation();
    }

    // Session Management
    createSession(rememberMe = false) {
        const session = {
            userId: this.currentUser.id,
            loginTime: new Date().toISOString(),
            rememberMe: rememberMe
        };

        localStorage.setItem('arcadezone-session', JSON.stringify(session));
    }

    clearSession() {
        localStorage.removeItem('arcadezone-session');
    }

    checkExistingSession() {
        const session = localStorage.getItem('arcadezone-session');
        if (session) {
            const sessionData = JSON.parse(session);
            const user = this.users.find(u => u.id === sessionData.userId);
            if (user) {
                this.currentUser = user;
                return true;
            }
        }
        return false;
    }

    // UI Updates
    updateNavigation() {
        const navContainer = document.getElementById('auth-nav-container');
        if (!navContainer) return;

        if (this.currentUser) {
            navContainer.innerHTML = this.getLoggedInNav();
            this.bindUserDropdown();
        } else {
            navContainer.innerHTML = this.getLoggedOutNav();
        }
    }

    getLoggedOutNav() {
        return `
            <div class="flex items-center space-x-4">
                <button id="login-btn" class="nav-link font-semibold">Login</button>
                <button id="signup-btn" class="btn-primary px-4 py-2 rounded-lg font-bold">Sign Up</button>
            </div>
        `;
    }

    getLoggedInNav() {
        return `
            <div class="relative">
                <button id="user-dropdown-btn" class="flex items-center space-x-2 nav-link font-semibold">
                    <div class="w-8 h-8 bg-orange rounded-full flex items-center justify-center text-black font-bold text-sm">
                        ${this.currentUser.username.charAt(0).toUpperCase()}
                    </div>
                    <span>${this.currentUser.username}</span>
                    <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd"></path>
                    </svg>
                </button>
                
                <div id="user-dropdown" class="absolute right-0 mt-2 w-48 bg-black bg-opacity-95 border border-orange rounded-lg shadow-lg hidden z-50">
                    <div class="py-2">
                        <a href="#" class="block px-4 py-2 text-sm hover:bg-orange hover:text-black transition-colors">My Profile</a>
                        <a href="#" class="block px-4 py-2 text-sm hover:bg-orange hover:text-black transition-colors">My Games</a>
                        <a href="#" class="block px-4 py-2 text-sm hover:bg-orange hover:text-black transition-colors">Settings</a>
                        <hr class="border-gray-700 my-2">
                        <button id="logout-btn" class="block w-full text-left px-4 py-2 text-sm hover:bg-orange hover:text-black transition-colors">Logout</button>
                    </div>
                </div>
            </div>
        `;
    }

    bindUserDropdown() {
        const dropdownBtn = document.getElementById('user-dropdown-btn');
        const dropdown = document.getElementById('user-dropdown');
        const logoutBtn = document.getElementById('logout-btn');

        if (dropdownBtn && dropdown) {
            dropdownBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                dropdown.classList.toggle('hidden');
            });

            // Close dropdown when clicking outside
            document.addEventListener('click', () => {
                dropdown.classList.add('hidden');
            });
        }

        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => {
                this.logout();
                showNotification('Logged out successfully!', 'success');
            });
        }
    }

    // Modal Management
    showModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('hidden');
            document.body.style.overflow = 'hidden';
            
            // Animate modal in
            anime({
                targets: modal.querySelector('.modal-content'),
                scale: [0.8, 1],
                opacity: [0, 1],
                duration: 300,
                easing: 'easeOutQuad'
            });
        }
    }

    hideModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            // Animate modal out
            anime({
                targets: modal.querySelector('.modal-content'),
                scale: [1, 0.8],
                opacity: [1, 0],
                duration: 200,
                easing: 'easeInQuad',
                complete: () => {
                    modal.classList.add('hidden');
                    document.body.style.overflow = 'auto';
                }
            });
        }
    }

    // Event Binding
    bindEvents() {
        // Navigation buttons
        document.addEventListener('click', (e) => {
            if (e.target.id === 'login-btn') {
                this.showModal('login-modal');
            }
            if (e.target.id === 'signup-btn') {
                this.showModal('signup-modal');
            }
        });

        // Modal close buttons
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal-close') || 
                e.target.classList.contains('modal-overlay')) {
                const modal = e.target.closest('.modal');
                if (modal) {
                    this.hideModal(modal.id);
                }
            }
        });

        // Form submissions
        this.bindFormSubmissions();

        // Password visibility toggles
        this.bindPasswordToggles();

        // Modal switching
        this.bindModalSwitching();
    }

    bindFormSubmissions() {
        // Registration form
        const signupForm = document.getElementById('signup-form');
        if (signupForm) {
            signupForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleRegistration(e.target);
            });
        }

        // Login form
        const loginForm = document.getElementById('login-form');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleLogin(e.target);
            });
        }

        // Password reset form
        const resetForm = document.getElementById('reset-form');
        if (resetForm) {
            resetForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handlePasswordReset(e.target);
            });
        }
    }

    bindPasswordToggles() {
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('password-toggle')) {
                const input = e.target.previousElementSibling;
                if (input.type === 'password') {
                    input.type = 'text';
                    e.target.innerHTML = '👁️';
                } else {
                    input.type = 'password';
                    e.target.innerHTML = '👁️‍🗨️';
                }
            }
        });
    }

    bindModalSwitching() {
        document.addEventListener('click', (e) => {
            if (e.target.id === 'switch-to-signup') {
                this.hideModal('login-modal');
                setTimeout(() => this.showModal('signup-modal'), 200);
            }
            if (e.target.id === 'switch-to-login') {
                this.hideModal('signup-modal');
                setTimeout(() => this.showModal('login-modal'), 200);
            }
            if (e.target.id === 'forgot-password') {
                this.hideModal('login-modal');
                setTimeout(() => this.showModal('reset-modal'), 200);
            }
            if (e.target.id === 'back-to-login') {
                this.hideModal('reset-modal');
                setTimeout(() => this.showModal('login-modal'), 200);
            }
        });
    }

    // Form Handlers
    handleRegistration(form) {
        const formData = new FormData(form);
        const userData = {
            username: formData.get('username'),
            email: formData.get('email'),
            password: formData.get('password'),
            confirmPassword: formData.get('confirmPassword')
        };

        try {
            this.register(userData);
            this.hideModal('signup-modal');
            showNotification('Account created successfully! Welcome to ArcadeZone!', 'success');
        } catch (error) {
            showNotification(error.message, 'error');
        }
    }

    handleLogin(form) {
        const formData = new FormData(form);
        const identifier = formData.get('identifier');
        const password = formData.get('password');
        const rememberMe = formData.get('rememberMe') === 'on';

        try {
            this.login(identifier, password, rememberMe);
            this.hideModal('login-modal');
            showNotification(`Welcome back, ${this.currentUser.username}!`, 'success');
        } catch (error) {
            showNotification(error.message, 'error');
        }
    }

    handlePasswordReset(form) {
        const formData = new FormData(form);
        const email = formData.get('email');

        if (!email || !this.isValidEmail(email)) {
            showNotification('Please enter a valid email address', 'error');
            return;
        }

        const user = this.findUser(email);
        if (!user) {
            showNotification('If an account exists with this email, you will receive a password reset link.', 'info');
            return;
        }

        // Simulate sending reset email
        setTimeout(() => {
            this.hideModal('reset-modal');
            showNotification('Password reset link sent to your email!', 'success');
        }, 1000);
    }

    // Utility Functions
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Game Purchase Integration
    addGameToUser(gameId, gameName, price) {
        if (!this.currentUser) {
            this.showModal('login-modal');
            showNotification('Please login to purchase games', 'info');
            return false;
        }

        const existingGame = this.currentUser.games.find(game => game.id === gameId);
        if (existingGame) {
            showNotification('You already own this game!', 'info');
            return false;
        }

        this.currentUser.games.push({
            id: gameId,
            name: gameName,
            price: price,
            purchasedAt: new Date().toISOString()
        });

        this.saveUsers();
        return true;
    }

    isGameOwned(gameId) {
        if (!this.currentUser) return false;
        return this.currentUser.games.some(game => game.id === gameId);
    }
}

// Initialize auth system when DOM is loaded
let authSystem;

document.addEventListener('DOMContentLoaded', function() {
    authSystem = new AuthSystem();
});

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AuthSystem;
}