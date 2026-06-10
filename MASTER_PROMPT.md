# MASTER PROMPT TEMPLATE
## SL FATHIMA'S FOODS — E-COMMERCE FULL-STACK SYSTEM (vFINAL)
### Public Website + Admin Panel + Backend API + Firebase + DevOps

---

## ROLE DEFINITION (AI BEHAVIOR CONTRACT)

You are acting as a combined expert engineering team:

- **Senior Software Architect** — System Design & Scalability
- **Senior Full-Stack Engineer** — Next.js Implementation Strategy
- **UI/UX Architect** — Design Systems & Mobile-First Experience
- **Firebase Architect** — Firestore, Auth, Storage, Cloud Functions
- **E-Commerce Engineer** — Order Flow, Inventory, Product Systems
- **SEO & Performance Engineer** — Core Web Vitals & Sri Lanka Market Optimization

---

## CORE OBJECTIVE

Design a:

> Production-grade, scalable, secure, maintainable, high-performance
> e-commerce full-stack system for a homemade food business in Sri Lanka.

The system must include:

- Public E-Commerce Website (Customer-Facing Frontend)
- Admin Panel (Internal Business Operations)
- Backend API (Next.js API Routes)
- Firebase Architecture (Firestore + Auth + Storage)
- Order & Inventory Management System
- Media & Content Management System
- SEO & Analytics System
- DevOps & Deployment Setup

---

## PROJECT INPUT CONFIGURATION

**Business Name:** SL Fathima's Foods

**Business Type:** Homemade Food Products — E-Commerce (B2C)

**TikTok:** https://www.tiktok.com/@sl.fathimas.products

**Core Selling Points:**
- Preservative-free and artificial-flavour-free products
- Natural ingredients only
- Island-wide delivery via Domex courier
- Vacuum packaging option for overseas orders

**Current Order Channel:** TikTok discovery → WhatsApp ordering (to be replaced by this system)

**Payment Methods:** Cash on Delivery (COD) + Bank Transfer (primary). Payment gateway integration (PayHere, Stripe, PayPal) — UI placeholder only, NOT to be developed in this phase.

**Email Provider:** Brevo (Sendinblue) — free tier required

**Delivery Partner:** Domex (island-wide, approx. 5 days)

**Target Markets:** Colombo, Kandy, Galle, Kurunegala, Jaffna, all Sri Lanka, Overseas Sri Lankan community

**Estimated Product SKUs:** 25–50 products

---

## 1. SYSTEM ARCHITECTURE REQUIREMENTS

### 1.1 Architecture Style

Use **Modular Monolith** architecture built on Next.js (App Router).

Justification:
- Single deployment unit reduces ops overhead for a small business
- Next.js handles SSR, API routes, and frontend in one codebase
- Firebase manages database, auth, and file storage externally
- Easy to scale to microservices later if business grows

### 1.2 Layered Architecture

- **Presentation Layer** — Next.js frontend (public site) + Admin panel pages
- **Application Layer** — Next.js API routes (business logic, order processing)
- **Domain Layer** — Core rules: order workflow, inventory rules, RBAC enforcement
- **Data Layer** — Firebase Firestore (database) + Cloudinary (media) + Firebase Auth

### 1.3 System Components

- Public E-Commerce Website
- Admin Panel
- API Layer (Next.js API Routes)
- Automated Email Notification System (Brevo)
- Analytics & Pixel Tracking System (Meta Pixel + TikTok Pixel)
- Media Management System (Cloudinary)
- Audit Log System
- SEO System

---

## 2. PUBLIC WEBSITE (FRONTEND ARCHITECTURE)

### 2.1 Page Structure

| Page | Purpose |
|---|---|
| Home | Conversion-optimized landing page |
| About Us | Brand story, natural ingredients, trust building |
| Products | Full product catalog with filtering |
| Product Details | Individual product with images, description, customization |
| Categories | Browse by category |
| Gift Packs | Special gift pack configurations |
| Custom Orders | Custom order request form |
| Reviews | Customer testimonials and ratings |
| FAQ | Common questions (delivery, payment, shelf life) |
| Contact | WhatsApp link + contact form |
| Cart | Order summary and management |
| Checkout | Shipping details + payment method selection |
| Order Confirmation | Post-order success page |
| Auth Pages | Login / Register / Forgot Password |

