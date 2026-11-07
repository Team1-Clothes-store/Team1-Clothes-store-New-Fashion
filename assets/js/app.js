/**
 * New Fashion - Main Application Core & Router
 */

const App = (function() {
    let currentView = 'home';

    function init() {
        bindEvents();
        updateAuthUI();
        updateCartBadge();
        Store.renderFeaturedGrid();
        Store.renderProductsView();
        updateCategoryNav();

        // Listen for internal events
        window.addEventListener('auth-changed', () => {
            updateAuthUI();
            if (currentView === 'orders') Orders.renderOrdersView();
            if (currentView === 'admin' && !Auth.isAdmin()) navigateTo('home');
        });

        window.addEventListener('cart-updated', () => {
            updateCartBadge();
            renderCartDrawer();
            if (currentView === 'checkout') Checkout.renderCheckoutSummary();
        });

        // Check for URL hash or default to home
        const hash = window.location.hash.replace('#', '') || 'home';
        navigateTo(hash);
    }

    function bindEvents() {
        // Global search input
        const searchInput = document.getElementById('global-search-input');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                Store.setSearch(e.target.value);
                if (currentView !== 'products') {
                    navigateTo('products');
                }
            });
        }

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                closeAllModals();
            }
            if (document.getElementById('presentation-modal')?.classList.contains('active')) {
                if (e.key === 'ArrowRight') Presentation.nextSlide();
                if (e.key === 'ArrowLeft') Presentation.prevSlide();
            }
        });
    }

    function navigateTo(viewName) {
        currentView = viewName;
        window.location.hash = viewName;

        // Hide all views
        document.querySelectorAll('.view-section').forEach(sec => {
            sec.style.display = 'none';
        });

        // Show targeted view
        const target = document.getElementById(`view-${viewName}`);
        if (target) {
            target.style.display = 'block';
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }

        // View-specific initializations
        if (viewName === 'home') {
            Store.renderFeaturedGrid();
        } else if (viewName === 'products') {
            Store.renderProductsView();
        } else if (viewName === 'checkout') {
            Checkout.initCheckoutView();
        } else if (viewName === 'orders') {
            Orders.renderOrdersView();
        } else if (viewName === 'admin') {
            Admin.initAdminPanel();
        }

        // Update active nav link
        document.querySelectorAll('.nav-link').forEach(link => {
            if (link.dataset.view === viewName) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }

    function updateCategoryNav() {
        const categories = DB.getCategories();
        const pillsContainer = document.getElementById('category-filter-pills');
        const headerCatMenu = document.getElementById('nav-categories-dropdown');

        if (pillsContainer) {
            pillsContainer.innerHTML = `
                <button class="cat-pill active" data-cat="all" onclick="App.filterByCategory(null, this)">All Streetwear</button>
                ${categories.map(c => `
                    <button class="cat-pill" data-cat="${c.category_id}" onclick="App.filterByCategory(${c.category_id}, this)">${c.name}</button>
                `).join('')}
            `;
        }

        if (headerCatMenu) {
            headerCatMenu.innerHTML = categories.map(c => `
                <a href="#products" class="dropdown-item" onclick="App.filterByCategory(${c.category_id})">${c.name}</a>
            `).join('');
        }
    }

    function filterByCategory(catId, btnElement) {
        if (btnElement) {
            document.querySelectorAll('.cat-pill').forEach(p => p.classList.remove('active'));
            btnElement.classList.add('active');
        }
        Store.setCategory(catId);
        navigateTo('products');
    }

    // --- AUTH UI & MODAL ---
    function updateAuthUI() {
        const user = Auth.getCurrentUser();
        const userBtnText = document.getElementById('nav-user-label');
        const adminBtn = document.getElementById('nav-admin-link');
        const guestActions = document.getElementById('auth-guest-links');
        const loggedActions = document.getElementById('auth-logged-links');

        if (user) {
            if (userBtnText) userBtnText.textContent = user.name.split(' ')[0];
            if (guestActions) guestActions.style.display = 'none';
            if (loggedActions) loggedActions.style.display = 'block';
            if (adminBtn) adminBtn.style.display = user.role === 'Admin' ? 'inline-flex' : 'none';
        } else {
            if (userBtnText) userBtnText.textContent = 'Account';
            if (guestActions) guestActions.style.display = 'block';
            if (loggedActions) loggedActions.style.display = 'none';
            if (adminBtn) adminBtn.style.display = 'inline-flex'; // Still accessible to test admin login
        }
    }

    function openAuthModal(presetRole = 'customer') {
        const modal = document.getElementById('auth-modal');
        if (!modal) return;
        modal.classList.add('active');
        switchAuthTab('login');

        if (presetRole === 'admin') {
            quickFillAuth('admin@newfashion.com', 'admin123');
        }
    }

    function closeAuthModal() {
        const modal = document.getElementById('auth-modal');
        if (modal) modal.classList.remove('active');
    }

    function switchAuthTab(tab) {
        const loginForm = document.getElementById('auth-login-form');
        const registerForm = document.getElementById('auth-register-form');
        const loginTabBtn = document.getElementById('auth-tab-login');
        const regTabBtn = document.getElementById('auth-tab-register');

        if (tab === 'login') {
            if (loginForm) loginForm.style.display = 'block';
            if (registerForm) registerForm.style.display = 'none';
            if (loginTabBtn) loginTabBtn.classList.add('active');
            if (regTabBtn) regTabBtn.classList.remove('active');
        } else {
            if (loginForm) loginForm.style.display = 'none';
            if (registerForm) registerForm.style.display = 'block';
            if (loginTabBtn) loginTabBtn.classList.remove('active');
            if (regTabBtn) regTabBtn.classList.add('active');
        }
    }

    function handleLoginSubmit(event) {
        event.preventDefault();
        const email = document.getElementById('login-email').value;
        const pass = document.getElementById('login-password').value;

        const res = Auth.login(email, pass);
        if (res.success) {
            showToast(`Welcome back, ${res.user.name}!`, 'success');
            closeAuthModal();
            if (res.user.role === 'Admin') {
                navigateTo('admin');
            }
        } else {
            showToast(res.message, 'error');
        }
    }

    function handleRegisterSubmit(event) {
        event.preventDefault();
        const name = document.getElementById('reg-name').value;
        const email = document.getElementById('reg-email').value;
        const pass = document.getElementById('reg-password').value;
        const phone = document.getElementById('reg-phone').value;
        const address = document.getElementById('reg-address').value;

        const res = Auth.register({ name, email, password: pass, phone, address });
        if (res.success) {
            showToast(`Account created! Welcome, ${res.user.name}.`, 'success');
            closeAuthModal();
        } else {
            showToast(res.message, 'error');
        }
    }

    function handleLogout() {
        Auth.logout();
        showToast('Logged out successfully.', 'info');
        navigateTo('home');
    }

    function quickFillAuth(email, password) {
        switchAuthTab('login');
        const emailEl = document.getElementById('login-email');
        const passEl = document.getElementById('login-password');
        if (emailEl) emailEl.value = email;
        if (passEl) passEl.value = password;
    }

    // --- CART DRAWER & BADGE ---
    function updateCartBadge() {
        const totals = Cart.getTotals();
        document.querySelectorAll('.cart-badge-count').forEach(el => {
            el.textContent = totals.itemCount;
            el.style.display = totals.itemCount > 0 ? 'inline-flex' : 'none';
        });
    }

    function openCartDrawer() {
        renderCartDrawer();
        const drawer = document.getElementById('cart-drawer');
        const overlay = document.getElementById('cart-overlay');
        if (drawer) drawer.classList.add('active');
        if (overlay) overlay.classList.add('active');
    }

    function closeCartDrawer() {
        const drawer = document.getElementById('cart-drawer');
        const overlay = document.getElementById('cart-overlay');
        if (drawer) drawer.classList.remove('active');
        if (overlay) overlay.classList.remove('active');
    }

    function renderCartDrawer() {
        const items = Cart.getItems();
        const totals = Cart.getTotals();
        const container = document.getElementById('cart-drawer-items');
        const subtotalEl = document.getElementById('drawer-subtotal');
        const totalEl = document.getElementById('drawer-total');
        const discountRow = document.getElementById('drawer-discount-row');
        const discountEl = document.getElementById('drawer-discount-val');
        const promoTagEl = document.getElementById('drawer-promo-badge');

        if (!container) return;

        if (items.length === 0) {
            container.innerHTML = `
                <div class="empty-cart-drawer">
                    <span class="empty-cart-icon">🛒</span>
                    <h4>Your Cart is Empty</h4>
                    <p>Add some fresh streetwear pieces to get started!</p>
                    <button class="btn btn-secondary mt-3" onclick="App.closeCartDrawer(); App.navigateTo('products');">
                        Browse Products
                    </button>
                </div>
            `;
            if (subtotalEl) subtotalEl.textContent = '$0.00';
            if (totalEl) totalEl.textContent = '$0.00';
            if (discountRow) discountRow.style.display = 'none';
            return;
        }

        container.innerHTML = items.map(item => `
            <div class="cart-drawer-item">
                <img src="${item.image}" alt="${item.name}" class="drawer-item-img" />
                <div class="drawer-item-info">
                    <h5 class="drawer-item-title">${item.name}</h5>
                    <div class="drawer-item-meta">Size: <strong>${item.size}</strong></div>
                    <div class="drawer-item-price">$${parseFloat(item.price).toFixed(2)}</div>
                    <div class="drawer-qty-controls">
                        <button class="qty-btn-sm" onclick="Cart.updateQuantity(${item.product_id}, '${item.size}', ${item.quantity - 1})">-</button>
                        <span class="qty-val">${item.quantity}</span>
                        <button class="qty-btn-sm" onclick="Cart.updateQuantity(${item.product_id}, '${item.size}', ${item.quantity + 1})">+</button>
                        <button class="btn-remove-item" onclick="Cart.removeItem(${item.product_id}, '${item.size}')" title="Remove">✕</button>
                    </div>
                </div>
            </div>
        `).join('');

        if (subtotalEl) subtotalEl.textContent = `$${totals.subtotal.toFixed(2)}`;
        if (totalEl) totalEl.textContent = `$${totals.total.toFixed(2)}`;

        if (totals.discount > 0) {
            if (discountRow) discountRow.style.display = 'flex';
            if (discountEl) discountEl.textContent = `-$${totals.discount.toFixed(2)}`;
            if (promoTagEl) promoTagEl.textContent = `Applied: ${totals.promo.code}`;
        } else {
            if (discountRow) discountRow.style.display = 'none';
        }
    }

    function applyPromoFromDrawer() {
        const input = document.getElementById('drawer-promo-input');
        if (!input) return;
        const res = Cart.applyPromoCode(input.value);
        if (res.success) {
            showToast(res.message, 'success');
            renderCartDrawer();
            input.value = '';
        } else {
            showToast(res.message, 'error');
        }
    }

    function proceedToCheckout() {
        closeCartDrawer();
        navigateTo('checkout');
    }

    // --- SCHEMA & ERD MODAL ---
    function openSchemaModal() {
        const modal = document.getElementById('schema-modal');
        if (modal) modal.classList.add('active');
    }

    function closeSchemaModal() {
        const modal = document.getElementById('schema-modal');
        if (modal) modal.classList.remove('active');
    }

    function closeAllModals() {
        Store.closeProductModal();
        closeAuthModal();
        closeCartDrawer();
        Orders.closeInvoiceModal();
        Presentation.closeModal();
        closeSchemaModal();
        Admin.closeProductModal();
    }

    // --- TOAST NOTIFICATIONS ---
    function showToast(message, type = 'info') {
        const container = document.getElementById('toast-container');
        if (!container) return;

        const toast = document.createElement('div');
        toast.className = `toast-item toast-${type} animate-slide-in`;

        const icon = type === 'success' ? '✓' : (type === 'error' ? '✕' : 'ℹ');
        toast.innerHTML = `
            <span class="toast-icon">${icon}</span>
            <span class="toast-message">${message}</span>
        `;

        container.appendChild(toast);

        setTimeout(() => {
            toast.classList.add('fade-out');
            setTimeout(() => toast.remove(), 400);
        }, 3200);
    }

    return {
        init,
        navigateTo,
        filterByCategory,
        updateCategoryNav,
        openAuthModal,
        closeAuthModal,
        switchAuthTab,
        handleLoginSubmit,
        handleRegisterSubmit,
        handleLogout,
        quickFillAuth,
        openCartDrawer,
        closeCartDrawer,
        applyPromoFromDrawer,
        proceedToCheckout,
        openSchemaModal,
        closeSchemaModal,
        closeAllModals,
        showToast
    };
})();

// Start application when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    App.init();
});
