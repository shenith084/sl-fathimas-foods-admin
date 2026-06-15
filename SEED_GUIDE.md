# Database Seeding Guide

This project includes a seeding system to quickly populate your Firestore database with dummy data or initial production data.

## What does the Seed Script do?
When you run the seed script, it performs the following actions:
1. Deletes all existing Products and Categories (WARNING: This is destructive!).
2. Reads the dummy data arrays (Biriyani Kits, Sambals, Pickles, etc.).
3. Writes the initial categories to the `/categories` Firestore collection.
4. Writes the initial products to the `/products` Firestore collection, automatically setting their `stock_count` to 50 and status to `in_stock`.

## How to Run the Seed
Because the seed operation is destructive to products, it should ideally only be run in development or immediately after setting up a fresh production database.

### Method 1: Local Development
Ensure your local server is running (`npm run dev`), then open your browser and navigate to:
`http://localhost:3000/api/seed`

You will see a JSON response: `{"message": "Database seeded successfully!"}`.

### Method 2: Production (Initial Setup Only)
Immediately after deploying to Vercel for the first time, navigate to:
`https://your-domain.com/api/seed`

**WARNING:** Do not run this in a live production environment once you have real customers and real products, as it will wipe out the current products and replace them with the seed array.

## How to Update the Seed Data
The seed data is stored directly inside the API route file. To change the initial products:
1. Open `src/app/api/seed/route.ts`.
2. Locate the `products` array at the top of the file.
3. Modify the JSON objects to match your desired starting products.
4. Run the seed endpoint again.
