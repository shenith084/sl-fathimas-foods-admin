# Developer Onboarding Guide

Welcome to the SL Fathima's Foods codebase. This document outlines our conventions, folder structures, and coding rules.

## 📁 Folder Structure

We use the Next.js **App Router** (`/src/app`).

```
src/
├── app/
│   ├── (public)/          # All customer-facing pages (Home, Products, Cart)
│   ├── (admin)/           # All admin dashboard pages (Protected by middleware)
│   ├── api/               # Next.js API route handlers (Backend)
│   ├── globals.css        # Global Tailwind CSS styles
│   └── layout.tsx         # Root layout (Providers, Fonts)
├── components/
│   ├── admin/             # Components used strictly in the admin dashboard
│   ├── public/            # Components used strictly on the storefront
│   └── ui/                # Shared, generic UI components (Buttons, Inputs, Modals)
├── lib/
│   ├── firebase/          # Firebase client config & utilities
│   ├── firebase-admin.ts  # Firebase server config (Admin SDK)
│   ├── services/          # Business logic (e.g., productService.ts)
│   └── mockData.ts        # Type definitions and local static data
```

## 🧠 Core Architecture Principles

### 1. Server Components vs Client Components
- By default, all components are **Server Components**. They fetch data directly from Firebase Admin and render HTML on the server. This makes the site incredibly fast.
- Use `"use client";` at the top of a file *only* when you need interactivity (e.g., `onClick`, `useState`, `useEffect`). Keep client components as small as possible (push them down the tree).

### 2. Service Layer Pattern
**DO NOT** write Firebase logic directly inside your API routes or Server Components.
- **Wrong:** Writing `adminDb.collection('products').get()` inside `app/api/products/route.ts`.
- **Right:** Create a function `getProducts()` inside `src/lib/services/productService.ts` and call it from your route or component.

### 3. Security
- The `/admin` routes are protected via a Higher Order Component/Layout that checks if the logged-in user's role is `admin`.
- API routes that modify data (POST, PUT, DELETE) must verify the Firebase session token using the `adminAuth` SDK before executing.

### 4. Styling
- We exclusively use **Tailwind CSS**.
- Avoid writing custom CSS in `globals.css` unless strictly necessary.
- For dynamic class names, use standard template literals or a utility like `clsx` or `tailwind-merge`.

## 🧑‍💻 Getting Started
1. Run `npm run dev`.
2. Inspect `src/app/(public)/page.tsx` to see how data is loaded into the homepage.
3. Check `src/app/api/seed/route.ts` to understand the data schema.
