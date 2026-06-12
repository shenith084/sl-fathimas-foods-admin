import { NextRequest, NextResponse } from "next/server";
import { getProducts, createProduct } from "@/lib/services/productService";
import { logAuditAction } from "@/lib/services/auditService";

export async function GET() {
  try {
    const products = await getProducts();
    return NextResponse.json({ success: true, data: products });
  } catch (err) {
    return NextResponse.json({ success: false, message: "Failed to fetch products" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { adminUid, ...productData } = body;
    const id = await createProduct({
      ...productData,
      stock_count: productData.stock_count || 0,
      availability: productData.availability || "in_stock",
      rating: productData.rating || 5.0,
      reviews: productData.reviews || 0,
    });
    await logAuditAction({
      adminUid: adminUid || "system",
      action: "create_product",
      module: "products",
      targetId: id,
      newValue: { name: productData.name },
    });
    return NextResponse.json({ success: true, data: { id }, message: "Product created" });
  } catch (err) {
    console.error("POST /api/v1/products error:", err);
    return NextResponse.json({ success: false, message: "Failed to create product" }, { status: 500 });
  }
}
