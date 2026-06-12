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

  if (adminSdkKey) {
    try {
      const serviceAccount = JSON.parse(adminSdkKey);
      adminApp = initializeApp({
        credential: cert(serviceAccount),
        projectId,
      });
    } catch {
      adminApp = initializeApp({ projectId });
    }
  } else {
    adminApp = initializeApp({ projectId });
  }

  return adminApp;
}

export const adminDb = getFirestore(getAdminApp());
export const adminAuth = getAuth(getAdminApp());
