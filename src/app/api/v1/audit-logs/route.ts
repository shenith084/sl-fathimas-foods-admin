import { NextResponse } from "next/server";
import { getAuditLogs } from "@/lib/services/auditService";

export async function GET() {
  try {
    const logs = await getAuditLogs(100);
    return NextResponse.json({ success: true, data: logs });
  } catch {
    return NextResponse.json({ success: false, message: "Failed to fetch audit logs" }, { status: 500 });
  }
}