### 2.2 UI/UX DESIGN SYSTEM (MANDATORY)

Design System must include:

**Design Tokens:**
Primary Brand Colors
| Color         | Hex       | Usage                                 |
| ------------- | --------- | ------------------------------------- |
| Saffron Gold  | `#D98C1F` | Buttons, highlights, prices           |
| Olive Green   | `#556B4F` | Brand color, icons, secondary buttons |
| Premium Black | `#1F1F1F` | Product packaging inspiration, footer |

Background Colors
| Color      | Hex       | Usage                   |
| ---------- | --------- | ----------------------- |
| Warm Cream | `#FAF7F2` | Main website background |
| Soft Beige | `#F4EFE6` | Alternate sections      |
| Pure White | `#FFFFFF` | Cards, forms, navbar    |

Text Colors
| Color          | Hex       | Usage      |
| -------------- | --------- | ---------- |
| Charcoal Black | `#222222` | Headings   |
| Soft Gray      | `#666666` | Paragraphs |
| Light Gray     | `#9CA3AF` | Small text |

Accent Colors
| Color       | Hex       | Usage                         |
| ----------- | --------- | ----------------------------- |
| Gold Accent | `#E8B04A` | Hover effects                 |
| Sage Green  | `#7A9B76` | Icons and decorative elements |
| Light Olive | `#A3B18A` | Background accents            |



**Component Library:**
- Buttons (primary, secondary, ghost, danger)
- Product cards with image, name, price, add-to-cart
- Category filter chips
- Cart drawer (slide-in)
- Toast notifications
- Modal dialogs
- Pagination
- Star rating display
- Badge components (New, Out of Stock, Best Seller)
- Navigation bar (mobile hamburger + desktop)
- Footer with links and social icons

### 2.3 RESPONSIVE DESIGN RULES

- **Mobile-first** — primary target is mobile (TikTok traffic)
- Tablet optimization
- Desktop enhancement
- Flexible grid: 1 col (mobile) → 2 col (tablet) → 3–4 col (desktop)
- Touch-friendly tap targets (min 44px)

### 2.4 CATEGORY STRUCTURE (PRODUCT TAXONOMY)

```
Food Products
 ├─ Biriyani Kit
 ├─ Ghee Rice Combo Kit
 ├─ Sambals
 │    ├─ Beef Sambal
 │    ├─ Chicken Sambal
 │    ├─ Maldive Fish Sambal
 │    ├─ Kooni Sambal
 │    ├─ Dry Fish Sambal
 │    └─ Banana Blossom Sambal
 ├─ Pickles
 │    ├─ Beef Pickle
 │    ├─ Chicken Pickle
 │    ├─ Baabath Pickle
 │    ├─ Prawns Pickle
 │    ├─ Crab Pickle
 │    └─ Fish Pickle
 ├─ Seenima
 ├─ Gift Packs
 └─ Customized Orders
```

### 2.5 PRODUCT ATTRIBUTES SCHEMA

Each product must support:

- Product Name
- Category (linked to taxonomy above)
- Price (LKR)
- Weight (grams)
- Shelf Life
- Ingredients list
- Product Images (multiple, Cloudinary-hosted)
- Availability Status (In Stock / Out of Stock / Pre-Order)
- Delivery Information
- Customization Options (e.g. vacuum packaging: +LKR 50/item, excludes Biriyani Kit and Ghee Rice Kit)
- Tags (e.g. "Best Seller", "New")

### 2.6 DYNAMIC CONTENT RENDERING

- Section-based homepage builder:
  - Hero section (banner + CTA)
  - Featured Products section
  - Category showcase
  - Why Choose Us (natural ingredients, preservative-free)
  - Customer Testimonials / Reviews
  - TikTok Feed embed
  - Gift Pack CTA block
- CMS-controlled banners and announcements

### 2.7 SEO ARCHITECTURE

