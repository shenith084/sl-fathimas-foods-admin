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
    <div className={`bg-gradient-to-br ${colorMap[color]} border rounded-2xl p-5`}>
      <div className="flex items-start justify-between mb-3">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${iconColorMap[color]}`}>
          {icon}
        </div>
        {trend !== undefined && (
          <div className={`flex items-center gap-1 text-xs font-medium ${trend >= 0 ? "text-emerald-600" : "text-red-500"}`}>
            {trend >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            {Math.abs(trend)}%
          </div>
        )}
      </div>
      <p className="text-2xl font-bold text-[#222] mb-1">{value}</p>
      <p className="text-xs text-[#888]">{title}</p>
      {trendLabel && <p className="text-[10px] text-[#aaa] mt-0.5">{trendLabel}</p>}
    </div>
  );
}
