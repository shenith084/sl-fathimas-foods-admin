# Backend API Reference

This document outlines the core internal Next.js API Routes (`/api/v1/`) used by the SL Fathima's Foods frontend and admin panel.

All endpoints are hosted at `https://yourdomain.com/api/v1/...` and return JSON.

---

## Standard Response Format
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... }
}
```
*Errors will have `success: false` and an `error` string instead of data.*

---

## 1. Products API
### `GET /products`
Fetches all active products.
- **Query Params:** `?includeDeleted=true` (Admin only)
- **Response:** Array of `Product` objects.

### `GET /products/[id]`
Fetches a single product by its database ID.

### `GET /products/by-slug/[slug]`
Fetches a single product by its URL-friendly slug.

### `POST /products`
*(Admin Only)* Creates a new product.
- **Body:** `AdminProduct` object.

### `PUT /products/[id]`
*(Admin Only)* Updates an existing product.
- **Body:** Partial `AdminProduct` object.

### `DELETE /products/[id]`
*(Admin Only)* Soft-deletes a product (sets `deleted_at`).

---

## 2. Orders API
### `POST /orders`
Creates a new customer order.
- **Body:** `{ items: CartItem[], customerDetails: {}, paymentMethod: string, deliveryCharge: number, total: number }`

### `GET /orders`
*(Admin Only)* Fetches all orders.

### `GET /orders/[id]`
Fetches a specific order. Requires Admin or the Customer who placed the order.

### `PUT /orders/[id]`
*(Admin Only)* Updates order status or custom quote total.
- **Body:** `{ status: "Pending" | "Processing" | "Dispatched" | "Delivered", total?: number }`

---

## 3. Media & Uploads API
### `POST /upload`
*(Admin Only)* Uploads a product image directly to Cloudinary.
- **Body:** `FormData` containing the `file`.
- **Response:** `{ secure_url: string, public_id: string }`

### `POST /upload-receipt`
Uploads a bank transfer receipt to Cloudinary and links it to an order.
- **Body:** `FormData` containing `file` and `orderId`.

---

## 4. Settings API
### `GET /settings`
Fetches public store settings (e.g., delivery charges, bank details).

### `PUT /settings`
*(Admin Only)* Updates store settings.

---

## 5. Seed API
### `GET /api/seed`
*(Development Only)* Wipes the database and injects initial mock data and categories.
