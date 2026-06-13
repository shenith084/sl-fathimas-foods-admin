"use client";

import { useEffect } from "react";
import { event as fbEvent } from "@/components/analytics/MetaPixel";
import { ttevent } from "@/components/analytics/TikTokPixel";

export default function OrderPixelTracker({ orderId, total }: { orderId: string, total: number }) {
  useEffect(() => {
    // Trigger Purchase event
    fbEvent("Purchase", { value: total, currency: "LKR", content_ids: [orderId] });
    ttevent("CompletePayment", { value: total, currency: "LKR", content_id: orderId });
  }, [orderId, total]);

  return null;
}
