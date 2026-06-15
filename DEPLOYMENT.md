# Deployment Guide

This guide explains how to deploy the SL Fathima's Foods Next.js application to Vercel and how to configure the production Firebase environment.

---

## 1. Firebase Production Setup
Before deploying the code, you need a production database.

1. Go to the [Firebase Console](https://console.firebase.google.com/).
2. Create a new project (e.g., `sl-fathimas-foods-prod`).
3. **Enable Firestore:**
   - Go to Firestore Database > Create Database.
   - Start in **Production Mode**.
4. **Enable Authentication:**
   - Go to Authentication > Get Started.
   - Enable **Email/Password** and **Google** providers.
5. **Get Client Credentials:**
   - Go to Project Settings > General. Add a "Web App".
   - Copy the `apiKey`, `authDomain`, and `projectId`.
6. **Get Admin Credentials:**
   - Go to Project Settings > Service Accounts.
   - Click **Generate new private key**.
   - Download the JSON file. You will need to extract the `private_key` and `client_email` from it.

---

## 2. Cloudinary Setup
1. Create a [Cloudinary](https://cloudinary.com) account.
2. Go to your Dashboard and copy your:
   - Cloud Name
   - API Key
   - API Secret
3. Go to Settings > Upload and create an Upload Preset if needed.

---

## 3. Vercel Deployment
Vercel is the recommended hosting platform as it is built specifically for Next.js.

1. Push your code to a GitHub repository.
2. Log into [Vercel](https://vercel.com) and click **Add New > Project**.
3. Import your GitHub repository.
4. **Environment Variables:**
   Before clicking deploy, open the "Environment Variables" section and add the following keys. Paste the values you gathered from Firebase and Cloudinary:

   ```text
   # Firebase Client
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id

   # Firebase Admin (Server Side)
   FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxx@your_project.iam.gserviceaccount.com
   FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYourKeyHere\n-----END PRIVATE KEY-----\n"
   
   # Cloudinary
   NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```

5. Click **Deploy**. Vercel will automatically build the site (`npm run build`) and generate all static pages.

---

## 4. Post-Deployment Steps
1. Visit your Vercel URL (e.g., `fathimas-foods.vercel.app`).
2. Log in using Google or create an account.
3. **Make yourself Admin:** Since this is a fresh database, no one is admin. Go to your Firebase Console > Firestore, find your user document in the `users` collection, and manually change the `role` field from `customer` to `admin`.
4. Run the seed script by visiting `https://yourdomain.com/api/seed` in your browser to load initial categories and products into your fresh production database.
