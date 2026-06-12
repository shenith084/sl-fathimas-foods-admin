import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase/admin";

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    if (!id) return NextResponse.json({ success: false, error: "Role ID is required" }, { status: 400 });
    
    if (id === "super_admin") {
      return NextResponse.json({ success: false, error: "Cannot delete super admin role" }, { status: 403 });
    }

    await adminDb.collection("roles").doc(id).delete();
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error deleting role:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