Must include:
- Dynamic meta tags per page and per product
- OpenGraph + Twitter Card tags
- Sitemap.xml (auto-generated)
- robots.txt
- Schema.org structured data (Product, LocalBusiness, Review)
- SEO-friendly URL slugs (e.g. `/products/biriyani-kit`)
- Core keyword targeting:
  1. Homemade Biriyani Sri Lanka
  2. SL Fathima's Foods Sri Lanka
  3. Homemade Chili Paste Sri Lanka
  4. Natural Food Products Sri Lanka
  5. Gift Food Packs Sri Lanka

### 2.8 PROTECTED ROUTING

- Auth-guarded routes (Cart, Checkout, Order History)
- Role-based UI rendering (Admin link visible only to admin/owner)
- Session/token validation via Firebase Auth
- Redirect to login if unauthenticated user attempts checkout

---

## 3. ADMIN PANEL ARCHITECTURE

### 3.1 MODULE STRUCTURE (MODULE-BASED, NOT PAGE-BASED)

| Module | Description |
|---|---|
| Dashboard | KPIs — revenue, orders, customers, stock alerts |
| Product Management | Create, edit, delete, organize products and categories |
| Order Management | Full order lifecycle tracking |
| Customer Management | Customer records, order history, contact info |
| Stock Management | Inventory levels, low-stock alerts, auto-decrement on order |
| Content Management | Banners, homepage sections, reviews, FAQ content |
| Reports & Analytics | Sales reports, product performance, customer insights |
| User & Role Management | Create users, assign roles, manage permissions |
| Media Manager | Upload, organize, and reuse product images |
| Audit Log | Track all admin actions and system events |
| Settings | Business config, delivery charges, email templates |

### 3.2 ORDER WORKFLOW STATES

```
Pending → Confirmed → Preparing → Packed → Dispatched → Delivered → Completed
                                                                    ↓
                                                               Cancelled (any stage)
```

### 3.3 STOCK MANAGEMENT RULES

- Manual stock level entry by admin
- Automatic stock decrement when order is confirmed
- Low stock threshold alerts on dashboard
- Out-of-stock products automatically flagged on public website
- Stock history log per product

### 3.4 MEDIA MANAGER SYSTEM

Must include:
- Image upload to Cloudinary
- WebP/AVIF auto-optimization
- Folder/category organization (by product category)
- File reuse across products
- Image preview and management UI

### 3.5 AUDIT LOG SYSTEM

Must track:
- Admin login/logout
- Product create/edit/delete actions
- Order status changes
- Role and permission changes
- Stock level changes
- Settings updates

### 3.6 ADMIN UX RULES

- Table-first system with sortable columns
- Bulk actions (bulk status update, bulk delete)
- Advanced filtering and search
- Inline editing where appropriate
- Fast sidebar navigation
- Mobile-responsive admin (owner may use mobile)

---

## 4. USER ROLES & RBAC SYSTEM

### 4.1 Role Definitions

| Role | Access Level |
|---|---|
| Owner (Super Admin) | Full access to all modules |
| Staff | Restricted — orders, products, stock only |

### 4.2 Permission Format

```
module.action

Examples:
  product.create
  product.edit
  product.delete
  order.view
  order.update_status
  customer.view
  report.view
  settings.edit
  user.create
  user.edit
  stock.update
```

### 4.3 Enforcement

- Firebase Auth custom claims for role storage
- Next.js API middleware validation on every protected route
- Frontend UI hiding of restricted elements
- Admin panel module access gating per role

### 4.4 Seed Roles

- Super Admin (Owner) — all permissions
- Staff — order management, product view, stock update only

---

## 5. DATABASE ARCHITECTURE (FIREBASE FIRESTORE)

### 5.1 Rules

- Denormalized where needed for Firestore read efficiency
- Soft deletes (`deleted_at` field)
- Audit fields on all documents (`created_at`, `updated_at`, `created_by`)
- Firestore security rules enforce role-based access

### 5.2 Core Collections

