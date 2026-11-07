/**
 * New Fashion - Admin Management Module
 * Comprehensive dashboard for Products, Categories, Orders, Customers, and System Database.
 */

const Admin = (function() {
    let currentAdminTab = 'dashboard';

    function initAdminPanel() {
        if (!Auth.isAdmin()) {
            App.showToast('Administrator privileges required.', 'error');
            App.openAuthModal('admin');
            return;
        }

        switchTab(currentAdminTab || 'dashboard');
    }

    function switchTab(tabName) {
        currentAdminTab = tabName;

        // Update nav buttons
        document.querySelectorAll('.admin-nav-item').forEach(btn => {
            if (btn.dataset.tab === tabName) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });

        // Toggle sub-sections
        document.querySelectorAll('.admin-tab-pane').forEach(pane => {
            pane.style.display = pane.id === `admin-${tabName}-pane` ? 'block' : 'none';
        });

        if (tabName === 'dashboard') renderDashboard();
        if (tabName === 'products') renderProductsTable();
        if (tabName === 'categories') renderCategoriesTable();
        if (tabName === 'orders') renderOrdersTable();
        if (tabName === 'customers') renderCustomersTable();
        if (tabName === 'database') renderDatabaseTools();
    }

    function renderDashboard() {
        const stats = DB.getStats();

        const revEl = document.getElementById('stat-revenue');
        const ordersEl = document.getElementById('stat-orders');
        const prodsEl = document.getElementById('stat-products');
        const custEl = document.getElementById('stat-customers');

        if (revEl) revEl.textContent = `$${stats.revenue}`;
        if (ordersEl) ordersEl.textContent = stats.ordersCount;
        if (prodsEl) prodsEl.textContent = stats.productsCount;
        if (custEl) custEl.textContent = stats.customersCount;

        // Recent orders table in dashboard
        const recentOrdersContainer = document.getElementById('admin-recent-orders-body');
        if (recentOrdersContainer) {
            const recent = DB.getOrders().slice(0, 5);
            recentOrdersContainer.innerHTML = recent.map(o => `
                <tr>
                    <td><strong>#NF-${o.order_id}</strong></td>
                    <td>${o.customer_name}</td>
                    <td>${new Date(o.order_date).toLocaleDateString()}</td>
                    <td>$${parseFloat(o.total).toFixed(2)}</td>
                    <td><span class="status-pill status-${o.status.toLowerCase()}">${o.status}</span></td>
                    <td>
                        <button class="btn btn-secondary btn-sm" onclick="Admin.viewOrderDetails(${o.order_id})">Inspect</button>
                    </td>
                </tr>
            `).join('');
        }
    }

    // --- PRODUCTS CRUD ---
    function renderProductsTable() {
        const tbody = document.getElementById('admin-products-tbody');
        if (!tbody) return;

        const products = DB.getProducts();
        tbody.innerHTML = products.map(p => {
            const cat = DB.getCategoryById(p.category_id);
            return `
                <tr>
                    <td>
                        <img src="${p.image}" alt="${p.name}" class="admin-table-thumb" />
                    </td>
                    <td>
                        <strong>${p.name}</strong><br>
                        <small class="text-muted">${cat ? cat.name : 'Category #' + p.category_id}</small>
                    </td>
                    <td>$${parseFloat(p.price).toFixed(2)}</td>
                    <td>
                        <span class="stock-tag ${p.stock < 10 ? 'low' : ''}">${p.stock} units</span>
                    </td>
                    <td>
                        <div class="table-action-btns">
                            <button class="btn btn-secondary btn-sm" onclick="Admin.openEditProductModal(${p.product_id})">Edit</button>
                            <button class="btn btn-danger btn-sm" onclick="Admin.deleteProduct(${p.product_id})">Delete</button>
                        </div>
                    </td>
                </tr>
            `;
        }).join('');
    }

    function openAddProductModal() {
        const modal = document.getElementById('admin-product-modal');
        const form = document.getElementById('admin-product-form');
        const titleEl = document.getElementById('admin-product-modal-title');
        const catSelect = document.getElementById('admin-prod-category');

        if (!modal || !form) return;
        titleEl.textContent = 'Add New Streetwear Product';
        form.reset();
        document.getElementById('admin-prod-id').value = '';

        // Populate category dropdown
        const categories = DB.getCategories();
        catSelect.innerHTML = categories.map(c => `
            <option value="${c.category_id}">${c.name}</option>
        `).join('');

        modal.classList.add('active');
    }

    function openEditProductModal(productId) {
        const product = DB.getProductById(productId);
        if (!product) return;

        const modal = document.getElementById('admin-product-modal');
        const titleEl = document.getElementById('admin-product-modal-title');
        const catSelect = document.getElementById('admin-prod-category');

        titleEl.textContent = 'Edit Product';

        document.getElementById('admin-prod-id').value = product.product_id;
        document.getElementById('admin-prod-name').value = product.name;
        document.getElementById('admin-prod-price').value = product.price;
        document.getElementById('admin-prod-stock').value = product.stock;
        document.getElementById('admin-prod-image').value = product.image;
        document.getElementById('admin-prod-desc').value = product.description || '';

        const categories = DB.getCategories();
        catSelect.innerHTML = categories.map(c => `
            <option value="${c.category_id}" ${c.category_id === product.category_id ? 'selected' : ''}>${c.name}</option>
        `).join('');

        modal.classList.add('active');
    }

    function closeProductModal() {
        const modal = document.getElementById('admin-product-modal');
        if (modal) modal.classList.remove('active');
    }

    function saveProductFromForm(event) {
        event.preventDefault();
        const id = document.getElementById('admin-prod-id').value;
        const name = document.getElementById('admin-prod-name').value.trim();
        const catId = document.getElementById('admin-prod-category').value;
        const price = parseFloat(document.getElementById('admin-prod-price').value);
        const stock = parseInt(document.getElementById('admin-prod-stock').value);
        const image = document.getElementById('admin-prod-image').value.trim();
        const desc = document.getElementById('admin-prod-desc').value.trim();

        if (!name || isNaN(price) || isNaN(stock)) {
            App.showToast('Please fill out all required product fields.', 'error');
            return;
        }

        const data = {
            category_id: catId,
            name: name,
            price: price,
            stock: stock,
            image: image || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800',
            description: desc
        };

        if (id) {
            DB.updateProduct(id, data);
            App.showToast('Product updated successfully!', 'success');
        } else {
            DB.addProduct(data);
            App.showToast('New product added successfully!', 'success');
        }

        closeProductModal();
        renderProductsTable();
        Store.renderProductsView();
        Store.renderFeaturedGrid();
    }

    function deleteProduct(productId) {
        const product = DB.getProductById(productId);
        if (!product) return;

        if (confirm(`Are you sure you want to delete "${product.name}"?`)) {
            DB.deleteProduct(productId);
            App.showToast('Product deleted.', 'info');
            renderProductsTable();
            Store.renderProductsView();
            Store.renderFeaturedGrid();
        }
    }

    // --- CATEGORIES CRUD ---
    function renderCategoriesTable() {
        const tbody = document.getElementById('admin-categories-tbody');
        if (!tbody) return;

        const categories = DB.getCategories();
        tbody.innerHTML = categories.map(c => {
            const count = DB.getProducts().filter(p => p.category_id === c.category_id).length;
            return `
                <tr>
                    <td>#${c.category_id}</td>
                    <td><strong>${c.name}</strong></td>
                    <td>${c.description || '-'}</td>
                    <td><span class="badge badge-brand">${count} Products</span></td>
                    <td>
                        <div class="table-action-btns">
                            <button class="btn btn-secondary btn-sm" onclick="Admin.openEditCategoryModal(${c.category_id})">Edit</button>
                            <button class="btn btn-danger btn-sm" onclick="Admin.deleteCategory(${c.category_id})">Delete</button>
                        </div>
                    </td>
                </tr>
            `;
        }).join('');
    }

    function openAddCategoryModal() {
        const name = prompt('Enter Category Name (e.g. Men\'s Streetwear, Outerwear):');
        if (name && name.trim()) {
            const desc = prompt('Enter Short Description (optional):') || '';
            DB.addCategory({ name: name.trim(), description: desc.trim() });
            App.showToast('Category created!', 'success');
            renderCategoriesTable();
            App.updateCategoryNav();
        }
    }

    function openEditCategoryModal(catId) {
        const cat = DB.getCategoryById(catId);
        if (!cat) return;
        const newName = prompt('Update Category Name:', cat.name);
        if (newName && newName.trim()) {
            const newDesc = prompt('Update Description:', cat.description || '');
            DB.updateCategory(catId, { name: newName.trim(), description: newDesc.trim() });
            App.showToast('Category updated!', 'success');
            renderCategoriesTable();
            App.updateCategoryNav();
        }
    }

    function deleteCategory(catId) {
        const cat = DB.getCategoryById(catId);
        if (!cat) return;
        if (confirm(`Delete category "${cat.name}"?`)) {
            DB.deleteCategory(catId);
            App.showToast('Category deleted.', 'info');
            renderCategoriesTable();
            App.updateCategoryNav();
        }
    }

    // --- ORDERS MANAGEMENT ---
    function renderOrdersTable() {
        const tbody = document.getElementById('admin-orders-tbody');
        if (!tbody) return;

        const orders = DB.getOrders();
        tbody.innerHTML = orders.map(o => {
            return `
                <tr>
                    <td><strong>#NF-${o.order_id}</strong></td>
                    <td>
                        <div><strong>${o.customer_name}</strong></div>
                        <small class="text-muted">${o.customer_phone}</small>
                    </td>
                    <td>${new Date(o.order_date).toLocaleDateString()}</td>
                    <td><strong>$${parseFloat(o.total).toFixed(2)}</strong></td>
                    <td>
                        <select class="admin-status-select status-${o.status.toLowerCase()}" onchange="Admin.updateOrderStatus(${o.order_id}, this.value)">
                            <option value="Pending" ${o.status === 'Pending' ? 'selected' : ''}>Pending</option>
                            <option value="Processing" ${o.status === 'Processing' ? 'selected' : ''}>Processing</option>
                            <option value="Shipped" ${o.status === 'Shipped' ? 'selected' : ''}>Shipped</option>
                            <option value="Delivered" ${o.status === 'Delivered' ? 'selected' : ''}>Delivered</option>
                            <option value="Cancelled" ${o.status === 'Cancelled' ? 'selected' : ''}>Cancelled</option>
                        </select>
                    </td>
                    <td>
                        <button class="btn btn-secondary btn-sm" onclick="Orders.openInvoiceModal(${o.order_id})">Receipt</button>
                    </td>
                </tr>
            `;
        }).join('');
    }

    function updateOrderStatus(orderId, newStatus) {
        DB.updateOrderStatus(orderId, newStatus);
        App.showToast(`Order #NF-${orderId} set to "${newStatus}"`, 'success');
        renderOrdersTable();
    }

    function viewOrderDetails(orderId) {
        Orders.openInvoiceModal(orderId);
    }

    // --- CUSTOMERS MANAGEMENT ---
    function renderCustomersTable() {
        const tbody = document.getElementById('admin-customers-tbody');
        if (!tbody) return;

        const users = DB.getUsers();
        tbody.innerHTML = users.map(u => {
            const customerOrders = DB.getOrders().filter(o => o.user_id === u.user_id);
            const totalSpent = customerOrders.reduce((sum, o) => sum + parseFloat(o.total), 0);

            return `
                <tr>
                    <td>#${u.user_id}</td>
                    <td>
                        <strong>${u.name}</strong><br>
                        <small class="text-muted">${u.email}</small>
                    </td>
                    <td>
                        <span class="badge ${u.role === 'Admin' ? 'badge-brand' : 'badge-neutral'}">${u.role}</span>
                    </td>
                    <td>${u.phone || 'N/A'}</td>
                    <td><strong>${customerOrders.length}</strong> orders</td>
                    <td>$${totalSpent.toFixed(2)}</td>
                </tr>
            `;
        }).join('');
    }

    // --- DATABASE & SCHEMA INSPECTOR ---
    function renderDatabaseTools() {
        const container = document.getElementById('admin-db-viewer');
        if (!container) return;

        const stats = DB.getStats();
        container.innerHTML = `
            <div class="db-inspector-card">
                <h3>Relational Database Engine (Midterm Assignment Tables)</h3>
                <p>This system fully reflects the 6 schema tables with Primary Keys (PK) & Foreign Keys (FK) defined in Section 4 of the project plan.</p>
                <div class="db-tables-grid">
                    <div class="db-table-chip">
                        <span class="table-title">1. users</span>
                        <span class="table-meta">${DB.getUsers().length} records • PK: user_id</span>
                    </div>
                    <div class="db-table-chip">
                        <span class="table-title">2. categories</span>
                        <span class="table-meta">${DB.getCategories().length} records • PK: category_id</span>
                    </div>
                    <div class="db-table-chip">
                        <span class="table-title">3. products</span>
                        <span class="table-meta">${DB.getProducts().length} records • PK: product_id, FK: category_id</span>
                    </div>
                    <div class="db-table-chip">
                        <span class="table-title">4. orders</span>
                        <span class="table-meta">${DB.getOrders().length} records • PK: order_id, FK: user_id</span>
                    </div>
                    <div class="db-table-chip">
                        <span class="table-title">5. order_items</span>
                        <span class="table-meta">Line items • PK: order_item_id, FK: order_id, product_id</span>
                    </div>
                    <div class="db-table-chip">
                        <span class="table-title">6. payments</span>
                        <span class="table-meta">1:1 with orders • PK: payment_id, FK: order_id</span>
                    </div>
                </div>

                <div class="db-action-buttons-row mt-4">
                    <button class="btn btn-secondary" onclick="Admin.exportDatabaseJSON()">📥 Export DB as JSON</button>
                    <button class="btn btn-secondary" onclick="App.openSchemaModal()">📊 View ERD & SQL Schema</button>
                    <button class="btn btn-danger" onclick="Admin.resetDatabaseWithConfirm()">⚠️ Reset DB to Default Seed</button>
                </div>
            </div>
        `;
    }

    function exportDatabaseJSON() {
        const data = {
            users: DB.getUsers(),
            categories: DB.getCategories(),
            products: DB.getProducts(),
            orders: DB.getOrders(),
            exportedAt: new Date().toISOString()
        };
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `new_fashion_db_export_${Date.now()}.json`;
        a.click();
        URL.revokeObjectURL(url);
        App.showToast('Database exported as JSON!', 'success');
    }

    function resetDatabaseWithConfirm() {
        if (confirm('Are you sure you want to reset all tables to default seed data? All custom products and orders will be reset.')) {
            DB.reset();
            App.showToast('Database reset to default seed data!', 'success');
            renderDashboard();
            Store.renderProductsView();
            Store.renderFeaturedGrid();
        }
    }

    return {
        initAdminPanel,
        switchTab,
        renderDashboard,
        renderProductsTable,
        openAddProductModal,
        openEditProductModal,
        closeProductModal,
        saveProductFromForm,
        deleteProduct,
        renderCategoriesTable,
        openAddCategoryModal,
        openEditCategoryModal,
        deleteCategory,
        renderOrdersTable,
        updateOrderStatus,
        viewOrderDetails,
        renderCustomersTable,
        renderDatabaseTools,
        exportDatabaseJSON,
        resetDatabaseWithConfirm
    };
})();
