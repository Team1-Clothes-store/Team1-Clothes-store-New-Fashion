/**
 * New Fashion - Cart Module
 * Supports sizing, quantity adjustments, discount promo codes, and live badge updates.
 */

const Cart = (function() {
    const CART_STORAGE_KEY = 'newfashion_cart_items';
    const PROMO_STORAGE_KEY = 'newfashion_applied_promo';

    function getItems() {
        const stored = localStorage.getItem(CART_STORAGE_KEY);
        return stored ? JSON.parse(stored) : [];
    }

    function saveItems(items) {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
        window.dispatchEvent(new CustomEvent('cart-updated', { detail: { items, totals: getTotals() } }));
    }

    function addItem(productId, quantity = 1, size = 'M') {
        const product = DB.getProductById(productId);
        if (!product) return false;

        const items = getItems();
        const existingIdx = items.findIndex(i => i.product_id === Number(productId) && i.size === size);

        if (existingIdx !== -1) {
            items[existingIdx].quantity += parseInt(quantity);
            if (items[existingIdx].quantity > product.stock) {
                items[existingIdx].quantity = product.stock;
            }
        } else {
            items.push({
                product_id: Number(productId),
                name: product.name,
                price: parseFloat(product.price),
                image: product.image,
                size: size,
                quantity: Math.min(parseInt(quantity), product.stock)
            });
        }

        saveItems(items);
        return true;
    }

    function updateQuantity(productId, size, quantity) {
        let items = getItems();
        const product = DB.getProductById(productId);
        const idx = items.findIndex(i => i.product_id === Number(productId) && i.size === size);

        if (idx !== -1) {
            const newQty = parseInt(quantity);
            if (newQty <= 0) {
                items.splice(idx, 1);
            } else {
                const maxStock = product ? product.stock : 99;
                items[idx].quantity = Math.min(newQty, maxStock);
            }
            saveItems(items);
        }
    }

    function removeItem(productId, size) {
        let items = getItems();
        items = items.filter(i => !(i.product_id === Number(productId) && i.size === size));
        saveItems(items);
    }

    function clearCart() {
        saveItems([]);
        localStorage.removeItem(PROMO_STORAGE_KEY);
    }

    function applyPromoCode(code) {
        const clean = code.trim().toUpperCase();
        if (clean === 'NEW10' || clean === 'PHONK10') {
            localStorage.setItem(PROMO_STORAGE_KEY, JSON.stringify({ code: clean, discountPercent: 0.10, label: '10% Off' }));
            return { success: true, message: `Coupon ${clean} applied! 10% off.` };
        } else if (clean === 'MIDTERM') {
            localStorage.setItem(PROMO_STORAGE_KEY, JSON.stringify({ code: clean, discountFixed: 5.00, label: '$5.00 Off' }));
            return { success: true, message: 'Midterm promo applied! $5 discount.' };
        } else {
            return { success: false, message: 'Invalid promo code. Try NEW10 or MIDTERM.' };
        }
    }

    function removePromoCode() {
        localStorage.removeItem(PROMO_STORAGE_KEY);
    }

    function getAppliedPromo() {
        const promo = localStorage.getItem(PROMO_STORAGE_KEY);
        return promo ? JSON.parse(promo) : null;
    }

    function getTotals() {
        const items = getItems();
        const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        
        // Shipping is free if subtotal > $75, else flat $3.00 (or $0 if empty)
        const shipping = items.length === 0 ? 0 : (subtotal >= 75 ? 0 : 3.00);

        let discount = 0;
        const promo = getAppliedPromo();
        if (promo && subtotal > 0) {
            if (promo.discountPercent) {
                discount = subtotal * promo.discountPercent;
            } else if (promo.discountFixed) {
                discount = Math.min(promo.discountFixed, subtotal);
            }
        }

        const grandTotal = Math.max(0, subtotal + shipping - discount);

        return {
            itemCount: items.reduce((sum, i) => sum + i.quantity, 0),
            subtotal: parseFloat(subtotal.toFixed(2)),
            shipping: parseFloat(shipping.toFixed(2)),
            discount: parseFloat(discount.toFixed(2)),
            total: parseFloat(grandTotal.toFixed(2)),
            promo
        };
    }

    return {
        getItems,
        addItem,
        updateQuantity,
        removeItem,
        clearCart,
        applyPromoCode,
        removePromoCode,
        getAppliedPromo,
        getTotals
    };
})();