```
/users/{userId}
  - uid, email, displayName, phone, role, addresses[], created_at

/products/{productId}
  - name, slug, category, price, weight, shelf_life, ingredients,
    images[], availability, customization_options, tags, stock_count,
    deleted_at, created_at, updated_at

/categories/{categoryId}
  - name, slug, parent_id, image, sort_order

/orders/{orderId}
  - customer_id, items[], subtotal, delivery_charge, total,
    payment_method, payment_status, order_status, shipping_address,
    vacuum_packaging, notes, created_at, updated_at, status_history[]

/customers/{customerId}
  - name, email, phone, addresses[], order_count, total_spent, created_at

/reviews/{reviewId}
  - customer_id, product_id, rating, comment, status (approved/pending),
    created_at

/audit_logs/{logId}
  - admin_uid, action, module, target_id, old_value, new_value, timestamp

/settings/{settingKey}
  - value, updated_by, updated_at
```

### 5.3 SEED SYSTEM

Must include:

**System Seeds:**
- Default Owner user account
- Default Staff role configuration
- Default permission mappings
- System configuration (delivery charges, business info)

**Content Seeds:**
- Sample product categories
- Sample products (biriyani kit, ghee rice kit)
- Default FAQ entries
- Default homepage banner content

**Rules:**
- Idempotent (safe to re-run without duplication)
- Environment-based execution (dev / staging / production)
- Admin-triggerable via Admin Panel → Settings → Seed System

---

## 6. API ARCHITECTURE

### 6.1 Design

- REST API via Next.js API Routes
- Versioned: `/api/v1/`
- Standard response format:

```json
{
  "success": true,
  "message": "Order created successfully",
  "data": {}
}
```

### 6.2 Core API Modules

```
/api/v1/auth/         — login, register, logout, session
/api/v1/products/     — list, detail, create, update, delete
/api/v1/categories/   — list, detail, manage
/api/v1/orders/       — create, list, detail, update status
/api/v1/customers/    — list, detail, update
/api/v1/reviews/      — create, list, approve
/api/v1/cart/         — add, remove, update quantity
/api/v1/media/        — upload, list, delete
/api/v1/reports/      — sales, products, customers
/api/v1/settings/     — get, update
/api/v1/stock/        — update, history
/api/v1/audit-logs/   — list, filter
```

### 6.3 THIRD-PARTY INTEGRATION LAYER

All integrations via centralized service layer (no direct API calls in controllers):

| Service | Purpose | Notes |
|---|---|---|
| Firebase Auth | Authentication | Core auth provider |
| Firebase Firestore | Database | Primary data store |
| Cloudinary | Image hosting & optimization | WebP/AVIF auto-convert |
| Brevo (Sendinblue) | Transactional email | Free tier — order confirmation |
| Domex | Delivery tracking reference | Manual update workflow |
| Meta Pixel | Marketing tracking | Frontend integration |
| TikTok Pixel | Marketing tracking | Frontend integration |
| PayHere / Stripe / PayPal | Payment gateway | UI placeholder only — not active |

**Rules:**
- No direct third-party calls in API controllers
- Centralized service abstraction files per integration
- Retry + fallback logic on email sending

---

## 7. ORDER & PAYMENT SYSTEM

### 7.1 Order Flow

1. Customer adds products to cart
2. Selects customization (e.g. vacuum packaging)
3. Enters shipping address
4. Views delivery charge (Domex rate by weight)
5. Selects payment: COD or Bank Transfer
6. Submits order → Order created in Firestore
7. Auto email confirmation sent via Brevo
8. Admin notified of new order on dashboard

### 7.2 Delivery Charge Logic

- Calculated based on total order weight
- Admin-configurable rate table in Settings
- Example reference: 500g = LKR 450 (Domex)

### 7.3 Vacuum Packaging

- Optional add-on: LKR 50 per item
- Excluded from: Biriyani Kit, Ghee Rice Combo Kit
- Displayed as checkbox on product detail and cart pages

### 7.4 Payment UI

- COD — show delivery instructions
- Bank Transfer — show bank account image/details + receipt upload prompt
- Payment gateway section — display placeholder cards (PayHere, Stripe, PayPal) with "Coming Soon" badges — NOT functional

### 7.5 Order Confirmation Email (Brevo)

Must include:
- Order ID
- Ordered items + quantities + prices
- Delivery address
- Payment method
- Estimated delivery (5 business days)
- Contact/support info

---

## 8. ANALYTICS & TRACKING SYSTEM

Must include:

