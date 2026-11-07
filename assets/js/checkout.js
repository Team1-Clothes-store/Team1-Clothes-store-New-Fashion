/**
 * New Fashion - Checkout & Mock Payment Module
 * Simulates real-world Cambodian & International e-commerce checkout with ABA KHQR, Card, and COD.
 */

const Checkout = (function() {
    let selectedPaymentMethod = 'ABA KHQR';

    function initCheckoutView() {
        const currentUser = Auth.getCurrentUser();
        const totals = Cart.getTotals();
        const items = Cart.getItems();

        if (items.length === 0) {
            App.navigateTo('products');
            App.showToast('Your cart is empty! Add products first.', 'info');
            return;
        }

        // Pre-fill user data
        const nameInput = document.getElementById('checkout-name');
        const emailInput = document.getElementById('checkout-email');
        const phoneInput = document.getElementById('checkout-phone');
        const addressInput = document.getElementById('checkout-address');

        if (currentUser) {
            if (nameInput) nameInput.value = currentUser.name || '';
            if (emailInput) emailInput.value = currentUser.email || '';
            if (phoneInput) phoneInput.value = currentUser.phone || '';
            if (addressInput) addressInput.value = currentUser.address || '';
        }

        renderCheckoutSummary();
        selectPaymentMethod('ABA KHQR');
    }

    function renderCheckoutSummary() {
        const items = Cart.getItems();
        const totals = Cart.getTotals();
        const listEl = document.getElementById('checkout-items-list');
        const subtotalEl = document.getElementById('checkout-subtotal');
        const shippingEl = document.getElementById('checkout-shipping');
        const discountEl = document.getElementById('checkout-discount');
        const totalEl = document.getElementById('checkout-total');
        const payAmountEl = document.getElementById('khqr-pay-amount');

        if (listEl) {
            listEl.innerHTML = items.map(item => `
                <div class="checkout-item-row">
                    <img src="${item.image}" alt="${item.name}" class="checkout-item-img" />
                    <div class="checkout-item-details">
                        <div class="checkout-item-title">${item.name}</div>
                        <div class="checkout-item-meta">Size: ${item.size} • Qty: ${item.quantity}</div>
                    </div>
                    <div class="checkout-item-price">$${(item.price * item.quantity).toFixed(2)}</div>
                </div>
            `).join('');
        }

        if (subtotalEl) subtotalEl.textContent = `$${totals.subtotal.toFixed(2)}`;
        if (shippingEl) shippingEl.textContent = totals.shipping === 0 ? 'FREE' : `$${totals.shipping.toFixed(2)}`;
        if (discountEl) {
            if (totals.discount > 0) {
                discountEl.parentElement.style.display = 'flex';
                discountEl.textContent = `-$${totals.discount.toFixed(2)}`;
            } else {
                discountEl.parentElement.style.display = 'none';
            }
        }
        if (totalEl) totalEl.textContent = `$${totals.total.toFixed(2)}`;
        if (payAmountEl) payAmountEl.textContent = `$${totals.total.toFixed(2)}`;
    }

    function selectPaymentMethod(method) {
        selectedPaymentMethod = method;

        // Update active UI cards
        document.querySelectorAll('.payment-option-card').forEach(card => {
            if (card.dataset.method === method) {
                card.classList.add('selected');
            } else {
                card.classList.remove('selected');
            }
        });

        // Toggle payment details container
        const cardSection = document.getElementById('payment-card-fields');
        const qrSection = document.getElementById('payment-khqr-fields');
        const codSection = document.getElementById('payment-cod-fields');

        if (cardSection) cardSection.style.display = method === 'Credit Card' ? 'block' : 'none';
        if (qrSection) qrSection.style.display = method === 'ABA KHQR' ? 'block' : 'none';
        if (codSection) codSection.style.display = method === 'Cash on Delivery' ? 'block' : 'none';
    }

    function simulateProcessPayment() {
        const name = document.getElementById('checkout-name').value.trim();
        const email = document.getElementById('checkout-email').value.trim();
        const phone = document.getElementById('checkout-phone').value.trim();
        const address = document.getElementById('checkout-address').value.trim();
        const notes = document.getElementById('checkout-notes') ? document.getElementById('checkout-notes').value.trim() : '';

        if (!name || !phone || !address) {
            App.showToast('Please enter your full name, phone number, and delivery address.', 'error');
            return;
        }

        const items = Cart.getItems();
        const totals = Cart.getTotals();
        let currentUser = Auth.getCurrentUser();

        // If user is guest, automatically register or assign mock guest customer ID
        if (!currentUser) {
            currentUser = DB.getUserByEmail(email);
            if (!currentUser) {
                currentUser = DB.createUser({
                    name: name,
                    email: email || `guest_${Date.now()}@newfashion.com`,
                    password: 'guest123Password',
                    phone: phone,
                    address: address,
                    role: 'Customer'
                });
            }
            Auth.setCurrentUser(currentUser);
        }

        // Show processing overlay
        showPaymentProcessingModal(selectedPaymentMethod, () => {
            // Create the order in DB
            const order = DB.createOrder({
                user_id: currentUser.user_id,
                total: totals.total,
                customer_name: name,
                customer_phone: phone,
                customer_address: address,
                notes: notes
            }, items, selectedPaymentMethod);

            // Clear the cart
            Cart.clearCart();

            // Display confirmation
            showOrderConfirmation(order);
        });
    }

    function showPaymentProcessingModal(method, onComplete) {
        const modal = document.getElementById('payment-processing-modal');
        const statusText = document.getElementById('processing-status-text');
        if (!modal) {
            onComplete();
            return;
        }

        modal.classList.add('active');
        if (statusText) statusText.textContent = `Connecting to ${method} gateway...`;

        setTimeout(() => {
            if (statusText) statusText.textContent = `Authorizing payment transaction...`;
        }, 800);

        setTimeout(() => {
            if (statusText) statusText.textContent = `Payment Verified! Finalizing your order...`;
        }, 1600);

        setTimeout(() => {
            modal.classList.remove('active');
            onComplete();
        }, 2200);
    }

    function showOrderConfirmation(order) {
        App.navigateTo('order-confirmation');

        const orderIdEl = document.getElementById('conf-order-id');
        const orderDateEl = document.getElementById('conf-order-date');
        const orderTotalEl = document.getElementById('conf-order-total');
        const orderCustomerEl = document.getElementById('conf-customer-name');
        const orderAddressEl = document.getElementById('conf-delivery-address');
        const orderPaymentEl = document.getElementById('conf-payment-method');
        const itemsListEl = document.getElementById('conf-items-list');

        if (orderIdEl) orderIdEl.textContent = `#NF-${order.order_id}`;
        if (orderDateEl) orderDateEl.textContent = new Date(order.order_date).toLocaleString();
        if (orderTotalEl) orderTotalEl.textContent = `$${parseFloat(order.total).toFixed(2)}`;
        if (orderCustomerEl) orderCustomerEl.textContent = `${order.customer_name} (${order.customer_phone})`;
        if (orderAddressEl) orderAddressEl.textContent = order.customer_address;
        if (orderPaymentEl) orderPaymentEl.textContent = `${order.payment.method} (${order.payment.status})`;

        if (itemsListEl) {
            itemsListEl.innerHTML = order.items.map(item => `
                <div class="conf-item-row">
                    <img src="${item.product_image}" alt="${item.product_name}" class="conf-item-thumb" />
                    <div class="conf-item-info">
                        <strong>${item.product_name}</strong>
                        <span>Size: ${item.size} • Qty: ${item.quantity}</span>
                    </div>
                    <div class="conf-item-total">$${(item.price * item.quantity).toFixed(2)}</div>
                </div>
            `).join('');
        }

        App.showToast(`Order #NF-${order.order_id} placed successfully!`, 'success');
    }

    return {
        initCheckoutView,
        renderCheckoutSummary,
        selectPaymentMethod,
        simulateProcessPayment,
        showOrderConfirmation
    };
})();
