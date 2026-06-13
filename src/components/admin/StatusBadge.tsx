const STATUS_CONFIG: Record<string, { label: string; cls: string }> = {
  pending: { label: "Pending", cls: "bg-amber-100 text-amber-700 border-amber-200" },
  processing: { label: "Processing", cls: "bg-purple-100 text-purple-700 border-purple-200" },
  dispatched: { label: "Dispatched", cls: "bg-cyan-100 text-cyan-700 border-cyan-200" },
  delivered: { label: "Delivered", cls: "bg-emerald-100 text-emerald-700 border-emerald-200" },
  cancelled: { label: "Cancelled", cls: "bg-red-100 text-red-700 border-red-200" },
  in_stock: { label: "In Stock", cls: "bg-green-100 text-green-700 border-green-200" },
  out_of_stock: { label: "Out of Stock", cls: "bg-red-100 text-red-700 border-red-200" },
  pre_order: { label: "Pre-Order", cls: "bg-orange-100 text-orange-700 border-orange-200" },
  approved: { label: "Approved", cls: "bg-green-100 text-green-700 border-green-200" },
  rejected: { label: "Rejected", cls: "bg-red-100 text-red-700 border-red-200" },
};

export default function StatusBadge({ status }: { status: string }) {
  const config = STATUS_CONFIG[status] || { label: status, cls: "bg-gray-100 text-gray-600 border-gray-200" };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${config.cls}`}>
      {config.label}
    </span>
  );
}
