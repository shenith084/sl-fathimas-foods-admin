import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase/admin";
import { isSuperAdmin } from "@/lib/apiAuth";

// GET /api/v1/me?uid=xxx  → returns the logged-in user's role data
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const uid = searchParams.get("uid");

    if (!uid) {
      return NextResponse.json({ success: false, error: "uid is required" }, { status: 400 });
    }

    const userDoc = await adminDb.collection("users").doc(uid).get();

    if (!userDoc.exists) {
      return NextResponse.json({ success: true, data: { roleId: "customer" } });
    }

    const data = userDoc.data();
    
    // Check super admin status
    const isSuper = await isSuperAdmin(uid, data?.email);
    
    return NextResponse.json({
      success: true,
      data: {
        roleId: data?.roleId || data?.role || "customer",
        email: data?.email,
        displayName: data?.displayName,
        isSuperAdmin: isSuper,
      }
    });
  } catch (error: any) {
    console.error("Error fetching user role:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
