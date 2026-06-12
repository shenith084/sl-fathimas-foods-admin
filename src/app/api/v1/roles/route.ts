import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase/admin";
import { verifyToken, isSuperAdmin } from "@/lib/apiAuth";

export async function GET() {
  try {
    const snapshot = await adminDb.collection("roles").orderBy("name", "asc").get();
    const roles = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return NextResponse.json({ success: true, data: roles });
  } catch (error: any) {
    console.error("Error fetching roles:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    // 1. Verify caller is authenticated
    const caller = await verifyToken(req);

    // 2. Verify caller is Super Admin
    const callerIsAdmin = await isSuperAdmin(caller.uid, caller.email);
    if (!callerIsAdmin) {
      return NextResponse.json(
        { success: false, error: "Forbidden: Only Super Admins can create or modify roles." },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { id, ...data } = body;
    if (!id) return NextResponse.json({ success: false, error: "Role ID is required" }, { status: 400 });

    // 3. Prevent creating a role with isAdminPrivileges if called by a non-super-admin
    // (already enforced above, but extra safety)

    const roleRef = adminDb.collection("roles").doc(id);
    await roleRef.set({
      ...data,
      updatedAt: new Date().toISOString()
    }, { merge: true });

    return NextResponse.json({ success: true, data: { id, ...data } });
  } catch (error: any) {
    if (error.message?.startsWith("UNAUTHORIZED")) {
      return NextResponse.json({ success: false, error: error.message }, { status: 401 });
    }
    console.error("Error saving role:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
