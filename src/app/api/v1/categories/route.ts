import { NextResponse } from "next/server";
import { getCategories, createCategory } from "@/lib/services/categoryService";

export const dynamic = "force-dynamic"; // Ensure it's not cached at build time

export async function GET() {
  try {
    const categories = await getCategories();
    return NextResponse.json({ success: true, data: categories });
  } catch (err: any) {
    console.error("GET /api/v1/categories error:", err);
    return NextResponse.json({ success: false, message: "Failed to fetch categories", error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const newCategory = await createCategory(body);
    return NextResponse.json({ success: true, data: newCategory });
  } catch (err: any) {
    console.error("POST /api/v1/categories error:", err);
    return NextResponse.json({ success: false, message: "Failed to create category", error: err.message }, { status: 500 });
  }
}
