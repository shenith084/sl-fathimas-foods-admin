import { NextResponse } from "next/server";
import { adminDb, adminAuth } from "@/lib/firebase/admin";

export async function GET() {
  try {
    const snapshot = await adminDb.collection("users").orderBy("created_at", "desc").get();
    const users = snapshot.docs.map((doc) => ({
      uid: doc.id,
      ...doc.data(),
    }));
    return NextResponse.json({ success: true, data: users });
  } catch (error: any) {
    console.error("Error fetching users:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password, displayName, roleId, isActive } = body;

    if (!email || !password || !displayName) {
      return NextResponse.json({ success: false, error: "Email, password, and name are required." }, { status: 400 });
    }

    // 1. Create User in Firebase Authentication
    const userRecord = await adminAuth.createUser({
      email,
      password,
      displayName,
      disabled: isActive === false,
    });

    // 2. Save User Document in Firestore
    await adminDb.collection("users").doc(userRecord.uid).set({
      email: userRecord.email,
      displayName: userRecord.displayName,
      roleId: roleId || "staff",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });

    return NextResponse.json({ 
      success: true, 
      data: { uid: userRecord.uid, email, displayName, roleId } 
    });

  } catch (error: any) {
    console.error("Error creating user:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
