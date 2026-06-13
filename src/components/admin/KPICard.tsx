import { ReactNode } from "react";
import { TrendingUp, TrendingDown } from "lucide-react";

interface KPICardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  trend?: number;
  trendLabel?: string;
  color?: "gold" | "green" | "blue" | "red";
}

const colorMap = {
  gold: "from-[#D98C1F]/10 to-[#D98C1F]/5 border-[#D98C1F]/20",
  green: "from-[#2C4631]/10 to-[#2C4631]/5 border-[#2C4631]/20",
  blue: "from-blue-500/10 to-blue-500/5 border-blue-500/20",
  red: "from-red-500/10 to-red-500/5 border-red-500/20",
};

const iconColorMap = {
  gold: "bg-[#D98C1F]/15 text-[#D98C1F]",
  green: "bg-[#2C4631]/15 text-[#2C4631]",
  blue: "bg-blue-500/15 text-blue-600",
  red: "bg-red-500/15 text-red-500",
};

export default function KPICard({ title, value, icon, trend, trendLabel, color = "gold" }: KPICardProps) {
  return (
    <div className="bg-white border border-gray-100 rounded-3xl p-5 shadow-sm flex flex-col justify-between">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${iconColorMap[color]}`}>
        {icon}
      </div>
      <div>
        <p className="text-2xl font-bold text-[#222] mb-1 leading-none">{value}</p>
        <p className="text-xs text-[#888] font-medium">{title}</p>
      </div>
      {trend !== undefined && (
        <div className={`mt-4 flex items-center gap-1.5 text-xs font-semibold ${trend >= 0 ? "text-emerald-500" : "text-red-500"}`}>
          {trend >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
          <span>{Math.abs(trend)}% from last month</span>
          {trendLabel && <span className="ml-auto text-[#E88E23] font-medium">{trendLabel}</span>}
        </div>
      )}
      {trend === undefined && trendLabel && (
        <div className="mt-4 text-xs text-[#E88E23] font-medium">
          {trendLabel}
        </div>
      )}
    </div>
  );
}
