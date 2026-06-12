import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase/admin";
import { FieldValue } from "firebase-admin/firestore";

const DEFAULTS = {
  deliveryCharge: 450,
  freeDeliveryThreshold: 5000,
  whatsappNumber: "+94771234567",
  bankName: "People's Bank",
  bankAccountName: "SL Fathima's Foods",
  bankAccountNo: "123-456-789-012",
  bankBranch: "Colombo Main Branch",
  businessEmail: "slfathimasfoods@gmail.com",
  businessAddress: "Colombo, Sri Lanka",
};

export async function GET() {
  try {
    const doc = await adminDb.collection("settings").doc("business").get();
    const data = doc.exists ? doc.data() : DEFAULTS;
    return NextResponse.json({ success: true, data });
  } catch {
    return NextResponse.json({ success: true, data: DEFAULTS });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    await adminDb.collection("settings").doc("business").set(
      { ...body, updated_at: FieldValue.serverTimestamp() },
      { merge: true }
    );
    return NextResponse.json({ success: true, message: "Settings saved" });
  } catch {
    return NextResponse.json({ success: false, message: "Failed to save settings" }, { status: 500 });
  }
}