- **Meta (Facebook) Pixel** integration — ViewContent, AddToCart, InitiateCheckout, Purchase events
- **TikTok Pixel** integration — matching events for TikTok ad attribution
- **Conversion event tracking** — purchase value, product category, payment method
- **Admin dashboard analytics** — daily/weekly/monthly orders, revenue, top products
- **Page performance tracking** — Next.js Web Vitals reporting
- **Business KPI dashboard widgets:**
  - Total orders today / this month
  - Revenue today / this month
  - Low stock alerts
  - New customer count
  - Top 5 products by sales

---

## 9. SECURITY ARCHITECTURE

- **Firebase Auth** — JWT-based authentication, token refresh
- **Password security** — Managed by Firebase Auth (bcrypt internally)
- **CSRF protection** — SameSite cookies + token validation
- **XSS prevention** — React DOM escaping, DOMPurify for any rich text
- **SQL injection** — Not applicable (Firestore NoSQL), enforce Firestore security rules
- **Rate limiting** — Next.js API middleware (limit order submissions, auth attempts)
- **Secure headers** — CSP, HSTS, X-Frame-Options via Next.js headers config
- **Firestore Security Rules** — Role-based read/write enforcement at database level
- **Audit logging** — All admin actions recorded
- **OWASP Top 10** compliance review required before production launch

---

## 10. PERFORMANCE & SCALABILITY

- **Next.js SSR/SSG** — Product pages statically generated, revalidated on update (ISR)
- **Cloudinary** — Auto CDN delivery, WebP/AVIF image optimization, lazy loading
- **Firebase Firestore** — Indexed queries for product listing and order filtering
- **Next.js Image component** — Built-in lazy loading and responsive images
- **Code splitting** — Automatic via Next.js App Router
- **Mobile PageSpeed target: 90+**
- **Firebase CDN** — Static asset delivery
- **Incremental Static Regeneration (ISR)** — Product catalog pages
- **Horizontal scaling** — Firebase and Vercel auto-scale

---

## 11. SEO & CONTENT ARCHITECTURE

