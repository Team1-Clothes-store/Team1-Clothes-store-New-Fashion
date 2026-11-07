/**
 * New Fashion - Interactive Midterm Presentation Viewer
 * Renders all 8 slides specified in Section 6 of the project planning document.
 */

const Presentation = (function() {
    let currentSlide = 1;
    const totalSlides = 8;

    const slidesData = [
        {
            num: 1,
            title: "Project Introduction",
            subtitle: "New Fashion – Online Clothing Store",
            badge: "Assignment – Midterm 1 | Class PG-B",
            content: `
                <div class="slide-intro-card">
                    <div class="slide-logo-brand">NEW FASHION</div>
                    <p class="slide-tagline">Contemporary Streetwear & Modern Lifestyle E-Commerce</p>
                    <div class="slide-team-box">
                        <h4>Prepared By Team Members:</h4>
                        <ol class="team-list">
                            <li><strong>Niem sreynit</strong></li>
                            <li><strong>Ruon Bulimunny</strong></li>
                            <li><strong>Surs Panha</strong></li>
                            <li><strong>Chem Malin</strong></li>
                        </ol>
                        <div class="class-badge">Class / Instructor: <strong>PG-B</strong></div>
                    </div>
                </div>
            `
        },
        {
            num: 2,
            title: "Business Idea",
            subtitle: "1.2 Online Clothing Store Concept",
            badge: "Business Planning",
            content: `
                <div class="slide-bullets-card">
                    <p class="slide-lead">New Fashion is an online destination tailored for modern fashion & streetwear enthusiasts.</p>
                    <ul class="slide-feature-list">
                        <li><strong>Browse & Discover:</strong> Interactive catalog featuring curated Men's, Women's, and Accessory drops.</li>
                        <li><strong>Detailed Spec Inspection:</strong> Full transparency on fabric weight, sizes (S to XXL), and real-time inventory count.</li>
                        <li><strong>Shopping Cart & Checkout:</strong> Fast item management with instant subtotal and coupon calculation.</li>
                        <li><strong>Mock Payment Gateway:</strong> Realistic simulation of card processing, ABA KHQR mobile scan, and Cash on Delivery.</li>
                        <li><strong>Core Mission:</strong> Make online fashion shopping in Cambodia effortless, fast, and stylish.</li>
                    </ul>
                </div>
            `
        },
        {
            num: 3,
            title: "Target Customer",
            subtitle: "1.4 Customer Segmentation & Needs Solved",
            badge: "Market Analysis",
            content: `
                <div class="slide-grid-2col">
                    <div class="slide-col-box">
                        <h4>Target Customer Segments</h4>
                        <ul>
                            <li><strong>Teenagers & Young Adults:</strong> Driven by modern urban streetwear and casual fashion.</li>
                            <li><strong>Convenience Seekers:</strong> Customers who prefer the time savings of shopping from home.</li>
                            <li><strong>Comparison Shoppers:</strong> Users who compare styles, reviews, and prices before purchasing.</li>
                            <li><strong>Mobile & Desktop Users:</strong> Cross-platform shoppers browsing on phones and laptops.</li>
                        </ul>
                    </div>
                    <div class="slide-col-box">
                        <h4>Key Problems Solved</h4>
                        <ul>
                            <li><strong>Save Time:</strong> No need to spend hours visiting physical retail stores.</li>
                            <li><strong>Effortless Search:</strong> Fast category pills and live instant search.</li>
                            <li><strong>Transparent Information:</strong> Accurate pricing, sizing guides, and live stock indicator.</li>
                            <li><strong>Reliable Tracking:</strong> Instant order verification with stage-by-stage delivery tracking.</li>
                        </ul>
                    </div>
                </div>
            `
        },
        {
            num: 4,
            title: "E-Commerce Model",
            subtitle: "1.6 Business-to-Consumer (B2C) Architecture",
            badge: "Business Model",
            content: `
                <div class="slide-model-diagram">
                    <div class="b2c-card">
                        <div class="b2c-entity">
                            <span class="entity-icon">🏢</span>
                            <strong>New Fashion Store</strong>
                            <span>Inventory & Fulfillment</span>
                        </div>
                        <div class="b2c-arrow">
                            <span>Direct Sales & Fast Shipping</span>
                            ➔ ➔ ➔
                        </div>
                        <div class="b2c-entity">
                            <span class="entity-icon">🧑‍🤝‍🧑</span>
                            <strong>Individual Customers</strong>
                            <span>Online Shoppers (B2C)</span>
                        </div>
                    </div>
                    <div class="model-notes mt-4">
                        <p>Our direct B2C model cuts intermediary retail costs, passing the savings to customers while maintaining premium product standards and direct customer care.</p>
                    </div>
                </div>
            `
        },
        {
            num: 5,
            title: "Main Business Process & User Flow",
            subtitle: "2.4 & 2.5 Ten-Step End-to-End Workflow",
            badge: "Workflow",
            content: `
                <div class="slide-flow-steps">
                    <div class="flow-pill">1. Visit Store</div>
                    <div class="flow-arrow">➜</div>
                    <div class="flow-pill">2. Browse/Search</div>
                    <div class="flow-arrow">➜</div>
                    <div class="flow-pill">3. View Details</div>
                    <div class="flow-arrow">➜</div>
                    <div class="flow-pill">4. Add to Cart</div>
                    <div class="flow-arrow">➜</div>
                    <div class="flow-pill">5. Review Cart</div>
                </div>
                <div class="slide-flow-steps mt-3">
                    <div class="flow-pill">6. Fill Info</div>
                    <div class="flow-arrow">➜</div>
                    <div class="flow-pill">7. Mock Payment</div>
                    <div class="flow-arrow">➜</div>
                    <div class="flow-pill">8. Order Created</div>
                    <div class="flow-arrow">➜</div>
                    <div class="flow-pill">9. Admin Process</div>
                    <div class="flow-arrow">➜</div>
                    <div class="flow-pill">10. Delivery</div>
                </div>
            `
        },
        {
            num: 6,
            title: "Website Sitemap",
            subtitle: "2.6 Complete Navigation Architecture",
            badge: "System Planning",
            content: `
                <div class="sitemap-tree-container">
                    <div class="tree-root">New Fashion Store</div>
                    <div class="tree-branches">
                        <div class="tree-branch">
                            <strong>🛍️ Storefront</strong>
                            <ul>
                                <li>Home (Banner & Featured)</li>
                                <li>Categories (Men, Women, Accessories)</li>
                                <li>Search & Product Details Modal</li>
                            </ul>
                        </div>
                        <div class="tree-branch">
                            <strong>🛒 Checkout & Orders</strong>
                            <ul>
                                <li>Shopping Cart & Promo Codes</li>
                                <li>Checkout & Mock Payment (KHQR/Card/COD)</li>
                                <li>Order Confirmation & My Orders Tracking</li>
                            </ul>
                        </div>
                        <div class="tree-branch">
                            <strong>🔐 Admin Portal</strong>
                            <ul>
                                <li>Executive Dashboard & KPI Analytics</li>
                                <li>Products & Categories CRUD</li>
                                <li>Orders Management & Status Updater</li>
                            </ul>
                        </div>
                    </div>
                </div>
            `
        },
        {
            num: 7,
            title: "Database Design (ERD & Schema)",
            subtitle: "4.1 & 4.2 Relational Tables, PK, FK, and Integrity",
            badge: "Database Design",
            content: `
                <div class="slide-table-summary">
                    <table class="slide-data-table">
                        <thead>
                            <tr>
                                <th>Table</th>
                                <th>Primary Key (PK)</th>
                                <th>Foreign Key (FK)</th>
                                <th>Relationship</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td><code>users</code></td>
                                <td>user_id</td>
                                <td>—</td>
                                <td>1:N with orders</td>
                            </tr>
                            <tr>
                                <td><code>categories</code></td>
                                <td>category_id</td>
                                <td>—</td>
                                <td>1:N with products</td>
                            </tr>
                            <tr>
                                <td><code>products</code></td>
                                <td>product_id</td>
                                <td>category_id</td>
                                <td>N:1 with categories; 1:N with order_items</td>
                            </tr>
                            <tr>
                                <td><code>orders</code></td>
                                <td>order_id</td>
                                <td>user_id</td>
                                <td>N:1 with users; 1:N with order_items; 1:1 with payments</td>
                            </tr>
                            <tr>
                                <td><code>order_items</code></td>
                                <td>order_item_id</td>
                                <td>order_id, product_id</td>
                                <td>N:1 with orders and products</td>
                            </tr>
                            <tr>
                                <td><code>payments</code></td>
                                <td>payment_id</td>
                                <td>order_id</td>
                                <td>1:1 with orders</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            `
        },
        {
            num: 8,
            title: "Conclusion & Project Delivery",
            subtitle: "7. Summary & Demonstration Readiness",
            badge: "Conclusion",
            content: `
                <div class="slide-conclusion-card">
                    <p class="slide-lead">New Fashion fulfills all Midterm Project Planning specifications:</p>
                    <div class="concl-checklist">
                        <div class="check-row">✅ Full B2C E-Commerce requirements met</div>
                        <div class="check-row">✅ Responsive front-end UI matching Section 3 design</div>
                        <div class="check-row">✅ Relational database engine adhering to Section 4 tables</div>
                        <div class="check-row">✅ Admin Management & Customer Order Tracking implemented</div>
                        <div class="check-row">✅ Complete SQL scripts (schema.sql & seed.sql) generated</div>
                    </div>
                    <div class="concl-footer mt-4">
                        <button class="btn btn-primary" onclick="Presentation.closeModal(); App.navigateTo('products');">
                            🚀 Launch Live Storefront Demo
                        </button>
                    </div>
                </div>
            `
        }
    ];

    function openModal(slideNum = 1) {
        currentSlide = slideNum;
        renderSlide();
        const modal = document.getElementById('presentation-modal');
        if (modal) modal.classList.add('active');
    }

    function closeModal() {
        const modal = document.getElementById('presentation-modal');
        if (modal) modal.classList.remove('active');
    }

    function renderSlide() {
        const data = slidesData[currentSlide - 1];
        const bodyEl = document.getElementById('pres-slide-body');
        const counterEl = document.getElementById('pres-slide-counter');
        const prevBtn = document.getElementById('pres-btn-prev');
        const nextBtn = document.getElementById('pres-btn-next');

        if (!bodyEl) return;

        bodyEl.innerHTML = `
            <div class="slide-card animate-fade">
                <div class="slide-top-header">
                    <span class="slide-badge">${data.badge}</span>
                    <span class="slide-index-pill">Slide ${data.num} / ${totalSlides}</span>
                </div>
                <h1 class="slide-main-title">${data.title}</h1>
                <h3 class="slide-sub-title">${data.subtitle}</h3>
                <div class="slide-inner-content">
                    ${data.content}
                </div>
            </div>
        `;

        if (counterEl) counterEl.textContent = `${currentSlide} / ${totalSlides}`;
        if (prevBtn) prevBtn.disabled = currentSlide === 1;
        if (nextBtn) nextBtn.disabled = currentSlide === totalSlides;
    }

    function nextSlide() {
        if (currentSlide < totalSlides) {
            currentSlide++;
            renderSlide();
        }
    }

    function prevSlide() {
        if (currentSlide > 1) {
            currentSlide--;
            renderSlide();
        }
    }

    return {
        openModal,
        closeModal,
        nextSlide,
        prevSlide
    };
})();
