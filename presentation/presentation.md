# NEW FASHION – E-Commerce Project Presentation
**Assignment – Midterm 1 | Class: PG-B**

## Team Members
1. **Niem sreynit**
2. **Ruon Bulimunny**
3. **Surs Panha**
4. **Chem Malin**

---

### Slide 1: Project Introduction
- **Store Name**: New Fashion – Online Clothing Store
- **Business Type**: E-Commerce / Online Fashion
- **Tagline**: Modern Streetwear & Contemporary Apparel Delivered to Your Doorstep
- **Target Platform**: Responsive Web Application (Mobile, Tablet, Desktop)

### Slide 2: Business Idea
- New Fashion is a B2C online clothing store offering trendsetters and fashion enthusiasts access to curated modern streetwear collections.
- Customers can effortlessly browse categories, inspect detailed product specs, select sizing, add items to their shopping cart, and complete orders with realistic mock payment methods (Card, ABA KHQR, COD).

### Slide 3: Target Customer
- **Teenagers and Young Adults**: Urban youth passionate about contemporary fashion, modern aesthetic, and casual wear.
- **Home Shoppers**: Customers who value the comfort and efficiency of shopping from home without visiting physical storefronts.
- **Comparison & Savvy Shoppers**: Users looking for competitive prices, clear sizing guides, and immediate order verification.
- **Multi-Device Users**: Shoppers who browse primarily on smartphones and personal computers.

### Slide 4: E-Commerce Model
- **Model**: B2C (Business-to-Consumer).
- **Value Proposition**: Direct sales to consumers, eliminating intermediary markups, guaranteeing authentic styles and rapid local delivery.

### Slide 5: Main Business Process & Flow
1. **Browse / Search**: Customer lands on homepage, filters by Category (Men, Women, Accessories) or queries search.
2. **Product Details**: Customer views photo gallery, pricing, stock count, and selects size & quantity.
3. **Shopping Cart**: Review items, adjust quantities, calculate subtotal and delivery cost.
4. **Checkout**: Input shipping address, contact details, and special instructions.
5. **Mock Payment**: Select preferred method (ABA KHQR, Credit Card, or Cash on Delivery).
6. **Order Confirmation & Tracking**: System generates Order ID, creates database entries, and provides interactive tracking status.

### Slide 6: Website Sitemap
- **Home**: Banner, Featured Collections, Quick Categories, Value Highlights
- **Categories**: Men's Wear, Women's Wear, Accessories
- **Products & Product Details**: Filterable Catalog, Sorting, Interactive Detail Modal
- **Search**: Dynamic instant search with keyword highlights
- **Cart & Checkout**: Slide-out drawer, step-by-step checkout wizard
- **Authentication**: Customer Login / Register & Admin Portal Switch
- **My Orders**: Real-time order progress timeline (Pending -> Processing -> Shipped -> Delivered)
- **Admin Panel**: Dashboard Statistics, Product CRUD, Category CRUD, Customer Management, Order Tracking

### Slide 7: Database Design (ERD & Relational Integrity)
- **Tables (6)**:
  1. `users`: Stores customer and administrator accounts (`user_id` PK)
  2. `categories`: Classification hierarchy (`category_id` PK)
  3. `products`: Inventory catalog (`product_id` PK, `category_id` FK)
  4. `orders`: Customer transactions (`order_id` PK, `user_id` FK)
  5. `order_items`: Order line items (`order_item_id` PK, `order_id` FK, `product_id` FK)
  6. `payments`: Payment logs (`payment_id` PK, `order_id` FK)
- **Relationships**:
  - Users 1:N Orders
  - Categories 1:N Products
  - Orders 1:N Order_Items
  - Products 1:N Order_Items
  - Orders 1:1 Payments

### Slide 8: Conclusion & Next Steps
- Successfully established end-to-end B2C system architecture for New Fashion.
- Implemented responsive, high-performance frontend UI with real-time state management.
- Delivered full database schema adhering precisely to course specifications.
- Ready for deployment and demonstration.