- Dynamic `<head>` metadata per page using Next.js Metadata API
- OpenGraph tags for TikTok/social link sharing
- Twitter Card tags
- `sitemap.xml` — auto-generated, submitted to Google Search Console
- `robots.txt`
- Schema.org JSON-LD:
  - `LocalBusiness` (SL Fathima's Foods)
  - `Product` (each product page)
  - `Review` / `AggregateRating`
- SEO-friendly URLs: `/products/biriyani-kit`, `/categories/sambals`
- Alt text on all product images
- Blog system (optional phase 2) for keyword-rich content

---

## 12. EMAIL NOTIFICATION SYSTEM

Provider: **Brevo (Sendinblue) — Free Tier**

Must send:

| Trigger | Recipient | Template |
|---|---|---|
| Order placed | Customer | Order confirmation with summary |
| Order status update | Customer | Status change notification |
| Low stock alert | Owner/Admin | Internal stock warning |
| New order received | Owner/Admin | New order notification |

Rules:
- Centralized email service class (no direct API calls in routes)
- Template-based (HTML email templates)
- Retry on failure (max 3 attempts)
- Email log stored in Firestore

---

## 13. CODING STANDARDS

### 13.1 Folder Structure

```
/app
  /(public)               — Public website pages
    /page.tsx             — Home
    /about/
    /products/
    /products/[slug]/
    /categories/[slug]/
    /gift-packs/
    /custom-orders/
    /reviews/
    /faq/
    /contact/
    /cart/
    /checkout/
    /order-confirmation/
    /auth/
  /(admin)                — Admin panel pages (protected)
    /dashboard/
    /products/
    /orders/
    /customers/
    /stock/
    /content/
    /reports/
    /users/
    /media/
    /audit-logs/
    /settings/
/api
  /v1/
    /auth/
    /products/
    /orders/
    /customers/
    /reviews/
    /cart/
    /media/
    /reports/
    /stock/
    /settings/
    /audit-logs/
/components
  /ui/                    — Shared design system components
  /public/                — Public website components
  /admin/                 — Admin panel components
/lib
  /firebase/              — Firebase config and helpers
  /cloudinary/            — Cloudinary service
  /brevo/                 — Email service
  /pixels/                — Meta + TikTok pixel helpers
/hooks                    — Custom React hooks
/types                    — TypeScript type definitions
/utils                    — Utility functions
/constants                — App-wide constants
/styles                   — Global CSS / Tailwind config
/seeds                    — Seed scripts for Firestore
```

### 13.2 Naming Conventions

| Context | Convention | Example |
|---|---|---|
| JS/TS variables | camelCase | `orderStatus` |
| React components | PascalCase | `ProductCard` |
| Firestore fields | snake_case | `created_at` |
| API routes | kebab-case | `/api/v1/gift-packs` |
| File names | kebab-case | `product-card.tsx` |
| Environment vars | SCREAMING_SNAKE_CASE | `FIREBASE_API_KEY` |

### 13.3 Code Quality Rules

- No business logic in API route handlers — use service layer files
- DRY principle — no duplicated logic
- SOLID principles throughout service layer
- Separation of concerns (route → service → repository pattern)
- Reusable service pattern for all integrations
- TypeScript strict mode enabled
- Error handling at all API boundaries (try/catch + standard error response)
- All Firebase calls wrapped in service abstraction

---

## 14. DEVOPS & DEPLOYMENT

### 14.1 CI/CD Pipeline

- GitHub repository (main, staging, dev branches)
- Vercel for Next.js deployment (automatic previews per branch)
- Firebase deployment for security rules and indexes
- GitHub Actions for linting, type-check, and build verification on push

### 14.2 Environment Separation

| Environment | Purpose |
|---|---|
| dev | Local development |
| staging | Pre-production testing |
| production | Live customer-facing system |

### 14.3 Environment Variables

```
NEXT_PUBLIC_FIREBASE_API_KEY
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
NEXT_PUBLIC_FIREBASE_PROJECT_ID
FIREBASE_ADMIN_SDK_KEY
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
CLOUDINARY_API_SECRET
BREVO_API_KEY
NEXT_PUBLIC_META_PIXEL_ID
NEXT_PUBLIC_TIKTOK_PIXEL_ID
```

### 14.4 Monitoring & Logging

- Vercel built-in analytics and error tracking
- Firebase Firestore usage monitoring
- Cloudinary bandwidth monitoring
- Custom error logging to Firestore `/error_logs` collection
- Admin alert on critical failures (via email)

### 14.5 Backup Strategy

- Firebase automatic daily backups (Firestore export to Cloud Storage)
- Cloudinary assets versioning
- GitHub repository as code backup

---

## 15. DOCUMENTATION SYSTEM

System must generate:

- `README.md` — Project setup, architecture overview, environment config
- `API.md` — Full API endpoint documentation (method, params, response)
- `ADMIN_GUIDE.md` — Admin panel user guide for Owner and Staff
- `DEPLOYMENT.md` — Step-by-step deployment guide (Vercel + Firebase)
- `SEED_GUIDE.md` — How to run and reset seed data
- `DEVELOPER_ONBOARDING.md` — Local setup, folder structure, code conventions

---

## 16. FINAL OUTPUT REQUIREMENTS

The system design must produce all of the following:

- System architecture diagram
- Firestore database schema (all collections + fields)
- API route structure with methods and descriptions
- RBAC matrix (roles x permissions)
- Full folder structure
- Admin module breakdown
- Public website page list with purpose
- Security implementation plan
- Performance optimization plan
- DevOps and deployment plan
- Media system design (Cloudinary)
- Audit log system design
- Analytics and pixel tracking setup
- Email notification system (Brevo)
- Order workflow state machine
- Seed system structure
- Naming conventions reference

---

## TECH STACK REFERENCE

| Layer | Technology |
|---|---|
| Frontend Framework | Next.js 14+ (App Router) |
| Styling | Tailwind CSS |
| Database | Firebase Firestore |
| Authentication | Firebase Auth |
| File Storage | Cloudinary |
| Backend API | Next.js API Routes |
| Email | Brevo (Sendinblue) — free tier |
| Deployment | Vercel |
| Image Optimization | Cloudinary + Next.js Image |
| Analytics | Meta Pixel + TikTok Pixel |
| State Management | React Context + Zustand (cart) |
| Language | TypeScript |
| Version Control | GitHub |

---

