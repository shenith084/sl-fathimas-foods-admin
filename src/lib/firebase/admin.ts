import { initializeApp, getApps, cert, App } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getAuth } from "firebase-admin/auth";

let adminApp: App;

function getAdminApp(): App {
  if (getApps().length > 0) {
    return getApps()[0];
  }

  const projectId = (process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "sl-fathimas-foods").trim();
  const storageBucket = (process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "sl-fathima-s-foods.firebasestorage.app").trim();

  const adminSdkKey = process.env.FIREBASE_ADMIN_SDK_KEY?.trim();
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.trim();
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL?.trim();

  let credential;

  // Try parsing the full JSON string first
  if (adminSdkKey) {
    try {
      let cleanedKey = adminSdkKey.replace(/^['"]|['"]$/g, '');
      // Re-escape actual newlines if Vercel mangled them
      cleanedKey = cleanedKey.replace(/\n/g, '\\n');
      const serviceAccount = JSON.parse(cleanedKey);
      credential = cert(serviceAccount);
      console.log("Successfully parsed FIREBASE_ADMIN_SDK_KEY.");
    } catch (error) {
      console.error("Failed to parse FIREBASE_ADMIN_SDK_KEY (JSON might be mangled). Trying fallback...");
    }
  }

  // Fallback to separate keys
  if (!credential && privateKey && clientEmail) {
    try {
      let cleanedPrivateKey = privateKey.replace(/^['"]|['"]$/g, '').replace(/\\n/g, '\n');
      
      // If the user pasted it without newlines (e.g. Vercel stripped them), reconstruct the PEM format!
      if (!cleanedPrivateKey.includes('\n')) {
        const match = cleanedPrivateKey.match(/-----BEGIN PRIVATE KEY-----\s*(.*?)\s*-----END PRIVATE KEY-----/);
        if (match) {
          const base64Part = match[1].replace(/\s+/g, ''); // Remove all spaces
          const formattedBase64 = base64Part.match(/.{1,64}/g)?.join('\n') || base64Part;
          cleanedPrivateKey = `-----BEGIN PRIVATE KEY-----\n${formattedBase64}\n-----END PRIVATE KEY-----\n`;
        }
      }

      credential = cert({
        projectId,
        clientEmail,
        privateKey: cleanedPrivateKey,
      });
      console.log("Successfully loaded Client Email and Private Key.");
    } catch (error) {
      console.error("Failed to initialize with Client Email and Private Key:", error);
    }
  }

  // Initialize App
  if (credential) {
    adminApp = initializeApp({
      credential,
      projectId,
      storageBucket
    });
  } else {
    console.warn("WARNING: Initializing Firebase Admin without credentials. Database access will likely fail in production.");
    adminApp = initializeApp({ projectId, storageBucket });
  }

  return adminApp;
}

export const adminDb = getFirestore(getAdminApp());
export const adminAuth = getAuth(getAdminApp());
