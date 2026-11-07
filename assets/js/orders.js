/**
 * New Fashion - Customer Orders & Tracking Module
 * Displays user order history, delivery timelines, and order lookup by ID.
 */

const Orders = (function() {

    function renderOrdersView() {
        const container = document.getElementById('my-orders-list');
        const user = Auth.getCurrentUser();
        if (!container) return;

        let orders = [];
        if (user) {
            orders = DB.getOrdersByUserId(user.user_id);
        } else {
            // Guest mode: show recent sample or let them search by ID
            orders = DB.getOrders().slice(0, 3).map(o => DB.getOrderById(o.order_id));
        }

        if (orders.length === 0) {
            container.innerHTML = `
                <div class="empty-orders-state">
                    <div class="empty-icon">📦</div>
                    <h3>No orders found</h3>
                    <p>You haven't placed any orders yet. Discover our latest fashion drops!</p>
                    <button class="btn btn-primary mt-4" onclick="App.navigateTo('products')">Explore Products</button>
                </div>
            `;
            return;
        }

        container.innerHTML = orders.map(renderOrderCard).join('');
    }

    function renderOrderCard(order) {
        const dateStr = new Date(order.order_date).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });

        const statusClass = order.status.toLowerCase();

        return `
            <div class="order-card-box">
                <div class="order-header-bar">
                    <div class="order-title-group">
                        <span class="order-id-label">Order #NF-${order.order_id}</span>
                        <span class="order-timestamp">${dateStr}</span>
                    </div>
                    <div class="order-status-group">
                        <span class="status-pill status-${statusClass}">${order.status}</span>
                        <button class="btn-icon-link" onclick="Orders.openInvoiceModal(${order.order_id})" title="View Receipt">
                            📄 Receipt
                        </button>
                    </div>
                </div>

                <!-- Order Progress Tracker -->
                <div class="order-progress-tracker">
                    ${renderTimelineSteps(order.status)}
                </div>

                <!-- Items Preview -->
                <div class="order-items-preview">
                    ${order.items.map(i => `
                        <div class="order-preview-item">
                            <img src="${i.product_image || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800'}" alt="${i.product_name}" class="order-thumb" />
                            <div class="order-item-desc">
                                <span class="order-item-title">${i.product_name}</span>
                                <span class="order-item-meta">Size: ${i.size || 'M'} • Qty: ${i.quantity}</span>
                            </div>
                            <span class="order-item-subtotal">$${(i.price * i.quantity).toFixed(2)}</span>
                        </div>
                    `).join('')}
                </div>

                <div class="order-footer-bar">
                    <div class="order-destination">
                        <strong>Shipping To:</strong> ${order.customer_name} • ${order.customer_address}
                    </div>
                    <div class="order-total-summary">
                        Total Amount: <span class="highlight-total">$${parseFloat(order.total).toFixed(2)}</span>
                    </div>
                </div>
            </div>
        `;
    }

    function renderTimelineSteps(status) {
        const steps = ['Pending', 'Processing', 'Shipped', 'Delivered'];
        const currentIdx = steps.indexOf(status);
        const isCancelled = status === 'Cancelled';

        if (isCancelled) {
            return `
                <div class="order-cancelled-banner">
                    ⚠️ This order was cancelled.
                </div>
            `;
        }

        return `
            <div class="timeline-stepper">
                ${steps.map((step, idx) => {
                    const isDone = idx <= currentIdx;
                    const isCurrent = idx === currentIdx;
                    return `
                        <div class="timeline-step ${isDone ? 'completed' : ''} ${isCurrent ? 'active-step' : ''}">
                            <div class="step-dot">
                                ${isDone ? '✓' : idx + 1}
                            </div>
                            <div class="step-label">${step}</div>
                        </div>
                    `;
                }).join('')}
            </div>
        `;
    }

    function searchOrderByNumber() {
        const input = document.getElementById('order-search-input');
        if (!input) return;
        const query = input.value.trim().replace(/[^0-9]/g, '');
        if (!query) {
            App.showToast('Please enter an Order ID number (e.g. 101, 102)', 'info');
            return;
        }

        const order = DB.getOrderById(parseInt(query));
        const container = document.getElementById('my-orders-list');
        if (!container) return;

        if (!order) {
            App.showToast(`Order #${query} not found.`, 'error');
            return;
        }

        container.innerHTML = `
            <div class="search-result-header">
                <h3>Showing Result for Order #NF-${order.order_id}</h3>
                <button class="btn btn-secondary btn-sm" onclick="Orders.renderOrdersView()">View All</button>
            </div>
            ${renderOrderCard(order)}
        `;
    }

    function openInvoiceModal(orderId) {
        const order = DB.getOrderById(orderId);
        if (!order) return;

        const modal = document.getElementById('invoice-modal');
        const content = document.getElementById('invoice-modal-content');
        if (!modal || !content) return;

        content.innerHTML = `
            <div class="invoice-box" id="printable-invoice">
                <div class="invoice-header">
                    <div>
                        <h2 class="invoice-brand">NEW FASHION</h2>
                        <p class="invoice-sub">Assignment Midterm E-Commerce System</p>
                    </div>
                    <div class="invoice-meta">
                        <div class="invoice-title">RECEIPT / INVOICE</div>
                        <div><strong>Order #:</strong> NF-${order.order_id}</div>
                        <div><strong>Date:</strong> ${new Date(order.order_date).toLocaleDateString()}</div>
                        <div><strong>Status:</strong> ${order.status}</div>
                    </div>
                </div>

                <div class="invoice-addresses">
                    <div class="address-col">
                        <strong>Billed / Shipped To:</strong><br>
                        ${order.customer_name}<br>
                        Phone: ${order.customer_phone}<br>
                        Address: ${order.customer_address}
                    </div>
                    <div class="address-col">
                        <strong>Payment Information:</strong><br>
                        Method: ${order.payment ? order.payment.method : 'Mock Gateway'}<br>
                        Ref: ${order.payment ? order.payment.transaction_ref : 'TXN-NF'}<br>
                        Payment Status: ${order.payment ? order.payment.status : 'Paid'}
                    </div>
                </div>

                <table class="invoice-table">
                    <thead>
                        <tr>
                            <th>Item Description</th>
                            <th>Size</th>
                            <th>Unit Price</th>
                            <th>Qty</th>
                            <th style="text-align: right;">Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${order.items.map(item => `
                            <tr>
                                <td>${item.product_name}</td>
                                <td>${item.size || 'M'}</td>
                                <td>$${parseFloat(item.price).toFixed(2)}</td>
                                <td>${item.quantity}</td>
                                <td style="text-align: right;">$${(item.price * item.quantity).toFixed(2)}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>

                <div class="invoice-totals">
                    <div class="invoice-totals-line">
                        <span>Total Paid:</span>
                        <strong>$${parseFloat(order.total).toFixed(2)} USD</strong>
                    </div>
                </div>

                <div class="invoice-footer">
                    <p>Thank you for choosing New Fashion! Keep rocking the street aesthetic.</p>
                </div>
            </div>
            <div class="invoice-actions no-print">
                <button class="btn btn-secondary" onclick="Orders.closeInvoiceModal()">Close</button>
                <button class="btn btn-primary" onclick="window.print()">🖨️ Print Invoice</button>
            </div>
        `;

        modal.classList.add('active');
    }

    function closeInvoiceModal() {
        const modal = document.getElementById('invoice-modal');
        if (modal) modal.classList.remove('active');
    }

    return {
        renderOrdersView,
        searchOrderByNumber,
        openInvoiceModal,
        closeInvoiceModal
    };
})();
