import { NextResponse } from "next/server";
import { adminDb, adminAuth } from "@/lib/firebase/admin";
import { verifyToken, isSuperAdmin } from "@/lib/apiAuth";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    // 1. Verify the caller is authenticated
    const caller = await verifyToken(req);

    // 2. Verify the caller is a Super Admin
    const callerIsAdmin = await isSuperAdmin(caller.uid, caller.email);
    if (!callerIsAdmin) {
      return NextResponse.json(
        { success: false, error: "Forbidden: Only Super Admins can change user roles." },
        { status: 403 }
      );
    }

    const { id } = await params;
    if (!id) return NextResponse.json({ success: false, error: "User ID is required" }, { status: 400 });

    const body = await req.json();
    const { roleId } = body;
    if (!roleId) return NextResponse.json({ success: false, error: "Role ID is required" }, { status: 400 });

    // 3. Prevent a non-super-admin from being promoted to super_admin
    //    (double-check even though caller is already a super admin — future proofing)
    // A super_admin CAN assign super_admin. This is intentional.

    await adminDb.collection("users").doc(id).set({
      roleId,
      updated_at: new Date().toISOString()
    }, { merge: true });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    if (error.message?.startsWith("UNAUTHORIZED")) {
      return NextResponse.json({ success: false, error: error.message }, { status: 401 });
    }
    console.error("Error updating user role:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const caller = await verifyToken(req);
    const callerIsAdmin = await isSuperAdmin(caller.uid, caller.email);
    if (!callerIsAdmin) {
      return NextResponse.json({ success: false, error: "Forbidden: Only Super Admins can delete users." }, { status: 403 });
    }

    const { id } = await params;
    if (!id) return NextResponse.json({ success: false, error: "User ID required" }, { status: 400 });

    if (caller.uid === id) {
      return NextResponse.json({ success: false, error: "Cannot delete yourself" }, { status: 400 });
    }

    // Attempt to delete from Auth, but catch if not found
    try {
      await adminAuth.deleteUser(id);
    } catch (e: any) {
      console.warn("User might not exist in Auth, but proceeding to delete from Firestore:", e.message);
    }

    await adminDb.collection("users").doc(id).delete();
    return NextResponse.json({ success: true });
  } catch (error: any) {
    if (error.message?.startsWith("UNAUTHORIZED")) {
      return NextResponse.json({ success: false, error: error.message }, { status: 401 });
    }
    console.error("Error deleting user:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
