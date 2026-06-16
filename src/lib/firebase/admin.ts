import { initializeApp, getApps, cert, App } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getAuth } from "firebase-admin/auth";

let adminApp: App;

function getAdminApp(): App {
  if (getApps().length > 0) {
    return getApps()[0];
  }

  // In production, use FIREBASE_ADMIN_SDK_KEY env var (JSON string of service account)
  // In dev, we use a simplified approach with project ID only (no auth validation)
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "sl-fathimas-foods";

  const adminSdkKey = process.env.FIREBASE_ADMIN_SDK_KEY;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;

  if (adminSdkKey) {
    try {
      // Remove surrounding single or double quotes if Next.js didn't strip them
      const cleanedKey = adminSdkKey.replace(/^['"]|['"]$/g, '');
      const serviceAccount = JSON.parse(cleanedKey);
      
      adminApp = initializeApp({
        credential: cert(serviceAccount),
        projectId,
        storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "sl-fathima-s-foods.firebasestorage.app"
      });
      console.log("Firebase Admin SDK successfully initialized with Service Account Key.");
    } catch (error) {
      console.error("CRITICAL ERROR: Failed to parse FIREBASE_ADMIN_SDK_KEY:", error);
      adminApp = initializeApp({ projectId });
    }
  } else if (privateKey && clientEmail) {
    try {
      const cleanedPrivateKey = privateKey.replace(/^['"]|['"]$/g, '').replace(/\\n/g, '\n');
      adminApp = initializeApp({
        credential: cert({
          projectId,
          clientEmail,
          privateKey: cleanedPrivateKey,
        }),
        projectId,
        storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "sl-fathima-s-foods.firebasestorage.app"
      });
      console.log("Firebase Admin SDK successfully initialized with Client Email and Private Key.");
    } catch (error) {
      console.error("CRITICAL ERROR: Failed to initialize with Client Email and Private Key:", error);
      adminApp = initializeApp({ projectId });
    }
  } else {
    adminApp = initializeApp({ projectId });
  }

  return adminApp;
}

export const adminDb = getFirestore(getAdminApp());
export const adminAuth = getAuth(getAdminApp());
