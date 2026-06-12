import { NextResponse } from "next/server";
import { getCategoryById, updateCategory, deleteCategory } from "@/lib/services/categoryService";

export const dynamic = "force-dynamic";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const category = await getCategoryById(params.id);
    if (!category) {
      return NextResponse.json({ success: false, message: "Category not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: category });
  } catch (err: any) {
    console.error(`GET /api/v1/categories/${params.id} error:`, err);
    return NextResponse.json({ success: false, message: "Failed to fetch category" }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    const updated = await updateCategory(params.id, body);
    return NextResponse.json({ success: true, data: updated });
  } catch (err: any) {
    console.error(`PUT /api/v1/categories/${params.id} error:`, err);
    return NextResponse.json({ success: false, message: err.message || "Failed to update category" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    await deleteCategory(params.id);
    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error(`DELETE /api/v1/categories/${params.id} error:`, err);
    return NextResponse.json({ success: false, message: "Failed to delete category" }, { status: 500 });
  }
}
