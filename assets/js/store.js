/**
 * New Fashion - Store & Product Catalog Module
 * Manages category filtering, search, sorting, and product modal interactions.
 */

const Store = (function() {
    let currentFilter = {
        categoryId: null,
        searchTerm: '',
        sortBy: 'featured',
        priceRange: 'all'
    };

    function setCategory(catId) {
        currentFilter.categoryId = catId ? Number(catId) : null;
        renderProductsView();
    }

    function setSearch(term) {
        currentFilter.searchTerm = (term || '').trim().toLowerCase();
        renderProductsView();
    }

    function setSort(sortBy) {
        currentFilter.sortBy = sortBy;
        renderProductsView();
    }

    function setPriceRange(range) {
        currentFilter.priceRange = range;
        renderProductsView();
    }

    function getFilteredProducts() {
        let products = DB.getProducts();

        // Category filter
        if (currentFilter.categoryId) {
            products = products.filter(p => p.category_id === currentFilter.categoryId);
        }

        // Search query filter
        if (currentFilter.searchTerm) {
            products = products.filter(p =>
                p.name.toLowerCase().includes(currentFilter.searchTerm) ||
                (p.description && p.description.toLowerCase().includes(currentFilter.searchTerm))
            );
        }

        // Price range filter
        if (currentFilter.priceRange !== 'all') {
            if (currentFilter.priceRange === 'under30') {
                products = products.filter(p => p.price < 30);
            } else if (currentFilter.priceRange === '30to50') {
                products = products.filter(p => p.price >= 30 && p.price <= 50);
            } else if (currentFilter.priceRange === 'over50') {
                products = products.filter(p => p.price > 50);
            }
        }

        // Sorting
        if (currentFilter.sortBy === 'price-low') {
            products.sort((a, b) => a.price - b.price);
        } else if (currentFilter.sortBy === 'price-high') {
            products.sort((a, b) => b.price - a.price);
        } else if (currentFilter.sortBy === 'name') {
            products.sort((a, b) => a.name.localeCompare(b.name));
        } else {
            // featured / default: product_id descending
            products.sort((a, b) => b.product_id - a.product_id);
        }

        return products;
    }

    function renderProductCard(product) {
        const cat = DB.getCategoryById(product.category_id);
        const catName = cat ? cat.name : 'Fashion';
        const isOutOfStock = product.stock <= 0;

        return `
            <div class="product-card group" data-product-id="${product.product_id}">
                <div class="product-thumb-wrapper">
                    <img src="${product.image}" alt="${product.name}" class="product-thumb" loading="lazy" />
                    <span class="product-tag">${catName}</span>
                    ${product.stock < 10 && product.stock > 0 ? `<span class="stock-badge low-stock">Low Stock: ${product.stock} left</span>` : ''}
                    ${isOutOfStock ? `<span class="stock-badge out-stock">Sold Out</span>` : ''}
                    <div class="product-overlay-actions">
                        <button class="action-btn btn-quick-view" onclick="Store.openProductModal(${product.product_id})" title="Quick View">
                            <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                        </button>
                        <button class="action-btn btn-quick-add ${isOutOfStock ? 'disabled' : ''}" onclick="Store.quickAddToCart(${product.product_id})" ${isOutOfStock ? 'disabled' : ''} title="Add to Cart">
                            <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/></svg>
                        </button>
                    </div>
                </div>
                <div class="product-info">
                    <h3 class="product-name" onclick="Store.openProductModal(${product.product_id})">${product.name}</h3>
                    <p class="product-desc-snippet">${product.description ? product.description.substring(0, 60) + '...' : ''}</p>
                    <div class="product-price-row">
                        <span class="product-price">$${parseFloat(product.price).toFixed(2)}</span>
                        <span class="product-stock-text">${isOutOfStock ? 'Out of stock' : `${product.stock} in stock`}</span>
                    </div>
                </div>
            </div>
        `;
    }

    function renderFeaturedGrid() {
        const container = document.getElementById('featured-products-grid');
        if (!container) return;
        const products = DB.getProducts().slice(0, 8);
        container.innerHTML = products.map(renderProductCard).join('');
    }

    function renderProductsView() {
        const grid = document.getElementById('catalog-products-grid');
        const countEl = document.getElementById('catalog-product-count');
        if (!grid) return;

        const filtered = getFilteredProducts();
        if (countEl) {
            countEl.textContent = `${filtered.length} products found`;
        }

        if (filtered.length === 0) {
            grid.innerHTML = `
                <div class="no-results-state col-span-full">
                    <div class="empty-icon">🔍</div>
                    <h3>No products found</h3>
                    <p>Try clearing filters or search terms.</p>
                    <button class="btn btn-secondary mt-3" onclick="Store.resetFilters()">Clear Filters</button>
                </div>
            `;
            return;
        }

        grid.innerHTML = filtered.map(renderProductCard).join('');
    }

    function resetFilters() {
        currentFilter = {
            categoryId: null,
            searchTerm: '',
            sortBy: 'featured',
            priceRange: 'all'
        };
        const searchInput = document.getElementById('global-search-input');
        if (searchInput) searchInput.value = '';
        const categoryPills = document.querySelectorAll('.cat-pill');
        categoryPills.forEach(p => p.classList.remove('active'));
        const allPill = document.querySelector('.cat-pill[data-cat="all"]');
        if (allPill) allPill.classList.add('active');
        renderProductsView();
    }

    function openProductModal(productId) {
        const product = DB.getProductById(productId);
        if (!product) return;

        const cat = DB.getCategoryById(product.category_id);
        const modal = document.getElementById('product-detail-modal');
        const content = document.getElementById('product-modal-content');
        if (!modal || !content) return;

        const isAccessories = cat && cat.name.includes('Accessories');
        const sizes = isAccessories ? ['One Size'] : ['S', 'M', 'L', 'XL', 'XXL'];

        content.innerHTML = `
            <div class="product-modal-grid">
                <div class="modal-image-col">
                    <img src="${product.image}" alt="${product.name}" class="modal-main-img" />
                    <div class="modal-img-badges">
                        <span class="badge badge-brand">${cat ? cat.name : 'New Fashion'}</span>
                        <span class="badge ${product.stock > 0 ? 'badge-success' : 'badge-danger'}">
                            ${product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                        </span>
                    </div>
                </div>
                <div class="modal-details-col">
                    <div class="modal-header-row">
                        <span class="category-breadcrumbs">${cat ? cat.name : 'Category'} / New Fashion Streetwear</span>
                        <h2 class="modal-title">${product.name}</h2>
                        <div class="modal-price-tag">$${parseFloat(product.price).toFixed(2)}</div>
                    </div>

                    <div class="modal-rating-row">
                        <div class="stars">★★★★★</div>
                        <span class="rating-count">(4.9/5 • 42 Midterm Customer Reviews)</span>
                    </div>

                    <p class="modal-description">${product.description || 'Exclusive New Fashion streetwear design with premium fabric and durable stitching.'}</p>

                    <div class="modal-selector-group">
                        <label class="selector-label">Select Size:</label>
                        <div class="size-options-container" id="modal-size-selector">
                            ${sizes.map((s, idx) => `
                                <button type="button" class="size-btn ${idx === 0 ? 'selected' : ''}" onclick="Store.selectSize(this, '${s}')">${s}</button>
                            `).join('')}
                        </div>
                    </div>

                    <div class="modal-selector-group">
                        <label class="selector-label">Quantity:</label>
                        <div class="qty-stepper">
                            <button type="button" class="qty-btn" onclick="Store.stepModalQty(-1)">-</button>
                            <input type="number" id="modal-qty-input" value="1" min="1" max="${product.stock}" readonly />
                            <button type="button" class="qty-btn" onclick="Store.stepModalQty(1)">+</button>
                        </div>
                    </div>

                    <div class="modal-actions-group">
                        <button class="btn btn-primary btn-block ${product.stock <= 0 ? 'disabled' : ''}" 
                                onclick="Store.addToCartFromModal(${product.product_id})" ${product.stock <= 0 ? 'disabled' : ''}>
                            <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/></svg>
                            Add to Cart
                        </button>
                        <button class="btn btn-outline btn-block mt-2 ${product.stock <= 0 ? 'disabled' : ''}" 
                                onclick="Store.buyNowFromModal(${product.product_id})" ${product.stock <= 0 ? 'disabled' : ''}>
                            ⚡ Instant Buy Now
                        </button>
                    </div>

                    <div class="modal-guarantees">
                        <div class="guarantee-item">🚚 <span>Fast Delivery 1-3 Business Days</span></div>
                        <div class="guarantee-item">💳 <span>Safe Mock Checkout (Card, KHQR, COD)</span></div>
                        <div class="guarantee-item">🔄 <span>Easy 7-Day Exchange</span></div>
                    </div>
                </div>
            </div>
        `;

        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeProductModal() {
        const modal = document.getElementById('product-detail-modal');
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    }

    function selectSize(btn, size) {
        document.querySelectorAll('#modal-size-selector .size-btn').forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
    }

    function stepModalQty(delta) {
        const input = document.getElementById('modal-qty-input');
        if (!input) return;
        let val = parseInt(input.value) || 1;
        const max = parseInt(input.max) || 99;
        val += delta;
        if (val < 1) val = 1;
        if (val > max) val = max;
        input.value = val;
    }

    function addToCartFromModal(productId) {
        const selectedSizeBtn = document.querySelector('#modal-size-selector .size-btn.selected');
        const size = selectedSizeBtn ? selectedSizeBtn.textContent.trim() : 'M';
        const qty = parseInt(document.getElementById('modal-qty-input').value) || 1;

        Cart.addItem(productId, qty, size);
        closeProductModal();
        App.showToast(`Added to cart (${qty}x - Size ${size})!`, 'success');
        App.openCartDrawer();
    }

    function buyNowFromModal(productId) {
        const selectedSizeBtn = document.querySelector('#modal-size-selector .size-btn.selected');
        const size = selectedSizeBtn ? selectedSizeBtn.textContent.trim() : 'M';
        const qty = parseInt(document.getElementById('modal-qty-input').value) || 1;

        Cart.addItem(productId, qty, size);
        closeProductModal();
        App.navigateTo('checkout');
    }

    function quickAddToCart(productId) {
        const product = DB.getProductById(productId);
        if (!product || product.stock <= 0) return;
        Cart.addItem(productId, 1, 'M');
        App.showToast(`Added ${product.name} to cart!`, 'success');
    }

    return {
        setCategory,
        setSearch,
        setSort,
        setPriceRange,
        renderFeaturedGrid,
        renderProductsView,
        resetFilters,
        openProductModal,
        closeProductModal,
        selectSize,
        stepModalQty,
        addToCartFromModal,
        buyNowFromModal,
        quickAddToCart
    };
})();
