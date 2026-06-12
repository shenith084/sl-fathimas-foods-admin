import { NextRequest, NextResponse } from "next/server";
import { getProductById, updateProduct, softDeleteProduct } from "@/lib/services/productService";
import { logAuditAction } from "@/lib/services/auditService";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const product = await getProductById(id);
    if (!product) return NextResponse.json({ success: false, message: "Product not found" }, { status: 404 });
    return NextResponse.json({ success: true, data: product });
  } catch {
    return NextResponse.json({ success: false, message: "Failed to fetch product" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { adminUid, ...data } = await req.json();
    const old = await getProductById(id);
    await updateProduct(id, data);
    await logAuditAction({
      adminUid: adminUid || "system",
      action: "update_product",
      module: "products",
      targetId: id,
      oldValue: old,
      newValue: data,
    });
    return NextResponse.json({ success: true, message: "Product updated" });
  } catch {
    return NextResponse.json({ success: false, message: "Failed to update product" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { adminUid } = await req.json().catch(() => ({ adminUid: "system" }));
    await softDeleteProduct(id);
    await logAuditAction({
      adminUid: adminUid || "system",
      action: "delete_product",
      module: "products",
      targetId: id,
    });
    return NextResponse.json({ success: true, message: "Product deleted" });
  } catch {
    return NextResponse.json({ success: false, message: "Failed to delete product" }, { status: 500 });
  }
}
