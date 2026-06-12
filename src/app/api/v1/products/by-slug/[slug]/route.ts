import { NextResponse } from "next/server";
import { getProductBySlug } from "@/lib/services/productService";

export async function GET(
  req: Request,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    const params = await context.params;
    const { slug } = params;
    
    if (!slug) {
      return NextResponse.json({ success: false, message: "Slug is required" }, { status: 400 });
    }

    const product = await getProductBySlug(slug);
    
    if (!product) {
      return NextResponse.json({ success: false, message: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: product });
  } catch (err) {
    console.error(`GET /api/v1/products/by-slug/[slug] error:`, err);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}
