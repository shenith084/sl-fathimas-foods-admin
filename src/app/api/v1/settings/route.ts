import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase/admin";
import { FieldValue } from "firebase-admin/firestore";
import { verifyToken } from "@/lib/apiAuth";
import { logAuditAction } from "@/lib/services/auditService";
const DEFAULTS = {
  deliveryCharge: 450,
  freeDeliveryThreshold: 5000,
  whatsappNumber: "+94771234567",
  bank1Name: "BOC Bank",
  bank1AccountName: "A R F SHAHANA",
  bank1AccountNo: "92878052",
  bank1Branch: "Kurunegala Branch",
  bank2Name: "Commercial Bank (COM BANK)",
  bank2AccountName: "A R F SHAHANA",
  bank2AccountNo: "8009702437",
  bank2Branch: "Narammala Branch",
  businessEmail: "slfathimasfoods@gmail.com",
  businessAddress: "Colombo, Sri Lanka",
  giftPackMinItems: 3,
  giftPackRibbonPrice: 150,
  giftPackGreetingCardPrice: 500,
};

export async function GET() {
  try {
    const doc = await adminDb.collection("settings").doc("business").get();
    const data = doc.exists ? { ...DEFAULTS, ...doc.data() } : DEFAULTS;
    return NextResponse.json({ success: true, data });
  } catch {
    return NextResponse.json({ success: true, data: DEFAULTS });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const caller = await verifyToken(req);

    const body = await req.json();
    const docRef = adminDb.collection("settings").doc("business");
    const existingDoc = await docRef.get();
    const oldValue = existingDoc.exists ? existingDoc.data() : null;

    await docRef.set(
      { ...body, updated_at: FieldValue.serverTimestamp() },
      { merge: true }
    );

    await logAuditAction({
      adminUid: caller.uid,
      action: "update_settings",
      module: "settings",
      targetId: "business",
      oldValue,
      newValue: { ...oldValue, ...body },
    });

    return NextResponse.json({ success: true, message: "Settings saved" });
  } catch (error) {
    console.error("Error saving settings:", error);
    return NextResponse.json({ success: false, message: "Failed to save settings", error: String(error) }, { status: 500 });
  }
}
