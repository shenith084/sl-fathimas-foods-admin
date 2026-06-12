import { NextResponse } from "next/server";
import { getSalesReport } from "@/lib/services/reportService";

export async function GET() {
  try {
    const report = await getSalesReport();
    return NextResponse.json({ success: true, data: report });
  } catch {
    return NextResponse.json({ success: false, message: "Failed to generate report" }, { status: 500 });
  }
}
