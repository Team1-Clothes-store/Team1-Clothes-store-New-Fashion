-- ===================================================
-- New Fashion - Seed Data
-- ===================================================

USE new_fashion;

-- Seed Users (Passwords stored in plain/mock hash for demo)
INSERT INTO users (user_id, name, email, password, role, phone, address) VALUES
(1, 'Admin New Fashion', 'admin@newfashion.com', 'admin123', 'Admin', '+855 12 345 678', 'Street 271, Phnom Penh, Cambodia'),
(2, 'Niem Sreynit', 'sreynit@gmail.com', 'user123', 'Customer', '+855 98 765 432', 'Toul Kork, Phnom Penh, Cambodia'),
(3, 'Ruon Bulimunny', 'bulimunny@gmail.com', 'user123', 'Customer', '+855 77 112 233', 'Boeung Keng Kang, Phnom Penh'),
(4, 'Surs Panha', 'panha@gmail.com', 'user123', 'Customer', '+855 89 445 566', 'Sen Sok, Phnom Penh'),
(5, 'Chem Malin', 'malin@gmail.com', 'user123', 'Customer', '+855 96 332 211', 'Chroy Changvar, Phnom Penh');

-- Seed Categories
INSERT INTO categories (category_id, name, description) VALUES
(1, 'Men\'s Clothing', 'Modern streetwear shirts, t-shirts, hoodies and cargo pants for men'),
(2, 'Women\'s Clothing', 'Trendy fashion dresses, shirts, pleated skirts and parachute pants'),
(3, 'Fashion Accessories', 'Caps, crossbody bags, chains and modern fashion accessories');

-- Seed Products
INSERT INTO products (product_id, category_id, name, price, stock, image, description) VALUES
(1, 1, 'Oversized Acid-Wash Street Tee', 29.99, 45, 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80', 'Heavyweight 240GSM cotton with vintage acid-wash finish and subtle embroidered chest logo.'),
(2, 1, 'Midnight Heavyweight Street Hoodie', 54.99, 30, 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800&auto=format&fit=crop&q=80', 'Premium fleece-lined oversized hoodie in washed midnight black. Ribbed cuffs and dropped shoulders.'),
(3, 1, 'Tactical Modular Cargo Pants', 49.99, 25, 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=800&auto=format&fit=crop&q=80', 'Weather-resistant nylon blend with deep multi-strap utility pockets and adjustable ankle cinches.'),
(4, 1, 'Vintage Striped Relaxed Shirt', 34.50, 40, 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800&auto=format&fit=crop&q=80', 'Breathable open collar camp shirt featuring retro-inspired neutral stripes and relaxed boxy drape.'),
(5, 1, 'Urban Division Graphic T-Shirt', 27.00, 60, 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800&auto=format&fit=crop&q=80', 'Bold modern typography and urban culture graphic print across back and chest in pure combed cotton.'),
(6, 1, 'Wide-Leg Pleated Tailored Pants', 46.00, 20, 'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=800&auto=format&fit=crop&q=80', 'Structured high-waisted relaxed trouser for elevated fashion look. Premium wool-polyester blend.'),

(7, 2, 'Neo-Gothic Slip Midi Dress', 48.00, 35, 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=800&auto=format&fit=crop&q=80', 'Sleek satin slip dress with adjustable thin straps and side slit, tailored for day-to-night styling.'),
(8, 2, 'Y2K Cyber Cropped Long Sleeve', 26.50, 50, 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=800&auto=format&fit=crop&q=80', 'Ribbed stretchy contour fabric with thumbhole sleeves and minimalist front metallic badge.'),
(9, 2, 'High-Waisted Pleated Tennis Skirt', 32.00, 40, 'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=800&auto=format&fit=crop&q=80', 'Classic razor-sharp knife pleats with built-in safety shorts and hidden side zipper.'),
(10, 2, 'Urban Parachute Cargo Pants', 52.00, 28, 'https://images.unsplash.com/photo-1517445312882-bc9910d016b7?w=800&auto=format&fit=crop&q=80', 'Lightweight ultra-wide techwear parachute trousers with toggle cords and reflective striping.'),
(11, 2, 'Velvet Bodycon Night Mini Dress', 59.99, 18, 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&auto=format&fit=crop&q=80', 'Luxe stretch crushed velvet sculpts body silhouette with squared neckline and subtle ruched seams.'),
(12, 2, 'Oversized Distressed Knit Sweater', 42.00, 32, 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=800&auto=format&fit=crop&q=80', 'Chunky ladder-stitch distressed cotton-blend sweater for effortless streetwear layering.'),

(13, 3, 'Tactical Crossbody Chest Bag', 36.00, 55, 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=80', 'Waterproof Cordura fabric with heavy-duty quick-release buckle, Molle webbing, and phone pouch.'),
(14, 3, 'New Fashion Embroidered Trucker Cap', 22.00, 70, 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=800&auto=format&fit=crop&q=80', 'Classic 5-panel curved brim foam trucker with breathable mesh back and signature 3D New Fashion logo.'),
(15, 3, 'Cuban Link Titanium Necklace', 25.00, 45, 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&auto=format&fit=crop&q=80', 'Heavyweight hypoallergenic stainless steel Cuban link chain with high-polish mirrored finish.'),
(16, 3, 'Modern Rimless Sunglasses', 24.00, 40, 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800&auto=format&fit=crop&q=80', 'Aerodynamic wraparound UV400 mirrored shield shades with lightweight silver metal frames.');

-- Seed Orders
INSERT INTO orders (order_id, user_id, order_date, status, total, customer_name, customer_phone, customer_address, notes) VALUES
(101, 2, '2026-10-25 10:15:00', 'Delivered', 84.98, 'Niem Sreynit', '+855 98 765 432', 'House 12B, St 315, Toul Kork, Phnom Penh', 'Please leave at reception'),
(102, 3, '2026-10-28 14:30:00', 'Shipped', 104.98, 'Ruon Bulimunny', '+855 77 112 233', 'Condo 5F, BKK1, Phnom Penh', 'Call before arrival'),
(103, 4, '2026-11-01 09:45:00', 'Processing', 59.99, 'Surs Panha', '+855 89 445 566', 'Street 1986, Sen Sok, Phnom Penh', 'Deliver in the afternoon'),
(104, 2, '2026-11-03 16:20:00', 'Pending', 76.99, 'Niem Sreynit', '+855 98 765 432', 'House 12B, St 315, Toul Kork, Phnom Penh', 'Fast shipping please');

-- Seed Order Items
INSERT INTO order_items (order_item_id, order_id, product_id, quantity, price) VALUES
(1, 101, 1, 1, 29.99),
(2, 101, 2, 1, 54.99),
(3, 102, 3, 1, 49.99),
(4, 102, 7, 1, 48.00),
(5, 102, 14, 1, 22.00),
(6, 103, 11, 1, 59.99),
(7, 104, 13, 1, 36.00),
(8, 104, 8, 1, 26.50);

-- Seed Payments
INSERT INTO payments (payment_id, order_id, method, amount, status, payment_date, transaction_ref) VALUES
(1, 101, 'ABA KHQR', 84.98, 'Paid', '2026-10-25 10:16:00', 'KHQR-TXN-90281'),
(2, 102, 'Credit Card', 104.98, 'Paid', '2026-10-28 14:31:00', 'CARD-TXN-44129'),
(3, 103, 'ABA KHQR', 59.99, 'Paid', '2026-11-01 09:46:00', 'KHQR-TXN-77341'),
(4, 104, 'Cash on Delivery', 76.99, 'Pending', '2026-11-03 16:20:00', 'COD-REF-104');
