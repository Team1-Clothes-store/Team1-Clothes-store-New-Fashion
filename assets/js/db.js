/**
 * New Fashion - Local Relational Database Engine
 * Implements the 6 tables specified in Section 4.1 of the planning assignment:
 * 1. users
 * 2. categories
 * 3. products
 * 4. orders
 * 5. order_items
 * 6. payments
 */

const DB = (function() {
    const STORAGE_KEY_PREFIX = 'newfashion_db_';

    const DEFAULT_CATEGORIES = [
        { category_id: 1, name: "Men's Clothing", description: "Modern fashion shirts, t-shirts, hoodies and cargo pants for men" },
        { category_id: 2, name: "Women's Clothing", description: "Trendy street dresses, shirts, pleated skirts and parachute pants" },
        { category_id: 3, name: "Fashion Accessories", description: "Caps, crossbody bags, chains and modern fashion accessories" }
    ];

    const DEFAULT_USERS = [
        {
            user_id: 1,
            name: "Admin New Fashion",
            email: "admin@newfashion.com",
            password: "admin123",
            role: "Admin",
            phone: "+855 12 345 678",
            address: "Street 271, Phnom Penh, Cambodia",
            created_at: "2026-10-01T08:00:00Z"
        },
        {
            user_id: 2,
            name: "Niem Sreynit",
            email: "sreynit@gmail.com",
            password: "user123",
            role: "Customer",
            phone: "+855 98 765 432",
            address: "House 12B, St 315, Toul Kork, Phnom Penh",
            created_at: "2026-10-15T09:30:00Z"
        },
        {
            user_id: 3,
            name: "Ruon Bulimunny",
            email: "bulimunny@gmail.com",
            password: "user123",
            role: "Customer",
            phone: "+855 77 112 233",
            address: "Condo 5F, BKK1, Phnom Penh",
            created_at: "2026-10-18T11:20:00Z"
        },
        {
            user_id: 4,
            name: "Surs Panha",
            email: "panha@gmail.com",
            password: "user123",
            role: "Customer",
            phone: "+855 89 445 566",
            address: "Street 1986, Sen Sok, Phnom Penh",
            created_at: "2026-10-20T14:45:00Z"
        },
        {
            user_id: 5,
            name: "Chem Malin",
            email: "malin@gmail.com",
            password: "user123",
            role: "Customer",
            phone: "+855 96 332 211",
            address: "Chroy Changvar, Phnom Penh",
            created_at: "2026-10-22T16:10:00Z"
        }
    ];

    const DEFAULT_PRODUCTS = [
        {
            product_id: 1,
            category_id: 1,
            name: "Oversized Acid-Wash Street Tee",
            price: 29.99,
            stock: 45,
            image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80",
            description: "Heavyweight 240GSM cotton with vintage acid-wash finish and subtle embroidered chest logo. Built for ultimate relaxed streetwear drape."
        },
        {
            product_id: 2,
            category_id: 1,
            name: "Midnight Heavyweight Street Hoodie",
            price: 54.99,
            stock: 30,
            image: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800&auto=format&fit=crop&q=80",
            description: "Premium fleece-lined oversized hoodie in washed midnight black. Features ribbed cuffs, dropped shoulders, and double-layered hood."
        },
        {
            product_id: 3,
            category_id: 1,
            name: "Tactical Modular Cargo Pants",
            price: 49.99,
            stock: 25,
            image: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=800&auto=format&fit=crop&q=80",
            description: "Weather-resistant nylon blend with deep multi-strap utility pockets, reinforced knee panels, and adjustable ankle cinches."
        },
        {
            product_id: 4,
            category_id: 1,
            name: "Vintage Striped Relaxed Shirt",
            price: 34.50,
            stock: 40,
            image: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800&auto=format&fit=crop&q=80",
            description: "Breathable open-collar camp shirt featuring retro-inspired neutral stripes and a breezy relaxed silhouette."
        },
        {
            product_id: 5,
            category_id: 1,
            name: "Urban Division Graphic T-Shirt",
            price: 27.00,
            stock: 60,
            image: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800&auto=format&fit=crop&q=80",
            description: "Bold modern typography and urban culture graphic print across back and chest in 100% pure combed organic cotton."
        },
        {
            product_id: 6,
            category_id: 1,
            name: "Wide-Leg Pleated Tailored Pants",
            price: 46.00,
            stock: 20,
            image: "https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=800&auto=format&fit=crop&q=80",
            description: "Structured high-waisted relaxed trouser for elevated fashion look. Premium wrinkle-resistant blend."
        },
        {
            product_id: 7,
            category_id: 2,
            name: "Neo-Gothic Slip Midi Dress",
            price: 48.00,
            stock: 35,
            image: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=800&auto=format&fit=crop&q=80",
            description: "Sleek satin slip dress with adjustable thin straps and side slit, tailored for effortless day-to-night styling."
        },
        {
            product_id: 8,
            category_id: 2,
            name: "Y2K Cyber Cropped Long Sleeve",
            price: 26.50,
            stock: 50,
            image: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=800&auto=format&fit=crop&q=80",
            description: "Ribbed stretchy contour fabric with thumbhole sleeves and minimalist front metallic New Fashion hardware badge."
        },
        {
            product_id: 9,
            category_id: 2,
            name: "High-Waisted Pleated Tennis Skirt",
            price: 32.00,
            stock: 40,
            image: "https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=800&auto=format&fit=crop&q=80",
            description: "Classic razor-sharp knife pleats with built-in safety stretch shorts and hidden invisible side zipper."
        },
        {
            product_id: 10,
            category_id: 2,
            name: "Urban Parachute Cargo Pants",
            price: 52.00,
            stock: 28,
            image: "https://images.unsplash.com/photo-1517445312882-bc9910d016b7?w=800&auto=format&fit=crop&q=80",
            description: "Lightweight ultra-wide techwear parachute trousers with elastic toggle cords and subtle reflective piping."
        },
        {
            product_id: 11,
            category_id: 2,
            name: "Velvet Bodycon Night Mini Dress",
            price: 59.99,
            stock: 18,
            image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&auto=format&fit=crop&q=80",
            description: "Luxe stretch crushed velvet sculpts body silhouette with squared neckline and subtle ruched seams."
        },
        {
            product_id: 12,
            category_id: 2,
            name: "Oversized Distressed Knit Sweater",
            price: 42.00,
            stock: 32,
            image: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=800&auto=format&fit=crop&q=80",
            description: "Chunky ladder-stitch distressed cotton-blend sweater for effortless streetwear layering."
        },
        {
            product_id: 13,
            category_id: 3,
            name: "Tactical Crossbody Chest Bag",
            price: 36.00,
            stock: 55,
            image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=80",
            description: "Waterproof Cordura fabric with heavy-duty quick-release cobra buckle, Molle webbing, and quick-access phone pouch."
        },
        {
            product_id: 14,
            category_id: 3,
            name: "New Fashion Embroidered Trucker Cap",
            price: 22.00,
            stock: 70,
            image: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=800&auto=format&fit=crop&q=80",
            description: "Classic 5-panel curved brim foam trucker with breathable mesh back and signature 3D New Fashion embroidery."
        },
        {
            product_id: 15,
            category_id: 3,
            name: "Cuban Link Titanium Necklace",
            price: 25.00,
            stock: 45,
            image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&auto=format&fit=crop&q=80",
            description: "Heavyweight hypoallergenic stainless steel Cuban link chain with high-polish mirrored chrome finish (55cm)."
        },
        {
            product_id: 16,
            category_id: 3,
            name: "Modern Rimless Sunglasses",
            price: 24.00,
            stock: 40,
            image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800&auto=format&fit=crop&q=80",
            description: "Aerodynamic wraparound UV400 mirrored shield shades with lightweight silver metal frames."
        }
    ];

    const DEFAULT_ORDERS = [
        {
            order_id: 101,
            user_id: 2,
            order_date: "2026-10-25T10:15:00Z",
            status: "Delivered",
            total: 84.98,
            customer_name: "Niem Sreynit",
            customer_phone: "+855 98 765 432",
            customer_address: "House 12B, St 315, Toul Kork, Phnom Penh",
            notes: "Please leave with security"
        },
        {
            order_id: 102,
            user_id: 3,
            order_date: "2026-10-28T14:30:00Z",
            status: "Shipped",
            total: 104.98,
            customer_name: "Ruon Bulimunny",
            customer_phone: "+855 77 112 233",
            customer_address: "Condo 5F, BKK1, Phnom Penh",
            notes: "Call 15 minutes before arrival"
        },
        {
            order_id: 103,
            user_id: 4,
            order_date: "2026-11-01T09:45:00Z",
            status: "Processing",
            total: 59.99,
            customer_name: "Surs Panha",
            customer_phone: "+855 89 445 566",
            customer_address: "Street 1986, Sen Sok, Phnom Penh",
            notes: "Afternoon delivery preferred"
        },
        {
            order_id: 104,
            user_id: 2,
            order_date: "2026-11-03T16:20:00Z",
            status: "Pending",
            total: 76.99,
            customer_name: "Niem Sreynit",
            customer_phone: "+855 98 765 432",
            customer_address: "House 12B, St 315, Toul Kork, Phnom Penh",
            notes: "Express delivery"
        }
    ];

    const DEFAULT_ORDER_ITEMS = [
        { order_item_id: 1, order_id: 101, product_id: 1, quantity: 1, price: 29.99, size: "L" },
        { order_item_id: 2, order_id: 101, product_id: 2, quantity: 1, price: 54.99, size: "XL" },
        { order_item_id: 3, order_id: 102, product_id: 3, quantity: 1, price: 49.99, size: "M" },
        { order_item_id: 4, order_id: 102, product_id: 7, quantity: 1, price: 48.00, size: "M" },
        { order_item_id: 5, order_id: 102, product_id: 14, quantity: 1, price: 22.00, size: "One Size" },
        { order_item_id: 6, order_id: 103, product_id: 11, quantity: 1, price: 59.99, size: "S" },
        { order_item_id: 7, order_id: 104, product_id: 13, quantity: 1, price: 36.00, size: "One Size" },
        { order_item_id: 8, order_id: 104, product_id: 8, quantity: 1, price: 26.50, size: "M" }
    ];

    const DEFAULT_PAYMENTS = [
        {
            payment_id: 1,
            order_id: 101,
            method: "ABA KHQR",
            amount: 84.98,
            status: "Paid",
            payment_date: "2026-10-25T10:16:00Z",
            transaction_ref: "KHQR-TXN-90281"
        },
        {
            payment_id: 2,
            order_id: 102,
            method: "Credit Card",
            amount: 104.98,
            status: "Paid",
            payment_date: "2026-10-28T14:31:00Z",
            transaction_ref: "CARD-TXN-44129"
        },
        {
            payment_id: 3,
            order_id: 103,
            method: "ABA KHQR",
            amount: 59.99,
            status: "Paid",
            payment_date: "2026-11-01T09:46:00Z",
            transaction_ref: "KHQR-TXN-77341"
        },
        {
            payment_id: 4,
            order_id: 104,
            method: "Cash on Delivery",
            amount: 76.99,
            status: "Pending",
            payment_date: "2026-11-03T16:20:00Z",
            transaction_ref: "COD-REF-104"
        }
    ];

    function getTable(name) {
        const data = localStorage.getItem(STORAGE_KEY_PREFIX + name);
        return data ? JSON.parse(data) : [];
    }

    function setTable(name, data) {
        localStorage.setItem(STORAGE_KEY_PREFIX + name, JSON.stringify(data));
    }

    function init() {
        if (!localStorage.getItem(STORAGE_KEY_PREFIX + 'initialized')) {
            reset();
        }
    }

    function reset() {
        setTable('categories', DEFAULT_CATEGORIES);
        setTable('users', DEFAULT_USERS);
        setTable('products', DEFAULT_PRODUCTS);
        setTable('orders', DEFAULT_ORDERS);
        setTable('order_items', DEFAULT_ORDER_ITEMS);
        setTable('payments', DEFAULT_PAYMENTS);
        localStorage.setItem(STORAGE_KEY_PREFIX + 'initialized', 'true');
        console.log('Database initialized with default seed data.');
    }

    // --- USERS (Table 1) ---
    function getUsers() {
        return getTable('users');
    }

    function getUserById(userId) {
        return getUsers().find(u => u.user_id === Number(userId)) || null;
    }

    function getUserByEmail(email) {
        return getUsers().find(u => u.email.toLowerCase() === email.trim().toLowerCase()) || null;
    }

    function createUser(user) {
        const users = getUsers();
        const nextId = users.length > 0 ? Math.max(...users.map(u => u.user_id)) + 1 : 1;
        const newUser = {
            user_id: nextId,
            name: user.name,
            email: user.email,
            password: user.password,
            role: user.role || 'Customer',
            phone: user.phone || '',
            address: user.address || '',
            created_at: new Date().toISOString()
        };
        users.push(newUser);
        setTable('users', users);
        return newUser;
    }

    // --- CATEGORIES (Table 2) ---
    function getCategories() {
        return getTable('categories');
    }

    function getCategoryById(categoryId) {
        return getCategories().find(c => c.category_id === Number(categoryId)) || null;
    }

    function addCategory(category) {
        const categories = getCategories();
        const nextId = categories.length > 0 ? Math.max(...categories.map(c => c.category_id)) + 1 : 1;
        const newCat = {
            category_id: nextId,
            name: category.name,
            description: category.description || ''
        };
        categories.push(newCat);
        setTable('categories', categories);
        return newCat;
    }

    function updateCategory(categoryId, updatedData) {
        const categories = getCategories();
        const idx = categories.findIndex(c => c.category_id === Number(categoryId));
        if (idx !== -1) {
            categories[idx] = { ...categories[idx], ...updatedData };
            setTable('categories', categories);
            return categories[idx];
        }
        return null;
    }

    function deleteCategory(categoryId) {
        let categories = getCategories();
        categories = categories.filter(c => c.category_id !== Number(categoryId));
        setTable('categories', categories);
    }

    // --- PRODUCTS (Table 3) ---
    function getProducts() {
        return getTable('products');
    }

    function getProductById(productId) {
        return getProducts().find(p => p.product_id === Number(productId)) || null;
    }

    function addProduct(product) {
        const products = getProducts();
        const nextId = products.length > 0 ? Math.max(...products.map(p => p.product_id)) + 1 : 1;
        const newProd = {
            product_id: nextId,
            category_id: Number(product.category_id),
            name: product.name,
            price: parseFloat(product.price),
            stock: parseInt(product.stock) || 0,
            image: product.image || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80',
            description: product.description || ''
        };
        products.push(newProd);
        setTable('products', products);
        return newProd;
    }

    function updateProduct(productId, updatedData) {
        const products = getProducts();
        const idx = products.findIndex(p => p.product_id === Number(productId));
        if (idx !== -1) {
            products[idx] = {
                ...products[idx],
                ...updatedData,
                price: parseFloat(updatedData.price ?? products[idx].price),
                stock: parseInt(updatedData.stock ?? products[idx].stock),
                category_id: Number(updatedData.category_id ?? products[idx].category_id)
            };
            setTable('products', products);
            return products[idx];
        }
        return null;
    }

    function deleteProduct(productId) {
        let products = getProducts();
        products = products.filter(p => p.product_id !== Number(productId));
        setTable('products', products);
    }

    // --- ORDERS (Table 4) & ORDER_ITEMS (Table 5) & PAYMENTS (Table 6) ---
    function getOrders() {
        return getTable('orders');
    }

    function getOrderItems() {
        return getTable('order_items');
    }

    function getPayments() {
        return getTable('payments');
    }

    function getOrderById(orderId) {
        const order = getOrders().find(o => o.order_id === Number(orderId));
        if (!order) return null;
        const items = getOrderItems().filter(i => i.order_id === Number(orderId)).map(i => {
            const product = getProductById(i.product_id);
            return {
                ...i,
                product_name: product ? product.name : 'Unknown Product',
                product_image: product ? product.image : ''
            };
        });
        const payment = getPayments().find(p => p.order_id === Number(orderId));
        return {
            ...order,
            items,
            payment
        };
    }

    function getOrdersByUserId(userId) {
        const orders = getOrders().filter(o => o.user_id === Number(userId));
        return orders.map(o => getOrderById(o.order_id)).sort((a, b) => new Date(b.order_date) - new Date(a.order_date));
    }

    function createOrder(orderData, items, paymentMethod) {
        const orders = getOrders();
        const orderItems = getOrderItems();
        const payments = getPayments();
        const products = getProducts();

        const nextOrderId = orders.length > 0 ? Math.max(...orders.map(o => o.order_id)) + 1 : 101;

        const newOrder = {
            order_id: nextOrderId,
            user_id: Number(orderData.user_id),
            order_date: new Date().toISOString(),
            status: 'Pending',
            total: parseFloat(orderData.total),
            customer_name: orderData.customer_name,
            customer_phone: orderData.customer_phone,
            customer_address: orderData.customer_address,
            notes: orderData.notes || ''
        };
        orders.unshift(newOrder);

        // Add line items and reduce stock
        let nextItemId = orderItems.length > 0 ? Math.max(...orderItems.map(i => i.order_item_id)) + 1 : 1;
        items.forEach(item => {
            orderItems.push({
                order_item_id: nextItemId++,
                order_id: nextOrderId,
                product_id: Number(item.product_id),
                quantity: parseInt(item.quantity),
                price: parseFloat(item.price),
                size: item.size || 'M'
            });

            // Adjust inventory stock
            const prodIdx = products.findIndex(p => p.product_id === Number(item.product_id));
            if (prodIdx !== -1) {
                products[prodIdx].stock = Math.max(0, products[prodIdx].stock - parseInt(item.quantity));
            }
        });

        // Add payment record (1:1 with order)
        const nextPaymentId = payments.length > 0 ? Math.max(...payments.map(p => p.payment_id)) + 1 : 1;
        const newPayment = {
            payment_id: nextPaymentId,
            order_id: nextOrderId,
            method: paymentMethod,
            amount: parseFloat(orderData.total),
            status: paymentMethod === 'Cash on Delivery' ? 'Pending' : 'Paid',
            payment_date: new Date().toISOString(),
            transaction_ref: 'TXN-' + Math.floor(100000 + Math.random() * 900000)
        };
        payments.push(newPayment);

        setTable('orders', orders);
        setTable('order_items', orderItems);
        setTable('payments', payments);
        setTable('products', products);

        return getOrderById(nextOrderId);
    }

    function updateOrderStatus(orderId, newStatus) {
        const orders = getOrders();
        const idx = orders.findIndex(o => o.order_id === Number(orderId));
        if (idx !== -1) {
            orders[idx].status = newStatus;
            setTable('orders', orders);

            // Update payment status if delivered or cancelled
            if (newStatus === 'Delivered') {
                const payments = getPayments();
                const payIdx = payments.findIndex(p => p.order_id === Number(orderId));
                if (payIdx !== -1) {
                    payments[payIdx].status = 'Paid';
                    setTable('payments', payments);
                }
            } else if (newStatus === 'Cancelled') {
                const payments = getPayments();
                const payIdx = payments.findIndex(p => p.order_id === Number(orderId));
                if (payIdx !== -1) {
                    payments[payIdx].status = 'Failed';
                    setTable('payments', payments);
                }
            }
            return orders[idx];
        }
        return null;
    }

    function getStats() {
        const orders = getOrders();
        const products = getProducts();
        const users = getUsers().filter(u => u.role === 'Customer');

        const totalRevenue = orders
            .filter(o => o.status !== 'Cancelled')
            .reduce((sum, o) => sum + parseFloat(o.total || 0), 0);

        return {
            revenue: totalRevenue.toFixed(2),
            ordersCount: orders.length,
            productsCount: products.length,
            customersCount: users.length,
            pendingOrders: orders.filter(o => o.status === 'Pending').length,
            deliveredOrders: orders.filter(o => o.status === 'Delivered').length
        };
    }

    return {
        init,
        reset,
        getUsers,
        getUserById,
        getUserByEmail,
        createUser,
        getCategories,
        getCategoryById,
        addCategory,
        updateCategory,
        deleteCategory,
        getProducts,
        getProductById,
        addProduct,
        updateProduct,
        deleteProduct,
        getOrders,
        getOrderById,
        getOrdersByUserId,
        createOrder,
        updateOrderStatus,
        getStats
    };
})();

// Auto initialize on load
DB.init();
