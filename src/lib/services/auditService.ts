import { adminDb } from "@/lib/firebase/admin";
import { FieldValue } from "firebase-admin/firestore";

export async function logAuditAction({
  adminUid,
  action,
  module,
  targetId,
  oldValue,
  newValue,
}: {
  adminUid: string;
  action: string;
  module: string;
  targetId?: string;
  oldValue?: unknown;
  newValue?: unknown;
}) {
  try {
    await adminDb.collection("audit_logs").add({
      admin_uid: adminUid,
      action,
      module,
      target_id: targetId || null,
      old_value: oldValue || null,
      new_value: newValue || null,
      timestamp: FieldValue.serverTimestamp(),
    });
  } catch (err) {
    console.error("Failed to write audit log:", err);
  }
}

export async function getAuditLogs(limit = 50) {
  const snapshot = await adminDb
    .collection("audit_logs")
    .orderBy("timestamp", "desc")
    .limit(limit)
    .get();

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
    timestamp: doc.data().timestamp?.toDate?.()?.toISOString() || null,
  }));
}
