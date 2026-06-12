import { db } from "@/lib/firebase/client";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";

export type UserRole = "owner" | "staff" | "customer";

const ADMIN_EMAILS = ["admin@slfathimasfoods.com"];

export async function getUserRole(uid: string, email?: string | null): Promise<UserRole> {
  if (email && ADMIN_EMAILS.includes(email)) return "owner";
  
  try {
    const userDoc = await getDoc(doc(db, "users", uid));
    if (userDoc.exists()) {
      const data = userDoc.data();
      if (data.email && ADMIN_EMAILS.includes(data.email)) return "owner";
      return (data.role as UserRole) || "customer";
    }
    return "customer";
  } catch {
    return "customer";
  }
}

export async function createOrUpdateUserDoc(
  uid: string,
  email: string,
  displayName: string | null
): Promise<UserRole> {
  // Auto-assign owner role to admin email
  const role: UserRole = ADMIN_EMAILS.includes(email) ? "owner" : "customer";

  try {
    const userRef = doc(db, "users", uid);
    const existing = await getDoc(userRef);

    if (!existing.exists()) {
      // Create new user document
      await setDoc(userRef, {
        uid,
        email,
        displayName: displayName || "",
        role,
        addresses: [],
        created_at: serverTimestamp(),
        updated_at: serverTimestamp(),
      });
    } else {
      // If user exists but has no role, set it
      const data = existing.data();
      if (!data.role) {
        await setDoc(userRef, { role, updated_at: serverTimestamp() }, { merge: true });
        return role;
      }
      return data.role as UserRole;
    }
  } catch (err) {
    console.error("Error creating/updating user doc:", err);
  }

  return role;
}

export async function isAdminUser(uid: string): Promise<boolean> {
  const role = await getUserRole(uid);
  return role === "owner" || role === "staff";
}
