# 🥻 SilkVerse — Live Presentation & Showcase Walkthrough

Welcome to **SilkVerse**, a luxury e-commerce platform dedicated to bridging South India's heritage handloom silk saree master weavers directly with global connoisseurs.

---

## 🌟 Executive Highlights

| Dimension | Specification |
| :--- | :--- |
| **Catalog Depth** | **100 Studio Saree Photographs** across 10 authentic handloom varieties |
| **Frontend Stack** | **Next.js 16** (Turbopack, App Router, TypeScript, Tailwind CSS) |
| **Backend Stack** | **Node.js, Express.js, MongoDB** (Mongoose ODM) |
| **Architecture** | **Dual-Engine Runtime**: Full Express REST API locally + Zero-latency Serverless Edge Fallback |
| **Mobile Experience** | **Progressive Web App (PWA)** installable on iOS and Android with custom bottom navigation |
| **Bilingual Commerce** | Instant real-time toggle between **English** and **తెలుగు (Telugu)** with phonetic search |
| **Trust Badges** | **Silk Mark India Certified**, Artisan Weaver Profiles & Video Consultation Concierge |

---

## 🎬 9-Step Showcase Walkthrough (Demo Script)

Follow this 5-minute interactive walkthrough to demonstrate the full power of SilkVerse:

### 1. 🏛️ Homepage & Brand Heritage (`/`)
* **Curtain Reveal**: Open [http://localhost:3001](http://localhost:3001) to experience the royal maroon curtain opening animation.
* **Hero Carousel**: Browse featured master-weaver centerpieces with authentic loom details.
* **Telugu Language Toggle**: Click **తెలుగు** in the announcement bar to demonstrate full regional localization.

### 2. 🔍 Bilingual Semantic Search (`/products`)
* Click the Search bar in the top navbar.
* Type English keywords (e.g., `wedding crimson`, `banarasi plum`) or Telugu terms (`పట్టు`, `ధర్మవరం`).
* Notice instant real-time filtering without page reloads.

### 3. 🛍️ 100 Saree Catalog & Filter Matrix (`/products`)
* Filter by **Category** (Kanchipuram, Banarasi, Mysore, Paithani, Dharmavaram, Gadwal, Uppada).
* Filter by **Occasion** (Bridal, Wedding, Festive, Party, Reception).
* Toggle between **Grid View** and **List View**.

### 4. 🥻 Product Detail Experience (`/products/[id]`)
* View any saree (e.g., *Royal Crimson Dharmavaram Silk*).
* Inspect the **Silk Mark India Certification Badge** verifying 100% pure natural silk.
* Check the **Pincode Delivery Estimator** (type `500001` or `560001` for instant delivery calculations).
* Test the **Video Shopping Booking Modal** to schedule a live call with the artisan.

### 5. 🛒 Smart Cart & Multi-Coupon Engine (`/cart`)
* Add sarees to the bag.
* Navigate to the Cart page.
* Test active promotion codes:
  * `FESTIVE15` — 15% Festive Discount
  * `WELCOME500` — ₹500 Flat Welcome Voucher
  * `SILK10` — 10% Handloom Appreciation Discount
  * `FREESHIP` — Free Insured Shipping

### 6. 💳 3-Step Express Checkout (`/checkout`)
* **Step 1: Shipping Address** — Select or add delivery location.
* **Step 2: Payment Gateway** — Choose between Razorpay, Instant UPI QR Code, Credit/Debit Card, NetBanking, or COD.
* **Step 3: Confirmation** — Complete the test transaction to receive your verified Order ID.

### 7. 📄 Printable Tax Invoice (`/orders/[id]/invoice`)
* View the placed order in your order history.
* Click **"Download Tax Invoice"** to inspect the GST-compliant printable invoice with weaver details.

### 8. 🛡️ Artisan & Admin Back-Office Console (`/admin`)
* Access the Executive Console at [http://localhost:3001/admin](http://localhost:3001/admin).
* Review live business analytics:
  * Total Gross Revenue
  * Live Order Pipeline & Delivery Statuses
  * 100-Product Inventory Controls & Low-Stock Alerts
  * Promotional Coupon Management

### 9. 📱 Mobile Responsiveness & PWA
* Open DevTools (`F12` $\rightarrow$ Toggle Device Toolbar).
* Inspect breakpoints:
  * **Mobile (375px)**: Sticky bottom navigation bar, ergonomic touch buttons.
  * **Tablet (768px)**: Optimized 3-column product grid with collapsible filter drawer.
  * **Desktop (1440px)**: Mega-menu navigation and split-view product layout.

---

## 🔑 Test Accounts & Demo Credentials

| Role | Email | Password |
| :--- | :--- | :--- |
| **Store Admin** | `admin@silkverse.com` | `Admin@123` |
| **Customer Demo** | `vishnu@silkverse.com` | `SilkVerse@2026` |

---

## 🏷️ Active Promotional Codes

* **`FESTIVE15`** — 15% Off all wedding & festive silks
* **`WELCOME500`** — Flat ₹500 off for first-time buyers
* **`SILK10`** — 10% Off on pure silk mark collections
* **`ROYAL20`** — 20% Off on orders above ₹25,000
* **`FREESHIP`** — Free Express Delivery across India

---

## 🛠️ Quick Launch Commands

```bash
# 1-Click Launch on Windows (Double-click or run):
.\run.bat

# Or run via root scripts:
npm run dev
```
