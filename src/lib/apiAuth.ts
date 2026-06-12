import { adminAuth, adminDb } from "@/lib/firebase/admin";

const SUPER_ADMIN_EMAILS = ["admin@slfathimasfoods.com", "shenith222@gmail.com"];

/**
 * Verifies the Firebase ID token from the Authorization header.
 * Returns { uid, email } on success, or throws with a 401 error message.
 */
export async function verifyToken(req: Request): Promise<{ uid: string; email: string | undefined }> {
  const authHeader = req.headers.get("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new Error("UNAUTHORIZED: Missing auth token");
  }
  const token = authHeader.replace("Bearer ", "").trim();
  const decoded = await adminAuth.verifyIdToken(token);
  return { uid: decoded.uid, email: decoded.email };
}

/**
 * Checks if a user (by uid + email) has Super Admin privileges.
 * Checks hardcoded emails first, then Firestore roleId.
 */
export async function isSuperAdmin(uid: string, email?: string): Promise<boolean> {
  if (email && SUPER_ADMIN_EMAILS.includes(email)) return true;
  try {
    const doc = await adminDb.collection("users").doc(uid).get();
    if (!doc.exists) return false;
    const data = doc.data();
    return data?.roleId === "super_admin";
  } catch {
    return false;
  }
}
