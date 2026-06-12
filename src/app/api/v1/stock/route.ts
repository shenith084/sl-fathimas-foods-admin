import { NextRequest, NextResponse } from "next/server";
import { getProducts, updateProductStock } from "@/lib/services/productService";
import { logAuditAction } from "@/lib/services/auditService";

export async function GET() {
  try {
    const products = await getProducts();
    const stockData = products.map((p) => ({
      id: p.id,
      name: p.name,
      emoji: p.emoji,
      category: p.category,
      stock_count: p.stock_count,
      availability: p.availability,
    }));
    return NextResponse.json({ success: true, data: stockData });
  } catch {
    return NextResponse.json({ success: false, message: "Failed to fetch stock" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { id, stock_count, adminUid } = await req.json();
    await updateProductStock(id, stock_count);
    await logAuditAction({
      adminUid: adminUid || "system",
      action: "update_stock",
      module: "stock",
      targetId: id,
      newValue: { stock_count },
    });
    return NextResponse.json({ success: true, message: "Stock updated" });
  } catch {
    return NextResponse.json({ success: false, message: "Failed to update stock" }, { status: 500 });
  }
}
