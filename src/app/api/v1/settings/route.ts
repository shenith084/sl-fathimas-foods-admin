import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase/admin";
import { FieldValue } from "firebase-admin/firestore";

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
