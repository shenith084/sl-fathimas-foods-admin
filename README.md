# SL Fathima's Foods — E-Commerce Platform

A premium, highly-optimized Next.js e-commerce application built for SL Fathima's Foods to manage homemade Sri Lankan food products, custom orders, and island-wide delivery.

## 🚀 Tech Stack

- **Framework:** Next.js 15+ (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS & Lucide Icons
- **Database & Auth:** Firebase (Firestore NoSQL & Firebase Authentication)
- **Media Management:** Cloudinary CDN
- **Mailing:** Resend API

## ✨ Key Features

### For Customers
- **Blazing Fast Browsing:** 100% statically generated product pages (SSG) for instant load times.
- **Secure Authentication:** Seamless email/password and Google login via Firebase.
- **Advanced Cart System:** Real-time cart updates, dynamic free-delivery thresholds, and visual progress bars.
- **Custom Order Builder:** Interactive form to request personalized event catering or gift hampers.
- **Customer Dashboard:** Real-time order tracking, receipt uploading, and admin-message viewing.

### For Administrators
- **Secure Admin Panel:** Role-based access control protecting the `/admin` routes.
- **Order Management:** Interactive Kanban-style or list-based order processing (Pending ➔ Processing ➔ Dispatched ➔ Delivered).
- **Dynamic Quoting:** Ability to assign custom prices to unquoted Custom Orders.
- **Receipt Verification:** In-dashboard modal to view and verify customer-uploaded bank transfer receipts.
- **Dynamic Settings:** Change bank account details and delivery fees without touching the code.

## 🛠️ Local Development

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/sl-fathimas-foods.git
   cd sl-fathimas-foods
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Environment Variables:**
   Create a `.env.local` file in the root directory and add your Firebase, Cloudinary, and Resend credentials (refer to `.env.example` if available).

4. **Run the development server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📦 Deployment (Vercel)

This application is architected for Vercel's Edge Network.
1. Push your code to a GitHub repository.
2. Import the repository into your Vercel Dashboard.
3. Copy all variables from your `.env.local` into the Vercel Environment Variables settings.
4. Click **Deploy**. Vercel will automatically run `npm run build` and generate all static pages.

## 🔒 Security Architecture
- **Firestore Rules:** Read/Write access is strictly guarded. Only the Admin SDK (server-side) can mutate products and system settings.
- **Server Actions & API Routes:** All sensitive operations (order quoting, user role management) run securely on the Node backend.
- **Content Security Policy:** Implemented to prevent XSS and inline-script injection.

---
*Built with ❤️ for SL Fathima's Foods.*
