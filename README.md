# 🛍️ New Fashion – Online Clothing Store
> **E-Commerce Project Planning & System Design (Assignment – Midterm 1)**  
> **Class / Instructor:** `PG-B`  
> **E-Commerce Model:** B2C (Business to Customer)  
> **Business Type:** Online Fashion & Streetwear  

---

## 👥 Prepared By (Team Members)
1. **Niem sreynit**
2. **Ruon Bulimunny**
3. **Surs Panha**
4. **Chem Malin**

---

## 🚀 Quick Start / How to Run

No installations, Node.js, or complex database servers are required! Everything is portable and runs instantly:

### Option 1: Direct Browser Launch (Easiest)
Simply double-click [`index.html`](./index.html) or open it with **Google Chrome**, **Brave**, or **Microsoft Edge**.

### Option 2: Local Server via PowerShell
Right-click [`start-server.ps1`](./start-server.ps1) and choose **Run with PowerShell**, or execute in PowerShell:
```powershell
powershell -ExecutionPolicy Bypass -File .\start-server.ps1
```
Then visit: `http://localhost:8080`

---

## 🔑 Demo Accounts & Credentials

For instructor testing and grading, you can click the **👤 Account** button and use the **Demo Fast Login** buttons or enter:

| Role | Email | Password | Access / Pages |
| :--- | :--- | :--- | :--- |
| **Administrator** | `admin@newfashion.com` | `admin123` | Full Admin Panel, Dashboard KPIs, Product CRUD, Categories, Orders, Customers, Database Tools |
| **Customer** | `sreynit@gmail.com` | `user123` | Catalog, Cart, Checkout, Order Tracking, Receipt |
| **Customer** | `bulimunny@gmail.com` | `user123` | Customer Orders, Checkout |

*Tip: You can also place orders as a guest; an account will be automatically associated with your delivery details.*

### 🏷️ Active Promo Codes:
- `NEW10` → **10% Discount** on your order
- `MIDTERM` → **$5.00 Fixed Discount**

---

## 🗄️ Relational Database Architecture (Section 4)

The project strictly follows the 6 relational tables, Primary Keys (PK), Foreign Keys (FK), and cardinality constraints specified in Section 4.1 of the planning assignment:

| Table | Primary Key (PK) | Foreign Key (FK) | Important Fields | Relationship |
| :--- | :--- | :--- | :--- | :--- |
| `users` | `user_id` | — | `name`, `email`, `password`, `role`, `phone`, `address` | 1:N with `orders` |
| `categories` | `category_id` | — | `name`, `description` | 1:N with `products` |
| `products` | `product_id` | `category_id` | `name`, `price`, `stock`, `image`, `description` | N:1 with `categories`; 1:N with `order_items` |
| `orders` | `order_id` | `user_id` | `order_date`, `status`, `total`, `customer_name`, `customer_address` | N:1 with `users`; 1:N with `order_items`; 1:1 with `payments` |
| `order_items` | `order_item_id` | `order_id`, `product_id` | `quantity`, `price`, `size` | N:1 with `orders` and `products` |
| `payments` | `payment_id` | `order_id` | `method`, `amount`, `status`, `transaction_ref` | 1:1 with `orders` |

- **SQL Schema Script:** Located at [`database/schema.sql`](./database/schema.sql)
- **SQL Seed Data Script:** Located at [`database/seed.sql`](./database/seed.sql)
- **Live ERD Inspector:** Click the **🗄️** button in the website navigation to inspect the interactive schema.

---

## ✨ System Features & Pages (Section 2 & 3)

### 1. Storefront & Customer Experience
- **Home Screen:** Streetwear hero banner, value proposition badges, category highlights, and trending drops.
- **Product Catalog:** Real-time filtering by Category (*Men's Wear, Women's Wear, Accessories*), price brackets, and sorting (*Price Low-High, High-Low, Name, Featured*).
- **Live Search:** Instant search by keywords and product descriptions.
- **Product Details Modal:** High-resolution preview, stock counter, size selector (`S`, `M`, `L`, `XL`, `XXL`), quantity stepper, and "Instant Buy Now".
- **Cart Slide-Over Drawer:** Live badge counter, line-item quantity controls, coupon promo application, and automatic free shipping calculations ($75+).
- **Checkout Wizard:**
  - Delivery details input (Name, Phone, Address, Notes).
  - Mock Payment Gateways:
    - **ABA KHQR** (Realistic Cambodian Bakong QR code simulation with auto-verification)
    - **Credit / Debit Card** (Visa/Mastercard simulation)
    - **Cash on Delivery (COD)**
- **Order Confirmation:** Generated Order ID (e.g. `#NF-105`), breakdown, and direct link to live tracking.
- **Order Tracking & My Orders:** 4-stage delivery timeline (`Pending` ➔ `Processing` ➔ `Shipped` ➔ `Delivered`) and printable official invoice/receipt.

### 2. Admin Management Panel
- **Dashboard Overview:** Real-time KPI statistics (Total Revenue, Orders Count, Products in Stock, Registered Users) and recent order feed.
- **Products CRUD:** Add new streetwear items (with image URL, category, price, stock), edit existing products, or delete items.
- **Category Management:** Create, edit, and delete store categories.
- **Order Management:** Inspect any customer order and update delivery status (*Pending, Processing, Shipped, Delivered, Cancelled*). Updates immediately reflect on customer's order tracker.
- **Customer List:** View registered customers, emails, contact info, total orders placed, and lifetime spend.
- **Database Tools:** 1-click JSON database export and reset database to default seed state.

### 3. Built-In Midterm Presentation (Section 6)
Click the **📊 Midterm Slides** button in the header to open the built-in presentation slide deck containing all 8 slides required by the assignment:
- **Slide 1:** Project Introduction (New Fashion, Team Members, Class PG-B)
- **Slide 2:** Business Idea
- **Slide 3:** Target Customer
- **Slide 4:** E-Commerce Model (B2C)
- **Slide 5:** Main Business Process & User Flow (10 Steps)
- **Slide 6:** Website Sitemap
- **Slide 7:** Database Design (ERD & 6 Tables)
- **Slide 8:** Conclusion & Project Delivery

---

## 📁 Project Directory Structure
```
New Fashion/
│
├── index.html                  # Main SPA entrypoint
├── start-server.ps1            # Local PowerShell web server launcher
├── README.md                   # Complete assignment documentation
│
├── assets/
│   ├── css/
│   │   ├── style.css           # Main modern streetwear styles & animations
│   │   └── admin.css           # Admin dashboard & management styles
│   └── js/
│       ├── db.js               # Relational Database Engine (6 tables & localStorage)
│       ├── auth.js             # Customer & Admin authentication state
│       ├── store.js            # Catalog filtering, search, sorting & product modal
│       ├── cart.js             # Cart management, coupons & drawer
│       ├── checkout.js         # Checkout flow & mock payment (ABA KHQR, Card, COD)
│       ├── orders.js           # Order history, tracking timeline & invoice generator
│       ├── admin.js            # Admin CRUD (Products, Categories, Orders, Customers)
│       ├── presentation.js     # Assignment Midterm Slides (1 to 8) viewer
│       └── app.js              # Application core, routing & event bindings
│
├── database/
│   ├── schema.sql              # MySQL/PostgreSQL schema for the 6 tables
│   └── seed.sql                # Realistic seed data
│
└── presentation/
    └── presentation.md         # Text presentation outline matching assignment
```

---

## 📤 Git Submission Steps (Section 5)

To push this project to the [Team1-Clothes-store/New-Fashion repository](https://github.com/Team1-Clothes-store/Team1-Clothes-store-New-Fashion), run these commands from this project directory:

```powershell
git init
git branch -M main
git remote add origin https://github.com/Team1-Clothes-store/Team1-Clothes-store-New-Fashion.git
git add .
git commit -m "Add New Fashion storefront"
git push -u origin main
```
